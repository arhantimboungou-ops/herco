/**
 * HERCO POS System - Main Application
 * Modern, Professional Point of Sale System
 * 
 * Architecture:
 * - Clean component-based structure
 * - Centralized theme system
 * - Reusable components
 * - Modular screens
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen, POSScreen } from './src/screens';
import { theme } from './src/theme';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!currentUser ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <POSScreen user={currentUser} onLogout={handleLogout} />
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default App;
