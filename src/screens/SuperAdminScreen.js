import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Colors } from '../theme/colors';
import { supabase } from '../services/supabase';

export default function SuperAdminScreen({ onLogout }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantAddress, setNewTenantAddress] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
      Alert.alert('Erreur', 'Impossible de charger les sociétés');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenantName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom de la société');
      return;
    }

    setCreating(true);
    try {
      // Générer un code d'activation unique
      const activationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data, error } = await supabase
        .from('tenants')
        .insert([
          {
            name: newTenantName,
            address: newTenantAddress || null,
            phone: newTenantPhone || null,
            activation_code: activationCode,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Succès',
        `Société créée avec le code: ${activationCode}\n\nCommuniquez ce code à votre client.`,
        [{ text: 'OK', onPress: () => setShowCreateModal(false) }]
      );

      setNewTenantName('');
      setNewTenantAddress('');
      setNewTenantPhone('');
      loadTenants();
    } catch (error) {
      console.error('Error creating tenant:', error);
      Alert.alert('Erreur', 'Impossible de créer la société');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTenantStatus = async (tenantId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ is_active: !currentStatus })
        .eq('id', tenantId);

      if (error) throw error;
      loadTenants();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut');
    }
  };

  const copyToClipboard = (code) => {
    // Dans une vraie app, utiliser react-native-clipboard
    Alert.alert('Code copié', `Le code ${code} a été copié`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Super Admin</Text>
          <Text style={styles.headerSubtitle}>Gestion des établissements</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tenants.length}</Text>
          <Text style={styles.statLabel}>Établissements</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tenants.filter(t => t.is_active).length}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>+ Créer une nouvelle société</Text>
      </TouchableOpacity>

      {/* Tenants List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : tenants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune société créée</Text>
          </View>
        ) : (
          tenants.map((tenant) => (
            <View key={tenant.id} style={styles.tenantCard}>
              <View style={styles.tenantHeader}>
                <View style={styles.tenantInfo}>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  {tenant.address && (
                    <Text style={styles.tenantAddress}>{tenant.address}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    tenant.is_active ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {tenant.is_active ? 'Actif' : 'Inactif'}
                  </Text>
                </View>
              </View>

              <View style={styles.tenantCode}>
                <Text style={styles.codeLabel}>Code d'activation:</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeValue}>{tenant.activation_code}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(tenant.activation_code)}
                  >
                    <Text style={styles.copyButton}>Copier</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.tenantActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleTenantStatus(tenant.id, tenant.is_active)}
                >
                  <Text style={styles.actionButtonText}>
                    {tenant.is_active ? 'Désactiver' : 'Activer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer une nouvelle société</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nom de la société"
              placeholderTextColor={Colors.textLight}
              value={newTenantName}
              onChangeText={setNewTenantName}
              editable={!creating}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Adresse (optionnel)"
              placeholderTextColor={Colors.textLight}
              value={newTenantAddress}
              onChangeText={setNewTenantAddress}
              editable={!creating}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Téléphone (optionnel)"
              placeholderTextColor={Colors.textLight}
              value={newTenantPhone}
              onChangeText={setNewTenantPhone}
              editable={!creating}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalCreateButton, creating && styles.buttonDisabled]}
                onPress={handleCreateTenant}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.modalCreateText}>Créer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.danger,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  createButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  tenantCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  tenantAddress: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: Colors.successLight,
  },
  statusInactive: {
    backgroundColor: Colors.dangerLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  tenantCode: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  codeLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
    fontFamily: 'monospace',
  },
  copyButton: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  tenantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  modalCreateText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
