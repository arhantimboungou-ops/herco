import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

export const PremiumInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(Colors.border);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withSpring(Colors.accent);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withSpring(Colors.border);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <AnimatedView style={[styles.inputWrapper, animatedStyle]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
});
