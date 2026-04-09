import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color = colors.primary, iconName }) => (
  <View style={[styles.container, { borderTopColor: color }]}>
    {iconName && <MaterialIcons name={iconName} size={18} color={color} style={styles.icon} />}
    <Text style={[styles.value, { color }]}>{value}</Text>
    {unit && <Text style={styles.unit}>{unit}</Text>}
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.md,
    padding: spacing.md, alignItems: 'center', borderTopWidth: 3, marginHorizontal: spacing.xs,
  },
  icon: { marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '800' },
  unit: { fontSize: 10, color: colors.textSecondary, marginTop: 1 },
  label: { fontSize: 11, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});
