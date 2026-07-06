import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme';
import { Exercise } from '../data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  compact?: boolean;
}

const difficultyColor: Record<string, string> = {
  Iniciante: colors.success,
  Intermediário: colors.warning,
  Avançado: colors.error,
};

const muscleColor: Record<string, string> = {
  Glúteos: '#D96B9E',
  Pernas: '#B57BEA',
  Cardio: '#89A8E0',
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress, compact }) => {
  const mColor = muscleColor[exercise.muscleGroup] ?? colors.primary;
  const hasGif = !!exercise.gifUrl;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.compactThumb}>
          {hasGif
            ? <Image source={exercise.gifUrl} style={styles.compactGif} resizeMode="cover" />
            : <MaterialIcons name="fitness-center" size={22} color={mColor} />
          }
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{exercise.name}</Text>
          <Text style={styles.compactMeta}>
            {exercise.defaultSets} séries · {exercise.defaultReps} reps
          </Text>
        </View>
        <View style={[styles.diffBadge, { backgroundColor: difficultyColor[exercise.difficulty] + '22' }]}>
          <Text style={[styles.diffText, { color: difficultyColor[exercise.difficulty] }]}>
            {exercise.difficulty}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        {hasGif
          ? <Image source={exercise.gifUrl} style={styles.gif} resizeMode="contain" />
          : (
            <View style={[styles.gifPlaceholder, { backgroundColor: mColor + '15' }]}>
              <MaterialIcons name="fitness-center" size={48} color={mColor + '80'} />
            </View>
          )
        }
        <View style={[styles.diffBadgeAbsolute, { backgroundColor: difficultyColor[exercise.difficulty] }]}>
          <Text style={styles.diffTextWhite}>{exercise.difficulty}</Text>
        </View>
        <View style={[styles.muscleBadge, { backgroundColor: mColor + 'CC' }]}>
          <Text style={styles.muscleBadgeText}>{exercise.muscleGroup}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <MaterialIcons name="repeat" size={11} color={colors.textMuted} />
            <Text style={styles.meta}>{exercise.defaultSets} séries</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialIcons name="repeat" size={11} color={colors.textMuted} />
            <Text style={styles.meta}>{exercise.defaultReps} reps</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialIcons name="timer" size={11} color={colors.textMuted} />
            <Text style={styles.meta}>{exercise.defaultRest}s</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={onPress} activeOpacity={0.85}>
          <MaterialIcons name="play-arrow" size={18} color="#fff" />
          <Text style={styles.startBtnText}>Iniciar exercício</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  gif: { width: '100%', height: '100%' },
  gifPlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  diffBadgeAbsolute: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  muscleBadge: {
    position: 'absolute', bottom: spacing.sm, left: spacing.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  muscleBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  diffBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  diffText: { fontSize: 10, fontWeight: '600' },
  diffTextWhite: { fontSize: 10, fontWeight: '700', color: '#fff' },
  info: { padding: spacing.md },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.sm },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.cardLight,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  meta: { fontSize: 11, color: colors.textSecondary },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
  },
  startBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  // Compact
  compactContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm, marginBottom: spacing.sm,
  },
  compactThumb: {
    width: 56, height: 56, borderRadius: borderRadius.md,
    overflow: 'hidden', backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  compactGif: { width: '100%', height: '100%' },
  compactInfo: { flex: 1, marginLeft: spacing.sm },
  compactName: { fontSize: 14, fontWeight: '600', color: colors.text },
  compactMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
});
