import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

export const RestTimerModal: React.FC = () => {
  const { restTimer, stopRestTimer, tickRestTimer } = useStore();

  useEffect(() => {
    if (!restTimer.isActive) return;
    const interval = setInterval(() => {
      tickRestTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer.isActive]);

  const progress = restTimer.totalSeconds > 0
    ? restTimer.seconds / restTimer.totalSeconds
    : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={restTimer.isActive}
      transparent
      animationType="fade"
      statusBarTranslucent={Platform.OS !== 'web'}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Tempo de Descanso</Text>

          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(restTimer.seconds)}</Text>
            <Text style={styles.timerSub}>restante</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.skipBtn} onPress={stopRestTimer}>
              <Text style={styles.skipText}>Pular Descanso</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  timerSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  buttons: {
    width: '100%',
  },
  skipBtn: {
    backgroundColor: colors.cardLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
