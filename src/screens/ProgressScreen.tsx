import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2;

// ── Gráfico de barras simples ────────────────────────────────────────────────
const BarChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  unit?: string;
}> = ({ data, maxValue, height = 100, unit = '' }) => {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, justifyContent: 'space-between' }}>
      {data.map((item, i) => {
        const barH = item.value > 0 ? Math.max((item.value / max) * (height - 24), 4) : 4;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            {item.value > 0 && (
              <Text style={{ fontSize: 9, color: colors.textSecondary, marginBottom: 2 }}>
                {item.value}{unit}
              </Text>
            )}
            <View style={{
              width: '60%', height: barH,
              backgroundColor: item.value > 0 ? (item.color ?? colors.primary) : colors.border,
              borderRadius: 4,
            }} />
            <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

// ── Gráfico de linha simples ─────────────────────────────────────────────────
const LineChart: React.FC<{
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  unit?: string;
}> = ({ data, labels, color = colors.primary, height = 80, unit = '' }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * CHART_WIDTH,
    y: height - ((v - min) / range) * (height - 20) - 10,
    v,
  }));

  return (
    <View style={{ height: height + 20 }}>
      {/* Linha conectando pontos */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}>
        {pts.slice(0, -1).map((pt, i) => {
          const next = pts[i + 1];
          const dx = next.x - pt.x;
          const dy = next.y - pt.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={i} style={{
              position: 'absolute',
              left: pt.x, top: pt.y,
              width: len, height: 2,
              backgroundColor: color + '60',
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: '0 0',
            }} />
          );
        })}
        {/* Pontos */}
        {pts.map((pt, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: pt.x - 5, top: pt.y - 5,
            width: 10, height: 10, borderRadius: 5,
            backgroundColor: i === pts.length - 1 ? color : color + '80',
            borderWidth: 2, borderColor: colors.card,
          }} />
        ))}
      </View>
      {/* Labels */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
        {labels.map((l, i) => (
          <Text key={i} style={{ fontSize: 9, color: colors.textMuted }}>{l}</Text>
        ))}
      </View>
    </View>
  );
};

// ── Anel de progresso ────────────────────────────────────────────────────────
const RingProgress: React.FC<{
  value: number; max: number; color: string; size?: number; label: string; sublabel?: string;
}> = ({ value, max, color, size = 80, label, sublabel }) => {
  const pct = Math.min(value / max, 1);
  return (
    <View style={{ alignItems: 'center', width: size + 20 }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 6, borderColor: colors.border,
        alignItems: 'center', justifyContent: 'center',
        borderTopColor: pct > 0.75 ? color : colors.border,
        borderRightColor: pct > 0.5 ? color : colors.border,
        borderBottomColor: pct > 0.25 ? color : colors.border,
        borderLeftColor: pct > 0 ? color : colors.border,
      }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color }}>{Math.round(pct * 100)}%</Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 6, textAlign: 'center' }}>{label}</Text>
      {sublabel && <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: 'center' }}>{sublabel}</Text>}
    </View>
  );
};

