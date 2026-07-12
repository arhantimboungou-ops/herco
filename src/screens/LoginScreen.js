import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients } from '../theme/colors';
import { Card, Button } from '../components';
import { DEFAULT_USERS } from '../utils/constants';

const LoginScreen = ({ onLogin }) => {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState('user');
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
      const user = DEFAULT_USERS.find(u => u.id === selectedUser.id && u.pin === newPin);
      if (user) onLogin(user);
      else {
        setError('PIN incorrect');
        setTimeout(() => { setPin(''); setError(''); }, 1000);
      }
    }
  };

  const pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background with a sophisticated gradient/overlay */}
      <View style={styles.bgOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>HERCO</Text>
            <Text style={styles.logoSub}>RESTAURANT & BAR</Text>
          </View>

          <Card style={styles.loginCard}>
            {step === 'user' ? (
              <>
                <Text style={styles.cardTitle}>Connexion</Text>
                <Text style={styles.cardSubtitle}>Sélectionnez votre profil pour continuer</Text>
                
                {DEFAULT_USERS.map(user => (
                  <TouchableOpacity key={user.id} onPress={() => handleUserSelect(user)} style={styles.userItem}>
                    <View style={[styles.userAvatar, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.pinContainer}>
                <TouchableOpacity onPress={() => setStep('user')} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>‹ Retour</Text>
                </TouchableOpacity>
                
                <View style={styles.selectedUser}>
                  <View style={[styles.userAvatarSmall, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={styles.avatarTextSmall}>{selectedUser?.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.selectedUserName}>{selectedUser?.name}</Text>
                </View>

                <View style={styles.pinDots}>
                  {[0,1,2,3].map(i => (
                    <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotFilled]} />
                  ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.keyboard}>
                  {pinKeys.map(key => (
                    <TouchableOpacity key={key} onPress={() => handlePinPress(key)} style={styles.key}>
                      <Text style={[styles.keyText, key === '⌫' && { color: colors.error }]}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E293B' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.8)' },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 42, fontWeight: '900', color: '#FFF', letterSpacing: 4 },
  logoSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 2, marginTop: -4 },
  loginCard: { width: '100%', maxWidth: 400, padding: 32, borderRadius: 24, backgroundColor: '#FFF' },
  cardTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 32 },
  userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  userAvatar: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  userRole: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, marginTop: 2 },
  chevron: { fontSize: 24, color: '#CBD5E1' },
  pinContainer: { width: '100%' },
  backBtn: { marginBottom: 24 },
  backBtnText: { color: colors.primary, fontWeight: '700' },
  selectedUser: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  userAvatarSmall: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTextSmall: { fontSize: 14, fontWeight: '800', color: colors.primary },
  selectedUserName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  pinDots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 },
  pinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#E2E8F0' },
  pinDotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  errorText: { color: colors.error, textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  key: { width: '30%', aspectRatio: 1.2, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#F8FAFC' },
  keyText: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
});

export default LoginScreen;
