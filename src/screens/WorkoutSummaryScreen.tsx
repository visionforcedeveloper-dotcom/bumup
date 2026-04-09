import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

export const WorkoutSummaryScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { duration, planName } = route.params;
  const { workoutHistory } = useStore();
  const last = workoutHistory[0];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#4A1A35', '#D96B9E']} style={styles.hero}>
          <MaterialIcons name="emoji-events" size={64} color="#fff" />
          <Text style={styles.congrats}>Treino Concluído!</Text>
          <Text style={styles.planName}>{planName}</Text>
        </LinearGradient>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Duração', value: formatTime(duration), color: colors.primary, icon: 'timer' as const },
            { label: 'Calorias', value: String(last?.calories ?? Math.round(duration / 60 * 8)), color: colors.accentOrange, icon: 'local-fire-department' as const },
            { label: 'Séries', value: String(last?.totalSets ?? 0), color: colors.accentPurple, icon: 'repeat' as const },
            { label: 'Repetições', value: String(last?.totalReps ?? 0), color: colors.accentBlue, icon: 'sports-gymnastics' as const },
          ].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <MaterialIcons name={s.icon} size={20} color={s.color} />
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Volume */}
        <View style={styles.volumeCard}>
          <Text style={styles.volumeLabel}>Volume Total</Text>
          <Text style={styles.volumeValue}>
            {((last?.totalWeight ?? 0) / 1000).toFixed(1)} <Text style={styles.volumeUnit}>toneladas</Text>
          </Text>
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <MaterialIcons name="format-quote" size={20} color={colors.primary} />
          <Text style={styles.motivationText}>
            Cada treino é um passo a mais em direção à melhor versão de você.
          </Text>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.homeBtnText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', paddingBottom: 40 },
  hero: {
    width: '100%', paddingTop: spacing.xxl + 16, paddingBottom: spacing.xl,
    alignItems: 'center', gap: spacing.sm,
  },
  congrats: { fontSize: 26, fontWeight: '800', color: '#fff' },
  planName: { fontSize: 15, color: 'rgba(255,255,255,0.75)' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg,
    gap: spacing.sm, width: '100%',
  },
  statBox: {
    width: '47%', backgroundColor: colors.card,
    borderRadius: borderRadius.lg, padding: spacing.lg,
    alignItems: 'center', gap: spacing.xs,
  },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  volumeCard: {
    width: '90%', backgroundColor: colors.card,
    borderRadius: borderRadius.lg, padding: spacing.lg,
    alignItems: 'center', marginTop: spacing.sm,
    borderWidth: 1, borderColor: colors.primary + '40',
  },
  volumeLabel: { fontSize: 13, color: colors.textSecondary },
  volumeValue: { fontSize: 32, fontWeight: '800', color: colors.primary, marginTop: 4 },
  volumeUnit: { fontSize: 16, fontWeight: '400' },
  motivationCard: {
    width: '90%', backgroundColor: colors.primary + '12',
    borderRadius: borderRadius.lg, padding: spacing.lg,
    marginTop: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.primary,
    gap: spacing.sm,
  },
  motivationText: { fontSize: 14, color: colors.text, lineHeight: 22, fontStyle: 'italic' },
  homeBtn: {
    width: '90%', backgroundColor: colors.primary,
    borderRadius: borderRadius.lg, padding: spacing.md,
    alignItems: 'center', marginTop: spacing.lg,
  },
  homeBtnText: { color: colors.background, fontWeight: '800', fontSize: 16 },
});
