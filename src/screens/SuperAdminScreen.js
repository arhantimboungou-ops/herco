import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { INITIAL_SITES, formatFCFA } from '../utils/constants';

const SuperAdminScreen = ({ onLogout }) => {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedSite, setLastCreatedSite] = useState(null);
  const [newSite, setNewSite] = useState({ name: '', type: 'Restaurant' });

  const handleAddSite = () => {
    if (!newSite.name) return;
    
    const siteId = sites.length + 1;
    const defaultPin = Math.floor(1000 + Math.random() * 9000).toString(); // Génère un PIN aléatoire de 4 chiffres
    
    const site = {
      id: siteId,
      name: newSite.name,
      type: newSite.type,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      adminPin: defaultPin // On stocke le PIN pour l'afficher
    };

    setSites([...sites, site]);
    setLastCreatedSite(site);
    setIsModalVisible(false);
    setShowSuccessModal(true);
    setNewSite({ name: '', type: 'Restaurant' });
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
          <Text style={styles.subtitle}>Contrôle Global & Licences Clients</Text>
        </View>
        <View style={styles.headerActions}>
          <Button label="+ Nouveau Client" variant="primary" onPress={() => setIsModalVisible(true)} style={{ marginRight: 12 }} />
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total Clients</Text>
            <Text style={styles.statValue}>{sites.length}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Revenu Mensuel Estimé</Text>
            <Text style={styles.statValue}>{formatFCFA(sites.filter(s => s.status === 'active').length * 150000)}</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Établissements sous Contrat</Text>
        
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
              <View style={styles.pinInfo}>
                <Text style={styles.pinLabel}>PIN ADMIN</Text>
                <Text style={styles.pinValue}>{site.adminPin || '1234'}</Text>
              </View>
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
            <Text style={styles.modalTitle}>Créer un Nouvel Établissement</Text>
            <Input 
              label="Nom du Restaurant / Bar" 
              placeholder="Ex: Le Palais des Saveurs" 
              value={newSite.name}
              onChangeText={(t) => setNewSite({...newSite, name: t})}
            />
            <Input 
              label="Type" 
              placeholder="Ex: Restaurant Gastronomique" 
              value={newSite.type}
              onChangeText={(t) => setNewSite({...newSite, type: t})}
            />
            <View style={styles.modalButtons}>
              <Button label="Annuler" variant="secondary" onPress={() => setIsModalVisible(false)} style={{ flex: 1, marginRight: 12 }} />
              <Button label="Générer l'Accès" variant="primary" onPress={handleAddSite} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>

      {/* Modal: Succès & Affichage du Code */}
      <Modal visible={showSuccessModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalContent, { alignItems: 'center' }]}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.modalTitle}>Site Créé avec Succès !</Text>
            <Text style={styles.successText}>Transmettez ces informations à votre client :</Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Établissement</Text>
              <Text style={styles.infoValue}>{lastCreatedSite?.name}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.infoLabel}>Code PIN Administrateur</Text>
              <Text style={styles.pinDisplay}>{lastCreatedSite?.adminPin}</Text>
            </View>

            <Button label="J'ai noté le code" variant="primary" onPress={() => setShowSuccessModal(false)} style={{ width: '100%' }} />
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
  statsRow: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  statCard: { flex: 1, padding: 24, backgroundColor: '#FFF', borderLeftWidth: 4, borderLeftColor: colors.primary },
  statLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },
  siteCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginBottom: 16, backgroundColor: '#FFF' },
  siteInfo: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 16 },
  siteName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  siteType: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  siteActions: { flexDirection: 'row', alignItems: 'center' },
  pinInfo: { marginRight: 24, alignItems: 'flex-end' },
  pinLabel: { fontSize: 10, fontWeight: '800', color: colors.textTertiary },
  pinValue: { fontSize: 16, fontWeight: '800', color: colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 450, padding: 32 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  successIcon: { fontSize: 60, marginBottom: 16 },
  successText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  infoBox: { width: '100%', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 24, marginBottom: 32 },
  infoLabel: { fontSize: 12, color: colors.textTertiary, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  infoValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
  pinDisplay: { fontSize: 42, fontWeight: '900', color: colors.primary, textAlign: 'center', letterSpacing: 8 },
  modalButtons: { flexDirection: 'row', marginTop: 32 }
});

export default SuperAdminScreen;
