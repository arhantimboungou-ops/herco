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
import { colors, gradients } from '../theme/colors';
import { typography } from '../theme/typography';
import { Card, Button } from '../components';
import { formatFCFA } from '../utils/constants';

const AdminDashboard = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const isTablet = width >= 600;

  const dashboardData = {
    today: { revenue: 1254600, orders: 42, customers: 38, avgOrderValue: 29870, profit: 435050 },
    week: { revenue: 8750000, orders: 287, customers: 245, avgOrderValue: 30486, profit: 3050000 },
    month: { revenue: 35000000, orders: 1150, customers: 980, avgOrderValue: 30434, profit: 12500000 },
  };

  const currentData = dashboardData[selectedPeriod];

  const StatCard = ({ label, value, trend, icon, gradient }) => (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: gradient[0] + '15' }]}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <View style={styles.trendBadge}>
          <Text style={styles.trendText}>↑ {trend}</Text>
        </View>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Sidebar - Desktop Only */}
      {isTablet && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>HERCO</Text>
          <Text style={styles.logoSub}>RESTAURANT SYSTEM</Text>
          
          <View style={styles.menuItems}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemActive]}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuTextActive}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🛒</Text>
              <Text style={styles.menuText}>Ventes (POS)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📋</Text>
              <Text style={styles.menuText}>Commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onGoToInventory}>
              <Text style={styles.menuIcon}>📦</Text>
              <Text style={styles.menuText}>Inventaire</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bienvenue, {user?.name || 'Admin'}! 👋</Text>
            <Text style={styles.dateText}>Voici l'état de votre restaurant aujourd'hui.</Text>
          </View>
          <View style={styles.periodSelector}>
            {['today', 'week', 'month'].map(p => (
              <TouchableOpacity 
                key={p} 
                onPress={() => setSelectedPeriod(p)}
                style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
              >
                <Text style={[styles.periodBtnText, selectedPeriod === p && styles.periodBtnTextActive]}>
                  {p === 'today' ? 'Jour' : p === 'week' ? 'Semaine' : 'Mois'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Ventes Totales" value={formatFCFA(currentData.revenue)} trend="18.2%" icon="💰" gradient={gradients.primary} />
          <StatCard label="Commandes" value={currentData.orders} trend="12.5%" icon="🛍️" gradient={gradients.secondary} />
          <StatCard label="Profit Net" value={formatFCFA(currentData.profit)} trend="15.8%" icon="⚖️" gradient={gradients.success} />
          <StatCard label="Panier Moyen" value={formatFCFA(currentData.avgOrderValue)} trend="8.4%" icon="📈" gradient={gradients.accent} />
        </View>

        {/* Analytics Section */}
        <View style={styles.analyticsRow}>
          <Card style={styles.chartCard}>
            <Text style={styles.cardTitle}>Performance des Ventes</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartLine} />
              <Text style={styles.placeholderText}>Graphique Analytique Interactif</Text>
            </View>
          </Card>
          
          <Card style={styles.topSellingCard}>
            <Text style={styles.cardTitle}>Meilleurs Articles</Text>
            {[
              { name: 'Poisson Grillé', sales: 125, rev: 1250000 },
              { name: 'Burger Herco', sales: 98, rev: 980000 },
              { name: 'Salade César', sales: 87, rev: 435000 },
            ].map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSales}>{item.sales} ventes</Text>
                </View>
                <Text style={styles.itemRev}>{formatFCFA(item.rev)}</Text>
              </View>
            ))}
          </Card>
        </View>

        <Button label="Exporter le Rapport Complet" variant="primary" style={{ marginBottom: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  sidebar: { width: 260, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border, padding: 24 },
  logo: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1 },
  logoSub: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', marginTop: -4, marginBottom: 40 },
  menuItems: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8 },
  menuItemActive: { backgroundColor: colors.primary },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  menuTextActive: { fontSize: 15, color: '#FFF', fontWeight: '600' },
  logoutButton: { padding: 16, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center' },
  logoutText: { color: colors.error, fontWeight: '600' },
  mainContent: { flex: 1, padding: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  dateText: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  periodSelector: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 4 },
  periodBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  periodBtnActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  periodBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  periodBtnTextActive: { color: colors.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -12, marginBottom: 24 },
  statCard: { flex: 1, minWidth: 200, marginHorizontal: 12, marginBottom: 24, padding: 24 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statIcon: { fontSize: 24 },
  trendBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  statLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  analyticsRow: { flexDirection: 'row', marginHorizontal: -12, marginBottom: 32 },
  chartCard: { flex: 2, marginHorizontal: 12, padding: 24, minHeight: 300 },
  topSellingCard: { flex: 1, marginHorizontal: 12, padding: 24 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 24 },
  chartPlaceholder: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border },
  chartLine: { width: '80%', height: 4, backgroundColor: colors.primary, borderRadius: 2, marginBottom: 12, opacity: 0.3 },
  placeholderText: { color: colors.textTertiary, fontSize: 14 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.surfaceAlt },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  itemSales: { fontSize: 13, color: colors.textSecondary },
  itemRev: { fontSize: 15, fontWeight: '700', color: colors.primary },
});

export default AdminDashboard;
