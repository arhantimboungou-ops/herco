import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const Button = ({
  label,
  onPress,
  variant = 'primary', // primary, secondary, danger, success
  size = 'md', // sm, md, lg
  disabled = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
    success: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 32,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 56,
    },
  };

  const textColorMap = {
    primary: theme.colors.background,
    secondary: theme.colors.textPrimary,
    danger: theme.colors.background,
    success: theme.colors.background,
  };

  const styles = StyleSheet.create({
    button: {
      ...sizeStyles[size],
      ...variantStyles[variant],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      color: textColorMap[variant],
      fontWeight: '600',
      fontSize: size === 'sm' ? 12 : size === 'md' ? 14 : 16,
      fontFamily: theme.typography.fontFamily.base,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon && icon}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
