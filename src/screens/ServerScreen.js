import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card, Input } from '../components';
import { DEFAULT_TABLES, DEFAULT_PRODUCTS, formatFCFA } from '../utils/constants';

const ServerScreen = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();
  const [tables, setTables] = useState(DEFAULT_TABLES);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');

  const isTablet = width >= 600;

  // Filtrer les produits
  const filteredProducts = DEFAULT_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ajouter un article à la commande de la table
  const handleAddProductToTable = (product) => {
    if (!selectedTable) return;

    const tableId = selectedTable.id;
    setTableOrders(prev => {
      const currentOrder = prev[tableId] || [];
      const existing = currentOrder.find(item => item.id === product.id);

      if (existing) {
        return {
          ...prev,
          [tableId]: currentOrder.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...prev,
        [tableId]: [...currentOrder, { ...product, quantity: 1 }],
      };
    });
  };

  // Mettre à jour la quantité
  const handleUpdateQuantity = (productId, quantity) => {
    if (!selectedTable) return;

    const tableId = selectedTable.id;
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    setTableOrders(prev => ({
      ...prev,
      [tableId]: prev[tableId].map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  // Supprimer un article
  const handleRemoveProduct = (productId) => {
    if (!selectedTable) return;

    const tableId = selectedTable.id;
    setTableOrders(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter(item => item.id !== productId),
    }));
  };

  // Calculer le total de la table
  const calculateTableTotal = () => {
    if (!selectedTable) return 0;
    const items = tableOrders[selectedTable.id] || [];
    return items.reduce((sum, item) => sum + item.priceTTC * item.quantity, 0);
  };

  // Envoyer la commande à la cuisine
  const handleSendToKitchen = () => {
    if (!selectedTable) return;

    const tableId = selectedTable.id;
    const items = tableOrders[tableId] || [];

    if (items.length === 0) {
      alert('Veuillez ajouter des articles');
      return;
    }

    // Mettre à jour le statut de la table
    setTables(prev =>
      prev.map(t =>
        t.id === tableId ? { ...t, status: 'occupée' } : t
      )
    );

    alert(`Commande envoyée à la cuisine pour la table ${selectedTable.name}`);
    
    // Réinitialiser
    setNotes('');
  };

  // Libérer une table
  const handleFreeTable = () => {
    if (!selectedTable) return;

    setTables(prev =>
      prev.map(t =>
        t.id === selectedTable.id ? { ...t, status: 'libre' } : t
      )
    );

    setTableOrders(prev => ({
      ...prev,
      [selectedTable.id]: [],
    }));

    setSelectedTable(null);
    setNotes('');
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'libre':
        return theme.colors.success;
      case 'occupée':
        return theme.colors.warning;
      case 'réservée':
        return theme.colors.info;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getTableStatusLabel = (status) => {
    switch (status) {
      case 'libre':
        return 'Libre';
      case 'occupée':
        return 'Occupée';
      case 'réservée':
        return 'Réservée';
      default:
        return status;
    }
  };

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
    mainContent: {
      flex: 1,
      flexDirection: isTablet ? 'row' : 'column',
    },
    tablesPanel: {
      flex: isTablet ? 0.4 : 0.35,
      borderRightWidth: isTablet ? 1 : 0,
      borderBottomWidth: !isTablet ? 1 : 0,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    tablesPanelTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottomVertical: theme.spacing.md,
    },
    tableGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    tableButton: {
      width: '30%',
      aspectRatio: 1,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    tableButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: 'rgba(30, 64, 175, 0.05)',
    },
    tableNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    tableCapacity: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    tableStatus: {
      fontSize: 10,
      fontWeight: '600',
      paddingHorizontalVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    orderPanel: {
      flex: isTablet ? 0.6 : 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchContainer: {
      marginBottomVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottomVertical: theme.spacing.md,
    },
    productsContainer: {
      marginBottomVertical: theme.spacing.lg,
      maxHeight: 200,
    },
    productItem: {
      paddingHorizontalVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottomVertical: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productName: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      flex: 1,
    },
    productPrice: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: '600',
      marginRightHorizontal: theme.spacing.md,
    },
    addProductButton: {
      paddingHorizontalVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    addProductButtonText: {
      color: theme.colors.background,
      fontSize: 12,
      fontWeight: '600',
    },
    orderItemsContainer: {
      marginBottomVertical: theme.spacing.lg,
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
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
      marginTopVertical: 2,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    quantityButton: {
      width: 20,
      height: 20,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quantityButtonText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    quantity: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      minWidth: 18,
      textAlign: 'center',
    },
    notesContainer: {
      marginBottomVertical: theme.spacing.lg,
      paddingHorizontalVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    notesLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottomVertical: theme.spacing.sm,
    },
    notesInput: {
      paddingHorizontalVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 60,
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily.base,
    },
    actionButtons: {
      gap: theme.spacing.md,
      marginTopVertical: theme.spacing.lg,
    },
    emptyState: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const currentTableOrders = selectedTable ? tableOrders[selectedTable.id] || [] : [];
  const tableTotal = calculateTableTotal();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Serveur</Text>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
            {user?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={{ color: theme.colors.error, fontSize: 13, fontWeight: '600' }}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Tables Panel */}
        <ScrollView style={styles.tablesPanel} showsVerticalScrollIndicator={false}>
          <Text style={styles.tablesPanelTitle}>Plan de Salle</Text>
          <View style={styles.tableGrid}>
            {tables.map(table => (
              <TouchableOpacity
                key={table.id}
                onPress={() => setSelectedTable(table)}
                style={[
                  styles.tableButton,
                  selectedTable?.id === table.id && styles.tableButtonActive,
                ]}
              >
                <Text style={styles.tableNumber}>{table.name}</Text>
                <Text style={styles.tableCapacity}>{table.cap} places</Text>
                <View
                  style={[
                    styles.tableStatus,
                    { backgroundColor: getTableStatusColor(table.status) },
                  ]}
                >
                  <Text style={{ color: 'white', fontSize: 9, fontWeight: '600' }}>
                    {getTableStatusLabel(table.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Order Panel */}
        <ScrollView style={styles.orderPanel} showsVerticalScrollIndicator={false}>
          {selectedTable ? (
            <>
              <Text style={styles.sectionTitle}>
                Table {selectedTable.name} - {selectedTable.cap} places
              </Text>

              {/* Search Products */}
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  icon={<Text style={{ fontSize: 14 }}>🔍</Text>}
                  size="sm"
                />
              </View>

              {/* Products List */}
              <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { marginBottomVertical: theme.spacing.md }]}>
                  Articles Disponibles
                </Text>
                {filteredProducts.map(product => (
                  <View key={product.id} style={styles.productItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{product.name}</Text>
                    </View>
                    <Text style={styles.productPrice}>{formatFCFA(product.priceTTC)}</Text>
                    <TouchableOpacity
                      onPress={() => handleAddProductToTable(product)}
                      style={styles.addProductButton}
                    >
                      <Text style={styles.addProductButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              {/* Current Order */}
              {currentTableOrders.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Commande Actuelle</Text>
                  <View style={styles.orderItemsContainer}>
                    {currentTableOrders.map(item => (
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
                            <Text style={{ fontSize: 14, color: theme.colors.error }}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Notes */}
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Demandes Spéciales</Text>
                    <Text
                      style={[
                        styles.notesInput,
                        {
                          paddingHorizontalVertical: theme.spacing.md,
                          color: theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {notes}
                    </Text>
                  </View>

                  {/* Total */}
                  <View
                    style={{
                      paddingHorizontalVertical: theme.spacing.md,
                      backgroundColor: theme.colors.background,
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      marginBottomVertical: theme.spacing.lg,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                      Total
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.primary }}>
                      {formatFCFA(tableTotal)}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <Button
                      label="Envoyer à la Cuisine"
                      variant="success"
                      size="lg"
                      onPress={handleSendToKitchen}
                    />
                    <Button
                      label="Libérer la Table"
                      variant="secondary"
                      size="md"
                      onPress={handleFreeTable}
                    />
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Sélectionnez une table pour commencer</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ServerScreen;
