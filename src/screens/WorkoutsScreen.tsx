import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, ImageBackground, Modal,
} from 'react-native';
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
  plan_zero:     require('../../Assets/img-gluteos/bumbum-exercicios-academia-ptbf9uix7q0fg0ullx3wqy865759i4eedoou2u35f0.jpg'),
  plan_max:      require('../../Assets/img-gluteos/Criando-glúteos-grandes-com-treino-para-glúteos.jpg'),
  plan_avancado: require('../../Assets/img-gluteos/agachamento.jpg'),
  plan_casa:     require('../../Assets/img-gluteos/como-ter-o-bumbum-dos-sonhos-1508379414.jpg'),
};

const CHALLENGE_IMAGES: Record<string, any> = {
  ch30: require('../../Assets/img-gluteos/harmonizacao-de-glueos.jpg'),
  ch60: require('../../Assets/img-gluteos/agachamento.jpg'),
  ch90: require('../../Assets/img-gluteos/Criando-glúteos-grandes-com-treino-para-glúteos.jpg'),
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
// CARD DE PLANO — com imagem de fundo local
// ─────────────────────────────────────────────────────────────────────────────
function PlanCard({ plan, onPress }: { plan: WorkoutPlan; onPress: () => void }) {
  const levelColor = LEVEL_COLORS[plan.level] ?? colors.primary;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <ImageBackground
        source={PLAN_IMAGES[plan.id] ?? PLAN_IMAGES['plan_zero']}
        style={styles.cardImageBg}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(13,11,14,0.85)', colors.background]}
          style={styles.cardImageGrad}
        >
          <View style={styles.cardImgTop}>
            <View style={[styles.levelBadge, {
              backgroundColor: levelColor + '30',
              borderColor: levelColor + '80',
              borderWidth: 1,
            }]}>
              <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
              <Text style={[styles.levelText, { color: levelColor }]}>{plan.level}</Text>
            </View>
          </View>
          <View style={styles.cardImgBottom}>
            <Text style={styles.cardTitle}>{plan.name}</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>{plan.objective}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="fitness-center" size={11} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaTextLight}>{plan.exerciseIds.length} exercícios</Text>
              </View>
              <View style={styles.metaDividerLight} />
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={11} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaTextLight}>{plan.duration}</Text>
              </View>
              <View style={styles.metaDividerLight} />
              <View style={styles.metaItem}>
                <MaterialIcons name="calendar-today" size={11} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaTextLight}>{plan.daysPerWeek}x/sem</Text>
              </View>
              <View style={[styles.arrowBtn, { backgroundColor: plan.color, marginLeft: 'auto' as any }]}>
                <MaterialIcons name="arrow-forward" size={14} color="#fff" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD DE DESAFIO — com imagem de fundo local
// ─────────────────────────────────────────────────────────────────────────────
function ChallengeCard({ ch, onPress }: { ch: Challenge; onPress: () => void }) {
  const phases = ch.weeks ? ch.weeks.length : (ch.months?.length ?? 0);
  const phaseLabel = ch.weeks ? 'semanas' : 'meses';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <ImageBackground
        source={CHALLENGE_IMAGES[ch.id] ?? CHALLENGE_IMAGES['ch30']}
        style={styles.cardImageBg}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(13,11,14,0.85)', colors.background]}
          style={styles.cardImageGrad}
        >
          <View style={styles.cardImgTop}>
            <View style={[styles.daysBadge, { backgroundColor: ch.color }]}>
              <MaterialIcons name="date-range" size={11} color="#fff" />
              <Text style={styles.daysBadgeText}>{ch.totalDays} dias</Text>
            </View>
          </View>
          <View style={styles.cardImgBottom}>
            <Text style={styles.cardTitle}>{ch.name}</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>{ch.description}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="layers" size={11} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaTextLight}>{phases} {phaseLabel}</Text>
              </View>
              <View style={styles.metaDividerLight} />
              <View style={styles.metaItem}>
                <MaterialIcons name="trending-up" size={11} color="rgba(255,255,255,0.6)" />
                <Text style={styles.metaTextLight}>Progressão gradual</Text>
              </View>
              <View style={[styles.arrowBtn, { backgroundColor: ch.color, marginLeft: 'auto' as any }]}>
                <MaterialIcons name="arrow-forward" size={14} color="#fff" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETALHE DE TREINO
// ─────────────────────────────────────────────────────────────────────────────
// DETALHE DE TREINO
// ─────────────────────────────────────────────────────────────────────────────
const FREE_EXERCISES = 3;

