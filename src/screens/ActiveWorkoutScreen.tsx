import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Animated, Alert, ScrollView, Dimensions, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { exercises } from '../data/exercises';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

// ─── Confete individual ───────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#D96B9E', '#B57BEA', '#F4845F', '#7ECBA0', '#89A8E0', '#F472B6', '#E8B870'];

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rot: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  left: number;
}

function useConfetti(active: boolean) {
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: 28 }, (_, i) => ({
      x:     new Animated.Value(0),
      y:     new Animated.Value(0),
      rot:   new Animated.Value(0),
      scale: new Animated.Value(0),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size:  Math.random() * 8 + 6,
      left:  Math.random() * SCREEN_W,
    }))
  ).current;

  useEffect(() => {
    if (!active) return;
    pieces.forEach((p, i) => {
      p.x.setValue(0); p.y.setValue(0); p.rot.setValue(0); p.scale.setValue(0);
      Animated.sequence([
        Animated.delay(i * 35),
        Animated.parallel([
          Animated.spring(p.scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }),
          Animated.timing(p.y, { toValue: SCREEN_H * 0.5 + Math.random() * 120, duration: 1600 + Math.random() * 600, useNativeDriver: true }),
          Animated.timing(p.x, { toValue: (Math.random() - 0.5) * 120, duration: 1400 + Math.random() * 400, useNativeDriver: true }),
          Animated.timing(p.rot, { toValue: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 4), duration: 1600, useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, [active]);

  return pieces;
}

// ─── Modal de descanso ────────────────────────────────────────────────────────
interface RestModalProps {
  visible: boolean;
  restSeconds: number;
  serieNum: number;
  totalSeries: number;
  isLastSerie: boolean;
  exerciseName: string;
  onSkip: () => void;
}

const RestModal: React.FC<RestModalProps> = ({
  visible, restSeconds, serieNum, totalSeries, isLastSerie, exerciseName, onSkip,
}) => {
  const [countdown, setCountdown] = useState(restSeconds);
  const countRef   = useRef<any>(null);
  const slideAnim  = useRef(new Animated.Value(SCREEN_H)).current;
  const scaleAnim  = useRef(new Animated.Value(0.7)).current;
  const confetti   = useConfetti(visible);

  // Reinicia countdown sempre que o modal abre
  useEffect(() => {
    if (!visible) { clearInterval(countRef.current); return; }
    setCountdown(restSeconds);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 10 }),
    ]).start();
    countRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(countRef.current); onSkip(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countRef.current);
  }, [visible]);

  if (!visible) return null;

  const progress = countdown / restSeconds;
  const circumf  = 2 * Math.PI * 52;

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <View style={ms.overlay}>

        {/* Confetes */}
        {confetti.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              ms.confettiPiece,
              {
                left: p.left,
                top: -20,
                width: p.size,
                height: p.size * (Math.random() > 0.5 ? 1 : 2.2),
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? p.size / 2 : 2,
                transform: [
                  { translateY: p.y },
                  { translateX: p.x },
                  { rotate: p.rot.interpolate({ inputRange: [-6, 6], outputRange: ['-360deg', '360deg'] }) },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        ))}

        {/* Card */}
        <Animated.View style={[ms.card, { transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#1C1720', '#231D28']}
            style={ms.cardInner}
          >
            {/* Ícone + título */}
            <View style={ms.topRow}>
              <View style={ms.iconCircle}>
                <MaterialIcons name="check-circle" size={32} color={colors.success} />
              </View>
              {!isLastSerie ? (
                <Text style={ms.badge}>Série {serieNum} concluída!</Text>
              ) : (
                <Text style={ms.badgeFinal}>Exercício concluído!</Text>
              )}
            </View>

            <Text style={ms.title}>
              {isLastSerie ? '🎉 Incrível!' : 'Descanse agora'}
            </Text>
            <Text style={ms.subtitle}>
              {isLastSerie
                ? `Todas as séries de "${exerciseName}" foram feitas.`
                : `Próxima: Série ${serieNum + 1} de ${totalSeries}`}
            </Text>

            {/* Anel regressivo */}
            {!isLastSerie && (
              <View style={ms.ringWrap}>
                <View style={ms.ringBg} />
                {/* Simula o arco com opacidade — sem SVG nativo */}
                <View style={[ms.ringFill, { opacity: progress }]} />
                <View style={ms.ringCenter}>
                  <Text style={ms.ringNumber}>{countdown}</Text>
                  <Text style={ms.ringLabel}>seg</Text>
                </View>
              </View>
            )}

            {/* Botão pular/continuar */}
            <TouchableOpacity style={ms.skipBtn} onPress={onSkip} activeOpacity={0.85}>
              <Text style={ms.skipText}>
                {isLastSerie ? 'Próximo exercício' : 'Pular descanso'}
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Tela principal ───────────────────────────────────────────────────────────
export const ActiveWorkoutScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation, route,
}) => {
  const { plan } = route.params;
  const { startWorkout, completeSet, finishWorkout } = useStore();

  const exerciseIds: string[] = plan.exerciseIds ?? plan.exercises ?? [];
  const planExercises = exerciseIds
    .map((id: string) => exercises.find((e) => e.id === id))
    .filter(Boolean) as typeof exercises;

  // ── Estado ──────────────────────────────────────────────────────────────────
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [elapsed,      setElapsed]      = useState(0);
  const [serieTimer,   setSerieTimer]   = useState(0);  const [serieRunning, setSerieRunning] = useState(false);
  const [currentSerie, setCurrentSerie] = useState(1);
  const [doneSeries,   setDoneSeries]   = useState<Record<string, number>>({});
  const [exDone,       setExDone]       = useState<Record<number, boolean>>({});
  const [restModal,    setRestModal]    = useState<{ visible: boolean; isLast: boolean }>({ visible: false, isLast: false });

  const workoutTimerRef = useRef<any>(null);
  const serieTimerRef   = useRef<any>(null);
  const pulseAnim       = useRef(new Animated.Value(1)).current;
  const checkAnim       = useRef(new Animated.Value(0)).current;

  const ex = planExercises[currentIdx];
  const totalSeries = ex?.defaultSets ?? 3;
  const serieDuration = ex?.defaultRest ?? 45; // usa o tempo de descanso como duração da série

  // séries concluídas deste exercício
  const doneCount = doneSeries[ex?.id ?? ''] ?? 0;
  const isExDone  = exDone[currentIdx] ?? false;

  // ── Inicializa ──────────────────────────────────────────────────────────────
  useEffect(() => {
    startWorkout(plan.id, exerciseIds);
    workoutTimerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(workoutTimerRef.current);
      clearInterval(serieTimerRef.current);
    };
  }, []);

  // ── Pulso no botão quando parado ─────────────────────────────────────────
  useEffect(() => {
    if (serieRunning) {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.96, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [serieRunning]);

  // ── Iniciar série ──────────────────────────────────────────────────────────
  const startSerie = () => {
    if (isExDone) return;
    setSerieTimer(serieDuration);
    setSerieRunning(true);
    clearInterval(serieTimerRef.current);
    serieTimerRef.current = setInterval(() => {
      setSerieTimer((t) => {
        if (t <= 1) {
          clearInterval(serieTimerRef.current);
          handleSerieComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // ── Série concluída ────────────────────────────────────────────────────────
  const handleSerieComplete = () => {
    setSerieRunning(false);
    if (!ex) return;

    const newDone = (doneSeries[ex.id] ?? 0) + 1;
    setDoneSeries((prev) => ({ ...prev, [ex.id]: newDone }));
    completeSet(ex.id, currentSerie - 1, 0, 0);

    const isLast = newDone >= totalSeries;
    setRestModal({ visible: true, isLast });

    if (isLast) {
      setExDone((prev) => ({ ...prev, [currentIdx]: true }));
    } else {
      setCurrentSerie(newDone + 1);
    }
  };

  // ── Fechar modal de descanso ───────────────────────────────────────────────
  const handleRestDone = () => {
    setRestModal({ visible: false, isLast: false });
    if (restModal.isLast && currentIdx < planExercises.length - 1) {
      setCurrentIdx((i) => i + 1);
      setCurrentSerie(1);
      setSerieTimer(0);
    }
  };

  // ── Cancelar série ────────────────────────────────────────────────────────
  const cancelSerie = () => {
    clearInterval(serieTimerRef.current);
    setSerieRunning(false);
    setSerieTimer(0);
  };

  // ── Navegar entre exercícios ──────────────────────────────────────────────
  const goTo = (idx: number) => {
    if (idx < 0 || idx >= planExercises.length) return;
    cancelSerie();
    setCurrentIdx(idx);
    setCurrentSerie((doneSeries[planExercises[idx]?.id ?? ''] ?? 0) + 1);
    setSerieTimer(0);
  };

  // ── Finalizar treino ──────────────────────────────────────────────────────
  const handleFinish = () => {
    clearInterval(workoutTimerRef.current);
    clearInterval(serieTimerRef.current);
    finishWorkout();
    navigation.navigate('WorkoutSummary', { duration: elapsed, planName: plan.name });
  };

  if (!ex) return null;

  const totalDone  = Object.values(exDone).filter(Boolean).length;
  const progress   = totalDone / planExercises.length;

  return (
    <View style={styles.root}>
      <RestModal
        visible={restModal.visible}
        restSeconds={ex.defaultRest ?? 45}
        serieNum={doneCount}
        totalSeries={totalSeries}
        isLastSerie={restModal.isLast}
        exerciseName={ex.name}
        onSkip={handleRestDone}
      />

      {/* ── GIF full-screen ─────────────────────────────────────────────── */}
      <View style={styles.gifContainer}>
        {ex.gifUrl
          ? <Image source={ex.gifUrl} style={styles.gif} resizeMode="contain" />
          : (
            <View style={styles.gifFallback}>
              <MaterialIcons name="fitness-center" size={80} color={colors.primary + '40'} />
            </View>
          )
        }
        {/* Gradiente superior para o header */}
        <LinearGradient
          colors={['rgba(13,11,14,0.92)', 'transparent']}
          style={styles.gradTop}
        />
        {/* Gradiente inferior para o conteúdo */}
        <LinearGradient
          colors={['transparent', 'rgba(13,11,14,0.97)', colors.background]}
          style={styles.gradBottom}
        />
      </View>

      {/* ── Header flutuante ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleFinish}>
          <MaterialIcons name="close" size={18} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTimerLabel}>{plan.name}</Text>
        </View>

        <TouchableOpacity style={[styles.headerBtn, styles.finishBtn]} onPress={handleFinish}>
          <Text style={styles.finishText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      {/* ── Barra de progresso geral ─────────────────────────────────────── */}
      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.progressTxt}>{totalDone}/{planExercises.length}</Text>
      </View>

      {/* ── Área inferior ────────────────────────────────────────────────── */}
      <View style={styles.bottom}>

        {/* Nome + músculo */}
        <View style={styles.exInfo}>
          <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
          <View style={styles.exMeta}>
            <View style={styles.pill}>
              <MaterialIcons name="fitness-center" size={11} color={colors.primary} />
              <Text style={styles.pillText}>{totalSeries} séries · {ex.defaultReps} reps</Text>
            </View>
            {isExDone && (
              <View style={[styles.pill, { backgroundColor: colors.success + '25' }]}>
                <MaterialIcons name="check-circle" size={11} color={colors.success} />
                <Text style={[styles.pillText, { color: colors.success }]}>Concluído</Text>
              </View>
            )}
          </View>
        </View>

        {/* Indicador de séries */}
        <View style={styles.seriesRow}>
          {Array.from({ length: totalSeries }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.serieDot,
                i < doneCount && styles.serieDotDone,
                i === doneCount && serieRunning && styles.serieDotActive,
              ]}
            />
          ))}
          <Text style={styles.seriesLabel}>
            {isExDone ? 'Todas as séries concluídas' : `Série ${Math.min(currentSerie, totalSeries)} de ${totalSeries}`}
          </Text>
        </View>

        {/* Botão circular */}
        <View style={styles.btnArea}>
          {/* Anel de progresso SVG-like com View (workaround sem SVG) */}
          <Animated.View style={[styles.circleBtnWrap, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.circleBtn,
                serieRunning && styles.circleBtnRunning,
                isExDone     && styles.circleBtnDone,
              ]}
              onPress={serieRunning ? cancelSerie : startSerie}
              activeOpacity={0.85}
              disabled={isExDone}
            >
              {serieRunning ? (
                <Text style={styles.circleBtnTimer}>{fmt(serieTimer)}</Text>
              ) : isExDone ? (
                <>
                  <MaterialIcons name="check-circle" size={36} color={colors.success} />
                  <Text style={[styles.circleBtnLabel, { color: colors.success }]}>Concluído</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name={doneCount === 0 ? 'play-arrow' : 'replay'}
                    size={38}
                    color="#fff"
                  />
                  <Text style={styles.circleBtnLabel}>
                    {doneCount === 0 ? 'Iniciar' : 'Continuar'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Navegação anterior / próximo */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, currentIdx === 0 && styles.navBtnOff]}
            onPress={() => goTo(currentIdx - 1)}
            disabled={currentIdx === 0}
          >
            <MaterialIcons name="chevron-left" size={18} color={colors.primary} />
            <Text style={styles.navBtnText}>Anterior</Text>
          </TouchableOpacity>

          <View style={styles.navDivider} />

          <TouchableOpacity
            style={[styles.navBtn, currentIdx === planExercises.length - 1 && styles.navBtnOff]}
            onPress={() => goTo(currentIdx + 1)}
            disabled={currentIdx === planExercises.length - 1}
          >
            <Text style={styles.navBtnText}>Próximo</Text>
            <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  // GIF
  gifContainer: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: SCREEN_H * 0.58,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: SCREEN_W,
    height: SCREEN_H * 0.58,
  },
  gifFallback: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.card,
  },
  gradTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 140 },
  gradBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 },

  // Badge check
  checkBadge: {
    position: 'absolute', top: '38%', alignSelf: 'center',
    alignItems: 'center', gap: 6,
  },
  checkBadgeText: { fontSize: 16, fontWeight: '800', color: colors.success },

  // Header
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.sm,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(28,23,32,0.75)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  headerCenter: { alignItems: 'center' },
  headerTimer: { fontSize: 24, fontWeight: '800', color: colors.primary, letterSpacing: 1 },
  headerTimerLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  finishBtn: { paddingHorizontal: spacing.md, width: 'auto' as any, borderColor: colors.error + '60', backgroundColor: 'rgba(232,120,120,0.12)' },
  finishText: { fontSize: 13, fontWeight: '700', color: colors.error },

  // Progress
  progressRow: {
    position: 'absolute',
    top: spacing.xl + 8 + 38 + spacing.sm + 4,
    left: spacing.lg, right: spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  progressBg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  progressTxt: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },

  // Dots
  dotsScroll: { position: 'absolute', top: spacing.xl + 8 + 38 + spacing.sm + 16 + 12, left: 0, right: 0 },
  dotsContent: { paddingHorizontal: spacing.lg, gap: 6 },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(28,23,32,0.8)',
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },

  // Área inferior
  bottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingTop: spacing.lg, paddingBottom: spacing.xl + 8,
    paddingHorizontal: spacing.lg,
    top: SCREEN_H * 0.52,
    justifyContent: 'space-between',
  },

  // Info exercício
  exInfo: { gap: 6 },
  exName: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  exMeta: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm, paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border,
  },
  pillText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Indicador de séries
  seriesRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  serieDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.border,
  },
  serieDotDone: { backgroundColor: colors.primary },
  serieDotActive: { backgroundColor: colors.primary, transform: [{ scale: 1.3 }] },
  seriesLabel: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },

  // Botão circular
  btnArea: { alignItems: 'center' },
  circleBtnWrap: {},
  circleBtn: {
    width: 148, height: 148, borderRadius: 74,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    gap: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 12,
  },
  circleBtnRunning: {
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
  },
  circleBtnDone: {
    backgroundColor: colors.success + '20',
    shadowColor: colors.success,
    borderWidth: 2,
    borderColor: colors.success,
  },
  circleBtnTimer: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  circleBtnLabel: { fontSize: 17, fontWeight: '800', color: '#fff' },
  circleBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },

  // Nav
  navRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 14,
  },
  navBtnOff: { opacity: 0.3 },
  navBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  navDivider: { width: 1, height: 20, backgroundColor: colors.border },
});

