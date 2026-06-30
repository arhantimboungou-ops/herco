import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { Colors } from './src/theme/colors';
import { USERS, PRODUCTS, TABLES, CATEGORIES } from './src/services/initialData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);
  const [tables, setTables] = useState(TABLES);

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentScreen('login');
  }, []);

  const handleNavigate = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  const renderScreen = useMemo(() => {
    if (!currentUser) {
      return <LoginScreen users={USERS} onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            orders={orders}
            products={products}
            tables={tables}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <DashboardScreen
            orders={orders}
            products={products}
            tables={tables}
            onNavigate={handleNavigate}
          />
        );
    }
  }, [currentUser, currentScreen, orders, products, tables, handleLogin, handleNavigate]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.container}>
          {renderScreen}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
