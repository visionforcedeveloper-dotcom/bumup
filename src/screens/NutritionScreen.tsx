import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const meals = [
  {
    time: '07:00', name: 'Café da Manhã', calories: 380,
    foods: [
      { name: 'Iogurte grego com frutas', calories: 180, protein: 15, carbs: 20, fat: 4 },
      { name: 'Aveia com mel', calories: 120, protein: 4, carbs: 24, fat: 2 },
      { name: 'Café preto', calories: 5, protein: 0, carbs: 1, fat: 0 },
    ],
  },
  {
    time: '10:00', name: 'Lanche', calories: 180,
    foods: [
      { name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Castanhas 30g', calories: 90, protein: 3, carbs: 3, fat: 8 },
    ],
  },
  {
    time: '13:00', name: 'Almoço', calories: 580,
    foods: [
      { name: 'Frango grelhado 150g', calories: 210, protein: 40, carbs: 0, fat: 5 },
      { name: 'Arroz integral 100g', calories: 130, protein: 3, carbs: 28, fat: 1 },
      { name: 'Salada verde', calories: 40, protein: 2, carbs: 6, fat: 0 },
      { name: 'Feijão 80g', calories: 80, protein: 5, carbs: 14, fat: 0 },
    ],
  },
  {
    time: '16:00', name: 'Pré-Treino', calories: 260,
    foods: [
      { name: 'Batata doce 120g', calories: 100, protein: 2, carbs: 24, fat: 0 },
      { name: 'Ovo cozido', calories: 80, protein: 6, carbs: 0, fat: 5 },
      { name: 'Whey protein', calories: 120, protein: 24, carbs: 3, fat: 2 },
    ],
  },
  {
    time: '20:00', name: 'Jantar', calories: 420,
    foods: [
      { name: 'Salmão 150g', calories: 210, protein: 30, carbs: 0, fat: 10 },
      { name: 'Legumes no vapor', calories: 80, protein: 3, carbs: 14, fat: 0 },
      { name: 'Quinoa 80g', calories: 100, protein: 4, carbs: 18, fat: 2 },
    ],
  },
];

const macroGoals = { protein: 140, carbs: 180, fat: 55, calories: 1800 };
const macroActual = { protein: 108, carbs: 140, fat: 48, calories: 1420 };

export const NutritionScreen: React.FC = () => {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [water, setWater] = useState(5);
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const calorieProgress = Math.min(totalCalories / macroGoals.calories, 1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrição</Text>
        <Text style={styles.subtitle}>Plano alimentar de hoje</Text>
      </View>

      {/* Calorie ring card */}
      <View style={styles.calorieCard}>
        <View style={styles.calorieLeft}>
          <Text style={styles.calorieValue}>{totalCalories}</Text>
          <Text style={styles.calorieLabel}>kcal consumidas</Text>
          <View style={styles.calorieBar}>
            <View style={[styles.calorieBarFill, { width: `${calorieProgress * 100}%` }]} />
          </View>
          <Text style={styles.calorieRemaining}>{macroGoals.calories - totalCalories} kcal restantes</Text>
        </View>
        <View style={styles.calorieCircle}>
          <Text style={styles.caloriePercent}>{Math.round(calorieProgress * 100)}%</Text>
          <Text style={styles.calorieGoalText}>da meta</Text>
        </View>
      </View>

      {/* Macros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutrientes</Text>
        {[
          { name: 'Proteínas', actual: macroActual.protein, goal: macroGoals.protein, color: colors.primary },
          { name: 'Carboidratos', actual: macroActual.carbs, goal: macroGoals.carbs, color: colors.accentOrange },
          { name: 'Gorduras', actual: macroActual.fat, goal: macroGoals.fat, color: colors.accentPurple },
        ].map((m) => (
          <View key={m.name} style={styles.macroRow}>
            <View style={styles.macroInfo}>
              <Text style={styles.macroName}>{m.name}</Text>
              <Text style={styles.macroVals}>
                <Text style={{ color: m.color }}>{m.actual}g</Text> / {m.goal}g
              </Text>
            </View>
            <View style={styles.macroBarBg}>
              <View style={[styles.macroBarFill, { width: `${Math.min((m.actual / m.goal) * 100, 100)}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Meals */}
      <Text style={styles.sectionTitle}>Refeições</Text>
      {meals.map((meal, index) => (
        <TouchableOpacity
          key={index}
          style={styles.mealCard}
          onPress={() => setExpandedMeal(expandedMeal === index ? null : index)}
          activeOpacity={0.85}
        >
          <View style={styles.mealHeader}>
            <View style={styles.mealTimeBadge}>
              <Text style={styles.mealTimeText}>{meal.time}</Text>
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealCount}>{meal.foods.length} alimentos</Text>
            </View>
            <Text style={styles.mealCal}>{meal.calories} kcal</Text>
            <MaterialIcons
              name={expandedMeal === index ? 'expand-less' : 'expand-more'}
              size={20} color={colors.textMuted}
            />
          </View>
          {expandedMeal === index && (
            <View style={styles.mealFoods}>
              {meal.foods.map((food, fi) => (
                <View key={fi} style={styles.foodItem}>
                  <View style={styles.foodLeft}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.foodMacros}>
                      <Text style={styles.foodMacro}>P {food.protein}g</Text>
                      <Text style={styles.foodMacro}>C {food.carbs}g</Text>
                      <Text style={styles.foodMacro}>G {food.fat}g</Text>
                    </View>
                  </View>
                  <Text style={styles.foodCal}>{food.calories} kcal</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Water */}
      <View style={styles.card}>
        <View style={styles.waterHeader}>
          <MaterialIcons name="water-drop" size={18} color={colors.accentBlue} />
          <Text style={styles.cardTitle}>Hidratação</Text>
        </View>
        <View style={styles.waterCups}>
          {Array.from({ length: 8 }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setWater(i + 1)}>
              <MaterialIcons
                name="water-drop"
                size={28}
                color={i < water ? colors.accentBlue : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.waterInfo}>{water}/8 copos · {(water * 0.25).toFixed(2)}L de 2L</Text>
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
  calorieCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md,
  },
  calorieLeft: { flex: 1 },
  calorieValue: { fontSize: 36, fontWeight: '800', color: colors.primary },
  calorieLabel: { fontSize: 12, color: colors.textSecondary },
  calorieBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginVertical: spacing.sm },
  calorieBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  calorieRemaining: { fontSize: 12, color: colors.textSecondary },
  calorieCircle: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md,
  },
  caloriePercent: { fontSize: 16, fontWeight: '800', color: colors.primary },
  calorieGoalText: { fontSize: 10, color: colors.textSecondary },
  card: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  macroRow: { marginBottom: spacing.md },
  macroInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroName: { fontSize: 13, color: colors.text, fontWeight: '600' },
  macroVals: { fontSize: 13, color: colors.textSecondary },
  macroBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  macroBarFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  mealCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.sm, overflow: 'hidden' },
  mealHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  mealTimeBadge: { backgroundColor: colors.primary + '20', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  mealTimeText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '700', color: colors.text },
  mealCount: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  mealCal: { fontSize: 15, fontWeight: '700', color: colors.text, marginRight: spacing.xs },
  mealFoods: { borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.md },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  foodLeft: { flex: 1 },
  foodName: { fontSize: 13, color: colors.text },
  foodMacros: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  foodMacro: { fontSize: 10, color: colors.textSecondary },
  foodCal: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  waterHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  waterCups: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  waterInfo: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
