import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const CATEGORIES = [
  { id: '1', label: 'Em casa', icon: 'home' as const },
  { id: '2', label: 'Iniciante', icon: 'fitness-center' as const },
  { id: '3', label: 'Intermediário', icon: 'local-fire-department' as const },
  { id: '4', label: 'Avançado', icon: 'rocket-launch' as const },
];

const QUICK_WORKOUTS = [
  {
    id: '1',
    name: 'Glúteos 15 min',
    desc: 'Rápido e eficaz',
    duration: '15 min',
    image: require('../../Assets/Exercicios gluteos/Hip Thrust.gif'),
  },
  {
    id: '2',
    name: 'Glúteos + Pernas 20 min',
    desc: 'Mais força e definição',
    duration: '20 min',
    image: require('../../Assets/Exercicios gluteos/Agachamento Livre.gif'),
  },
  {
    id: '3',
    name: 'Bumbum em Foco 10 min',
    desc: 'Ativação e queima',
    duration: '10 min',
    image: require('../../Assets/Exercicios gluteos/Ponte de Glúteos.gif'),
  },
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile } = useStore();
  const isPremium = useStore((s) => s.isPremium);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoWhite}>Bum</Text>
          <Text style={styles.logoPink}>UP</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <MaterialIcons name="emoji-events" size={28} color="#FFB830" />
        </TouchableOpacity>
      </View>

      {/* Saudação */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greetingTitle}>
          Olá, vamos treinar? 💪
        </Text>
        <Text style={styles.greetingSubtitle}>
          Escolha o treino ideal para seu objetivo
        </Text>
      </View>

      {/* Banner destaque */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => navigation.navigate('Workouts')}
        style={styles.bannerWrap}
      >
        <LinearGradient
          colors={['#1a0a12', '#3D0B22', '#7A0A35']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>{'Treino\nGlúteos'}</Text>
            <Text style={styles.bannerTitlePink}>Avançado</Text>
            <Text style={styles.bannerDesc}>Fortaleça e defina{'\n'}seus glúteos</Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => navigation.navigate('Workouts')}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnText}>Começar agora</Text>
              <MaterialIcons name="chevron-right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../Assets/img-gluteos/img-mulher.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Categorias */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Workouts')}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIcon}>
              <MaterialIcons name={cat.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Treinos rápidos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Treinos rápidos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.workoutList}>
        {QUICK_WORKOUTS.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={styles.workoutCard}
            onPress={() => navigation.navigate('Workouts')}
            activeOpacity={0.8}
          >
            <Image source={w.image} style={styles.workoutThumb} resizeMode="cover" />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{w.name}</Text>
              <Text style={styles.workoutDesc}>{w.desc}</Text>
              <View style={styles.workoutMeta}>
                <MaterialIcons name="schedule" size={12} color={colors.textSecondary} />
                <Text style={styles.workoutDuration}>{w.duration}</Text>
              </View>
            </View>
            <View style={styles.workoutArrow}>
              <MaterialIcons name="chevron-right" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.sm,
  },
  logoText: { fontSize: 26, fontWeight: '900' },
  logoWhite: { color: '#fff' },
  logoPink: { color: colors.primary },

  greetingWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  greetingTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  greetingSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  bannerWrap: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  banner: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 200,
  },
  bannerLeft: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: 6 },
  bannerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', lineHeight: 30 },
  bannerTitlePink: { fontSize: 26, fontWeight: '900', color: colors.primary, lineHeight: 32 },
  bannerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20, marginTop: 4 },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
    gap: 4,
  },
  bannerBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bannerImage: { width: 170, height: 210 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 10, color: colors.text, fontWeight: '600', textAlign: 'center' },

  workoutList: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  workoutThumb: { width: 80, height: 72 },
  workoutInfo: { flex: 1, paddingHorizontal: spacing.md },
  workoutName: { fontSize: 14, fontWeight: '700', color: colors.text },
  workoutDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  workoutMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  workoutDuration: { fontSize: 11, color: colors.textSecondary },
  workoutArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});
