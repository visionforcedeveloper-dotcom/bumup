import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

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
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A0F1E', colors.background]} style={styles.header}>
        <Text style={styles.headerLabel}>RESULTADOS REAIS</Text>
        <Text style={styles.title}>Elas transformaram{'\n'}o bumbum com o BumUp</Text>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MaterialIcons key={i} name="star" size={16} color="#FFD700" />
            ))}
          </View>
          <Text style={styles.ratingText}>4.8 • Mais de 1.200 usuárias</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <View key={i} style={styles.card}>
              {/* Imagem compacta */}
              <Image source={t.image} style={styles.cardImage} resizeMode="cover" />
              
              {/* Badge de resultado sobreposto */}
              <View style={[styles.resultBadge, { backgroundColor: t.planColor }]}>
                <Text style={styles.resultText}>{t.result}</Text>
              </View>

              {/* Informações */}
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{t.name}, {t.age}</Text>
                
                <View style={styles.cardStars}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <MaterialIcons key={si} name="star" size={11} color="#FFD700" />
                  ))}
                </View>

                <Text style={styles.cardQuote} numberOfLines={3}>
                  "{t.text}"
                </Text>

                <View style={[styles.planTag, { backgroundColor: t.planColor + '20' }]}>
                  <Text style={[styles.planTagText, { color: t.planColor }]}>{t.plan}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Por que escolher o BumUp?</Text>
          <View style={styles.statsGrid}>
            {[
              { icon: 'group', value: '1.200+', label: 'Usuárias ativas' },
              { icon: 'star', value: '4.8', label: 'Avaliação média' },
              { icon: 'trending-up', value: '89%', label: 'Veem resultados' },
              { icon: 'fitness-center', value: '3-5x', label: 'Treinos/semana' },
            ].map((s, i) => (
              <View key={i} style={styles.statCard}>
                <MaterialIcons name={s.icon as any} size={28} color={colors.primary} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA fixo */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity onPress={onContinue} activeOpacity={0.88}>
          <LinearGradient
            colors={['#4A1A35', colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>Quero meu plano personalizado</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  
  header: { 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.xl + 8, 
    paddingBottom: spacing.lg 
  },
  
  headerLabel: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: colors.primary, 
    letterSpacing: 2, 
    marginBottom: spacing.xs 
  },
  
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: colors.text, 
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  
  ratingText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  scrollView: { 
    flex: 1 
  },
  
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  
  card: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  
  resultBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  
  resultText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
  },
  
  cardContent: {
    padding: spacing.md,
  },
  
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  
  cardStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: spacing.sm,
  },
  
  cardQuote: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  
  planTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  
  planTagText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  statsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  
  statsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  statCard: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  
  ctaWrap: { 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  ctaBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: spacing.sm, 
    borderRadius: borderRadius.lg, 
    paddingVertical: spacing.md + 2,
  },
  
  ctaText: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#fff' 
  },
});
