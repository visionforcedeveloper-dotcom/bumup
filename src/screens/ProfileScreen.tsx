import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const goals = ['Definição', 'Bumbum', 'Perda de Peso', 'Força', 'Saúde Geral'];
const levels = ['Iniciante', 'Intermediário', 'Avançado'];
const geneticsOptions = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'] as const;

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, weeklyStats, workoutHistory } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  const handleSave = () => { updateProfile(form); setEditing(false); };

  const achievements = [
    { icon: 'local-fire-department' as const, name: '5 dias seguidos', unlocked: weeklyStats.streak >= 5, color: colors.accentOrange },
    { icon: 'fitness-center' as const, name: 'Primeiro treino', unlocked: workoutHistory.length >= 1, color: colors.primary },
    { icon: 'emoji-events' as const, name: '10 treinos', unlocked: workoutHistory.length >= 10, color: colors.warning },
    { icon: 'bolt' as const, name: '1000 calorias', unlocked: weeklyStats.calories >= 1000, color: colors.accentPurple },
    { icon: 'star' as const, name: 'Meta semanal', unlocked: weeklyStats.workouts >= 3, color: colors.accentBlue },
    { icon: 'workspace-premium' as const, name: 'Mês completo', unlocked: false, color: colors.accentPink },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{profile.name[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.goalText}>{profile.goal} · {profile.level}</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => editing ? handleSave() : setEditing(true)}>
          <MaterialIcons name={editing ? 'check' : 'edit'} size={14} color={colors.primary} />
          <Text style={styles.editBtnText}>{editing ? 'Salvar' : 'Editar Perfil'}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        {[
          { value: workoutHistory.length, label: 'Treinos', color: colors.primary },
          { value: weeklyStats.streak, label: 'Sequência', color: colors.accentOrange },
          { value: weeklyStats.minutes, label: 'Minutos', color: colors.accentPurple },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Body data */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados Corporais</Text>
        {editing ? (
          <View>
            <View style={styles.inputRow}>
              {[
                { label: 'Peso (kg)', key: 'weight', val: form.weight },
                { label: 'Altura (cm)', key: 'height', val: form.height },
                { label: 'Idade', key: 'age', val: form.age },
              ].map((f) => (
                <View key={f.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={String(f.val)}
                    onChangeText={(v) => setForm({ ...form, [f.key]: parseFloat(v) || 0 })}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Circunf. Glúteo (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={String(form.gluteCirc ?? '')}
                  onChangeText={(v) => setForm({ ...form, gluteCirc: parseFloat(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="ex: 96"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>% Gordura</Text>
                <TextInput
                  style={styles.input}
                  value={String(form.bodyFat ?? '')}
                  onChangeText={(v) => setForm({ ...form, bodyFat: parseFloat(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="ex: 24"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.bodyStats}>
            {[
              { value: profile.weight, unit: 'kg', label: 'Peso' },
              { value: profile.height, unit: 'cm', label: 'Altura' },
              { value: profile.age, unit: 'anos', label: 'Idade' },
              { value: bmi, unit: 'IMC', label: 'Normal' },
              { value: profile.gluteCirc ?? '—', unit: 'cm', label: 'Glúteo' },
              { value: profile.bodyFat ? `${profile.bodyFat}%` : '—', unit: '', label: 'Gordura' },
            ].map((b) => (
              <View key={b.label} style={styles.bodyStat}>
                <Text style={styles.bodyVal}>{b.value}</Text>
                <Text style={styles.bodyUnit}>{b.unit}</Text>
                <Text style={styles.bodyLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Goal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivo</Text>
        {editing ? (
          <View style={styles.chipsWrap}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, form.goal === g && styles.chipActive]}
                onPress={() => setForm({ ...form, goal: g })}
              >
                <Text style={[styles.chipText, form.goal === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.currentChip}>
            <MaterialIcons name="track-changes" size={16} color={colors.primary} />
            <Text style={styles.currentChipText}>{profile.goal}</Text>
          </View>
        )}
      </View>

      {/* Level */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nível</Text>
        {editing ? (
          <View style={styles.levelRow}>
            {levels.map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.levelChip, form.level === l && styles.chipActive]}
                onPress={() => setForm({ ...form, level: l })}
              >
                <Text style={[styles.chipText, form.level === l && styles.chipTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.currentChip}>
            <MaterialIcons name="bolt" size={16} color={colors.primary} />
            <Text style={styles.currentChipText}>{profile.level}</Text>
          </View>
        )}
      </View>

      {/* Biotipo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biotipo (Genética)</Text>
        {editing ? (
          <View style={styles.levelRow}>
            {geneticsOptions.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.levelChip, form.genetics === g && styles.chipActive]}
                onPress={() => setForm({ ...form, genetics: g })}
              >
                <Text style={[styles.chipText, form.genetics === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.currentChip}>
            <MaterialIcons name="dna" size={16} color={colors.primary} />
            <Text style={styles.currentChipText}>{profile.genetics ?? 'Não definido'}</Text>
          </View>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conquistas</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((a, i) => (
            <View key={i} style={[styles.achievement, !a.unlocked && styles.achievementLocked]}>
              <View style={[styles.achieveIcon, { backgroundColor: a.color + (a.unlocked ? '25' : '10') }]}>
                <MaterialIcons name={a.icon} size={22} color={a.unlocked ? a.color : colors.textMuted} />
              </View>
              <Text style={[styles.achieveName, !a.unlocked && { color: colors.textMuted }]}>{a.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingTop: spacing.xl + 8, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  avatarLarge: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: colors.background },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  goalText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.md, backgroundColor: colors.card,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.primary + '60',
  },
  editBtnText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  statBox: { flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  bodyStats: { flexDirection: 'row', justifyContent: 'space-around' },
  bodyStat: { alignItems: 'center' },
  bodyVal: { fontSize: 22, fontWeight: '800', color: colors.text },
  bodyUnit: { fontSize: 11, color: colors.textSecondary },
  bodyLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  inputRow: { flexDirection: 'row', gap: spacing.sm },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: colors.cardLight, borderRadius: borderRadius.sm,
    padding: spacing.sm, color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center',
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.cardLight,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: colors.background },
  currentChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.cardLight, borderRadius: borderRadius.md, padding: spacing.md },
  currentChipText: { fontSize: 15, color: colors.text, fontWeight: '600' },
  levelRow: { flexDirection: 'row', gap: spacing.sm },
  levelChip: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.cardLight, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  achievement: { width: '30%', alignItems: 'center', gap: spacing.xs },
  achievementLocked: { opacity: 0.45 },
  achieveIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  achieveName: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
});
