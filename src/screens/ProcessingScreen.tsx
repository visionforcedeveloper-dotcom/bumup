import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const STEPS = [
  'Analisando seu biotipo...',
  'Calculando seu IMC...',
  'Identificando seu formato de glúteos...',
  'Definindo intensidade ideal...',
  'Selecionando exercícios personalizados...',
  'Montando seu plano de treino...',
  'Finalizando seu perfil...',
];

export const ProcessingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { profile } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let step = 0;
    const totalDuration = 4000;
    const stepDuration = totalDuration / STEPS.length;

    // Animar barra de progresso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      step++;
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(onDone, 600);
        return;
      }
      // Fade out/in no texto
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      setCurrentStep(step);
      setProgress(Math.round((step / STEPS.length) * 100));
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0F1E', '#2D1033', '#1A0F1E']}
        style={styles.bg}
      >
        {/* Logo / ícone */}
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={[colors.primary, colors.accentPurple]}
            style={styles.logoCircle}
          >
            <Text style={styles.logoText}>BU</Text>
          </LinearGradient>
          <Text style={styles.appName}>BumUp</Text>
        </View>

        {/* Título */}
        <Text style={styles.title}>Criando seu plano</Text>
        <Text style={styles.subtitle}>
          Personalizando para {profile.name || 'você'}
        </Text>

        {/* Barra de progresso */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressPct}>{progress}%</Text>
        </View>

        {/* Step atual */}
        <Animated.Text style={[styles.stepText, { opacity: fadeAnim }]}>
          {STEPS[currentStep]}
        </Animated.Text>

        {/* Steps concluídos */}
        <View style={styles.stepsWrap}>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[
                styles.stepDot,
                i < currentStep && styles.stepDotDone,
                i === currentStep && styles.stepDotActive,
              ]} />
              <Text style={[
                styles.stepLabel,
                i < currentStep && styles.stepLabelDone,
                i === currentStep && styles.stepLabelActive,
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 22, fontWeight: '800', color: colors.text },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  progressWrap: { width: '100%', marginBottom: spacing.md },
  progressBg: {
    height: 8, backgroundColor: colors.border,
    borderRadius: 4, overflow: 'hidden', marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%', borderRadius: 4,
    backgroundColor: colors.primary,
  },
  progressPct: { fontSize: 13, color: colors.primary, fontWeight: '700', textAlign: 'right' },
  stepText: {
    fontSize: 15, color: colors.primary, fontWeight: '600',
    textAlign: 'center', marginBottom: spacing.xl,
  },
  stepsWrap: { width: '100%', gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  stepDotDone: { backgroundColor: colors.success },
  stepDotActive: { backgroundColor: colors.primary, width: 10, height: 10, borderRadius: 5 },
  stepLabel: { fontSize: 13, color: colors.textMuted },
  stepLabelDone: { color: colors.success },
  stepLabelActive: { color: colors.primary, fontWeight: '600' },
});
