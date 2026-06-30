import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import LinearGradient from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../theme/colors';
import { useBP } from '../utils/responsive';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumCard } from '../components/PremiumCard';
import { CFA } from '../services/formatter';

export const POSScreen = ({ products, categories, tables, onBack }) => {
  const bp = useBP();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.catId === selectedCategory && p.active && p.stock > 0
    );
  }, [products, selectedCategory]);

  // Memoized cart calculations
  const cartTotals = useMemo(() => {
    const subTotal = cart.reduce((sum, item) => sum + item.priceTTC * item.qty, 0);
    const tva = Math.round(subTotal - subTotal / 1.18);
    const total = subTotal;
    return { subTotal, tva, total };
  }, [cart]);

  const handleAddToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const renderProductCard = ({ item }) => (
    <Animated.View entering={FadeInDown}>
      <PremiumCard style={styles.productCard}>
        <TouchableOpacity
          onPress={() => handleAddToCart(item)}
          style={styles.productContent}
        >
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{item.stock}</Text>
            </View>
          </View>
          <Text style={styles.productUnit}>{item.unit}</Text>
          <Text style={styles.productPrice}>{CFA(item.priceTTC)}</Text>
        </TouchableOpacity>
      </PremiumCard>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeInDown} style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <Text style={styles.backButton}>‹ Retour</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Commande</Text>
            {selectedTable && (
              <Text style={styles.tableLabel}>{selectedTable.name}</Text>
            )}
          </Animated.View>

          {/* Main Layout */}
          <View style={[styles.mainLayout, bp.isTabletUp && styles.mainLayoutTablet]}>
            {/* Products Section */}
            <View style={[styles.productsSection, bp.isTabletUp && styles.productsSectionTablet]}>
              {/* Category Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryTab,
                      selectedCategory === cat.id && styles.categoryTabActive,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        selectedCategory === cat.id && styles.categoryLabelActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Products Grid */}
              <FlashList
                data={filteredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={bp.numCols}
                estimatedItemSize={150}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
              />
            </View>

            {/* Cart Section */}
            <Animated.View
              entering={SlideInRight}
              style={[styles.cartSection, bp.isTabletUp && styles.cartSectionTablet]}
            >
              <View style={styles.cartHeader}>
                <Text style={styles.cartTitle}>Panier</Text>
                <Text style={styles.cartItemCount}>{cart.length}</Text>
              </View>

              {cart.length === 0 ? (
                <View style={styles.cartEmpty}>
                  <Text style={styles.cartEmptyIcon}>🛒</Text>
                  <Text style={styles.cartEmptyText}>Panier vide</Text>
                </View>
              ) : (
                <>
                  <FlashList
                    data={cart}
                    renderItem={({ item }) => (
                      <View style={styles.cartItem}>
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <Text style={styles.cartItemPrice}>{CFA(item.priceTTC)}</Text>
                        </View>
                        <View style={styles.cartItemQty}>
                          <TouchableOpacity
                            onPress={() => handleRemoveFromCart(item.id)}
                            style={styles.qtyBtn}
                          >
                            <Text style={styles.qtyBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyValue}>{item.qty}</Text>
                          <TouchableOpacity
                            onPress={() => handleAddToCart(item)}
                            style={styles.qtyBtn}
                          >
                            <Text style={styles.qtyBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    estimatedItemSize={60}
                    scrollEnabled={true}
                  />

                  {/* Totals */}
                  <View style={styles.cartTotals}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Sous-total</Text>
                      <Text style={styles.totalValue}>{CFA(cartTotals.subTotal)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>TVA (18%)</Text>
                      <Text style={styles.totalValue}>{CFA(cartTotals.tva)}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.totalRowGrand]}>
                      <Text style={styles.totalLabelGrand}>Total</Text>
                      <Text style={styles.totalValueGrand}>{CFA(cartTotals.total)}</Text>
                    </View>
                  </View>

                  {/* Payment Button */}
                  <PremiumButton
                    title="Procéder au paiement"
                    onPress={() => setShowPaymentModal(true)}
                    style={styles.payButton}
                  />
                </>
              )}
            </Animated.View>
          </View>
        </View>
      </LinearGradient>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <PremiumCard style={styles.paymentModal}>
            <Text style={styles.paymentTitle}>Mode de paiement</Text>
            {['Espèces', 'Mobile Money', 'Carte Bancaire'].map((method) => (
              <TouchableOpacity
                key={method}
                style={styles.paymentMethod}
                onPress={() => {
                  setShowPaymentModal(false);
                  setCart([]);
                }}
              >
                <Text style={styles.paymentMethodText}>{method}</Text>
              </TouchableOpacity>
            ))}
            <PremiumButton
              title="Annuler"
              type="secondary"
              onPress={() => setShowPaymentModal(false)}
              style={styles.cancelButton}
            />
          </PremiumCard>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text,
  },
  tableLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  mainLayout: {
    flex: 1,
  },
  mainLayoutTablet: {
    flexDirection: 'row',
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productsSectionTablet: {
    flex: 2,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryLabelActive: {
    color: Colors.white,
  },
  productsGrid: {
    gap: 12,
  },
  productCard: {
    flex: 1,
  },
  productContent: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  stockBadge: {
    backgroundColor: Colors.info,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  productUnit: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  cartSection: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 300,
  },
  cartSectionTablet: {
    flex: 1,
    minWidth: 350,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  cartItemCount: {
    backgroundColor: Colors.accent,
    color: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  cartEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cartEmptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  cartItemPrice: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cartItemQty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  qtyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  cartTotals: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRowGrand: {
    paddingTopWidth: 1,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  totalLabelGrand: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '800',
  },
  totalValueGrand: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.accent,
  },
  payButton: {
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  paymentModal: {
    width: '100%',
    maxWidth: 400,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  paymentMethod: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.background,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cancelButton: {
    marginTop: 12,
  },
});
