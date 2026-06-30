import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const PremiumButton = ({ title, onPress, style, textStyle, type = 'primary' }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[
        styles.button,
        type === 'primary' ? styles.primary : styles.secondary,
        style,
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, type === 'primary' ? styles.textPrimary : styles.textSecondary, textStyle]}>
        {title}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.white,
  },
});
