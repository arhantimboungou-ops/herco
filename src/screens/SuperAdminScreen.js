import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { INITIAL_SITES, formatFCFA } from '../utils/constants';

const SuperAdminScreen = ({ onLogout }) => {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditPinVisible, setIsEditPinVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [newSite, setNewSite] = useState({ name: '', type: 'Restaurant', pin: '' });

  const handleAddSite = () => {
    if (!newSite.name) return;
    const site = {
      id: sites.length + 1,
      name: newSite.name,
      type: newSite.type,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      adminPin: newSite.pin || '1234'
    };
    setSites([...sites, site]);
    setIsModalVisible(false);
    setNewSite({ name: '', type: 'Restaurant', pin: '' });
  };

  const handleUpdatePin = () => {
    setSites(sites.map(s => 
      s.id === selectedSite.id ? { ...s, adminPin: newPin } : s
    ));
    setIsEditPinVisible(false);
    setNewPin('');
  };

  const toggleSiteStatus = (id) => {
    setSites(sites.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SUPER ADMIN PANEL</Text>
          <Text style={styles.subtitle}>Contrôle Total & Gestion des Accès</Text>
        </View>
        <View style={styles.headerActions}>
          <Button label="+ Créer un Établissement" variant="primary" onPress={() => setIsModalVisible(true)} style={{ marginRight: 12 }} />
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Gestion de vos Clients</Text>
        
        {sites.map(site => (
          <Card key={site.id} style={styles.siteCard}>
            <View style={styles.siteInfo}>
              <View style={[styles.statusIndicator, { backgroundColor: site.status === 'active' ? '#10B981' : '#EF4444' }]} />
              <View>
                <Text style={styles.siteName}>{site.name}</Text>
                <Text style={styles.siteType}>{site.type} • ID: #{site.id}</Text>
              </View>
            </View>
            
            <View style={styles.siteActions}>
              <View style={styles.pinDisplay}>
                <Text style={styles.pinLabel}>PIN ACTUEL</Text>
                <Text style={styles.pinValue}>{site.adminPin}</Text>
              </View>
              <Button 
                label="Modifier PIN" 
                variant="secondary" 
                size="sm" 
                onPress={() => { setSelectedSite(site); setIsEditPinVisible(true); }}
                style={{ marginRight: 12 }}
              />
              <Button 
                label={site.status === 'active' ? "Suspendre" : "Activer"} 
                variant={site.status === 'active' ? "danger" : "success"} 
                size="sm"
                onPress={() => toggleSiteStatus(site.id)}
              />
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Modal: Création de Site */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel Établissement</Text>
            <Input label="Nom" placeholder="Nom du site" value={newSite.name} onChangeText={(t) => setNewSite({...newSite, name: t})} />
            <Input label="Type" placeholder="Restaurant, Bar, etc." value={newSite.type} onChangeText={(t) => setNewSite({...newSite, type: t})} />
            <Input label="Code PIN Admin (Optionnel)" placeholder="1234 par défaut" value={newSite.pin} onChangeText={(t) => setNewSite({...newSite, pin: t})} keyboardType="numeric" />
            <View style={styles.modalButtons}>
              <Button label="Annuler" variant="secondary" onPress={() => setIsModalVisible(false)} style={{ flex: 1, marginRight: 12 }} />
              <Button label="Créer le Site" variant="primary" onPress={handleAddSite} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>

      {/* Modal: Modification de PIN */}
      <Modal visible={isEditPinVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier PIN - {selectedSite?.name}</Text>
            <Input label="Nouveau Code PIN" placeholder="Entrez 4 chiffres" value={newPin} onChangeText={setNewPin} keyboardType="numeric" maxLength={4} />
            <View style={styles.modalButtons}>
              <Button label="Annuler" variant="secondary" onPress={() => setIsEditPinVisible(false)} style={{ flex: 1, marginRight: 12 }} />
              <Button label="Enregistrer" variant="primary" onPress={handleUpdatePin} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 32, backgroundColor: '#0F172A' },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  logoutBtn: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' },
  logoutText: { color: '#F87171', fontWeight: '700' },
  content: { flex: 1, padding: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },
  siteCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginBottom: 16, backgroundColor: '#FFF' },
  siteInfo: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 16 },
  siteName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  siteType: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  siteActions: { flexDirection: 'row', alignItems: 'center' },
  pinDisplay: { marginRight: 24, alignItems: 'flex-end' },
  pinLabel: { fontSize: 10, fontWeight: '800', color: colors.textTertiary },
  pinValue: { fontSize: 16, fontWeight: '800', color: colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 450, padding: 32 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 24, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', marginTop: 32 }
});

export default SuperAdminScreen;
