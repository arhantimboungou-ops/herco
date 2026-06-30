import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

export const PremiumCard = ({ children, style, onPress, elevated = true }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1);
  };

  return (
    <AnimatedView
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevated: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
});
