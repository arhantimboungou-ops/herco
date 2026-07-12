import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { colors } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, formatFCFA } from '../utils/constants';

const InventoryScreen = ({ onBack }) => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', catId: 1, stock: '' });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      priceTTC: parseInt(newProduct.price),
      catId: parseInt(newProduct.catId),
      stock: parseInt(newProduct.stock) || 0,
      icon: '📦'
    };
    setProducts([product, ...products]);
    setIsModalVisible(false);
    setNewProduct({ name: '', price: '', catId: 1, stock: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Retour Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestion de l'Inventaire</Text>
        <Button label="+ Ajouter un Article" variant="primary" onPress={() => setIsModalVisible(true)} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Article</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Catégorie</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>Prix (FCFA)</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>Stock</Text>
          </View>

          {products.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemIcon}>{item.icon || '🍽️'}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemCat}>
                {DEFAULT_CATEGORIES.find(c => c.id === item.catId)?.name || 'Autre'}
              </Text>
              <Text style={styles.itemPrice}>{formatFCFA(item.priceTTC)}</Text>
              <View style={[styles.stockBadge, { backgroundColor: item.stock < 10 ? '#FEE2E2' : '#D1FAE5' }]}>
                <Text style={[styles.stockText, { color: item.stock < 10 ? '#DC2626' : '#059669' }]}>
                  {item.stock || 0}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Add Product Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel Article</Text>
            
            <Input 
              label="Nom de l'article" 
              placeholder="Ex: Bière Mutzig 65cl" 
              value={newProduct.name}
              onChangeText={(t) => setNewProduct({...newProduct, name: t})}
            />
            
            <View style={styles.rowInput}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Input 
                  label="Prix de vente (FCFA)" 
                  placeholder="1500" 
                  keyboardType="numeric"
                  value={newProduct.price}
                  onChangeText={(t) => setNewProduct({...newProduct, price: t})}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input 
                  label="Stock Initial" 
                  placeholder="50" 
                  keyboardType="numeric"
                  value={newProduct.stock}
                  onChangeText={(t) => setNewProduct({...newProduct, stock: t})}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button label="Annuler" variant="secondary" onPress={() => setIsModalVisible(false)} style={{ flex: 1, marginRight: 12 }} />
              <Button label="Enregistrer" variant="primary" onPress={handleAddProduct} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { padding: 8 },
  backText: { color: colors.primary, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  content: { flex: 1, padding: 24 },
  tableCard: { padding: 0, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 20, backgroundColor: colors.surfaceAlt, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.surfaceAlt },
  itemInfo: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  itemCat: { flex: 1, fontSize: 14, color: colors.textSecondary },
  itemPrice: { flex: 1, textAlign: 'right', fontSize: 15, fontWeight: '700', color: colors.primary },
  stockBadge: { flex: 0.5, paddingVertical: 4, borderRadius: 8, alignItems: 'center', marginLeft: 20 },
  stockText: { fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, padding: 32 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 24 },
  rowInput: { flexDirection: 'row', marginBottom: 16 },
  modalActions: { flexDirection: 'row', marginTop: 32 },
});

export default InventoryScreen;
