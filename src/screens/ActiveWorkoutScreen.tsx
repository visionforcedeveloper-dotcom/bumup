import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Image, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { exercises } from '../data/exercises';
import { RestTimerModal } from '../components/RestTimerModal';

export const ActiveWorkoutScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { plan } = route.params;
  const { startWorkout, completeSet, finishWorkout, activeWorkout, startRestTimer } = useStore();

  const [elapsed, setElapsed] = useState(0);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [setInputs, setSetInputs] = useState<Record<string, { reps: string; weight: string }>>({});
  const [exerciseDone, setExerciseDone] = useState<Record<number, boolean>>({});
  const timerRef = useRef<any>(null);
  const doneAnim = useRef(new Animated.Value(1)).current;

  const planExercises = plan.exercises
    .map((id: string) => exercises.find((e) => e.id === id))
    .filter(Boolean);

  useEffect(() => {
    startWorkout(plan.id, plan.exercises);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const currentExercise = planExercises[currentExIdx];
  const sets = activeWorkout?.exercises.find((e) => e.exerciseId === currentExercise?.id)?.sets || [];
  const completedSets = sets.filter((s) => s.completed).length;
  const allSetsDone = sets.length > 0 && completedSets === sets.length;
  const isExerciseDone = exerciseDone[currentExIdx] || false;

  const totalExercisesDone = Object.values(exerciseDone).filter(Boolean).length;

  const handleCompleteSet = (setIndex: number) => {
    const key = `${currentExercise?.id}-${setIndex}`;
    const input = setInputs[key] || { reps: currentExercise?.defaultReps ?? '0', weight: '0' };
    completeSet(
      currentExercise!.id, setIndex,
      parseInt(input.reps) || 0,
      parseFloat(input.weight) || 0
    );
    startRestTimer(currentExercise?.defaultRest || 60);
  };

  const handleMarkExerciseDone = () => {
    // Completa todas as séries não concluídas com os valores atuais
    sets.forEach((set, index) => {
      if (!set.completed) {
        const key = `${currentExercise?.id}-${index}`;
        const input = setInputs[key] || { reps: currentExercise?.defaultReps ?? '0', weight: '0' };
        completeSet(
          currentExercise!.id, index,
          parseInt(input.reps) || 0,
          parseFloat(input.weight) || 0
        );
      }
    });

    setExerciseDone((prev) => ({ ...prev, [currentExIdx]: true }));

    // Animação de feedback
    Animated.sequence([
      Animated.timing(doneAnim, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(doneAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    // Avança automaticamente para o próximo exercício após 1s
    if (currentExIdx < planExercises.length - 1) {
      setTimeout(() => setCurrentExIdx((i) => i + 1), 900);
    }
  };

  const handleFinish = () => {
    Alert.alert('Finalizar Treino', 'Deseja finalizar o treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar', onPress: () => {
          clearInterval(timerRef.current);
          finishWorkout();
          navigation.navigate('WorkoutSummary', { duration: elapsed, planName: plan.name });
        },
      },
    ]);
  };

  const goToExercise = (idx: number) => {
    if (idx >= 0 && idx < planExercises.length) setCurrentExIdx(idx);
  };

  if (!currentExercise) return null;

  return (
    <View style={styles.container}>
      <RestTimerModal />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.timerBox}>
          <Text style={styles.timer}>{formatTime(elapsed)}</Text>
          <Text style={styles.timerLabel}>em andamento</Text>
        </View>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de progresso geral */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, {
            width: `${(totalExercisesDone / planExercises.length) * 100}%`
          }]} />
        </View>
        <Text style={styles.progressLabel}>{totalExercisesDone}/{planExercises.length}</Text>
      </View>

      {/* Miniaturas dos exercícios */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.thumbScroll}
        contentContainerStyle={styles.thumbContent}
      >
        {planExercises.map((ex: any, i: number) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.thumbItem,
              i === currentExIdx && styles.thumbItemActive,
              exerciseDone[i] && styles.thumbItemDone,
            ]}
            onPress={() => goToExercise(i)}
          >
            {exerciseDone[i]
              ? <MaterialIcons name="check" size={14} color="#fff" />
              : <Text style={[styles.thumbNum, i === currentExIdx && { color: '#fff' }]}>{i + 1}</Text>
            }
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* GIF do exercício */}
        <View style={[styles.exerciseVisual, isExerciseDone && styles.exerciseVisualDone]}>
          {currentExercise.gifUrl
            ? <Image source={currentExercise.gifUrl} style={styles.exerciseGif} resizeMode="contain" />
            : <View style={styles.exercisePlaceholder}>
                <MaterialIcons name="fitness-center" size={72} color={colors.primary + '60'} />
              </View>
          }
          {isExerciseDone && (
            <View style={styles.doneBadge}>
              <MaterialIcons name="check-circle" size={32} color={colors.success} />
              <Text style={styles.doneBadgeText}>Concluído</Text>
            </View>
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.visualOverlay}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <View style={styles.musclePill}>
              <Text style={styles.musclePillText}>{currentExercise.muscleGroup}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Nav anterior / próximo */}
        <View style={styles.exNav}>
          <TouchableOpacity
            style={[styles.navBtn, currentExIdx === 0 && styles.navBtnDisabled]}
            onPress={() => goToExercise(currentExIdx - 1)}
          >
            <MaterialIcons name="chevron-left" size={20} color={colors.primary} />
            <Text style={styles.navBtnText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, currentExIdx === planExercises.length - 1 && styles.navBtnDisabled]}
            onPress={() => goToExercise(currentExIdx + 1)}
          >
            <Text style={styles.navBtnText}>Próximo</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Séries */}
        <View style={styles.setsCard}>
          <View style={styles.setsHeader}>
            <Text style={styles.setsTitle}>Séries</Text>
            <Text style={styles.setsProgress}>{completedSets}/{sets.length} concluídas</Text>
          </View>

          <View style={styles.setRow}>
            <Text style={[styles.setCol, styles.colHeader, { flex: 0.6 }]}>Série</Text>
            <Text style={[styles.setCol, styles.colHeader, { flex: 1.5 }]}>Reps</Text>
            <Text style={[styles.setCol, styles.colHeader, { flex: 1.5 }]}>Peso kg</Text>
            <Text style={[styles.setCol, styles.colHeader, { flex: 0.8 }]}>OK</Text>
          </View>

          {sets.map((set, index) => {
            const key = `${currentExercise.id}-${index}`;
            const input = setInputs[key] || { reps: '', weight: '' };
            return (
              <View key={index} style={[styles.setRow, set.completed && styles.setRowDone]}>
                <Text style={[styles.setCol, styles.setNum, { flex: 0.6 }]}>{set.setNumber}</Text>
                <TextInput
                  style={[styles.setCol, styles.setInput, { flex: 1.5 }]}
                  value={input.reps}
                  onChangeText={(v) => setSetInputs((p) => ({ ...p, [key]: { ...input, reps: v } }))}
                  keyboardType="numeric"
                  placeholder={currentExercise.defaultReps}
                  placeholderTextColor={colors.textMuted}
                  editable={!set.completed && !isExerciseDone}
                />
                <TextInput
                  style={[styles.setCol, styles.setInput, { flex: 1.5 }]}
                  value={input.weight}
                  onChangeText={(v) => setSetInputs((p) => ({ ...p, [key]: { ...input, weight: v } }))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  editable={!set.completed && !isExerciseDone}
                />
                <TouchableOpacity
                  style={[styles.checkBtn, { flex: 0.8 }, set.completed && styles.checkBtnDone]}
                  onPress={() => !set.completed && !isExerciseDone && handleCompleteSet(index)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={set.completed ? 'check-circle' : 'radio-button-unchecked'}
                    size={24}
                    color={set.completed ? '#fff' : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Botão EXERCÍCIO CONCLUÍDO */}
        {!isExerciseDone ? (
          <Animated.View style={[styles.doneWrap, { transform: [{ scale: doneAnim }] }]}>
            <TouchableOpacity
              style={[styles.doneBtn, allSetsDone && styles.doneBtnReady]}
              onPress={handleMarkExerciseDone}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name="check-circle"
                size={22}
                color={allSetsDone ? '#fff' : colors.textMuted}
              />
              <Text style={[styles.doneBtnText, allSetsDone && styles.doneBtnTextReady]}>
                {allSetsDone ? 'Exercício Concluído ✓' : 'Marcar como Concluído'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.doneWrap}>
            <View style={styles.doneBtnCompleted}>
              <MaterialIcons name="check-circle" size={22} color={colors.success} />
              <Text style={styles.doneBtnCompletedText}>Exercício Concluído!</Text>
              {currentExIdx < planExercises.length - 1 && (
                <TouchableOpacity
                  style={styles.nextExBtn}
                  onPress={() => goToExercise(currentExIdx + 1)}
                >
                  <Text style={styles.nextExBtnText}>Próximo exercício</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Dicas */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="lightbulb" size={16} color={colors.warning} />
            <Text style={styles.tipsTitle}>Dicas de execução</Text>
          </View>
          {currentExercise.tips.map((tip: string, i: number) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Instruções */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="format-list-numbered" size={16} color={colors.accentBlue} />
            <Text style={styles.tipsTitle}>Como executar</Text>
          </View>
          {currentExercise.instructions.map((inst: string, i: number) => (
            <View key={i} style={styles.instrRow}>
              <View style={[styles.instrNum, { backgroundColor: colors.primary }]}>
                <Text style={styles.instrNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.tipText}>{inst}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md,
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  timerBox: { alignItems: 'center' },
  timer: { fontSize: 26, fontWeight: '800', color: colors.primary },
  timerLabel: { fontSize: 10, color: colors.textSecondary },
  finishBtn: {
    backgroundColor: colors.error + '20', borderWidth: 1, borderColor: colors.error,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md,
  },
  finishBtnText: { color: colors.error, fontWeight: '700', fontSize: 13 },

  progressWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm, gap: spacing.sm,
  },
  progressBg: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  progressLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },

  thumbScroll: { maxHeight: 44 },
  thumbContent: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  thumbItem: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbItemActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  thumbItemDone: { backgroundColor: colors.success, borderColor: colors.success },
  thumbNum: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },

  exerciseVisual: {
    height: 280, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg,
    overflow: 'hidden', marginBottom: spacing.md, backgroundColor: '#fff',
    marginTop: spacing.sm,
  },
  exerciseVisualDone: { opacity: 0.75 },
  exerciseGif: { width: '100%', height: '100%', position: 'absolute' },
  exercisePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardLight },
  doneBadge: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)', gap: spacing.sm,
  },
  doneBadgeText: { fontSize: 18, fontWeight: '800', color: colors.success },
  visualOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  exerciseName: { fontSize: 15, fontWeight: '800', color: '#fff', flex: 1 },
  musclePill: {
    backgroundColor: colors.primary + 'CC',
    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full,
  },
  musclePillText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  exNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.card, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: borderRadius.md,
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { color: colors.primary, fontWeight: '600', fontSize: 13 },

  setsCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  setsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  setsTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  setsProgress: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  setRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  setRowDone: { opacity: 0.55 },
  setCol: { textAlign: 'center', color: colors.text },
  colHeader: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  setNum: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  setInput: {
    backgroundColor: colors.cardLight, borderRadius: borderRadius.sm,
    paddingVertical: 8, paddingHorizontal: spacing.sm,
    color: colors.text, fontSize: 15, fontWeight: '700',
    marginHorizontal: 4, textAlign: 'center',
  },
  checkBtn: { alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: borderRadius.sm },
  checkBtnDone: { backgroundColor: colors.primary },

  doneWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  doneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: borderRadius.lg, padding: spacing.md,
  },
  doneBtnReady: {
    backgroundColor: colors.primary, borderColor: colors.primary,
  },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  doneBtnTextReady: { color: '#fff' },
  doneBtnCompleted: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.success + '18', borderWidth: 1.5, borderColor: colors.success,
    borderRadius: borderRadius.lg, padding: spacing.md, flexWrap: 'wrap',
  },
  doneBtnCompletedText: { fontSize: 15, fontWeight: '700', color: colors.success, flex: 1 },
  nextExBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full,
  },
  nextExBtnText: { fontSize: 12, color: colors.primary, fontWeight: '700' },

  tipsCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm, gap: spacing.sm },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 6 },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  instrRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm, gap: spacing.sm },
  instrNum: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  instrNumText: { fontSize: 11, fontWeight: '800', color: '#fff' },
});
