import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

export default function SuperAdminLoginScreen({ onLoginSuccess, onBack }) {
  const [masterCode, setMasterCode] = useState('');
  const [loading, setLoading] = useState(false);

  // VOTRE CODE SUPER ADMIN PERSONNEL
  const SUPER_ADMIN_MASTER_CODE = 'HERCO-ADMIN-2026';

  const handleLogin = () => {
    if (masterCode === SUPER_ADMIN_MASTER_CODE) {
      setLoading(true);
      setTimeout(() => {
        onLoginSuccess();
        setLoading(false);
      }, 1000);
    } else {
      Alert.alert('Erreur', 'Code Super Admin invalide');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Accès Super Admin</Text>
        <Text style={styles.subtitle}>Entrez votre code maître personnel pour gérer la plateforme</Text>

        <TextInput
          style={styles.input}
          placeholder="Code Maître"
          placeholderTextColor={Colors.textLight}
          secureTextEntry
          value={masterCode}
          onChangeText={setMasterCode}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 24,
  },
  backButton: {
    marginTop: 40,
  },
  backText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
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
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
