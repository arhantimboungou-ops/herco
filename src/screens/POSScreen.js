import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, formatFCFA, TAX_RATE } from '../utils/constants';

const POSScreen = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  const isTablet = width >= 1024;

  const filteredProducts = useMemo(() => {
    let products = DEFAULT_PRODUCTS;
    if (selectedCategory) products = products.filter(p => p.catId === selectedCategory);
    if (searchQuery.trim()) products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return products;
  }, [selectedCategory, searchQuery]);

  const handleAddProduct = (product) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.priceTTC * item.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { total } = calculateTotals();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HERCO POS</Text>
          <Text style={styles.headerSubtitle}>{user?.name} • Session Active</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        {/* Left: Products Selection */}
        <View style={styles.leftPanel}>
          <View style={styles.searchBar}>
            <Input 
              placeholder="Rechercher un article (ex: Bière, Poulet...)" 
              value={searchQuery} 
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            <TouchableOpacity 
              onPress={() => setSelectedCategory(null)}
              style={[styles.catBtn, !selectedCategory && styles.catBtnActive]}
            >
              <Text style={[styles.catText, !selectedCategory && styles.catTextActive]}>Tous</Text>
            </TouchableOpacity>
            {DEFAULT_CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.catBtn, selectedCategory === cat.id && styles.catBtnActive]}
              >
                <Text style={[styles.catText, selectedCategory === cat.id && styles.catTextActive]}>{cat.icon} {cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.productGrid}>
            {filteredProducts.map(p => (
              <TouchableOpacity key={p.id} style={styles.productCard} onPress={() => handleAddProduct(p)}>
                <View style={styles.productIconContainer}>
                  <Text style={styles.productIcon}>{p.icon || '🍽️'}</Text>
                </View>
                <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.productPrice}>{formatFCFA(p.priceTTC)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right: Cart & Checkout */}
        <View style={styles.rightPanel}>
          <Text style={styles.cartTitle}>Commande Actuelle</Text>
          <ScrollView style={styles.cartList}>
            {orderItems.length === 0 ? (
              <Text style={styles.emptyCart}>Votre panier est vide</Text>
            ) : (
              orderItems.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{formatFCFA(item.priceTTC)}</Text>
                  </View>
                  <View style={styles.cartItemQty}>
                    <Text style={styles.qtyText}>x{item.quantity}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.checkout}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatFCFA(total)}</Text>
            </View>
            <Button 
              label="PAYER MAINTENANT" 
              variant="primary" 
              disabled={orderItems.length === 0}
              style={styles.payBtn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  headerSubtitle: { fontSize: 12, color: colors.textSecondary },
  logoutBtn: { padding: 8, borderRadius: 8, backgroundColor: colors.surfaceAlt },
  logoutText: { color: colors.error, fontSize: 12, fontWeight: '700' },
  main: { flex: 1, flexDirection: 'row' },
  leftPanel: { flex: 2.5, padding: 20 },
  rightPanel: { flex: 1, backgroundColor: '#FFF', borderLeftWidth: 1, borderLeftColor: colors.border, padding: 20 },
  searchBar: { marginBottom: 20 },
  categories: { flexDirection: 'row', marginBottom: 20, maxHeight: 50 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surfaceAlt, marginRight: 10 },
  catBtnActive: { backgroundColor: colors.primary },
  catText: { fontWeight: '600', color: colors.textSecondary },
  catTextActive: { color: '#FFF' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  productCard: { width: '30%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWeight: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  productIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surfaceAlt, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  productIcon: { fontSize: 30 },
  productName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  productPrice: { fontSize: 13, fontWeight: '600', color: colors.primary },
  cartTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },
  cartList: { flex: 1 },
  emptyCart: { textAlign: 'center', color: colors.textTertiary, marginTop: 40 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.surfaceAlt },
  cartItemName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  cartItemPrice: { fontSize: 12, color: colors.textSecondary },
  cartItemQty: { backgroundColor: colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  qtyText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  checkout: { marginTop: 20, borderTopWidth: 2, borderTopColor: colors.surfaceAlt, paddingTop: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: colors.textSecondary },
  totalValue: { fontSize: 24, fontWeight: '900', color: colors.primary },
  payBtn: { height: 60 },
});

export default POSScreen;
