import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, Image, ImageBackground, Modal,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { PulseButton } from '../components/PulseButton';
import {
  workoutPlans, challenges, getExercisesByIds,
  WorkoutPlan, Challenge,
} from '../data/exercises';
import { useStore } from '../store/useStore';
import { ExerciseCard } from '../components/ExerciseCard';
import { PaywallScreen } from './PaywallScreen';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type ActiveView =
  | { kind: 'list' }
  | { kind: 'plans' }
  | { kind: 'challenges_list' }
  | { kind: 'workout'; plan: WorkoutPlan }
  | { kind: 'challenge'; challenge: Challenge };

// ─── Imagens locais ───────────────────────────────────────────────────────────
const PLAN_IMAGES: Record<string, any> = {
  plan_zero:     require('../../Assets/img-gluteos/treino-img3.png'),
  plan_max:      require('../../Assets/img-gluteos/treino-img4.png'),
  plan_avancado: require('../../Assets/img-gluteos/treino-img10.png'),
  plan_casa:     require('../../Assets/img-gluteos/treino-img6.png'),
};

const CHALLENGE_IMAGES: Record<string, any> = {
  ch30: require('../../Assets/img-gluteos/treino-img7.png'),
  ch60: require('../../Assets/img-gluteos/treino-img8.png'),
  ch90: require('../../Assets/img-gluteos/treino-img9.png'),
};

const CHALLENGE_ICON: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  ch30: 'flag',
  ch60: 'emoji-events',
  ch90: 'military-tech',
};

const LEVEL_COLORS: Record<string, string> = {
  Iniciante:     '#7ECBA0',
  Intermediário: '#E8B870',
  Avançado:      '#E87878',
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE PLANO — estilo banner
// ─────────────────────────────────────────────────────────────────────────────
function PlanCard({ plan, onPress }: { plan: WorkoutPlan; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={['#1a0a12', '#3D0B22', '#7A0A35']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.cardInner}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.cardEyebrow}>{plan.level.toUpperCase()}</Text>
          <Text style={styles.cardTitle}>{plan.name}</Text>
          <Text style={styles.cardDesc}>{plan.objective}</Text>
          <View style={styles.cardMeta}>
            <MaterialIcons name="fitness-center" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.metaTextLight}>{plan.exerciseIds.length} exercícios</Text>
            <Text style={styles.metaDot}>·</Text>
            <MaterialIcons name="schedule" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.metaTextLight}>{plan.duration}</Text>
          </View>
          <View style={styles.cardBtn}>
            <Text style={styles.cardBtnText}>Ver treino</Text>
            <MaterialIcons name="chevron-right" size={16} color="#fff" />
          </View>
        </View>
        <Image source={PLAN_IMAGES[plan.id]} style={styles.cardImg} resizeMode="contain" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE DESAFIO — estilo banner
// ─────────────────────────────────────────────────────────────────────────────
function ChallengeCard({ ch, onPress }: { ch: Challenge; onPress: () => void }) {
  const phases = ch.weeks ? ch.weeks.length : (ch.months?.length ?? 0);
  const phaseLabel = ch.weeks ? 'semanas' : 'meses';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={['#1a0a12', '#3D0B22', '#7A0A35']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.cardInner}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.cardEyebrow}>DESAFIO</Text>
          <Text style={styles.cardTitle}>{ch.name}</Text>
          <Text style={styles.cardDesc}>{ch.description}</Text>
          <View style={styles.cardMeta}>
            <MaterialIcons name="date-range" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.metaTextLight}>{ch.totalDays} dias</Text>
            <Text style={styles.metaDot}>·</Text>
            <MaterialIcons name="layers" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.metaTextLight}>{phases} {phaseLabel}</Text>
          </View>
          <View style={styles.cardBtn}>
            <Text style={styles.cardBtnText}>Ver desafio</Text>
            <MaterialIcons name="chevron-right" size={16} color="#fff" />
          </View>
        </View>
        <Image source={CHALLENGE_IMAGES[ch.id]} style={styles.cardImg} resizeMode="contain" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// DETALHE DE TREINO
