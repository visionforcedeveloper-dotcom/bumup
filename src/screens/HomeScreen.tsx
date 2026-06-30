import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { weeklySchedule, getExerciseById } from '../data/exercises';

const MUSCLE_GROUPS = [
  { name: 'Glúteo Máximo', desc: 'Volume e força', pct: 60, color: colors.primary },
  { name: 'Glúteo Médio', desc: 'Forma e largura', pct: 25, color: colors.accentPurple },
  { name: 'Glúteo Mínimo', desc: 'Estabilidade', pct: 15, color: colors.accentBlue },
];

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Ana Paula, 28',
    plan: 'Desafio 30 Dias',
    planColor: '#D96B9E',
    text: 'Em 30 dias já senti meus glúteos muito mais firmes. O app me manteve consistente de um jeito que nunca consegui sozinha.',
    image: require('../../Assets/depol/1.png'),
  },
  {
    id: '2',
    name: 'Carla M., 34',
    plan: 'Glúteo Máximo',
    planColor: '#F4845F',
    text: 'Resultado visível em 6 semanas! Os treinos são objetivos e os GIFs deixam tudo claro. Amei cada desafio.',
    image: require('../../Assets/depol/2.png'),
  },
  {
    id: '3',
    name: 'Fernanda L., 25',
    plan: 'Desafio 90 Dias',
    planColor: '#B57BEA',
    text: 'Completei o desafio de 90 dias e a transformação foi incrível. Nunca imaginei que treinar em casa traria esses resultados.',
    image: require('../../Assets/depol/3.png'),
  },
  {
    id: '4',
    name: 'Juliana R., 31',
    plan: 'Bumbum do Zero',
    planColor: '#D96B9E',
    text: 'Comecei do zero sem saber nada de exercícios. Em 4 semanas já tinha uma rotina e meus glúteos responderam muito bem!',
    image: require('../../Assets/depol/4.png'),
  },
  {
    id: '5',
    name: 'Mariana T., 27',
    plan: 'Bumbum em Casa',
    planColor: '#89A8E0',
    text: 'Treinar em casa nunca foi tão eficiente. Sem academia, sem desculpas. Meu bumbum agradece todos os dias!',
    image: require('../../Assets/depol/5.png'),
  },
  {
    id: '6',
    name: 'Bianca S., 22',
    plan: 'Desafio 60 Dias',
    planColor: '#F4845F',
    text: 'Dois meses de dedicação e minha autoestima foi lá em cima. Os exercícios progridem na medida certa, sem me sobrecarregar.',
    image: require('../../Assets/depol/6.png'),
  },
  {
    id: '7',
    name: 'Patrícia O., 38',
    plan: 'Glúteo Máximo Avançado',
    planColor: '#B57BEA',
    text: 'Com 38 anos consegui o melhor resultado da minha vida. O protocolo avançado é desafiador mas cada série vale a pena.',
    image: require('../../Assets/depol/7.png'),
  },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile, weeklyStats, workoutHistory, userActivePlan } = useStore();
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const todayWorkout = weeklySchedule?.[dayIndex];

  // Animações do botão
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const ringAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulso suave no botão
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.07, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.96, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    // Anel expandindo e sumindo
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(ringAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!profile?.name) return null;

  const weeklyGoal = profile.level === 'Avançado' ? 5 : profile.level === 'Intermediário' ? 4 : 3;
  const progressPct = Math.min((weeklyStats.workouts / weeklyGoal) * 100, 100);

  // Próximo exercício do plano ativo
  const nextExercise = userActivePlan
    ? getExerciseById(userActivePlan.exerciseIds[userActivePlan.currentExerciseIndex])
    : null;
  const activePlanProgress = userActivePlan
    ? Math.round((userActivePlan.currentExerciseIndex / userActivePlan.exerciseIds.length) * 100)
    : 0;

  const handleContinue = () => {
    if (!userActivePlan) return;
    // Monta o objeto de plano compatível com ActiveWorkoutScreen
    const plan = {
      id: userActivePlan.planId,
      name: userActivePlan.planName,
      color: userActivePlan.planColor,
      exerciseIds: userActivePlan.exerciseIds,
      daysPerWeek: 3,
    };
    navigation.navigate('ActiveWorkout', { plan });
  };

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

      {/* Esta Semana — topo */}
      <View style={[styles.section, { marginBottom: spacing.sm }]}>
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

      {/* Treino de hoje */}
      <View style={styles.section}>

        {/* Botão Iniciar / Continuar — acima do card */}
        <View style={styles.startBtnWrap}>
          {/* Anel expandindo */}
          <Animated.View style={[styles.startBtnRing, {
            transform: [{ scale: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] }) }],
            opacity: ringAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.6, 0.2, 0] }),
          }]} />
          {/* Segundo anel com delay */}
          <Animated.View style={[styles.startBtnRing, styles.startBtnRing2, {
            transform: [{ scale: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
            opacity: ringAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.4, 0.1, 0] }),
          }]} />
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.startBtnMain}
              onPress={userActivePlan && nextExercise ? handleContinue : () => navigation.navigate('Workouts')}
              activeOpacity={0.75}
            >
              <View style={styles.startBtnInner}>
                <MaterialIcons
                  name={userActivePlan && nextExercise ? 'replay' : 'play-arrow'}
                  size={30} color={colors.primary}
                />
                <Text style={styles.startBtnLabel}>
                  {userActivePlan && nextExercise ? 'Continuar' : 'Iniciar'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

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
              {todayWorkout?.isRest && (
                <Text style={styles.restText}>Dia de recuperação ativa</Text>
              )}
            </View>
            <MaterialIcons
              name={todayWorkout?.isRest ? 'self-improvement' : 'bolt'}
              size={52} color="rgba(255,255,255,0.2)"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Cronograma semanal — removido daqui, está no topo */}

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

      {/* Depoimentos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resultados Reais</Text>
          <View style={styles.starRow}>
            {[1,2,3,4,5].map((s) => (
              <MaterialIcons key={s} name="star" size={13} color={colors.warning} />
            ))}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.testimonialScroll}>
          {TESTIMONIALS.map((t) => (
            <View key={t.id} style={styles.testimonialCard}>
              {/* Imagem única */}
              <Image source={t.image} style={styles.testimonialPhoto} resizeMode="cover" />

              {/* Texto */}
              <View style={styles.testimonialBody}>
                <View style={styles.testimonialStars}>
                  {[1,2,3,4,5].map((s) => (
                    <MaterialIcons key={s} name="star" size={12} color={colors.warning} />
                  ))}
                </View>
                <Text style={styles.testimonialText}>"{t.text}"</Text>
                <View style={styles.testimonialFooter}>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <View style={[styles.testimonialBadge, { backgroundColor: t.planColor + '25' }]}>
                    <Text style={[styles.testimonialBadgeText, { color: t.planColor }]}>{t.plan}</Text>
                  </View>
                </View>
              </View>
            </View>
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

  // ── Depoimentos ──────────────────────────────────────────────────────────
  testimonialScroll: { paddingBottom: spacing.xs },
  testimonialCard: {
    width: 280,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.cardLight,
  },
  photoWrap: {
    flex: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 130,
    borderRadius: borderRadius.md,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 6, left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  photoLabelAfter: {
    backgroundColor: colors.primary + 'CC',
  },
  photoLabelText: {
    fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1,
  },
  photoDivider: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  testimonialBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  testimonialStars: { flexDirection: 'row', gap: 2 },
  testimonialText: {
    fontSize: 13, color: colors.text, lineHeight: 20,
    fontStyle: 'italic',
  },
  testimonialFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 2,
  },
  testimonialName: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  testimonialBadge: {
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  testimonialBadgeText: { fontSize: 10, fontWeight: '700' },
  starRow: { flexDirection: 'row', gap: 2 },

  // ── Botão Iniciar / Continuar ────────────────────────────────────────────
  startBtnWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    height: 180,
  },
  // Anel externo animado
  startBtnRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  startBtnRing2: {
    borderColor: colors.primaryLight,
    borderWidth: 1,
  },
  startBtnMain: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  startBtnInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.card,
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 12,
  },
  startBtnLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
