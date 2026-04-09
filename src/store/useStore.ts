import { create } from 'zustand';
import storage from './storage';

const STORAGE_KEY = '@bumup_profile';
const ONBOARDING_KEY = '@bumup_onboarded';

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ActiveExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface CompletedWorkout {
  id: string;
  date: string;
  planName: string;
  duration: number;
  calories: number;
  exercises: ActiveExercise[];
  totalSets: number;
  totalReps: number;
  totalWeight: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  goal: string;
  level: string;
  bodyFat?: number;
  gluteCirc?: number;
  genetics?: 'Ectomorfo' | 'Mesomorfo' | 'Endomorfo';
  frequency?: number;
}

interface FitnessStore {
  profile: UserProfile;
  onboarded: boolean;
  profileLoaded: boolean;

  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  activeWorkout: {
    isActive: boolean;
    planId: string;
    startTime: number;
    exercises: ActiveExercise[];
    currentExerciseIndex: number;
  } | null;
  startWorkout: (planId: string, exerciseIds: string[]) => void;
  completeSet: (exerciseId: string, setIndex: number, reps: number, weight: number) => void;
  finishWorkout: () => void;

  workoutHistory: CompletedWorkout[];

  weeklyStats: {
    workouts: number;
    calories: number;
    minutes: number;
    streak: number;
  };

  restTimer: {
    isActive: boolean;
    seconds: number;
    totalSeconds: number;
  };
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  tickRestTimer: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  weight: 0,
  height: 0,
  age: 0,
  goal: 'Bumbum',
  level: 'Iniciante',
};

export const useStore = create<FitnessStore>((set, get) => ({
  profile: DEFAULT_PROFILE,
  onboarded: false,
  profileLoaded: false,

  loadProfile: async () => {
    try {
      const [profileJson, onboardedVal] = await Promise.all([
        storage.getItem(STORAGE_KEY),
        storage.getItem(ONBOARDING_KEY),
      ]);
      const profile = profileJson ? JSON.parse(profileJson) : DEFAULT_PROFILE;
      const onboarded = onboardedVal === 'true';
      set({ profile, onboarded, profileLoaded: true });
    } catch {
      set({ profileLoaded: true });
    }
  },

  updateProfile: (partial) => {
    const updated = { ...get().profile, ...partial };
    set({ profile: updated });
    storage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  completeOnboarding: () => {
    set({ onboarded: true });
    storage.setItem(ONBOARDING_KEY, 'true').catch(() => {});
  },

  activeWorkout: null,

  startWorkout: (planId, exerciseIds) =>
    set({
      activeWorkout: {
        isActive: true,
        planId,
        startTime: Date.now(),
        currentExerciseIndex: 0,
        exercises: exerciseIds.map((id) => ({
          exerciseId: id,
          sets: [
            { setNumber: 1, reps: 0, weight: 0, completed: false },
            { setNumber: 2, reps: 0, weight: 0, completed: false },
            { setNumber: 3, reps: 0, weight: 0, completed: false },
            { setNumber: 4, reps: 0, weight: 0, completed: false },
          ],
        })),
      },
    }),

  completeSet: (exerciseId, setIndex, reps, weight) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const exercises = state.activeWorkout.exercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const sets = ex.sets.map((s, i) =>
          i === setIndex ? { ...s, reps, weight, completed: true } : s
        );
        return { ...ex, sets };
      });
      return { activeWorkout: { ...state.activeWorkout, exercises } };
    }),

  finishWorkout: () => {
    const state = get();
    if (!state.activeWorkout) return;
    const duration = Math.max(Math.round((Date.now() - state.activeWorkout.startTime) / 60000), 1);
    const totalSets = state.activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0
    );
    const totalReps = state.activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).reduce((a, s) => a + s.reps, 0), 0
    );
    const totalWeight = state.activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).reduce((a, s) => a + s.weight * s.reps, 0), 0
    );
    const weight = state.profile.weight || 60;
    const completed: CompletedWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      planName: state.activeWorkout.planId,
      duration,
      calories: Math.round(duration * weight * 0.08),
      exercises: state.activeWorkout.exercises,
      totalSets,
      totalReps,
      totalWeight,
    };

    // Calcular streak
    const history = [completed, ...state.workoutHistory];
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastDate = state.workoutHistory[0]
      ? new Date(state.workoutHistory[0].date).toDateString()
      : null;
    const newStreak = lastDate === yesterday || lastDate === today
      ? state.weeklyStats.streak + 1
      : 1;

    // Calcular treinos desta semana
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekWorkouts = history.filter((w) => new Date(w.date) >= weekStart).length;

    const newStats = {
      workouts: weekWorkouts,
      calories: state.weeklyStats.calories + completed.calories,
      minutes: state.weeklyStats.minutes + duration,
      streak: newStreak,
    };

    // Persistir histórico
    storage.setItem('@bumup_history', JSON.stringify(history.slice(0, 50))).catch(() => {});
    storage.setItem('@bumup_stats', JSON.stringify(newStats)).catch(() => {});

    set({ activeWorkout: null, workoutHistory: history, weeklyStats: newStats });
  },

  workoutHistory: [],

  weeklyStats: { workouts: 0, calories: 0, minutes: 0, streak: 0 },

  restTimer: { isActive: false, seconds: 0, totalSeconds: 0 },

  startRestTimer: (seconds) =>
    set({ restTimer: { isActive: true, seconds, totalSeconds: seconds } }),

  stopRestTimer: () =>
    set({ restTimer: { isActive: false, seconds: 0, totalSeconds: 0 } }),

  tickRestTimer: () =>
    set((state) => {
      if (!state.restTimer.isActive || state.restTimer.seconds <= 0)
        return { restTimer: { ...state.restTimer, isActive: false, seconds: 0 } };
      return { restTimer: { ...state.restTimer, seconds: state.restTimer.seconds - 1 } };
    }),
}));
