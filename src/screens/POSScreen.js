import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card, Input } from '../components';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, formatFCFA, TAX_RATE } from '../utils/constants';

const POSScreen = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  const isTablet = width >= 600;

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    let products = DEFAULT_PRODUCTS;

    if (selectedCategory) {
      products = products.filter(p => p.catId === selectedCategory);
    }

    if (searchQuery.trim()) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [selectedCategory, searchQuery]);

  // Ajouter un article à la commande
  const handleAddProduct = (product) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Mettre à jour la quantité
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setOrderItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Supprimer un article
  const handleRemoveProduct = (productId) => {
    setOrderItems(prev => prev.filter(item => item.id !== productId));
  };

  // Calculer le total
  const calculateTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.priceTTC * item.quantity,
      0
    );
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

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
    headerSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    userInfo: {
      alignItems: 'flex-end',
    },
    mainContent: {
      flex: 1,
      flexDirection: isTablet ? 'row' : 'column',
    },
    leftPanel: {
      flex: isTablet ? 2 : 1,
      borderRightWidth: isTablet ? 1 : 0,
      borderRightColor: theme.colors.border,
    },
    rightPanel: {
      flex: isTablet ? 1 : 0,
      borderTopWidth: !isTablet ? 1 : 0,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoriesContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    categoryButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    categoryButtonTextActive: {
      color: theme.colors.background,
    },
    productsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    productGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    productCard: {
      width: isTablet ? '48%' : '100%',
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    productImage: {
      width: '100%',
      height: 120,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 40,
    },
    productInfo: {
      padding: theme.spacing.md,
    },
    productName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    productPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    addButton: {
      width: '100%',
    },
    orderSummary: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    orderItemInfo: {
      flex: 1,
    },
    orderItemName: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    orderItemPrice: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    quantityButton: {
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quantityButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    quantity: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      minWidth: 20,
      textAlign: 'center',
    },
    removeButton: {
      fontSize: 18,
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
    totalsContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    totalLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    totalValue: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    grandTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTopHorizontal: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    grandTotalLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    grandTotalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    actionButtons: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HERCO POS</Text>
          <Text style={styles.headerSubtitle}>Restaurant & Bar</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
          <TouchableOpacity onPress={onLogout}>
            <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Left Panel - Products */}
        <View style={styles.leftPanel}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon={<Text style={{ fontSize: 16 }}>🔍</Text>}
            />
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryButton,
                !selectedCategory && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  !selectedCategory && styles.categoryButtonTextActive,
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>

            {DEFAULT_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Products Grid */}
          <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
            {filteredProducts.length > 0 ? (
              <View style={styles.productGrid}>
                {filteredProducts.map(product => (
                  <Card key={product.id} style={styles.productCard} variant="default">
                    <View style={styles.productImage}>
                      {product.icon || '🍽️'}
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>{formatFCFA(product.priceTTC)}</Text>
                      <Button
                        label="Ajouter"
                        size="sm"
                        onPress={() => handleAddProduct(product)}
                        style={styles.addButton}
                      />
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Aucun article trouvé
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Right Panel - Order Summary */}
        <View style={styles.rightPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.orderSummary}>
              <Text style={styles.orderTitle}>Commande Actuelle</Text>

              {orderItems.length > 0 ? (
                orderItems.map(item => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.orderItemInfo}>
                      <Text style={styles.orderItemName}>{item.name}</Text>
                      <Text style={styles.orderItemPrice}>
                        {formatFCFA(item.priceTTC)} x {item.quantity}
                      </Text>
                    </View>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveProduct(item.id)}
                      >
                        <Text style={styles.removeButton}>×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyStateText}>Aucun article</Text>
              )}
            </View>

            {orderItems.length > 0 && (
              <>
                <View style={styles.totalsContainer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Sous-total</Text>
                    <Text style={styles.totalValue}>{formatFCFA(subtotal)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TVA (18%)</Text>
                    <Text style={styles.totalValue}>{formatFCFA(tax)}</Text>
                  </View>
                  <View style={styles.grandTotal}>
                    <Text style={styles.grandTotalLabel}>Total</Text>
                    <Text style={styles.grandTotalValue}>{formatFCFA(total)}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    label={`Passer au Paiement (${formatFCFA(total)})`}
                    variant="primary"
                    size="lg"
                  />
                  <Button
                    label="Annuler"
                    variant="secondary"
                    size="md"
                    onPress={() => setOrderItems([])}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default POSScreen;
