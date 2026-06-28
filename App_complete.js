/**
 * HERCO POS System - Complete Application
 * Modern, Professional Point of Sale System
 * 
 * Features:
 * - User Authentication (Login with PIN)
 * - Point of Sale Interface (POS)
 * - Cashier Payment Processing
 * - Server Order Management
 * - Admin Dashboard & Analytics
 * - Responsive Design (Mobile & Tablet)
 * - Real-time Calculations
 * - Multi-currency Support (FCFA)
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  LoginScreen,
  POSScreen,
  CashierScreen,
  ServerScreen,
  AdminDashboard,
} from './src/screens';
import { theme } from './src/theme';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login'); // login, pos, cashier, server, admin
  const [orderData, setOrderData] = useState({ items: [], table: null, notes: '' });

  const handleLogin = (user) => {
    setCurrentUser(user);
    
    // Route based on user role
    if (user.role === 'admin') {
      setCurrentScreen('admin');
    } else if (user.role === 'caissier') {
      setCurrentScreen('cashier');
    } else if (user.role === 'serveur') {
      setCurrentScreen('server');
    } else {
      setCurrentScreen('pos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setOrderData({ items: [], table: null, notes: '' });
  };

  const handleGoToCashier = (order) => {
    setOrderData(order);
    setCurrentScreen('cashier');
  };

  const handleBackFromCashier = () => {
    setCurrentScreen('pos');
    setOrderData({ items: [], table: null, notes: '' });
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
        {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}

        {currentScreen === 'pos' && currentUser?.role === 'caissier' && (
          <CashierScreen
            user={currentUser}
            orderData={orderData}
            onBack={handleBackFromCashier}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'pos' && currentUser?.role === 'serveur' && (
          <ServerScreen user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === 'pos' && (currentUser?.role === 'admin' || !currentUser?.role) && (
          <POSScreen
            user={currentUser}
            onLogout={handleLogout}
            onGoToCashier={handleGoToCashier}
          />
        )}

        {currentScreen === 'cashier' && (
          <CashierScreen
            user={currentUser}
            orderData={orderData}
            onBack={handleBackFromCashier}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'server' && (
          <ServerScreen user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default App;
