import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { exercises, workoutPlans, Exercise } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { PulseButton } from '../components/PulseButton';

const PLAN_IMAGES: Record<string, string> = {
  plan001: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  plan002: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  plan003: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  plan004: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80',
};

type SelectedPlan = typeof workoutPlans[0] | null;

export const WorkoutsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>(null);

  const planExercises: Exercise[] = selectedPlan
    ? selectedPlan.exercises
        .map((id) => exercises.find((e) => e.id === id))
        .filter(Boolean) as Exercise[]
    : [];

  // ── Tela de exercícios do plano ──────────────────────────────────────────
  if (selectedPlan) {
    return (
      <View style={styles.container}>
        {/* Header do plano */}
        <View style={styles.planDetailHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedPlan(null)}>
            <MaterialIcons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.planDetailTitle}>
            <Text style={styles.planDetailName}>{selectedPlan.name}</Text>
            <Text style={styles.planDetailMeta}>
              {selectedPlan.exercises.length} exercícios · {selectedPlan.daysPerWeek}x/sem · {selectedPlan.duration}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.startBtnHeader, { backgroundColor: selectedPlan.color }]}
            onPress={() => navigation.navigate('ActiveWorkout', { plan: selectedPlan })}
          >
            <MaterialIcons name="play-arrow" size={18} color="#fff" />
            <Text style={styles.startBtnHeaderText}>Iniciar</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <View style={styles.planDescCard}>
          <Text style={styles.planDescText}>{selectedPlan.description}</Text>
          <View style={styles.planDescMeta}>
            <View style={[styles.levelBadge, { backgroundColor: selectedPlan.color }]}>
              <Text style={styles.levelText}>{selectedPlan.level}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="schedule" size={12} color={colors.textSecondary} />
              <Text style={styles.metaChipText}>{selectedPlan.duration}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="fitness-center" size={12} color={colors.textSecondary} />
              <Text style={styles.metaChipText}>{selectedPlan.exercises.length} exercícios</Text>
            </View>
          </View>
        </View>

        {/* Lista de exercícios */}
        <Text style={styles.exercisesLabel}>Exercícios do Plano</Text>
        <FlatList
          data={planExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.exerciseList}
          renderItem={({ item, index }) => (
            <View style={styles.exerciseRow}>
              <View style={[styles.exerciseIndex, { backgroundColor: selectedPlan.color + '30' }]}>
                <Text style={[styles.exerciseIndexText, { color: selectedPlan.color }]}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <ExerciseCard
                  exercise={item}
                  onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
                  compact
                />
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.footerBtn}>
              <PulseButton
                label="Iniciar Treino"
                color={selectedPlan.color}
                onPress={() => navigation.navigate('ActiveWorkout', { plan: selectedPlan })}
              />
            </View>
          }
        />
      </View>
    );
  }

  // ── Lista de planos ──────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treinos</Text>
        <Text style={styles.subtitle}>Escolha seu plano de glúteos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {workoutPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => setSelectedPlan(plan)}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: PLAN_IMAGES[plan.id] }}
              style={styles.planBg}
              imageStyle={{ borderRadius: borderRadius.lg }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.88)']}
                style={styles.planGradient}
              >
                <View style={styles.planTop}>
                  <View style={[styles.levelBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.levelText}>{plan.level}</Text>
                  </View>
                  <View style={styles.daysChip}>
                    <MaterialIcons name="calendar-today" size={11} color={colors.textSecondary} />
                    <Text style={styles.daysText}>{plan.daysPerWeek}x/sem</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.planCategory}>{plan.category.toUpperCase()}</Text>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDesc} numberOfLines={2}>{plan.description}</Text>
                  <View style={styles.planFooter}>
                    <View style={styles.planStat}>
                      <MaterialIcons name="schedule" size={13} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.planStatText}>{plan.duration}</Text>
                    </View>
                    <View style={styles.planStat}>
                      <MaterialIcons name="fitness-center" size={13} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.planStatText}>{plan.exercises.length} exercícios</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.startBtn, { backgroundColor: plan.color }]}
                      onPress={() => navigation.navigate('ActiveWorkout', { plan })}
                    >
                      <MaterialIcons name="play-arrow" size={16} color="#fff" />
                      <Text style={styles.startBtnText}>Iniciar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Lista de planos
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  content: { paddingHorizontal: spacing.lg },
  planCard: { height: 220, borderRadius: borderRadius.lg, marginBottom: spacing.md, overflow: 'hidden' },
  planBg: { flex: 1 },
  planGradient: { flex: 1, padding: spacing.md, justifyContent: 'space-between', borderRadius: borderRadius.lg },
  planTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  levelText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  daysChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full,
  },
  daysText: { fontSize: 11, color: colors.textSecondary },
  planCategory: { fontSize: 10, color: colors.primary, fontWeight: '800', letterSpacing: 1.5, marginBottom: 2 },
  planName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  planDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, lineHeight: 17 },
  planFooter: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.md },
  planStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planStatText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  startBtn: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Detalhe do plano
  planDetailHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  planDetailTitle: { flex: 1 },
  planDetailName: { fontSize: 18, fontWeight: '800', color: colors.text },
  planDetailMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  startBtnHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  startBtnHeaderText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  planDescCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  planDescText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  planDescMeta: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.cardLight, paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: borderRadius.full,
  },
  metaChipText: { fontSize: 11, color: colors.textSecondary },
  exercisesLabel: {
    fontSize: 16, fontWeight: '700', color: colors.text,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  exerciseList: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  exerciseIndex: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseIndexText: { fontSize: 13, fontWeight: '800' },
  footerBtn: { paddingTop: spacing.md, paddingBottom: 80 },
});
