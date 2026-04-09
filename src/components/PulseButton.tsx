import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../theme';

interface PulseButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const PulseButton: React.FC<PulseButtonProps> = ({
  label, onPress, color = colors.primary, icon = 'play-arrow',
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.97, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(400),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.btnWrap}>
        <LinearGradient
          colors={['#4A1A35', color]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <MaterialIcons name={icon} size={22} color="#fff" />
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  btnWrap: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  gradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md + 4,
  },
  label: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
