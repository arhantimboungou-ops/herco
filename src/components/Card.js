import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

const Card = ({ children, style, variant = 'default', elevated = false }) => {
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    elevated: {
      backgroundColor: theme.colors.background,
      borderColor: 'transparent',
      borderWidth: 0,
      ...theme.shadows.md,
    },
  };

  const styles = StyleSheet.create({
    card: {
      ...variantStyles[variant],
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      overflow: 'hidden',
    },
  });

  return (
    <View style={[styles.card, elevated && theme.shadows.md, style]}>
      {children}
    </View>
  );
};

export default Card;
