import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { revenueCatService } from '../services/revenueCat';

// Tipo local — evita dependência do react-native-purchases no Expo Go
type PurchasesPackage = {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    title: string;
    price: number;
    priceString: string;
  };
};

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
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);

      // Em dev (Expo Go), usar planos mockados para visualização
      if (__DEV__) {
        const mockPackages: any[] = [
          {
            identifier: 'bumbup_anual',
            packageType: 'ANNUAL',
            product: {
              identifier: 'bumbup_anual',
              title: 'Plano Anual',
              price: 47.00,
              priceString: 'R$ 47,00',
            },
          },
          {
            identifier: 'bumup_mensal',
            packageType: 'MONTHLY',
            product: {
              identifier: 'bumup_mensal',
              title: 'Plano Mensal',
              price: 27.00,
              priceString: 'R$ 27,00',
            },
          },
        ];
        setPackages(mockPackages);
        setSelected('bumbup_anual');
        setLoading(false);
        return;
      }

      const offerings = await revenueCatService.getOfferings();
      
      if (offerings?.current?.availablePackages) {
        const pkgs = offerings.current.availablePackages;
        setPackages(pkgs);
        
        // Seleciona o anual por padrão (ou o primeiro disponível)
        const annual = pkgs.find(p => 
          p.identifier.includes('annual') || 
          p.packageType === 'ANNUAL' ||
          p.product.identifier.includes('anual') ||
          p.product.identifier === 'bumbup_anual'
        );
        setSelected(annual?.identifier || pkgs[0]?.identifier || '');
      }
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
      Alert.alert('Erro', 'Não foi possível carregar os planos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    // Em dev, simula compra bem-sucedida
    if (__DEV__) {
      Alert.alert('🎉 Simulação', 'Compra simulada com sucesso! (modo dev)', [
        { text: 'Entrar no app', onPress: onSubscribe },
      ]);
      return;
    }

    const selectedPackage = packages.find(p => p.identifier === selected);
    if (!selectedPackage) {
      Alert.alert('Erro', 'Selecione um plano');
      return;
    }

    try {
      setPurchasing(true);
      const result = await revenueCatService.purchasePackage(selectedPackage);
      
      if (result.success) {
        Alert.alert(
          '🎉 Bem-vinda ao Premium!',
          'Agora você tem acesso completo a todos os recursos.',
          [{ text: 'Começar', onPress: onSubscribe }]
        );
      }
    } catch (error: any) {
      if (!error?.userCancelled) {
        Alert.alert(
          'Erro na compra',
          error?.message || 'Não foi possível concluir a compra. Tente novamente.'
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const customerInfo = await revenueCatService.restorePurchases();
      
      // Verifica se tem algum entitlement ativo
      const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
      
      if (hasActive) {
        Alert.alert(
          '✅ Compras restauradas',
          'Seus acessos foram restaurados com sucesso!',
          [{ text: 'OK', onPress: onSubscribe }]
        );
      } else {
        Alert.alert(
          'Nenhuma compra encontrada',
          'Não encontramos compras anteriores nesta conta.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar as compras.');
    } finally {
      setPurchasing(false);
    }
  };

  const isAnual = (pkg: PurchasesPackage) =>
    pkg.packageType === 'ANNUAL' ||
    pkg.product.identifier.includes('anual') ||
    pkg.product.identifier === 'bumbup_anual';

  const formatPrice = (pkg: PurchasesPackage) => {
    const price = pkg.product.priceString;
    const period = isAnual(pkg) ? '/ano' : '/mês';
    return `${price}${period}`;
  };

  const formatPeriod = (pkg: PurchasesPackage) => {
    if (isAnual(pkg)) {
      const monthly = parseFloat(pkg.product.price) / 12;
      return `equivale a R$ ${monthly.toFixed(2)}/mês`;
    }
    return '';
  };

  const getLabel = (pkg: PurchasesPackage) => {
    if (isAnual(pkg)) return 'Anual';
    if (pkg.packageType === 'MONTHLY' || pkg.product.identifier.includes('mensal')) return 'Mensal';
    return pkg.product.title;
  };

  const getBadge = (pkg: PurchasesPackage) => {
    return isAnual(pkg) ? 'MELHOR OFERTA' : '';
  };

  const getSaving = (pkg: PurchasesPackage) => {
    return isAnual(pkg) ? 'Economize 86%' : '';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando planos...</Text>
      </View>
    );
  }

  if (packages.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Não foi possível carregar os planos</Text>
        <TouchableOpacity onPress={loadOfferings} style={styles.retryBtn}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#2D1033', colors.background]} style={styles.header}>
        <TouchableOpacity onPress={onSkip} style={styles.closeBtn}>
          <MaterialIcons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
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
        {packages.map((pkg) => {
          const isSelected = selected === pkg.identifier;
          const badge = getBadge(pkg);
          
          return (
            <TouchableOpacity
              key={pkg.identifier}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelected(pkg.identifier)}
              activeOpacity={0.85}
            >
              {badge ? (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{badge}</Text>
                </View>
              ) : null}
              <View style={styles.planLeft}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <View>
                  <Text style={styles.planLabel}>{getLabel(pkg)}</Text>
                  {getSaving(pkg) ? (
                    <Text style={styles.planSaving}>{getSaving(pkg)}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.planRight}>
                <Text style={[styles.planPrice, isSelected && { color: colors.primary }]}>
                  {formatPrice(pkg)}
                </Text>
                {formatPeriod(pkg) ? (
                  <Text style={styles.planTotal}>{formatPeriod(pkg)}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity 
          onPress={handlePurchase} 
          activeOpacity={0.88}
          disabled={purchasing || !selected}
        >
          <LinearGradient
            colors={['#4A1A35', colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.ctaBtn, (purchasing || !selected) && styles.ctaBtnDisabled]}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="lock-open" size={20} color="#fff" />
                <Text style={styles.ctaText}>Assinar agora</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.trial}>Cancele quando quiser • Sem compromisso</Text>

        <TouchableOpacity 
          onPress={handleRestore} 
          style={styles.restoreBtn}
          disabled={purchasing}
        >
          <Text style={styles.restoreText}>Restaurar compras</Text>
        </TouchableOpacity>
      </View>

      {/* Garantia */}
      <View style={styles.guarantee}>
        <MaterialIcons name="verified-user" size={20} color={colors.success} />
        <Text style={styles.guaranteeText}>
          Você será cobrada conforme o plano escolhido. Cancele a qualquer momento.
        </Text>
      </View>

      {/* Depoimentos */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.testimonialsTitle}>O que dizem nossas alunas</Text>
        {[
          {
            name: 'Ana Carolina', age: 27,
            result: '+4cm de glúteo em 6 semanas',
            text: 'Nunca achei que conseguiria ver resultados tão rápido. O plano personalizado fez toda a diferença.',
            stars: 5, image: require('../../Assets/depol/1.png'),
          },
          {
            name: 'Juliana Melo', age: 31,
            result: '-3kg e glúteo definido',
            text: 'Tentei vários apps antes mas nenhum era focado no que eu queria. O BumUp entendeu meu objetivo.',
            stars: 5, image: require('../../Assets/depol/2.png'),
          },
          {
            name: 'Mariana Santos', age: 24,
            result: 'Bumbum mais redondo e elevado',
            text: 'Os GIFs ajudam muito a entender a execução. Em 8 semanas minha calça ficou apertada nos lugares certos!',
            stars: 5, image: require('../../Assets/depol/3.png'),
          },
          {
            name: 'Camila Rocha', age: 29,
            result: '+6cm em 3 meses',
            text: 'Comecei como iniciante sem saber nada. O app foi aumentando a intensidade no ritmo certo para mim.',
            stars: 5, image: require('../../Assets/depol/4.png'),
          },
        ].map((t, i) => (
          <View key={i} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image source={t.image} style={styles.testimonialAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.testimonialName}>{t.name}, {t.age}</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <MaterialIcons key={s} name="star" size={12} color="#F4845F" />
                  ))}
                </View>
              </View>
              <View style={styles.resultBadge}>
                <Text style={styles.resultText}>{t.result}</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>"{t.text}"</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  loadingText: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.md },
  errorText: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' },
  retryBtn: { 
    marginTop: spacing.lg, 
    backgroundColor: colors.primary, 
    paddingHorizontal: spacing.xl, 
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.lg },
  closeBtn: {
    position: 'absolute',
    top: spacing.xl + 8,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
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
  ctaBtnDisabled: { opacity: 0.6 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  trial: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  restoreBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  restoreText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
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
  testimonialsSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  testimonialsTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  testimonialCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  testimonialAvatar: { width: 44, height: 44, borderRadius: 22 },
  testimonialName: { fontSize: 13, fontWeight: '700', color: colors.text },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  resultBadge: {
    backgroundColor: colors.primary + '20', borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 4,
  },
  resultText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  testimonialText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, fontStyle: 'italic' },
});