// ─────────────────────────────────────────────────────────────────────────────
function WorkoutDetail({ plan, navigation, onBack }: { plan: WorkoutPlan; navigation: any; onBack: () => void }) {
  const exs = getExercisesByIds(plan.exerciseIds);
  const { isPremium, setPremium } = useStore();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleExercisePress = (item: any) => {
    console.log('isPremium:', isPremium, 'showPaywall:', showPaywall);
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    navigation.navigate('ExerciseDetail', { exercise: item });
  };

  const handleStartPlan = () => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    navigation.navigate('ActiveWorkout', { plan });
  };

  return (
    <View style={styles.container}>
      {/* Modal Paywall */}
      <Modal visible={showPaywall} animationType="slide" onRequestClose={() => setShowPaywall(false)}>
        <PaywallScreen
          onSubscribe={() => { setPremium(true); setShowPaywall(false); }}
          onSkip={() => setShowPaywall(false)}
        />
      </Modal>

      <LinearGradient colors={[plan.color + '28', 'transparent']} style={styles.detailHeaderBg}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{plan.name}</Text>
            <Text style={styles.detailMeta}>{exs.length} exercícios · {plan.daysPerWeek}x/sem</Text>
          </View>
          <TouchableOpacity
            style={[styles.startBtnHeader, { backgroundColor: plan.color }]}
            onPress={handleStartPlan}
          >
            <MaterialIcons name="play-arrow" size={16} color="#fff" />
            <Text style={styles.startBtnHeaderText}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.infoCard}>
        <Text style={styles.infoDesc}>{plan.description}</Text>
        <View style={styles.infoMeta}>
          {[
            { icon: 'schedule' as const,      label: plan.duration },
            { icon: 'fitness-center' as const, label: plan.level },
            { icon: 'calendar-today' as const, label: `${plan.daysPerWeek}x/sem` },
          ].map((m) => (
            <View key={m.label} style={styles.infoChip}>
              <MaterialIcons name={m.icon} size={12} color={plan.color} />
              <Text style={[styles.infoChipText, { color: plan.color }]}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>
        <PulseButton
          label="Iniciar Treino"
          color={plan.color}
          onPress={handleStartPlan}
        />
      </View>

      <View style={styles.listLabelRow}>
        <Text style={styles.listLabel}>Exercícios</Text>
        <Text style={styles.listCount}>{exs.length} disponíveis</Text>
      </View>

      <FlatList
        data={exs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPad}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const locked = !isPremium;
          return (
            <TouchableOpacity
              style={styles.exerciseRow}
              onPress={() => handleExercisePress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.indexCircle, { backgroundColor: locked ? colors.border : plan.color + '28' }]}>
                {locked
                  ? <MaterialIcons name="lock" size={13} color={colors.primary} />
                  : <Text style={[styles.indexText, { color: plan.color }]}>{index + 1}</Text>
                }
              </View>
              <View style={{ flex: 1, opacity: locked ? 0.6 : 1 }}>
                <ExerciseCard exercise={item} onPress={() => handleExercisePress(item)} compact />
              </View>
              {locked && (
                <MaterialIcons name="workspace-premium" size={16} color={colors.primary} style={{ marginLeft: spacing.sm }} />
              )}
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View style={{ height: 80 }} />
        }
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETALHE DE DESAFIO — com fases bloqueadas
// ─────────────────────────────────────────────────────────────────────────────
function ChallengeDetail({ ch, navigation, onBack }: { ch: Challenge; navigation: any; onBack: () => void }) {
  const phases: any[] = ch.weeks ?? ch.months ?? [];
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const { completedChallengeFases, markChallengeFaseComplete, isPremium, setPremium } = useStore();
  const icon = CHALLENGE_ICON[ch.id] ?? 'emoji-events';

  const completed: number[] = completedChallengeFases[ch.id] ?? [];
  const unlockedPhase = phases.length;

  const handleStartPhase = (phaseIdx: number, phase: any) => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    navigation.navigate('ActiveWorkout', {
      plan: {
        id: `${ch.id}_${phaseIdx}`,
        name: phase.label,
        exerciseIds: phase.exerciseIds,
        color: ch.color,
        daysPerWeek: 3,
        onComplete: () => markChallengeFaseComplete(ch.id, phaseIdx),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Modal visible={showPaywall} animationType="slide" onRequestClose={() => setShowPaywall(false)}>
        <PaywallScreen
          onSubscribe={() => { setPremium(true); setShowPaywall(false); }}
          onSkip={() => setShowPaywall(false)}
        />
      </Modal>
      <LinearGradient colors={[ch.color + '28', 'transparent']} style={styles.detailHeaderBg}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.detailIconWrap, { backgroundColor: ch.color + '25' }]}>
            <MaterialIcons name={icon} size={18} color={ch.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{ch.name}</Text>
            <Text style={styles.detailMeta}>{ch.totalDays} dias · {phases.length} {ch.weeks ? 'semanas' : 'meses'}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.infoCard}>
          <Text style={styles.infoDesc}>{ch.description}</Text>
          <View style={styles.infoMeta}>
            <View style={styles.infoChip}>
              <MaterialIcons name="date-range" size={12} color={ch.color} />
              <Text style={[styles.infoChipText, { color: ch.color }]}>{ch.totalDays} dias</Text>
            </View>
            <View style={styles.infoChip}>
              <MaterialIcons name="layers" size={12} color={ch.color} />
              <Text style={[styles.infoChipText, { color: ch.color }]}>{phases.length} {ch.weeks ? 'semanas' : 'meses'}</Text>
            </View>
            <View style={styles.infoChip}>
              <MaterialIcons name="check-circle" size={12} color={ch.color} />
              <Text style={[styles.infoChipText, { color: ch.color }]}>{completed.length}/{phases.length} concluídas</Text>
            </View>
          </View>
        </View>

        <View style={[styles.listLabelRow, { paddingHorizontal: spacing.lg }]}>
          <Text style={styles.listLabel}>Fases do Desafio</Text>
          <Text style={styles.listCount}>{completed.length}/{phases.length} fases</Text>
        </View>

        {phases.map((phase, idx) => {
          const exs = getExercisesByIds(phase.exerciseIds);
          const isOpen = expandedPhase === idx;
          const isDone = completed.includes(idx);
          const isLocked = idx > unlockedPhase;
          const isCurrent = idx === unlockedPhase;

          return (
            <View
              key={idx}
              style={[
                styles.phaseCard,
                isLocked && styles.phaseCardLocked,
                isDone && { borderColor: colors.success + '50' },
                isCurrent && !isDone && { borderColor: ch.color + '60' },
              ]}
            >
              <TouchableOpacity
                style={styles.phaseHeader}
                onPress={() => !isLocked && setExpandedPhase(isOpen ? null : idx)}
                activeOpacity={isLocked ? 1 : 0.8}
              >
                {/* Ícone de status */}
                <View style={[
                  styles.phaseNumWrap,
                  isDone
                    ? { backgroundColor: colors.success }
                    : isLocked
                      ? { backgroundColor: colors.border }
                      : { backgroundColor: ch.color },
                ]}>
                  {isDone
                    ? <MaterialIcons name="check" size={16} color="#fff" />
                    : isLocked
                      ? <MaterialIcons name="lock" size={14} color={colors.textMuted} />
                      : <Text style={[styles.phaseNum, { color: '#fff' }]}>{idx + 1}</Text>
                  }
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.phaseLabel, isLocked && { color: colors.textMuted }]}>
                    {phase.label}
                  </Text>
                  {phase.description
                    ? <Text style={[styles.phaseSubLabel, isLocked && { color: colors.textMuted }]}>{phase.description}</Text>
                    : null}
                  <Text style={styles.phaseCount}>
                    {isDone
                      ? '✓ Concluída'
                      : isLocked
                        ? `Disponível após completar a fase ${idx}`
                        : `${exs.length} exercícios · disponível agora`}
                  </Text>
                </View>

                {!isLocked && (
                  <MaterialIcons
                    name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={22} color={colors.textMuted}
                  />
                )}
              </TouchableOpacity>

              {/* Conteúdo expandido — só para fases desbloqueadas */}
              {isOpen && !isLocked && (
                <View style={styles.phaseBody}>
                  {exs.map((ex, i) => (
                    <TouchableOpacity
                      key={ex.id} style={styles.phaseExRow}
                      onPress={() => navigation.navigate('ExerciseDetail', { exercise: ex })}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.phaseExNum, { color: isDone ? colors.success : ch.color }]}>
                        {String(i + 1).padStart(2, '0')}
                      </Text>
                      <Text style={styles.phaseExName}>{ex.name}</Text>
                      <View style={[styles.diffPill, { backgroundColor: LEVEL_COLORS[ex.difficulty] + '20' }]}>
                        <Text style={[styles.diffText, { color: LEVEL_COLORS[ex.difficulty] }]}>{ex.difficulty}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={15} color={colors.textMuted} />
                    </TouchableOpacity>
                  ))}

                  {!isDone && (
                    <TouchableOpacity
                      style={[styles.phaseStartBtn, { backgroundColor: ch.color }]}
                      onPress={() => handleStartPhase(idx, phase)}
                    >
                      <MaterialIcons name="play-arrow" size={17} color="#fff" />
                      <Text style={styles.phaseStartText}>Iniciar esta fase</Text>
                    </TouchableOpacity>
                  )}

                  {isDone && (
                    <View style={styles.phaseDoneBanner}>
                      <MaterialIcons name="check-circle" size={18} color={colors.success} />
                      <Text style={styles.phaseDoneText}>Fase concluída! Próxima fase desbloqueada.</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TELA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export const WorkoutsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [view, setView] = useState<ActiveView>({ kind: 'list' });
  const isFocused = useIsFocused();
  const { isPremium, setPremium, completeOnboarding } = useStore();
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (isFocused) setView({ kind: 'list' });
  }, [isFocused]);

  const handleChallengePress = (ch: Challenge) => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    setView({ kind: 'challenge', challenge: ch });
  };

  if (view.kind === 'workout') {
    return <WorkoutDetail plan={view.plan} navigation={navigation} onBack={() => setView({ kind: 'plans' })} />;
  }
  if (view.kind === 'challenge') {
    return <ChallengeDetail ch={view.challenge} navigation={navigation} onBack={() => setView({ kind: 'challenges_list' })} />;
  }  if (view.kind === 'plans') {
    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView({ kind: 'list' })}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Treinos</Text>
            <Text style={styles.headerSub}>Escolha seu plano</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {workoutPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onPress={() => setView({ kind: 'workout', plan })} />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }
  if (view.kind === 'challenges_list') {
    return (
      <View style={styles.container}>
        <Modal visible={showPaywall} animationType="slide" onRequestClose={() => setShowPaywall(false)}>
          <PaywallScreen
            onSubscribe={() => { setPremium(true); setShowPaywall(false); }}
            onSkip={() => setShowPaywall(false)}
          />
        </Modal>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView({ kind: 'list' })}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Desafios</Text>
            <Text style={styles.headerSub}>Escolha sua duração</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {challenges.map((ch) => (
            <ChallengeCard key={ch.id} ch={ch} onPress={() => handleChallengePress(ch)} />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treinos</Text>
        <Text style={styles.headerSub}>Escolha como quer treinar hoje</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Card Desafios */}
        <TouchableOpacity style={styles.bigCard} activeOpacity={0.88} onPress={() => setView({ kind: 'challenges_list' })}>
          <LinearGradient
            colors={['#1a0a12', '#3D0B22', '#7A0A35']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.bigCardInner}
          >
            <View style={styles.bigCardLeft}>
              <Text style={styles.bigCardEyebrow}>DESAFIOS</Text>
              <Text style={styles.bigCardTitle}>Desafio{'\n'}Glúteos</Text>
              <Text style={styles.bigCardTitlePink}>{challenges.length} desafios</Text>
              <Text style={styles.bigCardDesc}>Comprometa-se com um prazo e veja a transformação acontecer.</Text>
              <View style={styles.bigCardBtn}>
                <Text style={styles.bigCardBtnText}>Ver Desafios</Text>
                <MaterialIcons name="chevron-right" size={18} color="#fff" />
              </View>
            </View>
            <Image
              source={require('../../Assets/img-gluteos/treino-img2.png')}
              style={styles.bigCardImg}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Card Treinos */}
        <TouchableOpacity style={styles.bigCard} activeOpacity={0.88} onPress={() => setView({ kind: 'plans' })}>
          <LinearGradient
            colors={['#1a0a12', '#3D0B22', '#7A0A35']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.bigCardInner}
          >
            <View style={styles.bigCardLeft}>
              <Text style={styles.bigCardEyebrow}>TREINOS</Text>
              <Text style={styles.bigCardTitle}>Planos de{'\n'}Glúteos</Text>
              <Text style={styles.bigCardTitlePink}>{workoutPlans.length} planos</Text>
              <Text style={styles.bigCardDesc}>Do iniciante ao avançado. Escolha seu nível e comece agora.</Text>
              <View style={styles.bigCardBtn}>
                <Text style={styles.bigCardBtnText}>Ver Treinos</Text>
                <MaterialIcons name="chevron-right" size={18} color="#fff" />
              </View>
            </View>
            <Image
              source={require('../../Assets/img-gluteos/treino-img.png')}
              style={styles.bigCardImg}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 12,
    paddingBottom: spacing.md,
  },
  subHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 12,
    paddingBottom: spacing.md,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  scrollContent: { paddingHorizontal: spacing.lg },

  backBtn: {
    width: 38, height: 38, borderRadius: borderRadius.md,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Card estilo banner ─────────────────────────────────────────────────────
  card: { borderRadius: borderRadius.lg, marginBottom: spacing.md, overflow: 'hidden' },
  cardInner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: borderRadius.lg, minHeight: 190, overflow: 'hidden',
  },
  cardLeft: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: 5 },
  cardEyebrow: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#fff', lineHeight: 26 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  metaDot: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  metaTextLight: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  cardImg: { width: 120, height: 160 },
  cardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: borderRadius.full, marginTop: spacing.sm,
  },
  cardBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // ── Detail ─────────────────────────────────────────────────────────────────
  detailHeaderBg: { paddingBottom: spacing.sm },
  detailHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 12, paddingBottom: spacing.md, gap: spacing.sm,
  },
  detailIconWrap: { width: 38, height: 38, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  detailMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  startBtnHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: borderRadius.full,
  },
  startBtnHeaderText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  infoCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  infoDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  infoMeta: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.cardLight, paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: borderRadius.sm,
  },
  infoChipText: { fontSize: 11, fontWeight: '700' },

  listLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  listLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  listCount: { fontSize: 12, color: colors.textSecondary },
  listPad: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  indexCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  indexText: { fontSize: 12, fontWeight: '800' },

  // ── Fases ──────────────────────────────────────────────────────────────────
  phaseCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  phaseNumWrap: { width: 32, height: 32, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  phaseNum: { fontSize: 14, fontWeight: '800' },
  phaseLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  phaseSubLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  phaseCount: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  phaseBody: { borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 3 },
  phaseExRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, paddingHorizontal: spacing.sm, borderRadius: borderRadius.sm,
  },
  phaseExNum: { fontSize: 12, fontWeight: '800', width: 22 },
  phaseExName: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text },
  diffPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.full },
  diffText: { fontSize: 10, fontWeight: '700' },
  phaseStartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: borderRadius.md, paddingVertical: 12, marginTop: spacing.sm,
  },
  phaseStartText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  phaseCardLocked: {
    opacity: 0.5,
  },

  // ── Desbloqueio de exercícios ──────────────────────────────────────────────
  unlockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.warning + '15',
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1, borderColor: colors.warning + '40',
  },
  unlockBannerText: { fontSize: 12, color: colors.warning, fontWeight: '600', flex: 1 },
  exerciseRowLocked: { opacity: 1 },
  lockedExCard: { position: 'relative', borderRadius: borderRadius.md, overflow: 'hidden' },
  lockedExBlur: { opacity: 0.18 },
  lockedExOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    gap: 6, flexDirection: 'row',
    backgroundColor: colors.card + 'CC',
    borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.warning + '40',
    paddingHorizontal: spacing.md,
  },
  lockedExText: { fontSize: 12, color: colors.warning, fontWeight: '700' },
  phaseDoneBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.success + '15',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  phaseDoneText: { fontSize: 12, color: colors.success, fontWeight: '600', flex: 1 },

  // ── Big cards ──────────────────────────────────────────────────────────────
  bigCard: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.md },
  bigCardInner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: borderRadius.lg, minHeight: 210, overflow: 'hidden',
  },
  bigCardLeft: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: 6 },
  bigCardEyebrow: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  bigCardTitle: { fontSize: 22, fontWeight: '900', color: '#fff', lineHeight: 28 },
  bigCardTitlePink: { fontSize: 16, fontWeight: '800', color: colors.primary },
  bigCardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18, marginTop: 2 },
  bigCardImg: { width: 155, height: 190 },
  bigCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRadius: borderRadius.full, marginTop: spacing.sm,
  },
  bigCardBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
