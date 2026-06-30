import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Colors, shadows } from '../theme/colors';
import { supabase } from '../services/supabase';

export default function TenantSelectionScreen({ onTenantSelected }) {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    // Charger les sociétés disponibles
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true)
        .limit(10);
      
      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const handleActivationCode = async () => {
    if (!activationCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un code d\'activation');
      return;
    }

    setLoading(true);
    try {
      // Chercher la société avec ce code d'activation
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('activation_code', activationCode.toUpperCase())
        .single();

      if (error || !data) {
        Alert.alert('Erreur', 'Code d\'activation invalide');
        return;
      }

      if (!data.is_active) {
        Alert.alert('Erreur', 'Cette société n\'est pas active');
        return;
      }

      // Passer la société sélectionnée
      onTenantSelected(data);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTenant = (tenant) => {
    onTenantSelected(tenant);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>HERCO</Text>
        <Text style={styles.subtitle}>Plateforme de Gestion Restauration</Text>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Section Code d'Activation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accéder à votre établissement</Text>
          <Text style={styles.sectionDescription}>
            Entrez le code d'activation fourni par votre administrateur
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Code d'activation (ex: ABC123XY)"
            placeholderTextColor={Colors.textLight}
            value={activationCode}
            onChangeText={setActivationCode}
            editable={!loading}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleActivationCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Continuer</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        {tenants.length > 0 && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Section Sociétés Récentes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vos établissements</Text>
              {tenants.map((tenant) => (
                <TouchableOpacity
                  key={tenant.id}
                  style={styles.tenantCard}
                  onPress={() => handleSelectTenant(tenant)}
                >
                  <View style={styles.tenantInfo}>
                    <Text style={styles.tenantName}>{tenant.name}</Text>
                    {tenant.address && (
                      <Text style={styles.tenantAddress}>{tenant.address}</Text>
                    )}
                  </View>
                  <Text style={styles.tenantArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 HERCO. Tous droits réservés.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: Colors.textMuted,
    fontSize: 12,
  },
  tenantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  tenantAddress: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tenantArrow: {
    fontSize: 24,
    color: Colors.accent,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