function WorkoutDetail({ plan, navigation, onBack }: { plan: WorkoutPlan; navigation: any; onBack: () => void }) {
  const exs = getExercisesByIds(plan.exerciseIds);
  const { isPremium, setPremium, completeOnboarding } = useStore();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleExercisePress = (item: any, index: number) => {
    if (!isPremium && index >= FREE_EXERCISES) {
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

      <View style={styles.listLabelRow}>
        <Text style={styles.listLabel}>Exercícios</Text>
        <Text style={styles.listCount}>{isPremium ? exs.length : `${FREE_EXERCISES}/${exs.length}`} disponíveis</Text>
      </View>

      <FlatList
        data={exs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPad}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const locked = !isPremium && index >= FREE_EXERCISES;
          return (
            <TouchableOpacity
              style={styles.exerciseRow}
              onPress={() => handleExercisePress(item, index)}
              activeOpacity={0.8}
            >
              <View style={[styles.indexCircle, { backgroundColor: locked ? colors.border : plan.color + '28' }]}>
                {locked
                  ? <MaterialIcons name="lock" size={13} color={colors.primary} />
                  : <Text style={[styles.indexText, { color: plan.color }]}>{index + 1}</Text>
                }
              </View>
              <View style={{ flex: 1, opacity: locked ? 0.6 : 1 }}>
                <ExerciseCard exercise={item} onPress={() => handleExercisePress(item, index)} compact />
              </View>
              {locked && (
                <MaterialIcons name="workspace-premium" size={16} color={colors.primary} style={{ marginLeft: spacing.sm }} />
              )}
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View style={{ paddingTop: spacing.md, paddingBottom: 80 }}>
            <PulseButton
              label="Iniciar Treino"
              color={plan.color}
              onPress={handleStartPlan}
            />
          </View>
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
  const { isPremium, setPremium, completeOnboarding } = useStore();
  const [showPaywall, setShowPaywall] = useState(false);

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

        {/* Card Desafios — em cima */}
        <TouchableOpacity style={styles.bigCard} activeOpacity={0.88} onPress={() => setView({ kind: 'challenges_list' })}>
          <ImageBackground
            source={require('../../Assets/img-gluteos/Criando-glúteos-grandes-com-treino-para-glúteos.jpg')}
            style={styles.bigCardBg} imageStyle={styles.bigCardImg}
          >
            <LinearGradient colors={['rgba(13,11,14,0.1)', 'rgba(13,11,14,0.95)']} style={styles.bigCardGrad}>
              <View style={styles.bigCardContent}>
                <View style={styles.bigCardTop}>
                  <View style={[styles.bigCardBadge, { backgroundColor: '#B57BEA' }]}>
                    <MaterialIcons name="emoji-events" size={12} color="#fff" />
                    <Text style={styles.bigCardBadgeText}>{challenges.length} desafios</Text>
                  </View>
                </View>
                <View style={styles.bigCardBottom}>
                  <Text style={styles.bigCardEyebrow}>DESAFIOS</Text>
                  <Text style={styles.bigCardTitle}>Desafio</Text>
                  <Text style={styles.bigCardDesc}>Comprometa-se com um prazo e veja a transformação acontecer.</Text>
                  <View style={styles.pillRow}>
                    {challenges.map((ch) => (
                      <View key={ch.id} style={[styles.levelPill, { borderColor: ch.color + '80' }]}>
                        <Text style={[styles.levelPillText, { color: ch.color }]}>{ch.totalDays} dias</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.bigCardBtn, { backgroundColor: '#B57BEA' }]}>
                    <Text style={styles.bigCardBtnText}>Ver Desafios</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Card Treinos — embaixo */}
        <TouchableOpacity style={styles.bigCard} activeOpacity={0.88} onPress={() => setView({ kind: 'plans' })}>
          <ImageBackground
            source={require('../../Assets/img-gluteos/bumbum-exercicios-academia-ptbf9uix7q0fg0ullx3wqy865759i4eedoou2u35f0.jpg')}
            style={styles.bigCardBg} imageStyle={styles.bigCardImg}
          >
            <LinearGradient colors={['rgba(13,11,14,0.1)', 'rgba(13,11,14,0.95)']} style={styles.bigCardGrad}>
              <View style={styles.bigCardContent}>
                <View style={styles.bigCardTop}>
                  <View style={[styles.bigCardBadge, { backgroundColor: colors.primary }]}>
                    <MaterialIcons name="fitness-center" size={12} color="#fff" />
                    <Text style={styles.bigCardBadgeText}>{workoutPlans.length} planos</Text>
                  </View>
                </View>
                <View style={styles.bigCardBottom}>
                  <Text style={styles.bigCardEyebrow}>TREINOS</Text>
                  <Text style={styles.bigCardTitle}>Planos de Glúteos</Text>
                  <Text style={styles.bigCardDesc}>Do iniciante ao avançado. Escolha seu nível e comece agora.</Text>
                  <View style={styles.pillRow}>
                    {workoutPlans.map((p) => (
                      <View key={p.id} style={[styles.levelPill, { borderColor: p.color + '80' }]}>
                        <Text style={[styles.levelPillText, { color: p.color }]}>{p.category}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.bigCardBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.bigCardBtnText}>Ver Treinos</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
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

  // ── Card com imagem ────────────────────────────────────────────────────────
  card: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    height: 200,
  },
  cardImageBg: { flex: 1 },
  cardImageStyle: { borderRadius: borderRadius.lg },
  cardImageGrad: {
    flex: 1,
    borderRadius: borderRadius.lg,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  cardImgTop: { flexDirection: 'row', justifyContent: 'flex-end' },
  cardImgBottom: { gap: 6 },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full,
  },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTextLight: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  metaDividerLight: { width: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.2)' },
  arrowBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  daysBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: borderRadius.full,
  },
  daysBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },

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
  bigCard: { height: 280, borderRadius: borderRadius.xl, overflow: 'hidden', marginBottom: spacing.md },
  bigCardBg: { flex: 1 },
  bigCardImg: { borderRadius: borderRadius.xl },
  bigCardGrad: { flex: 1, borderRadius: borderRadius.xl, padding: spacing.md, justifyContent: 'space-between' },
  bigCardContent: { flex: 1, justifyContent: 'space-between' },
  bigCardTop: { flexDirection: 'row' },
  bigCardBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: borderRadius.full,
  },
  bigCardBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  bigCardBottom: { gap: spacing.sm },
  bigCardEyebrow: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.55)', letterSpacing: 2 },
  bigCardTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  bigCardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 19 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  levelPill: {
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: borderRadius.full, borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  levelPillText: { fontSize: 11, fontWeight: '700' },
  bigCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderRadius: borderRadius.full, paddingVertical: 11, paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start', marginTop: spacing.xs,
  },
  bigCardBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
