import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { Exercise, workoutPlans } from '../data/exercises';
import { PulseButton } from '../components/PulseButton';

const muscleColor: Record<string, string> = {
  Glúteos: '#F472B6', Pernas: '#A78BFA', Core: '#60A5FA',
  Braços: '#FBBF24', Costas: '#34D399', Ombros: '#F87171',
  Cardio: '#00E5A0', 'Corpo Todo': '#C084FC',
};

const difficultyColor: Record<string, string> = {
  Iniciante: colors.success, Intermediário: colors.warning, Avançado: colors.error,
};

export const ExerciseDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { exercise }: { exercise: Exercise } = route.params;
  const [activeTab, setActiveTab] = useState<'instrucoes' | 'dicas'>('instrucoes');
  const mColor = muscleColor[exercise.muscleGroup] ?? colors.primary;

  // Encontra o plano que contém esse exercício
  const relatedPlan = workoutPlans.find((p) => p.exerciseIds.includes(exercise.id)) ?? workoutPlans[0];

  return (
    <View style={styles.container}>
      {/* Hero com GIF */}
      <View style={styles.hero}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        {exercise.gifUrl
          ? <Image source={exercise.gifUrl} style={styles.heroGif} resizeMode="contain" />
          : <View style={[styles.heroPlaceholder, { backgroundColor: mColor + '18' }]}>
              <MaterialIcons name="fitness-center" size={80} color={mColor + '70'} />
            </View>
        }
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroGradient}>
          <Text style={styles.heroName}>{exercise.name}</Text>
          <View style={styles.heroTags}>
            <View style={[styles.tag, { backgroundColor: mColor }]}>
              <Text style={styles.tagText}>{exercise.muscleGroup}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: difficultyColor[exercise.difficulty] }]}>
              <Text style={styles.tagText}>{exercise.difficulty}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'repeat' as const, value: String(exercise.defaultSets), label: 'Séries' },
            { icon: 'sports-gymnastics' as const, value: exercise.defaultReps, label: 'Reps' },
            { icon: 'timer' as const, value: `${exercise.defaultRest}s`, label: 'Descanso' },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <MaterialIcons name={s.icon} size={18} color={colors.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Equipment */}
        <View style={styles.equipRow}>
          <MaterialIcons name="build" size={14} color={colors.textMuted} />
          <Text style={styles.equipText}>{exercise.equipment}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['instrucoes', 'dicas'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'instrucoes' ? 'Instruções' : 'Dicas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listWrap}>
          {activeTab === 'instrucoes'
            ? exercise.instructions.map((inst, i) => (
              <View key={i} style={styles.listItem}>
                <View style={[styles.stepBadge, { backgroundColor: mColor }]}>
                  <Text style={styles.stepNum}>{i + 1}</Text>
                </View>
                <Text style={styles.listText}>{inst}</Text>
              </View>
            ))
            : exercise.tips.map((tip, i) => (
              <View key={i} style={styles.listItem}>
                <MaterialIcons name="lightbulb" size={18} color={colors.warning} style={{ marginTop: 2 }} />
                <Text style={styles.listText}>{tip}</Text>
              </View>
            ))
          }
        </View>

        {/* Botão iniciar */}
        <View style={styles.startWrap}>
          <PulseButton
            label="Iniciar Exercício"
            color={relatedPlan.color}
            onPress={() => navigation.navigate('ActiveWorkout', { plan: relatedPlan })}
          />
          <Text style={styles.startHint}>
            Parte do plano: <Text style={{ color: colors.primary, fontWeight: '700' }}>{relatedPlan.name}</Text>
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 320, overflow: 'hidden', backgroundColor: '#fff' },
  heroGif: { width: '100%', height: '100%', position: 'absolute' },
  heroPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute', top: spacing.xl + 8, left: spacing.lg, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  heroGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.lg,
  },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroTags: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  tagText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  content: { flex: 1 },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.card,
    marginHorizontal: spacing.lg, borderRadius: borderRadius.lg,
    padding: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textSecondary },
  equipRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  equipText: { fontSize: 13, color: colors.textSecondary },
  tabs: {
    flexDirection: 'row', marginHorizontal: spacing.lg,
    backgroundColor: colors.card, borderRadius: borderRadius.md,
    padding: 3, marginBottom: spacing.md,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: borderRadius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: colors.background },
  listWrap: { paddingHorizontal: spacing.lg },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  stepNum: { fontSize: 13, fontWeight: '800', color: '#fff' },
  listText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 22 },
  startWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  startBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  startGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md + 2,
  },
  startBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  startHint: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
});
