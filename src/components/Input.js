import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';

const Input = ({
  placeholder,
  value,
  onChangeText,
  icon,
  size = 'md',
  disabled = false,
  style,
  ...props
}) => {
  const sizeStyles = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 12,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: 14,
    },
    lg: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      fontSize: 16,
    },
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.lg,
      ...sizeStyles[size],
    },
    input: {
      flex: 1,
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily.base,
      ...sizeStyles[size],
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    icon: {
      marginRight: theme.spacing.md,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        {...props}
      />
    </View>
  );
};

export default Input;
