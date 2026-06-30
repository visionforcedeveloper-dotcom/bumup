import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Animated, Dimensions, ScrollView, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const { width: W } = Dimensions.get('window');

const BIOTIPO_IMAGES: Record<string, any> = {
  Ectomorfo: require('../../Assets/quiz/ectomorfo.png'),
  Mesomorfo: require('../../Assets/quiz/Mesomorfo.png'),
  Endomorfo: require('../../Assets/quiz/Endomorfo.png'),
};

const BIOTIPO_DESC: Record<string, string> = {
  Ectomorfo: 'Corpo magro, dificuldade em ganhar massa muscular e gordura.',
  Mesomorfo: 'Corpo atlético, ganha músculo com facilidade e perde gordura bem.',
  Endomorfo: 'Corpo mais cheio, facilidade em ganhar massa mas também gordura.',
};

const GLUTE_SHAPES = [
  { value: 'Quadrado',   label: 'Quadrado',   image: require('../../Assets/quiz/b-quadrado.png') },
  { value: 'Redondo',    label: 'Redondo',    image: require('../../Assets/quiz/b-redondo.png') },
  { value: 'Triângulo',  label: 'Triângulo',  image: require('../../Assets/quiz/b-triangulo.png') },
  { value: 'Coração',    label: 'Coração',    image: require('../../Assets/quiz/b-coraçao.png') },
];

type StepType = 'welcome' | 'choice' | 'input' | 'done' | 'genetics_cards' | 'glute_shape';

interface Step {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  field?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputKeyboard?: 'default' | 'numeric' | 'decimal-pad';
  choices?: { label: string; value: string; icon?: keyof typeof MaterialIcons.glyphMap }[];
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Bem-vinda ao\nBumUp',
    subtitle: 'Vamos criar seu plano personalizado de glúteos em menos de 2 minutos.',
    icon: 'favorite',
  },
  {
    id: 'name',
    type: 'input',
    title: 'Qual é o seu nome?',
    subtitle: 'Como podemos te chamar?',
    icon: 'person',
    field: 'name',
    inputLabel: 'Seu nome',
    inputPlaceholder: 'Ex: Ana',
    inputKeyboard: 'default',
  },
  {
    id: 'age',
    type: 'input',
    title: 'Quantos anos você tem?',
    subtitle: 'A idade influencia no ritmo de recuperação e progressão.',
    icon: 'cake',
    field: 'age',
    inputLabel: 'Idade',
    inputPlaceholder: 'Ex: 25',
    inputKeyboard: 'numeric',
  },
  {
    id: 'weight',
    type: 'input',
    title: 'Qual é o seu peso?',
    subtitle: 'Usamos para calcular calorias e intensidade do treino.',
    icon: 'monitor-weight',
    field: 'weight',
    inputLabel: 'Peso (kg)',
    inputPlaceholder: 'Ex: 62',
    inputKeyboard: 'decimal-pad',
  },
  {
    id: 'height',
    type: 'input',
    title: 'Qual é a sua altura?',
    subtitle: 'Importante para calcular seu IMC e ajustar os exercícios.',
    icon: 'height',
    field: 'height',
    inputLabel: 'Altura (cm)',
    inputPlaceholder: 'Ex: 165',
    inputKeyboard: 'numeric',
  },
  {
    id: 'gluteCirc',
    type: 'glute_shape',
    title: 'Qual é o formato do seu bumbum?',
    subtitle: 'Isso nos ajuda a personalizar os exercícios para o seu formato.',
    icon: 'straighten',
    field: 'gluteShape',
  },
  {
    id: 'level',
    type: 'choice',
    title: 'Qual é seu nível de experiência?',
    subtitle: 'Seja honesta — isso define a intensidade do seu plano.',
    icon: 'bolt',
    field: 'level',
    choices: [
      { label: 'Iniciante', value: 'Iniciante', icon: 'star-border' },
      { label: 'Intermediário', value: 'Intermediário', icon: 'star-half' },
      { label: 'Avançado', value: 'Avançado', icon: 'star' },
    ],
  },
  {
    id: 'goal',
    type: 'choice',
    title: 'Qual é o seu objetivo principal?',
    subtitle: 'Vamos focar no que mais importa para você.',
    icon: 'track-changes',
    field: 'goal',
    choices: [
      { label: 'Definir o bumbum', value: 'Definição', icon: 'auto-awesome' },
      { label: 'Aumentar o volume', value: 'Bumbum', icon: 'trending-up' },
      { label: 'Perder gordura', value: 'Perda de Peso', icon: 'local-fire-department' },
      { label: 'Ganhar força', value: 'Força', icon: 'fitness-center' },
    ],
  },
  {
    id: 'genetics',
    type: 'genetics_cards',
    title: 'Qual é o seu biotipo?',
    subtitle: 'Isso nos ajuda a entender como seu corpo responde ao treino.',
    icon: 'accessibility-new',
    field: 'genetics',
    choices: [
      { label: 'Ectomorfo', value: 'Ectomorfo', icon: 'remove' },
      { label: 'Mesomorfo', value: 'Mesomorfo', icon: 'check' },
      { label: 'Endomorfo', value: 'Endomorfo', icon: 'add' },
    ],
  },
  {
    id: 'frequency',
    type: 'choice',
    title: 'Quantos dias por semana você pode treinar?',
    subtitle: 'Seja realista — consistência é mais importante que frequência.',
    icon: 'calendar-today',
    field: 'frequency',
    choices: [
      { label: '2 dias', value: '2', icon: 'looks-two' },
      { label: '3 dias', value: '3', icon: 'looks-3' },
      { label: '4 dias', value: '4', icon: 'looks-4' },
      { label: '5+ dias', value: '5', icon: 'looks-5' },
    ],
  },
  {
    id: 'done',
    type: 'done',
    title: 'Plano criado!',
    subtitle: 'Seu perfil foi configurado. Vamos começar a transformação do seu bumbum!',
    icon: 'emoji-events',
  },
];

