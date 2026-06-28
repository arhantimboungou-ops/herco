import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, Button } from '../components';
import { formatFCFA, DEFAULT_PRODUCTS } from '../utils/constants';

const AdminDashboard = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();
  const [selectedPeriod, setSelectedPeriod] = useState('today'); // today, week, month

  const isTablet = width >= 600;

  // Données simulées
  const dashboardData = {
    today: {
      revenue: 1250000,
      orders: 42,
      customers: 38,
      avgOrderValue: 29761,
    },
    week: {
      revenue: 8750000,
      orders: 287,
      customers: 245,
      avgOrderValue: 30486,
    },
    month: {
      revenue: 35000000,
      orders: 1150,
      customers: 980,
      avgOrderValue: 30434,
    },
  };

  const currentData = dashboardData[selectedPeriod];

  // Top selling items
  const topItems = [
    { name: 'Herco Burger', quantity: 186, revenue: 3534000 },
    { name: 'Truffle Pasta', quantity: 152, revenue: 2736000 },
    { name: 'Grilled Salmon', quantity: 128, revenue: 2816000 },
    { name: 'Margherita Pizza', quantity: 115, revenue: 1955000 },
    { name: 'Mojito', quantity: 97, revenue: 1455000 },
  ];

  // Payment methods breakdown
  const paymentMethods = [
    { name: 'Credit Card', percentage: 58.2, amount: 2037000 },
    { name: 'Debit Card', percentage: 18.7, amount: 656000 },
    { name: 'Mobile Payment', percentage: 13.4, amount: 470000 },
    { name: 'Cash', percentage: 9.7, amount: 340000 },
  ];

  // Peak hours data
  const peakHours = [
    { hour: '11 AM', orders: 3, intensity: 0.2 },
    { hour: '12 PM', orders: 8, intensity: 0.5 },
    { hour: '1 PM', orders: 12, intensity: 0.8 },
    { hour: '2 PM', orders: 6, intensity: 0.4 },
    { hour: '7 PM', orders: 10, intensity: 0.7 },
    { hour: '8 PM', orders: 14, intensity: 1 },
    { hour: '9 PM', orders: 9, intensity: 0.6 },
    { hour: '10 PM', orders: 5, intensity: 0.3 },
  ];

  const KPICard = ({ label, value, trend, icon, color }) => (
    <Card variant="elevated" style={{ flex: 1, marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            {label}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: color || theme.colors.primary }}>
            {value}
          </Text>
          {trend && (
            <Text style={{ fontSize: 11, color: theme.colors.success, marginTop: theme.spacing.sm }}>
              ↑ {trend}
            </Text>
          )}
        </View>
        <Text style={{ fontSize: 32 }}>{icon}</Text>
      </View>
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    periodSelector: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    periodButton: {
      paddingHorizontalVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    periodButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    periodButtonTextActive: {
      color: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottomVertical: theme.spacing.md,
      marginTopVertical: theme.spacing.lg,
    },
    kpiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottomVertical: theme.spacing.lg,
    },
    kpiItem: {
      width: isTablet ? '48%' : '100%',
    },
    chartContainer: {
      paddingHorizontalVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottomVertical: theme.spacing.lg,
    },
    barChart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 120,
      gap: theme.spacing.sm,
      marginTopVertical: theme.spacing.md,
    },
    barItem: {
      flex: 1,
      alignItems: 'center',
    },
    bar: {
      width: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      marginBottomVertical: theme.spacing.sm,
    },
    barLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    tableContainer: {
      marginBottomVertical: theme.spacing.lg,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingHorizontalVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tableHeaderCell: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontalVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: 'center',
    },
    tableCell: {
      fontSize: 12,
      color: theme.colors.textPrimary,
    },
    tableCellNumeric: {
      textAlign: 'right',
      fontWeight: '600',
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.surface,
      borderRadius: 3,
      overflow: 'hidden',
      marginVertical: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tableau de Bord</Text>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
            Bienvenue, {user?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={{ color: theme.colors.error, fontSize: 13, fontWeight: '600' }}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['today', 'week', 'month'].map(period => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {period === 'today'
                ? "Aujourd'hui"
                : period === 'week'
                ? 'Cette Semaine'
                : 'Ce Mois'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* KPI Cards */}
        <Text style={styles.sectionTitle}>Indicateurs Clés</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiItem}>
            <KPICard
              label="Chiffre d'Affaires"
              value={formatFCFA(currentData.revenue)}
              trend="18.6%"
              icon="💰"
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.kpiItem}>
            <KPICard
              label="Commandes"
              value={currentData.orders.toString()}
              trend="12.4%"
              icon="📦"
              color={theme.colors.info}
            />
          </View>
          <View style={styles.kpiItem}>
            <KPICard
              label="Clients"
              value={currentData.customers.toString()}
              trend="9.7%"
              icon="👥"
              color={theme.colors.success}
            />
          </View>
          <View style={styles.kpiItem}>
            <KPICard
              label="Panier Moyen"
              value={formatFCFA(currentData.avgOrderValue)}
              trend="5.5%"
              icon="🛒"
              color={theme.colors.warning}
            />
          </View>
        </View>

        {/* Peak Hours */}
        <Text style={styles.sectionTitle}>Heures de Pointe</Text>
        <View style={styles.chartContainer}>
          <View style={styles.barChart}>
            {peakHours.map((hour, idx) => (
              <View key={idx} style={styles.barItem}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(hour.intensity * 100, 10) },
                  ]}
                />
                <Text style={styles.barLabel}>{hour.hour}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Selling Items */}
        <Text style={styles.sectionTitle}>Articles Populaires</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Article</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Revenu</Text>
          </View>
          {topItems.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellNumeric, { flex: 1 }]}>
                {formatFCFA(item.revenue)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Modes de Paiement</Text>
        <View style={styles.tableContainer}>
          {paymentMethods.map((method, idx) => (
            <View key={idx} style={{ marginBottomVertical: theme.spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottomVertical: theme.spacing.sm }}>
                <Text style={styles.tableCell}>{method.name}</Text>
                <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                  {method.percentage}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${method.percentage}%` },
                  ]}
                />
              </View>
              <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>
                {formatFCFA(method.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Export Button */}
        <Button
          label="Exporter le Rapport"
          variant="primary"
          size="lg"
          style={{ marginBottomVertical: theme.spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;
