import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useBP } from '../utils/responsive';
import { KPICard } from '../components/KPICard';
import { PremiumCard } from '../components/PremiumCard';
import { CFA } from '../services/formatter';

export const DashboardScreen = ({ orders, products, tables, onNavigate }) => {
  const bp = useBP();

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.tot, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const activeOrders = orders.filter((o) => o.st === 'En cours').length;
    const occupiedTables = tables.filter((t) => t.status === 'occupée').length;
    const lowStockProducts = products.filter((p) => p.stock <= p.stockMin).length;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      activeOrders,
      occupiedTables,
      lowStockProducts,
    };
  }, [orders, products, tables]);

  const topProducts = useMemo(() => {
    const productSales = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        productSales[item.id] = (productSales[item.id] || 0) + item.qty;
      });
    });
    return Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => products.find((p) => p.id === parseInt(id)))
      .filter(Boolean);
  }, [orders, products]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown} style={styles.header}>
            <Text style={styles.headerTitle}>Tableau de Bord</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </Animated.View>

          {/* KPI Cards */}
          <View
            style={[
              styles.kpiGrid,
              bp.isTabletUp && styles.kpiGridTablet,
            ]}
          >
            <Animated.View entering={FadeInDown.delay(100)}>
              <KPICard
                label="Chiffre d'affaires"
                value={CFA(stats.totalRevenue)}
                icon="💰"
                color={Colors.accent}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200)}>
              <KPICard
                label="Commandes"
                value={stats.totalOrders}
                sub={`Moy: ${CFA(stats.avgOrderValue)}`}
                icon="📋"
                color={Colors.info}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(300)}>
              <KPICard
                label="Tables occupées"
                value={`${stats.occupiedTables}/${tables.length}`}
                icon="🪑"
                color={Colors.success}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400)}>
              <KPICard
                label="Stock faible"
                value={stats.lowStockProducts}
                icon="⚠️"
                color={Colors.warning}
              />
            </Animated.View>
          </View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={[styles.actionGrid, bp.isTabletUp && styles.actionGridTablet]}>
              {[
                { label: 'Nouvelle commande', icon: '➕', action: 'pos' },
                { label: 'Gestion tables', icon: '🪑', action: 'tables' },
                { label: 'Produits', icon: '📦', action: 'products' },
                { label: 'Rapports', icon: '📊', action: 'reports' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.action}
                  onPress={() => onNavigate(item.action)}
                  style={styles.actionCard}
                >
                  <Text style={styles.actionIcon}>{item.icon}</Text>
                  <Text style={styles.actionLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Top Products */}
          {topProducts.length > 0 && (
            <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
              <Text style={styles.sectionTitle}>Produits populaires</Text>
              <PremiumCard>
                {topProducts.map((product, index) => (
                  <View
                    key={product.id}
                    style={[
                      styles.productRow,
                      index !== topProducts.length - 1 && styles.productRowBorder,
                    ]}
                  >
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{CFA(product.priceTTC)}</Text>
                  </View>
                ))}
              </PremiumCard>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  kpiGrid: {
    gap: 12,
    marginBottom: 24,
  },
  kpiGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionGrid: {
    gap: 12,
  },
  actionGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flex: bp => bp.isTabletUp ? 0.48 : 1,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accent,
  },
});
