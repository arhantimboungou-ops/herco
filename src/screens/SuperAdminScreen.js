import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { INITIAL_SITES, formatFCFA } from '../utils/constants';

const SuperAdminScreen = ({ onLogout }) => {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', type: 'Restaurant', status: 'active' });

  const handleAddSite = () => {
    if (!newSite.name) return;
    const site = {
      id: sites.length + 1,
      name: newSite.name,
      type: newSite.type,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSites([...sites, site]);
    setIsModalVisible(false);
    setNewSite({ name: '', type: 'Restaurant', status: 'active' });
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
          <Text style={styles.subtitle}>Gestion Globale des Clients & Licences</Text>
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
            <Text style={styles.statLabel}>Clients Actifs</Text>
            <Text style={styles.statValue}>{sites.filter(s => s.status === 'active').length}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Chiffre d'Affaires Global</Text>
            <Text style={styles.statValue}>{formatFCFA(45750000)}</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Liste des Établissements</Text>
        
        {sites.map(site => (
          <Card key={site.id} style={styles.siteCard}>
            <View style={styles.siteInfo}>
              <View style={[styles.statusIndicator, { backgroundColor: site.status === 'active' ? '#10B981' : '#EF4444' }]} />
              <View>
                <Text style={styles.siteName}>{site.name}</Text>
                <Text style={styles.siteType}>{site.type} • Créé le {site.createdAt}</Text>
              </View>
            </View>
            <View style={styles.siteActions}>
              <Button 
                label={site.status === 'active' ? "Suspendre" : "Activer"} 
                variant={site.status === 'active' ? "danger" : "success"} 
                size="sm"
                onPress={() => toggleSiteStatus(site.id)}
                style={{ marginRight: 12 }}
              />
              <Button label="Voir Stats" variant="secondary" size="sm" />
            </View>
          </Card>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un Client</Text>
            <Input 
              label="Nom de l'établissement" 
              placeholder="Ex: Le Grand Restaurant" 
              value={newSite.name}
              onChangeText={(t) => setNewSite({...newSite, name: t})}
            />
            <Input 
              label="Type d'établissement" 
              placeholder="Ex: Bar Lounge" 
              value={newSite.type}
              onChangeText={(t) => setNewSite({...newSite, type: t})}
            />
            <View style={styles.modalButtons}>
              <Button label="Annuler" variant="secondary" onPress={() => setIsModalVisible(false)} style={{ flex: 1, marginRight: 12 }} />
              <Button label="Créer le Site" variant="primary" onPress={handleAddSite} style={{ flex: 1 }} />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 32, backgroundColor: '#1E293B' },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  logoutBtn: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' },
  logoutText: { color: '#EF4444', fontWeight: '700' },
  content: { flex: 1, padding: 32 },
  statsRow: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  statCard: { flex: 1, padding: 24, backgroundColor: '#FFF' },
  statLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: colors.primary },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },
  siteCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginBottom: 16, backgroundColor: '#FFF' },
  siteInfo: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 16 },
  siteName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  siteType: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  siteActions: { flexDirection: 'row' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 450, padding: 32 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', marginTop: 32 }
});

export default SuperAdminScreen;
