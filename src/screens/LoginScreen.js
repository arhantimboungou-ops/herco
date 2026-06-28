import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card, Input } from '../components';
import { DEFAULT_USERS } from '../utils/constants';

const LoginScreen = ({ onLogin }) => {
  const { width, height } = useWindowDimensions();
  const [step, setStep] = useState('user'); // 'user' ou 'pin'
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const isTablet = width >= 600;

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setStep('pin');
    setPin('');
    setError('');
  };

  const handlePinPress = (digit) => {
    if (digit === '⌫') {
      setPin(prev => prev.slice(0, -1));
      setError('');
      return;
    }

    if (pin.length >= 4) return;

    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      const user = DEFAULT_USERS.find(
        u => u.id === selectedUser.id && u.pin === newPin && u.active
      );

      if (user) {
        onLogin(user);
      } else {
        setError('PIN incorrect');
        setTimeout(() => {
          setPin('');
          setError('');
        }, 1000);
      }
    }
  };

  const handleBack = () => {
    setStep('user');
    setPin('');
    setError('');
    setSelectedUser(null);
  };

  const pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContainer: {
      flex: 1,
      width: '100%',
      flexDirection: isTablet ? 'row' : 'column',
      backgroundColor: theme.colors.background,
    },
    leftSection: {
      flex: isTablet ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
      borderRightWidth: isTablet ? 1 : 0,
      borderRightColor: theme.colors.border,
    },
    rightSection: {
      flex: isTablet ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
    },
    logo: {
      fontSize: 48,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily.base,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      fontFamily: theme.typography.fontFamily.base,
    },
    userCard: {
      marginBottom: theme.spacing.md,
      width: '100%',
    },
    userCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    userAvatarText: {
      color: theme.colors.background,
      fontWeight: '700',
      fontSize: 18,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    userRole: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    arrow: {
      fontSize: 20,
      color: theme.colors.textTertiary,
    },
    pinContainer: {
      width: '100%',
      maxWidth: 320,
    },
    backButton: {
      marginBottom: theme.spacing.lg,
    },
    backText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    selectedUserCard: {
      marginBottom: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    selectedUserAvatar: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    pinDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    pinDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: 'transparent',
    },
    pinDotFilled: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    pinKeyboard: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      justifyContent: 'center',
    },
    pinKey: {
      width: '30%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pinKeyText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    pinKeyDelete: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    pinKeyDeleteText: {
      color: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* Left Section - Branding */}
          {isTablet && (
            <View style={styles.leftSection}>
              <View style={styles.logo}>🍽️</View>
              <Text style={styles.title}>HERCO</Text>
              <Text style={styles.subtitle}>Restaurant & Bar</Text>
            </View>
          )}

          {/* Right Section - Login */}
          <View style={styles.rightSection}>
            {!isTablet && (
              <>
                <View style={styles.logo}>🍽️</View>
                <Text style={styles.title}>HERCO</Text>
                <Text style={styles.subtitle}>Restaurant & Bar</Text>
              </>
            )}

            {step === 'user' ? (
              <View style={{ width: '100%', maxWidth: 320 }}>
                <Text style={[styles.title, { marginBottom: theme.spacing.md }]}>Connexion</Text>
                <Text style={[styles.subtitle, { marginBottom: theme.spacing.lg }]}>
                  Sélectionnez votre profil
                </Text>

                {DEFAULT_USERS.filter(u => u.active).map(user => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleUserSelect(user)}
                    style={styles.userCard}
                  >
                    <Card variant="surface" elevated>
                      <View style={styles.userCardContent}>
                        <View
                          style={[
                            styles.userAvatar,
                            { backgroundColor: theme.colors.primary },
                          ]}
                        >
                          <Text style={styles.userAvatarText}>
                            {user.name.charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userRole}>
                            {user.role === 'admin'
                              ? 'Administrateur'
                              : user.role === 'caissier'
                              ? 'Caissier'
                              : 'Serveur'}
                          </Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.pinContainer}>
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
                >
                  <Text style={styles.backText}>‹ Retour</Text>
                </TouchableOpacity>

                <Card variant="surface" elevated>
                  <View style={styles.selectedUserCard}>
                    <View
                      style={[
                        styles.selectedUserAvatar,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={styles.userAvatarText}>
                        {selectedUser?.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{selectedUser?.name}</Text>
                      <Text style={styles.userRole}>
                        {selectedUser?.role === 'admin'
                          ? 'Administrateur'
                          : selectedUser?.role === 'caissier'
                          ? 'Caissier'
                          : 'Serveur'}
                      </Text>
                    </View>
                  </View>
                </Card>

                <Text style={[styles.title, { fontSize: 18, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md }]}>
                  Code PIN
                </Text>

                <View style={styles.pinDots}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.pinDot,
                        pin.length > i && styles.pinDotFilled,
                      ]}
                    />
                  ))}
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.pinKeyboard}>
                  {pinKeys.map(key => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => handlePinPress(key)}
                      style={[
                        styles.pinKey,
                        key === '⌫' && styles.pinKeyDelete,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.pinKeyText,
                          key === '⌫' && styles.pinKeyDeleteText,
                        ]}
                      >
                        {key}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
