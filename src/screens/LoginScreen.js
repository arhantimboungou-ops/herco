import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useBP } from '../utils/responsive';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumInput } from '../components/PremiumInput';

const AnimatedView = Animated.createAnimatedComponent(View);

export const LoginScreen = ({ users, onLogin }) => {
  const bp = useBP();
  const [step, setStep] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const ROLE_COLORS = {
    admin: Colors.accent,
    caissier: Colors.info,
    serveur: Colors.success,
  };

  const ROLE_LABELS = {
    admin: 'Administrateur',
    caissier: 'Caissier',
    serveur: 'Serveur',
  };

  const handlePressKey = (key) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      setError('');
      return;
    }
    if (pin.length >= 4) return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 4) {
      const user = users.find(
        (u) => u.id === selectedUser.id && u.pin === newPin && u.active
      );
      if (user) {
        onLogin(user);
      } else {
        setError('PIN incorrect');
        setTimeout(() => {
          setPin('');
          setError('');
        }, 1500);
      }
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.content,
              bp.isTabletUp && styles.contentTablet,
            ]}
          >
            {/* Branding */}
            <AnimatedView entering={FadeInUp.delay(100)} style={styles.branding}>
              <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>🍽️</Text>
              </View>
              <Text style={styles.logoTitle}>HERCO</Text>
              <Text style={styles.logoSubtitle}>Restaurant & Lounge Bar</Text>
              <Text style={styles.logoCity}>Brazzaville, Congo</Text>
            </AnimatedView>

            {/* Login Form */}
            <AnimatedView
              entering={FadeInDown.delay(200)}
              style={[styles.formContainer, bp.isTabletUp && styles.formTablet]}
            >
              {step === 'user' ? (
                <>
                  <Text style={styles.formTitle}>Connexion</Text>
                  <Text style={styles.formHint}>Sélectionnez votre profil</Text>
                  <View style={styles.userList}>
                    {users
                      .filter((u) => u.active)
                      .map((user, index) => (
                        <Animated.View
                          key={user.id}
                          entering={FadeInDown.delay(300 + index * 100)}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedUser(user);
                              setStep('pin');
                              setPin('');
                              setError('');
                            }}
                            style={styles.userCard}
                          >
                            <View
                              style={[
                                styles.userAvatar,
                                { backgroundColor: ROLE_COLORS[user.role] },
                              ]}
                            >
                              <Text style={styles.avatarText}>
                                {user.name.charAt(0)}
                              </Text>
                            </View>
                            <View style={styles.userInfo}>
                              <Text style={styles.userName}>{user.name}</Text>
                              <Text
                                style={[
                                  styles.userRole,
                                  { color: ROLE_COLORS[user.role] },
                                ]}
                              >
                                {ROLE_LABELS[user.role]}
                              </Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                          </TouchableOpacity>
                        </Animated.View>
                      ))}
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setStep('user');
                      setPin('');
                      setError('');
                    }}
                  >
                    <Text style={styles.backButton}>‹ Retour</Text>
                  </TouchableOpacity>

                  <View style={styles.selectedUserCard}>
                    <View
                      style={[
                        styles.selectedUserAvatar,
                        { backgroundColor: ROLE_COLORS[selectedUser?.role] },
                      ]}
                    >
                      <Text style={styles.selectedAvatarText}>
                        {selectedUser?.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.selectedUserName}>
                        {selectedUser?.name}
                      </Text>
                      <Text
                        style={[
                          styles.selectedUserRole,
                          { color: ROLE_COLORS[selectedUser?.role] },
                        ]}
                      >
                        {ROLE_LABELS[selectedUser?.role]}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pinTitle}>Code PIN</Text>
                  <View style={styles.pinDots}>
                    {[0, 1, 2, 3].map((i) => (
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

                  <View style={styles.keypad}>
                    {keys.map((key) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handlePressKey(key)}
                        activeOpacity={0.7}
                        style={[
                          styles.keyButton,
                          key === '✓' && styles.keyButtonConfirm,
                          key === '⌫' && styles.keyButtonDelete,
                        ]}
                      >
                        <Text
                          style={[
                            styles.keyText,
                            key === '⌫' && styles.keyTextDelete,
                          ]}
                        >
                          {key}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </AnimatedView>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentTablet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  branding: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  logoCity: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  formTablet: {
    width: 420,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  formHint: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  userList: {
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  userRole: {
    fontSize: 12,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  backButton: {
    color: Colors.accent,
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '600',
  },
  selectedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedAvatarText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 14,
  },
  selectedUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  selectedUserRole: {
    fontSize: 11,
    marginTop: 2,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pinDotFilled: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '600',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  keyButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keyButtonConfirm: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  keyButtonDelete: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  keyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  keyTextDelete: {
    color: Colors.danger,
  },
});
