import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

export const KPICard = ({ label, value, sub, icon, color = Colors.accent }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 8, mass: 1, overshootClamping: false });
  }, [value]);

  return (
    <AnimatedView
      style={[
        styles.card,
        { borderLeftColor: color },
        animatedStyle,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
      <Text style={styles.label}>{label}</Text>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
