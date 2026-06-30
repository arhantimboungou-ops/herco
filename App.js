import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import SuperAdminScreen from './src/screens/SuperAdminScreen';
import TenantSelectionScreen from './src/screens/TenantSelectionScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { Colors } from './src/theme/colors';
import { USERS, PRODUCTS, TABLES, CATEGORIES } from './src/services/initialData';

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'superadmin' ou 'client'
  const [currentTenant, setCurrentTenant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);
  const [tables, setTables] = useState(TABLES);

  const handleRoleSelected = useCallback((role) => {
    setUserRole(role);
  }, []);

  const handleTenantSelected = useCallback((tenant) => {
    setCurrentTenant(tenant);
  }, []);

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentTenant(null);
    setUserRole(null);
  }, []);

  const handleBackToRoleSelection = useCallback(() => {
    setUserRole(null);
    setCurrentTenant(null);
    setCurrentUser(null);
  }, []);

  const handleNavigate = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  const renderScreen = useMemo(() => {
    // Pas de rôle sélectionné
    if (!userRole) {
      return <RoleSelectionScreen onRoleSelected={handleRoleSelected} />;
    }

    // SUPER ADMIN
    if (userRole === 'superadmin') {
      return <SuperAdminScreen onLogout={handleLogout} />;
    }

    // CLIENT
    if (userRole === 'client') {
      // Pas de société sélectionnée
      if (!currentTenant) {
        return <TenantSelectionScreen onTenantSelected={handleTenantSelected} />;
      }

      // Pas d'utilisateur connecté
      if (!currentUser) {
        return (
          <LoginScreen
            users={USERS}
            onLogin={handleLogin}
            onBack={handleBackToRoleSelection}
            tenant={currentTenant}
          />
        );
      }

      // Utilisateur connecté - afficher le dashboard
      switch (currentScreen) {
        case 'dashboard':
          return (
            <DashboardScreen
              orders={orders}
              products={products}
              tables={tables}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              tenant={currentTenant}
              user={currentUser}
            />
          );
        default:
          return (
            <DashboardScreen
              orders={orders}
              products={products}
              tables={tables}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              tenant={currentTenant}
              user={currentUser}
            />
          );
      }
    }
  }, [userRole, currentTenant, currentUser, currentScreen]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
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
