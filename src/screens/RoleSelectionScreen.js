import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../theme/colors';

export default function RoleSelectionScreen({ onRoleSelected }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>HERCO</Text>
        <Text style={styles.tagline}>Plateforme de Gestion Restauration</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>Sélectionnez votre profil d'accès</Text>

        {/* Super Admin Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => onRoleSelected('superadmin')}
          activeOpacity={0.7}
        >
          <View style={styles.roleCardHeader}>
            <Text style={styles.roleIcon}>👨‍💼</Text>
            <Text style={styles.roleTitle}>Super Admin</Text>
          </View>
          <Text style={styles.roleDescription}>
            Gérez vos établissements, créez des codes d'activation et contrôlez vos clients
          </Text>
          <View style={styles.roleFeatures}>
            <Text style={styles.feature}>✓ Créer des sociétés</Text>
            <Text style={styles.feature}>✓ Générer des codes</Text>
            <Text style={styles.feature}>✓ Voir les statistiques</Text>
            <Text style={styles.feature}>✓ Gérer les utilisateurs</Text>
          </View>
          <View style={styles.roleArrow}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Client Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => onRoleSelected('client')}
          activeOpacity={0.7}
        >
          <View style={styles.roleCardHeader}>
            <Text style={styles.roleIcon}>🏪</Text>
            <Text style={styles.roleTitle}>Client</Text>
          </View>
          <Text style={styles.roleDescription}>
            Accédez à votre établissement avec votre code d'activation
          </Text>
          <View style={styles.roleFeatures}>
            <Text style={styles.feature}>✓ Entrer votre code</Text>
            <Text style={styles.feature}>✓ Gérer votre restaurant</Text>
            <Text style={styles.feature}>✓ Prendre des commandes</Text>
            <Text style={styles.feature}>✓ Voir les statistiques</Text>
          </View>
          <View style={styles.roleArrow}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
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
    fontSize: 36,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  roleFeatures: {
    marginBottom: 12,
  },
  feature: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  roleArrow: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  arrow: {
    fontSize: 32,
    color: Colors.accent,
    fontWeight: '300',
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