// ── Tela principal ───────────────────────────────────────────────────────────
export const ProgressScreen: React.FC = () => {
  const { workoutHistory, weeklyStats, profile } = useStore();
  const [weightTab, setWeightTab] = useState<'peso' | 'circunf'>('peso');

  // IMC
  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const bmiLabel = bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Peso normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidade';
  const bmiColor = bmi < 18.5 ? colors.accentBlue : bmi < 25 ? colors.success : bmi < 30 ? colors.warning : colors.error;

  // Calorias estimadas por treino baseado no peso
  const caloriesPerMin = profile.weight * 0.08;

  // Treinos por dia da semana (últimos 7 dias)
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const weekBarData = weekDays.map((label, i) => {
    const dayWorkouts = workoutHistory.filter((w) => {
      const d = new Date(w.date).getDay();
      const mapped = d === 0 ? 6 : d - 1;
      return mapped === i;
    });
    return {
      label,
      value: dayWorkouts.reduce((acc, w) => acc + w.duration, 0),
      color: colors.primary,
    };
  });

  // Histórico de peso simulado com base no peso atual
  const weightHistory = Array.from({ length: 7 }, (_, i) => {
    const variation = (Math.random() - 0.5) * 0.6;
    return parseFloat((profile.weight - (6 - i) * 0.15 + variation).toFixed(1));
  });
  weightHistory[weightHistory.length - 1] = profile.weight;

  // Circunferência glúteo simulada
  const gluteHistory = Array.from({ length: 6 }, (_, i) => {
    const base = (profile.gluteCirc ?? 95) - (5 - i) * 0.4;
    return parseFloat(base.toFixed(1));
  });

  // Meta de treinos semanal baseada no nível
  const weeklyGoal = profile.level === 'Avançado' ? 5 : profile.level === 'Intermediário' ? 4 : 3;
  const weeklyDone = Math.min(weeklyStats.workouts, weeklyGoal);

  // Estimativa de calorias totais
  const totalCalories = workoutHistory.reduce((acc, w) => acc + w.calories, 0);

  // Genética → velocidade de resposta
  const geneticsInfo: Record<string, { label: string; desc: string; color: string }> = {
    Ectomorfo:  { label: 'Ectomorfo', desc: 'Metabolismo rápido, ganho mais lento. Foco em volume e frequência.', color: colors.accentBlue },
    Mesomorfo:  { label: 'Mesomorfo', desc: 'Resposta muscular excelente. Ganhos consistentes com treino regular.', color: colors.success },
    Endomorfo:  { label: 'Endomorfo', desc: 'Facilidade em ganhar massa. Cardio complementar recomendado.', color: colors.warning },
  };
  const genetics = geneticsInfo[profile.genetics ?? 'Mesomorfo'];

  // Estimativa de progresso de glúteo baseada em treinos e genética
  const geneticsMultiplier = profile.genetics === 'Mesomorfo' ? 1.2 : profile.genetics === 'Endomorfo' ? 1.0 : 0.85;
  const gluteProgress = Math.min(workoutHistory.length * 5 * geneticsMultiplier, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progresso</Text>
        <Text style={styles.subtitle}>Baseado no seu perfil</Text>
      </View>

      {/* Cards de resumo */}
      <View style={styles.summaryRow}>
        {[
          { icon: 'local-fire-department' as const, value: weeklyStats.streak, label: 'Sequência', unit: 'dias', color: colors.accentOrange },
          { icon: 'fitness-center' as const, value: workoutHistory.length, label: 'Treinos', unit: 'total', color: colors.primary },
          { icon: 'timer' as const, value: weeklyStats.minutes, label: 'Minutos', unit: 'total', color: colors.accentPurple },
        ].map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <MaterialIcons name={s.icon} size={18} color={s.color} />
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryUnit}>{s.unit}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Meta semanal */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Meta Semanal</Text>
          <Text style={[styles.cardBadge, { color: colors.primary }]}>{weeklyDone}/{weeklyGoal} treinos</Text>
        </View>
        <View style={styles.goalBar}>
          {Array.from({ length: weeklyGoal }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.goalSegment,
                { backgroundColor: i < weeklyDone ? colors.primary : colors.border },
                i < weeklyGoal - 1 && { marginRight: 4 },
              ]}
            />
          ))}
        </View>
        <Text style={styles.goalHint}>
          {weeklyDone >= weeklyGoal
            ? '🎉 Meta da semana atingida!'
            : `Faltam ${weeklyGoal - weeklyDone} treino${weeklyGoal - weeklyDone > 1 ? 's' : ''} para atingir sua meta`}
        </Text>
      </View>

      {/* Atividade semanal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Atividade Semanal</Text>
        <Text style={styles.cardSub}>Minutos de treino por dia</Text>
        <BarChart data={weekBarData} height={110} unit="min" />
      </View>

      {/* Progresso de glúteo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progresso de Glúteos</Text>
        <Text style={styles.cardSub}>Estimativa baseada nos seus treinos e genética</Text>
        <View style={styles.ringsRow}>
          <RingProgress
            value={gluteProgress} max={100}
            color={colors.primary} size={84}
            label="Desenvolvimento" sublabel={`${Math.round(gluteProgress)}% da meta`}
          />
          <RingProgress
            value={weeklyDone} max={weeklyGoal}
            color={colors.accentPurple} size={84}
            label="Meta Semanal" sublabel={`${weeklyDone}/${weeklyGoal} treinos`}
          />
          <RingProgress
            value={weeklyStats.streak} max={30}
            color={colors.accentOrange} size={84}
            label="Sequência" sublabel={`${weeklyStats.streak} dias`}
          />
        </View>
      </View>

      {/* Gráfico de peso / circunferência */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Evolução Corporal</Text>
          <View style={styles.miniTabs}>
            <TouchableOpacity
              style={[styles.miniTab, weightTab === 'peso' && styles.miniTabActive]}
              onPress={() => setWeightTab('peso')}
            >
              <Text style={[styles.miniTabText, weightTab === 'peso' && styles.miniTabTextActive]}>Peso</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.miniTab, weightTab === 'circunf' && styles.miniTabActive]}
              onPress={() => setWeightTab('circunf')}
            >
              <Text style={[styles.miniTabText, weightTab === 'circunf' && styles.miniTabTextActive]}>Glúteo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {weightTab === 'peso' ? (
          <>
            <View style={styles.currentValRow}>
              <Text style={styles.currentVal}>{profile.weight} kg</Text>
              <Text style={[styles.currentDiff, { color: colors.success }]}>
                {(profile.weight - weightHistory[0] > 0 ? '+' : '')}{(profile.weight - weightHistory[0]).toFixed(1)} kg
              </Text>
            </View>
            <LineChart
              data={weightHistory}
              labels={['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Hoje']}
              color={colors.primary} height={80} unit="kg"
            />
          </>
        ) : (
          <>
            <View style={styles.currentValRow}>
              <Text style={styles.currentVal}>{profile.gluteCirc ?? 95} cm</Text>
              <Text style={[styles.currentDiff, { color: colors.primary }]}>
                +{((profile.gluteCirc ?? 95) - gluteHistory[0]).toFixed(1)} cm
              </Text>
            </View>
            <LineChart
              data={gluteHistory}
              labels={['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Hoje']}
              color={colors.primary} height={80} unit="cm"
            />
            <Text style={styles.chartHint}>Circunferência do glúteo (cm)</Text>
          </>
        )}
      </View>

      {/* Dados corporais */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados Corporais</Text>
        <View style={styles.bodyGrid}>
          {[
            { label: 'Peso', value: `${profile.weight} kg`, icon: 'monitor-weight' as const, color: colors.primary },
            { label: 'Altura', value: `${profile.height} cm`, icon: 'height' as const, color: colors.accentBlue },
            { label: 'Idade', value: `${profile.age} anos`, icon: 'cake' as const, color: colors.accentOrange },
            { label: 'IMC', value: bmi.toFixed(1), icon: 'analytics' as const, color: bmiColor },
          ].map((item) => (
            <View key={item.label} style={styles.bodyCard}>
              <MaterialIcons name={item.icon} size={20} color={item.color} />
              <Text style={[styles.bodyVal, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.bodyLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.bmiBar, { marginTop: spacing.md }]}>
          <View style={[styles.bmiFill, {
            width: `${Math.min(((bmi - 15) / 25) * 100, 100)}%`,
            backgroundColor: bmiColor,
          }]} />
        </View>
        <Text style={[styles.bmiLabel, { color: bmiColor }]}>{bmiLabel}</Text>
      </View>

      {/* Genética */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biotipo</Text>
        <LinearGradient
          colors={[genetics.color + '20', genetics.color + '08']}
          style={styles.geneticsCard}
        >
          <View style={[styles.geneticsBadge, { backgroundColor: genetics.color }]}>
            <Text style={styles.geneticsBadgeText}>{genetics.label}</Text>
          </View>
          <Text style={styles.geneticsDesc}>{genetics.desc}</Text>
          <View style={styles.geneticsTips}>
            <Text style={styles.geneticsTipsTitle}>Recomendações para você:</Text>
            {profile.genetics === 'Ectomorfo' && [
              'Treinos de 4-5x por semana com volume alto',
              'Foco em exercícios compostos pesados',
              'Descanso adequado entre sessões',
            ].map((t, i) => <Text key={i} style={styles.geneticsTip}>• {t}</Text>)}
            {profile.genetics === 'Mesomorfo' && [
              'Treinos de 3-4x por semana com intensidade moderada',
              'Boa resposta a qualquer tipo de treino',
              'Varie os estímulos para continuar evoluindo',
            ].map((t, i) => <Text key={i} style={styles.geneticsTip}>• {t}</Text>)}
            {(!profile.genetics || profile.genetics === 'Endomorfo') && [
              'Combine treino de força com cardio',
              'Treinos de 4x por semana',
              'Atenção à alimentação para melhores resultados',
            ].map((t, i) => <Text key={i} style={styles.geneticsTip}>• {t}</Text>)}
          </View>
        </LinearGradient>
      </View>

      {/* Calorias totais */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calorias Queimadas</Text>
        <Text style={styles.cardSub}>Estimativa baseada no seu peso ({profile.weight}kg)</Text>
        <View style={styles.caloriesRow}>
          <View style={styles.calorieBox}>
            <MaterialIcons name="local-fire-department" size={24} color={colors.accentOrange} />
            <Text style={[styles.calorieVal, { color: colors.accentOrange }]}>{totalCalories}</Text>
            <Text style={styles.calorieLabel}>kcal total</Text>
          </View>
          <View style={styles.calorieDivider} />
          <View style={styles.calorieBox}>
            <MaterialIcons name="fitness-center" size={24} color={colors.primary} />
            <Text style={[styles.calorieVal, { color: colors.primary }]}>
              {workoutHistory.length > 0 ? Math.round(totalCalories / workoutHistory.length) : 0}
            </Text>
            <Text style={styles.calorieLabel}>kcal/treino</Text>
          </View>
          <View style={styles.calorieDivider} />
          <View style={styles.calorieBox}>
            <MaterialIcons name="timer" size={24} color={colors.accentPurple} />
            <Text style={[styles.calorieVal, { color: colors.accentPurple }]}>
              {Math.round(caloriesPerMin)}
            </Text>
            <Text style={styles.calorieLabel}>kcal/min</Text>
          </View>
        </View>
      </View>

      {/* Histórico */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Histórico de Treinos</Text>
        {workoutHistory.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum treino registrado ainda. Comece agora!</Text>
        ) : (
          workoutHistory.map((w) => (
            <View key={w.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <MaterialIcons name="fitness-center" size={16} color={colors.primary} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{w.planName}</Text>
                <Text style={styles.historyDate}>
                  {new Date(w.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </Text>
              </View>
              <View style={styles.historyStats}>
                <Text style={styles.historyDur}>{w.duration}min</Text>
                <Text style={styles.historyCal}>{w.calories} kcal</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 8, paddingBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },

  summaryRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  summaryCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, alignItems: 'center', gap: 2,
  },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  summaryUnit: { fontSize: 9, color: colors.textMuted },
  summaryLabel: { fontSize: 11, color: colors.textSecondary },

  card: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md },
  cardBadge: { fontSize: 13, fontWeight: '700' },

  goalBar: { flexDirection: 'row', height: 10, marginBottom: spacing.sm },
  goalSegment: { flex: 1, height: '100%', borderRadius: 5 },
  goalHint: { fontSize: 12, color: colors.textSecondary },

  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.sm },

  miniTabs: { flexDirection: 'row', backgroundColor: colors.cardLight, borderRadius: borderRadius.sm, padding: 2 },
  miniTab: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  miniTabActive: { backgroundColor: colors.primary },
  miniTabText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  miniTabTextActive: { color: '#fff' },
  currentValRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.sm },
  currentVal: { fontSize: 28, fontWeight: '800', color: colors.text },
  currentDiff: { fontSize: 14, fontWeight: '700' },
  chartHint: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },

  bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bodyCard: {
    width: '47%', backgroundColor: colors.cardLight,
    borderRadius: borderRadius.md, padding: spacing.md,
    alignItems: 'center', gap: 4,
  },
  bodyVal: { fontSize: 20, fontWeight: '800' },
  bodyLabel: { fontSize: 11, color: colors.textSecondary },
  bmiBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  bmiFill: { height: '100%', borderRadius: 4 },
  bmiLabel: { fontSize: 12, fontWeight: '700', marginTop: 6, textAlign: 'center' },

  geneticsCard: { borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm },
  geneticsBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  geneticsBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  geneticsDesc: { fontSize: 13, color: colors.text, lineHeight: 20 },
  geneticsTips: { gap: 4 },
  geneticsTipsTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 4 },
  geneticsTip: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  caloriesRow: { flexDirection: 'row', alignItems: 'center' },
  calorieBox: { flex: 1, alignItems: 'center', gap: 4 },
  calorieDivider: { width: 1, height: 50, backgroundColor: colors.border },
  calorieVal: { fontSize: 22, fontWeight: '800' },
  calorieLabel: { fontSize: 11, color: colors.textSecondary },

  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: colors.border, gap: spacing.sm,
  },
  historyIcon: {
    width: 36, height: 36, borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center',
  },
  historyInfo: { flex: 1 },
  historyName: { fontSize: 14, fontWeight: '600', color: colors.text },
  historyDate: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  historyStats: { alignItems: 'flex-end' },
  historyDur: { fontSize: 14, fontWeight: '700', color: colors.primary },
  historyCal: { fontSize: 11, color: colors.textSecondary },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.md },
});
