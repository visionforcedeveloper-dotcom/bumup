import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';

const { width: W } = Dimensions.get('window');

const TESTIMONIALS = [
  {
    name: 'Ana Carolina',
    age: 27,
    result: '+4cm de glúteo em 6 semanas',
    text: 'Nunca achei que conseguiria ver resultados tão rápido. O plano personalizado fez toda a diferença — cada treino parece feito exatamente para o meu corpo.',
    stars: 5,
    image: require('../../Assets/depol/1.png'),
    planColor: '#D96B9E',
    plan: 'Glúteo Máximo',
  },
  {
    name: 'Juliana Melo',
    age: 31,
    result: '-3kg e glúteo definido',
    text: 'Tentei vários apps antes mas nenhum era focado no que eu queria. O BumUp entendeu meu objetivo e me deu um treino real, não genérico.',
    stars: 5,
    image: require('../../Assets/depol/2.png'),
    planColor: '#F4845F',
    plan: 'Desafio 60 Dias',
  },
  {
    name: 'Mariana Santos',
    age: 24,
    result: 'Bumbum mais redondo e elevado',
    text: 'Os exercícios são claros, os GIFs ajudam muito a entender a execução. Em 8 semanas minha calça ficou apertada nos lugares certos!',
    stars: 5,
    image: require('../../Assets/depol/3.png'),
    planColor: '#B57BEA',
    plan: 'Desafio 90 Dias',
  },
  {
    name: 'Camila Rocha',
    age: 29,
    result: '+6cm em 3 meses',
    text: 'Comecei como iniciante sem saber nada. O quiz identificou meu nível e o app foi aumentando a intensidade no ritmo certo para mim.',
    stars: 5,
    image: require('../../Assets/depol/4.png'),
    planColor: '#D96B9E',
    plan: 'Bumbum do Zero',
  },
];

export const TestimonialsScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (idx: number) => {
    setCurrent(idx);
    scrollRef.current?.scrollTo({ x: idx * W, animated: true });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A0F1E', colors.background]} style={styles.header}>
        <Text style={styles.headerLabel}>RESULTADOS REAIS</Text>
        <Text style={styles.title}>Elas transformaram{'\n'}o bumbum com o BumUp</Text>
        <Text style={styles.subtitle}>Mais de 1.200 mulheres já usam o app</Text>
      </LinearGradient>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / W);
          setCurrent(idx);
        }}
        style={styles.carousel}
      >
        {TESTIMONIALS.map((t, i) => (
          <View key={i} style={styles.card}>
            {/* Foto do depoimento */}
            <Image source={t.image} style={styles.photo} resizeMode="cover" />

            {/* Nome + plano */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardName}>{t.name}, {t.age} anos</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <MaterialIcons key={si} name="star" size={13} color="#FFD700" />
                  ))}
                </View>
              </View>
              <View style={[styles.planBadge, { backgroundColor: t.planColor + '25' }]}>
                <Text style={[styles.planBadgeText, { color: t.planColor }]}>{t.plan}</Text>
              </View>
            </View>

            {/* Resultado */}
            <View style={styles.resultBadge}>
              <MaterialIcons name="trending-up" size={14} color={colors.primary} />
              <Text style={styles.resultText}>{t.result}</Text>
            </View>

            {/* Depoimento */}
            <View style={styles.quoteWrap}>
              <MaterialIcons name="format-quote" size={22} color={colors.primary + '60'} />
              <Text style={styles.quoteText}>{t.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {TESTIMONIALS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View style={[styles.dot, i === current && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: '1.200+', label: 'Usuárias ativas' },
          { value: '4.8★', label: 'Avaliação média' },
          { value: '89%', label: 'Resultado em 4 sem.' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity onPress={onContinue} activeOpacity={0.88}>
          <LinearGradient
            colors={['#4A1A35', colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>Quero meu plano agora</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md },
  headerLabel: { fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 2, marginBottom: spacing.xs },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, lineHeight: 32 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
  carousel: { flexGrow: 0 },
  card: { width: W, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  photo: { width: '100%', height: 220, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.xs,
  },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  planBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  planBadgeText: { fontSize: 10, fontWeight: '700' },
  resultBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary + '18', borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: spacing.sm,
  },
  resultText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  quoteWrap: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md },
  quoteText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, fontStyle: 'italic', marginTop: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  ctaWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderRadius: borderRadius.lg, paddingVertical: spacing.md + 2,
  },
  ctaText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