export const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { updateProfile } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputVal, setInputVal] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const current = STEPS[step];
  const progress = step / (STEPS.length - 1);

  const animateNext = (cb: () => void) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start(cb);
  };

  const next = (value?: string) => {
    const newAnswers = { ...answers };
    if (current.field && value !== undefined) {
      newAnswers[current.field] = value;
      setAnswers(newAnswers);
    }
    if (current.type === 'input' && current.field) {
      newAnswers[current.field] = inputVal;
      setAnswers(newAnswers);
      setInputVal('');
    }

    if (step === STEPS.length - 1) {
      // Salvar no store
      updateProfile({
        name: newAnswers.name || 'Usuária',
        age: parseInt(newAnswers.age) || 25,
        weight: parseFloat(newAnswers.weight) || 60,
        height: parseFloat(newAnswers.height) || 165,
        gluteCirc: parseFloat(newAnswers.gluteCirc) || undefined,
        level: newAnswers.level || 'Iniciante',
        goal: newAnswers.goal || 'Bumbum',
        genetics: (newAnswers.genetics as any) || 'Mesomorfo',
      });
      onComplete();
      return;
    }

    animateNext(() => setStep((s) => s + 1));
  };

  const canAdvance = () => {
    if (current.type === 'welcome' || current.type === 'done') return true;
    if (current.type === 'input') return inputVal.trim().length > 0;
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Step counter */}
      {current.type !== 'welcome' && current.type !== 'done' && (
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.stepCounter}>{step}/{STEPS.length - 2}</Text>
        </View>
      )}

      <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>

        {/* Ícone */}
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + '20' }]}>
          <MaterialIcons name={current.icon ?? 'star'} size={36} color={colors.primary} />
        </View>

        <Text style={styles.title}>{current.title}</Text>
        {current.subtitle && <Text style={styles.subtitle}>{current.subtitle}</Text>}

        {/* Input */}
        {current.type === 'input' && (
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>{current.inputLabel}</Text>
            <TextInput
              style={styles.input}
              value={inputVal}
              onChangeText={setInputVal}
              placeholder={current.inputPlaceholder}
              placeholderTextColor={colors.textMuted}
              keyboardType={current.inputKeyboard ?? 'default'}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => canAdvance() && next()}
            />
          </View>
        )}

        {/* Choices */}
        {current.type === 'choice' && (
          <View style={styles.choicesWrap}>
            {current.choices?.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={styles.choiceBtn}
                onPress={() => next(c.value)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#2A1F30', '#1C1720']}
                  style={styles.choiceGradient}
                >
                  {c.icon && <MaterialIcons name={c.icon} size={22} color={colors.primary} />}
                  <Text style={styles.choiceLabel}>{c.label}</Text>
                  <MaterialIcons name="chevron-right" size={18} color={colors.textMuted} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Genetics image cards */}
        {current.type === 'genetics_cards' && (
          <View style={styles.geneticsRow}>
            {(['Ectomorfo', 'Mesomorfo', 'Endomorfo'] as const).map((bio) => (
              <TouchableOpacity
                key={bio}
                style={styles.geneticsCard}
                onPress={() => next(bio)}
                activeOpacity={0.85}
              >
                <Image
                  source={BIOTIPO_IMAGES[bio]}
                  style={styles.geneticsImg}
                  resizeMode="cover"
                />
                <View style={styles.geneticsTextBox}>
                  <Text style={styles.geneticsName}>{bio}</Text>
                  <Text style={styles.geneticsDesc}>{BIOTIPO_DESC[bio]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Glute shape cards */}
        {current.type === 'glute_shape' && (
          <View style={styles.gluteGrid}>
            {GLUTE_SHAPES.map((shape) => (
              <TouchableOpacity
                key={shape.value}
                style={styles.gluteCard}
                onPress={() => next(shape.value)}
                activeOpacity={0.85}
              >
                <Image
                  source={shape.image}
                  style={styles.gluteImg}
                  resizeMode="contain"
                />
                <View style={styles.gluteTextBox}>
                  <Text style={styles.gluteName}>{shape.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {(current.type === 'welcome' || current.type === 'done') && (
          <View style={styles.ctaWrap}>
            {/* Imagem de boas-vindas — só no step welcome */}
            {current.type === 'welcome' && (
              <Image
                source={require('../../Assets/img-gluteos/01.png')}
                style={styles.welcomeImg}
                resizeMode="contain"
              />
            )}
            {current.type === 'done' && (              <View style={styles.summaryCard}>
                {[
                  { label: 'Nome', value: answers.name },
                  { label: 'Idade', value: `${answers.age} anos` },
                  { label: 'Peso', value: `${answers.weight} kg` },
                  { label: 'Altura', value: `${answers.height} cm` },
                  { label: 'Objetivo', value: answers.goal },
                  { label: 'Nível', value: answers.level },
                ].filter(i => i.value).map((item) => (
                  <View key={item.label} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                    <Text style={styles.summaryValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.ctaBtn} onPress={() => next()} activeOpacity={0.88}>
              <LinearGradient
                colors={['#4A1A35', colors.primary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>
                  {current.type === 'welcome' ? 'Começar' : 'Entrar no App'}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Botão avançar para input */}
        {current.type === 'input' && (
          <TouchableOpacity
            style={[styles.nextBtn, !canAdvance() && styles.nextBtnDisabled]}
            onPress={() => canAdvance() && next()}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={canAdvance() ? ['#4A1A35', colors.primary] : [colors.card, colors.card]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.nextGradient}
            >
              <Text style={[styles.nextText, !canAdvance() && styles.nextTextDisabled]}>
                Continuar
              </Text>
              <MaterialIcons
                name="arrow-forward" size={18}
                color={canAdvance() ? '#fff' : colors.textMuted}
              />
            </LinearGradient>
          </TouchableOpacity>
        )}

      </Animated.View>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressBar: {
    height: 3, backgroundColor: colors.border,
    marginTop: spacing.xl + 16,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  stepCounter: {
    fontSize: 12, color: colors.textMuted, fontWeight: '600',
  },
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  content: {
    flex: 1, paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl, paddingBottom: spacing.lg,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28, fontWeight: '800', color: colors.text,
    lineHeight: 36, marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15, color: colors.textSecondary,
    lineHeight: 22, marginBottom: spacing.xl,
  },
  inputWrap: { marginBottom: spacing.lg },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: '600' },
  input: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, fontSize: 22, fontWeight: '700',
    color: colors.text, borderWidth: 1.5, borderColor: colors.border,
  },
  nextBtn: { marginTop: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.5 },
  nextGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md + 2,
  },
  nextText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  nextTextDisabled: { color: colors.textMuted },
  choicesWrap: { gap: spacing.sm },
  choiceBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  choiceGradient: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg,
  },
  choiceLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  ctaWrap: { gap: spacing.lg },
  welcomeImg: {
    width: '100%',
    height: 260,
    borderRadius: borderRadius.lg,
  },
  ctaBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md + 4,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  summaryCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, gap: spacing.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  skipBtn: { paddingBottom: spacing.xl, alignItems: 'center' },
  skipText: { fontSize: 13, color: colors.textMuted, textDecorationLine: 'underline' },

  // Genetics cards
  geneticsRow: { flexDirection: 'row', gap: spacing.sm },
  geneticsCard: {
    flex: 1, borderRadius: borderRadius.lg,
    overflow: 'hidden', borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.card,
  },
  geneticsImg: { width: '100%', height: 180 },
  geneticsTextBox: {
    padding: spacing.sm,
    backgroundColor: colors.card,
  },
  geneticsName: { fontSize: 13, fontWeight: '800', color: colors.text },
  geneticsDesc: { fontSize: 9, color: colors.textSecondary, lineHeight: 13, marginTop: 2 },

  // Glute shape grid
  gluteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gluteCard: {
    width: '47%', borderRadius: borderRadius.lg,
    overflow: 'hidden', borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: '#0D0B0E',
  },
  gluteImg: { width: '100%', height: 130, backgroundColor: '#0D0B0E' },
  gluteTextBox: {
    padding: spacing.sm, alignItems: 'center',
    backgroundColor: colors.card,
  },
  gluteName: { fontSize: 14, fontWeight: '800', color: colors.text },
});