// ─── Estilos do modal de descanso ─────────────────────────────────────────────
const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13,11,14,0.78)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl + 16,
  },
  cardInner: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.success + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    fontSize: 13, fontWeight: '700', color: colors.success,
    backgroundColor: colors.success + '18',
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeFinal: {
    fontSize: 13, fontWeight: '700', color: colors.primary,
    backgroundColor: colors.primary + '18',
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  title: {
    fontSize: 28, fontWeight: '800', color: colors.text,
    letterSpacing: -0.5, alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14, color: colors.textSecondary,
    lineHeight: 20, alignSelf: 'flex-start',
  },
  // Anel regressivo
  ringWrap: {
    width: 120, height: 120,
    alignItems: 'center', justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  ringBg: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 6, borderColor: colors.border,
  },
  ringFill: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 6, borderColor: colors.primary,
  },
  ringCenter: { alignItems: 'center', gap: 2 },
  ringNumber: { fontSize: 36, fontWeight: '800', color: colors.text },
  ringLabel: { fontSize: 12, color: colors.textSecondary, marginTop: -4 },
  // Botão pular
  skipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'stretch', justifyContent: 'center',
    backgroundColor: colors.primary + '18',
    borderWidth: 1, borderColor: colors.primary + '40',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
  },
  skipText: { fontSize: 15, fontWeight: '700', color: colors.primary },
});
