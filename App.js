import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  LoginScreen,
  POSScreen,
  CashierScreen,
  ServerScreen,
  AdminDashboard,
  InventoryScreen,
} from './src/screens';
import { colors } from './src/theme/colors';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [orderData, setOrderData] = useState({ items: [], table: null, notes: '' });

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') setCurrentScreen('admin');
    else if (user.role === 'caissier') setCurrentScreen('pos');
    else if (user.role === 'serveur') setCurrentScreen('server');
    else setCurrentScreen('pos');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setOrderData({ items: [], table: null, notes: '' });
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
        
        {currentScreen === 'pos' && (
          <POSScreen user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === 'server' && (
          <ServerScreen user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            onGoToInventory={() => setCurrentScreen('inventory')}
          />
        )}

        {currentScreen === 'inventory' && (
          <InventoryScreen onBack={() => setCurrentScreen('admin')} />
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default App;
