import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { weeklySchedule, workoutPlans, exercises } from '../data/exercises';

const PLAN_IMAGES: Record<string, string> = {
  plan001: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  plan002: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  plan003: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  plan004: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80',
};

const GLUTE_TIPS = [
  { icon: 'lightbulb' as const, title: 'Ativação é essencial', body: 'Sempre ative os glúteos antes do treino principal. 2 séries de ponte sem peso já fazem diferença.' },
  { icon: 'restaurant' as const, title: 'Proteína no pós-treino', body: 'Consuma proteína em até 30 min após o treino. Isso acelera a recuperação e o crescimento muscular.' },
  { icon: 'bedtime' as const, title: 'Sono = crescimento', body: 'Os glúteos crescem durante o descanso. Durma 7-9h por noite para maximizar os resultados.' },
  { icon: 'repeat' as const, title: 'Progressão de carga', body: 'Aumente o peso ou as repetições a cada semana. Sem progressão, não há crescimento.' },
  { icon: 'self-improvement' as const, title: 'Mente-músculo', body: 'Foque na contração do glúteo em cada repetição. A conexão mental faz toda a diferença.' },
];

const MUSCLE_GROUPS = [
  { name: 'Glúteo Máximo', desc: 'Volume e força', pct: 60, color: colors.primary },
  { name: 'Glúteo Médio', desc: 'Forma e largura', pct: 25, color: colors.accentPurple },
  { name: 'Glúteo Mínimo', desc: 'Estabilidade', pct: 15, color: colors.accentBlue },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile, weeklyStats, workoutHistory } = useStore();
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const todayWorkout = weeklySchedule?.[dayIndex];
  const tipOfDay = GLUTE_TIPS[new Date().getDate() % GLUTE_TIPS.length];

  if (!profile?.name) return null;

  const weeklyGoal = profile.level === 'Avançado' ? 5 : profile.level === 'Intermediário' ? 4 : 3;
  const progressPct = Math.min((weeklyStats.workouts / weeklyGoal) * 100, 100);

  // Exercício em destaque do dia
  const featuredExercise = exercises[new Date().getDate() % exercises.length];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>BumUp</Text>
          <Text style={styles.appSubtitle}>Seu treino de glúteos</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.avatarText}>{profile.name[0].toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <MaterialIcons name="local-fire-department" size={18} color={colors.accentOrange} />
          <Text style={[styles.statValue, { color: colors.accentOrange }]}>{weeklyStats.streak}</Text>
          <Text style={styles.statLabel}>sequência</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxCenter]}>
          <MaterialIcons name="fitness-center" size={18} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.primary }]}>{weeklyStats.workouts}</Text>
          <Text style={styles.statLabel}>treinos</Text>
        </View>
        <View style={styles.statBox}>
          <MaterialIcons name="timer" size={18} color={colors.accentPurple} />
          <Text style={[styles.statValue, { color: colors.accentPurple }]}>{weeklyStats.minutes}</Text>
          <Text style={styles.statLabel}>minutos</Text>
        </View>
      </View>

      {/* Meta semanal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meta Semanal</Text>
          <Text style={styles.sectionBadge}>{weeklyStats.workouts}/{weeklyGoal} treinos</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressHint}>
          {weeklyStats.workouts >= weeklyGoal
            ? '🎉 Meta atingida esta semana!'
            : `Faltam ${weeklyGoal - weeklyStats.workouts} treino${weeklyGoal - weeklyStats.workouts > 1 ? 's' : ''} para sua meta`}
        </Text>
      </View>

      {/* Treino de hoje */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Treino de Hoje</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => !todayWorkout?.isRest && navigation.navigate('Workouts')}
        >
          <LinearGradient
            colors={todayWorkout?.isRest ? ['#1C1720', '#231D28'] : ['#4A1A35', '#D96B9E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.todayCard}
          >
            <View style={styles.todayLeft}>
              <Text style={styles.todayDay}>{weeklySchedule[dayIndex]?.day?.toUpperCase()}</Text>
              <Text style={styles.todayWorkout}>{todayWorkout?.workout}</Text>
              {todayWorkout?.isRest ? (
                <Text style={styles.restText}>Dia de recuperação ativa</Text>
              ) : (
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => navigation.navigate('Workouts')}
                >
                  <MaterialIcons name="play-arrow" size={14} color={colors.background} />
                  <Text style={styles.startBtnText}>Iniciar</Text>
                </TouchableOpacity>
              )}
            </View>
            <MaterialIcons
              name={todayWorkout?.isRest ? 'self-improvement' : 'bolt'}
              size={52} color="rgba(255,255,255,0.2)"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Cronograma semanal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Esta Semana</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weeklySchedule.map((item, index) => (
            <View key={index} style={[
              styles.dayCard,
              index === dayIndex && styles.dayCardActive,
              item.completed && index !== dayIndex && styles.dayCardDone,
            ]}>
              <Text style={[styles.dayLabel, index === dayIndex && styles.dayLabelActive]}>{item.day}</Text>
              {item.completed
                ? <MaterialIcons name="check" size={14} color={index === dayIndex ? colors.background : colors.primary} />
                : item.isRest
                  ? <MaterialIcons name="remove" size={14} color={colors.textMuted} />
                  : <View style={styles.dayDot} />
              }
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Anatomia dos glúteos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Músculos Trabalhados</Text>
        <View style={styles.muscleCard}>
          <View style={styles.muscleLeft}>
            <View style={styles.muscleIcon}>
              <MaterialIcons name="accessibility-new" size={40} color={colors.primary + '60'} />
            </View>
          </View>
          <View style={styles.muscleRight}>
            {MUSCLE_GROUPS.map((m) => (
              <View key={m.name} style={styles.muscleRow}>
                <View style={styles.muscleInfo}>
                  <Text style={styles.muscleName}>{m.name}</Text>
                  <Text style={styles.muscleDesc}>{m.desc}</Text>
                </View>
                <View style={styles.muscleBarBg}>
                  <View style={[styles.muscleBarFill, { width: `${m.pct}%`, backgroundColor: m.color }]} />
                </View>
                <Text style={[styles.musclePct, { color: m.color }]}>{m.pct}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Dica do dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dica do Dia</Text>
        <LinearGradient
          colors={[colors.primary + '25', colors.accentPurple + '15']}
          style={styles.tipCard}
        >
          <View style={styles.tipHeader}>
            <View style={styles.tipIconWrap}>
              <MaterialIcons name={tipOfDay.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.tipTitle}>{tipOfDay.title}</Text>
          </View>
          <Text style={styles.tipBody}>{tipOfDay.body}</Text>
        </LinearGradient>
      </View>

      {/* Exercício em destaque */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercício em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => navigation.navigate('ExerciseDetail', { exercise: featuredExercise })}
          activeOpacity={0.9}
        >
          <View style={styles.featuredLeft}>
            <View style={[styles.featuredIcon, { backgroundColor: colors.primary + '20' }]}>
              <MaterialIcons name="fitness-center" size={28} color={colors.primary} />
            </View>
          </View>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredName}>{featuredExercise?.name}</Text>
            <Text style={styles.featuredMuscle}>{featuredExercise?.muscleGroup}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.featuredChip}>
                <Text style={styles.featuredChipText}>{featuredExercise?.defaultSets} séries</Text>
              </View>
              <View style={styles.featuredChip}>
                <Text style={styles.featuredChipText}>{featuredExercise?.defaultReps} reps</Text>
              </View>
              <View style={[styles.featuredChip, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.featuredChipText, { color: colors.primary }]}>{featuredExercise?.difficulty}</Text>
              </View>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Planos em destaque */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Planos de Treino</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {workoutPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => navigation.navigate('Workouts')}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: PLAN_IMAGES[plan.id] }}
                style={styles.planImage}
                imageStyle={{ borderRadius: borderRadius.lg }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.88)']}
                  style={styles.planGradient}
                >
                  <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.planBadgeText}>{plan.category}</Text>
                  </View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planMeta}>{plan.daysPerWeek}x/sem · {plan.duration}</Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Último treino */}
      {workoutHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Último Treino</Text>
          <View style={styles.lastCard}>
            <View style={styles.lastLeft}>
              <View style={styles.lastIcon}>
                <MaterialIcons name="fitness-center" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.lastName}>{workoutHistory[0].planName}</Text>
                <Text style={styles.lastDate}>
                  {new Date(workoutHistory[0].date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </Text>
              </View>
            </View>
            <View style={styles.lastStats}>
              <Text style={styles.lastStatVal}>{workoutHistory[0].duration}min</Text>
              <Text style={styles.lastStatLbl}>duração</Text>
            </View>
            <View style={styles.lastStats}>
              <Text style={[styles.lastStatVal, { color: colors.accentOrange }]}>{workoutHistory[0].calories}</Text>
              <Text style={styles.lastStatLbl}>kcal</Text>
            </View>
            <View style={styles.lastStats}>
              <Text style={[styles.lastStatVal, { color: colors.accentPurple }]}>{workoutHistory[0].totalSets}</Text>
              <Text style={styles.lastStatLbl}>séries</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md,
  },
  appTitle: { fontSize: 26, fontWeight: '800', color: colors.text },
  appSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.background },

  statsRow: {
    flexDirection: 'row', marginHorizontal: spacing.lg,
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statBoxCenter: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textSecondary },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sectionBadge: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.xs },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressHint: { fontSize: 12, color: colors.textSecondary },

  todayCard: {
    borderRadius: borderRadius.lg, padding: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  todayLeft: { flex: 1 },
  todayDay: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 1.5 },
  todayWorkout: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 4, marginBottom: 12 },
  restText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary, alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  startBtnText: { color: colors.background, fontWeight: '800', fontSize: 13 },

  dayCard: {
    width: 48, height: 64, backgroundColor: colors.card,
    borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm, gap: 4,
  },
  dayCardActive: { backgroundColor: colors.primary },
  dayCardDone: { borderWidth: 1, borderColor: colors.primary + '60' },
  dayLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '700' },
  dayLabelActive: { color: colors.background },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },

  muscleCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, flexDirection: 'row', gap: spacing.md,
  },
  muscleLeft: { justifyContent: 'center' },
  muscleIcon: {
    width: 64, height: 64, borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  muscleRight: { flex: 1, gap: spacing.sm },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  muscleInfo: { width: 100 },
  muscleName: { fontSize: 12, fontWeight: '700', color: colors.text },
  muscleDesc: { fontSize: 10, color: colors.textSecondary },
  muscleBarBg: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  muscleBarFill: { height: '100%', borderRadius: 3 },
  musclePct: { fontSize: 11, fontWeight: '700', width: 30, textAlign: 'right' },

  tipCard: { borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tipIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  tipBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  featuredCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  featuredLeft: {},
  featuredIcon: { width: 56, height: 56, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  featuredInfo: { flex: 1 },
  featuredName: { fontSize: 15, fontWeight: '700', color: colors.text },
  featuredMuscle: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
  featuredMeta: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, flexWrap: 'wrap' },
  featuredChip: {
    backgroundColor: colors.cardLight, paddingHorizontal: spacing.sm,
    paddingVertical: 3, borderRadius: borderRadius.full,
  },
  featuredChipText: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },

  planCard: { width: 190, height: 130, marginRight: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  planImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  planGradient: { padding: spacing.md, borderRadius: borderRadius.lg, flex: 1, justifyContent: 'flex-end' },
  planBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, marginBottom: spacing.xs },
  planBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  planName: { fontSize: 13, fontWeight: '800', color: '#fff' },
  planMeta: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  factsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  factCard: {
    width: '47%', backgroundColor: colors.card,
    borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm,
  },
  factText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  lastCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center',
  },
  lastLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lastIcon: {
    width: 40, height: 40, borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center',
  },
  lastName: { fontSize: 13, fontWeight: '700', color: colors.text },
  lastDate: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  lastStats: { alignItems: 'center', marginLeft: spacing.md },
  lastStatVal: { fontSize: 15, fontWeight: '800', color: colors.primary },
  lastStatLbl: { fontSize: 10, color: colors.textSecondary },
});
