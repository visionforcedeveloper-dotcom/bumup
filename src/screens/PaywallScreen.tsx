import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';

const PLANS = [
  {
    id: 'annual',
    label: 'Anual',
    price: 'R$ 47,00/ano',
    total: 'equivale a R$ 3,92/mês',
    badge: 'MELHOR OFERTA',
    saving: 'Economize 86%',
    color: colors.primary,
  },
  {
    id: 'monthly',
    label: 'Mensal',
    price: 'R$ 27,00/mês',
    total: '',
    badge: '',
    saving: '',
    color: colors.accentPurple,
  },
];

const FEATURES = [
  { icon: 'block' as const,          text: 'Sem anúncios — foco total no seu treino' },
  { icon: 'flag' as const,           text: 'Desafio 30 dias para criar o hábito' },
  { icon: 'emoji-events' as const,   text: 'Desafio 60 dias para transformação real' },
  { icon: 'military-tech' as const,  text: 'Desafio 90 dias — do zero ao avançado' },
  { icon: 'fitness-center' as const, text: 'Mais de 30 exercícios de glúteos com GIFs' },
  { icon: 'lock-open' as const,      text: 'Acesso ilimitado a todos os planos' },
  { icon: 'trending-up' as const,    text: 'Acompanhamento de progresso detalhado' },
  { icon: 'star' as const,           text: 'Suporte prioritário' },
];

export const PaywallScreen: React.FC<{ onSubscribe: () => void; onSkip: () => void }> = ({
  onSubscribe, onSkip,
}) => {
  const [selected, setSelected] = useState('annual');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#2D1033', colors.background]} style={styles.header}>
        <View style={styles.badge}>
          <MaterialIcons name="workspace-premium" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>BumUp Premium</Text>
        </View>
        <Text style={styles.title}>Seu plano está{'\n'}pronto!</Text>
        <Text style={styles.subtitle}>
          Desbloqueie acesso completo e comece sua transformação hoje
        </Text>
      </LinearGradient>

      {/* Features */}
      <View style={styles.featuresCard}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <MaterialIcons name={f.icon} size={16} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plansWrap}>
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, selected === plan.id && styles.planCardSelected]}
            onPress={() => setSelected(plan.id)}
            activeOpacity={0.85}
          >
            {plan.badge ? (
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{plan.badge}</Text>
              </View>
            ) : null}
            <View style={styles.planLeft}>
              <View style={[styles.radio, selected === plan.id && styles.radioSelected]}>
                {selected === plan.id && <View style={styles.radioDot} />}
              </View>
              <View>
                <Text style={styles.planLabel}>{plan.label}</Text>
                {plan.saving ? <Text style={styles.planSaving}>{plan.saving}</Text> : null}
              </View>
            </View>
            <View style={styles.planRight}>
              <Text style={[styles.planPrice, selected === plan.id && { color: colors.primary }]}>
                {plan.price}
              </Text>
              {plan.total ? <Text style={styles.planTotal}>{plan.total}</Text> : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {/* Banner 3 dias grátis */}
        <View style={styles.trialBanner}>
          <MaterialIcons name="celebration" size={18} color={colors.success} />
          <Text style={styles.trialBannerText}>3 dias completamente grátis</Text>
          <Text style={styles.trialBannerSub}>sem cobrança agora</Text>
        </View>

        <TouchableOpacity onPress={onSubscribe} activeOpacity={0.88}>
          <LinearGradient
            colors={['#4A1A35', colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <MaterialIcons name="lock-open" size={20} color="#fff" />
            <Text style={styles.ctaText}>Começar grátis por 3 dias</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.trial}>Cancele quando quiser • Sem compromisso</Text>

        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Continuar sem premium</Text>
        </TouchableOpacity>
      </View>

      {/* Garantia */}
      <View style={styles.guarantee}>
        <MaterialIcons name="verified-user" size={20} color={colors.success} />
        <Text style={styles.guaranteeText}>
          3 dias grátis para testar. Após o período, você será cobrada conforme o plano escolhido. Cancele a qualquer momento.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.lg },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.primary + '20', alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, marginBottom: spacing.md,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 38 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  featuresCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.md, gap: spacing.sm,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { fontSize: 14, color: colors.text, flex: 1 },
  plansWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  planCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    position: 'relative', overflow: 'hidden',
  },
  planCardSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  planBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderBottomLeftRadius: borderRadius.sm,
  },
  planBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  planLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  planSaving: { fontSize: 11, color: colors.success, fontWeight: '600', marginTop: 2 },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontSize: 15, fontWeight: '800', color: colors.text },
  planTotal: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  ctaWrap: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  trialBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.success + '18',
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.success + '40',
    flexWrap: 'wrap',
  },
  trialBannerText: { fontSize: 16, fontWeight: '800', color: colors.success },
  trialBannerSub: { fontSize: 12, color: colors.success + 'AA', fontWeight: '600' },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderRadius: borderRadius.lg, paddingVertical: spacing.md + 4,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  trial: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontSize: 13, color: colors.textMuted, textDecorationLine: 'underline' },
  guarantee: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    paddingHorizontal: spacing.lg, marginTop: spacing.md,
    backgroundColor: colors.success + '10',
    marginHorizontal: spacing.lg, borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  guaranteeText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
