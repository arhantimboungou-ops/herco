import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Card, Button, Input } from '../components';
import { DEFAULT_USERS, INITIAL_SITES } from '../utils/constants';

const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState('site'); // 'site', 'user', 'pin'
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [superAdminCode, setSuperAdminCode] = useState('');

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    setStep('user');
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setStep('pin');
    setPin('');
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
      const user = DEFAULT_USERS.find(u => 
        u.siteId === selectedSite.id && 
        u.pin === newPin && 
        u.name === selectedUser.name
      );
      if (user) onLogin(user);
      else {
        setError('PIN incorrect');
        setTimeout(() => { setPin(''); setError(''); }, 1000);
      }
    }
  };

  const handleSuperAdminAccess = () => {
    if (superAdminCode === '8888') {
      const sa = DEFAULT_USERS.find(u => u.role === 'superadmin');
      onLogin(sa);
    } else {
      setError('Code SuperAdmin invalide');
      setSuperAdminCode('');
    }
  };

  const filteredUsers = DEFAULT_USERS.filter(u => u.siteId === selectedSite?.id);
  const pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.bgOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>HERCO</Text>
            <Text style={styles.logoSub}>GESTION MULTI-SITES</Text>
          </View>

          <Card style={styles.loginCard}>
            {step === 'site' ? (
              <>
                <Text style={styles.cardTitle}>Bienvenue</Text>
                <Text style={styles.cardSubtitle}>Sélectionnez votre établissement</Text>
                
                {INITIAL_SITES.map(site => (
                  <TouchableOpacity key={site.id} onPress={() => handleSiteSelect(site)} style={styles.itemRow}>
                    <View style={styles.iconBox}><Text style={{fontSize: 20}}>🏢</Text></View>
                    <View style={{flex: 1}}>
                      <Text style={styles.itemName}>{site.name}</Text>
                      <Text style={styles.itemSub}>{site.type}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.superAdminDivider}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>ACCÈS PROPRIÉTAIRE</Text>
                  <View style={styles.line} />
                </View>

                <Input 
                  placeholder="Code SuperAdmin" 
                  value={superAdminCode} 
                  onChangeText={setSuperAdminCode}
                  secureTextEntry
                  keyboardType="numeric"
                />
                <Button label="Accéder au Panel" variant="secondary" onPress={handleSuperAdminAccess} style={{marginTop: 8}} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </>
            ) : step === 'user' ? (
              <>
                <TouchableOpacity onPress={() => setStep('site')} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>‹ Changer d'établissement</Text>
                </TouchableOpacity>
                <Text style={styles.cardTitle}>{selectedSite.name}</Text>
                <Text style={styles.cardSubtitle}>Qui se connecte ?</Text>
                
                {filteredUsers.map(user => (
                  <TouchableOpacity key={user.id} onPress={() => handleUserSelect(user)} style={styles.itemRow}>
                    <View style={[styles.iconBox, {backgroundColor: colors.primary + '15'}]}>
                      <Text style={[styles.avatarText, {color: colors.primary}]}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.itemName}>{user.name}</Text>
                      <Text style={styles.itemSub}>{user.role.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.pinContainer}>
                <TouchableOpacity onPress={() => setStep('user')} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>‹ Retour aux profils</Text>
                </TouchableOpacity>
                
                <View style={styles.selectedHeader}>
                  <Text style={styles.selectedSiteName}>{selectedSite.name}</Text>
                  <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
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
  container: { flex: 1, backgroundColor: '#0F172A' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.7)' },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 4 },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: 2, marginTop: -2 },
  loginCard: { width: '100%', maxWidth: 420, padding: 32, borderRadius: 28, backgroundColor: '#FFF' },
  cardTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  itemName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  itemSub: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, marginTop: 2 },
  avatarText: { fontSize: 18, fontWeight: '800' },
  chevron: { fontSize: 22, color: '#CBD5E1' },
  superAdminDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 10, fontWeight: '800', color: colors.textTertiary, marginHorizontal: 12 },
  errorText: { color: colors.error, fontSize: 12, textAlign: 'center', marginTop: 8, fontWeight: '600' },
  backBtn: { marginBottom: 20 },
  backBtnText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  pinContainer: { width: '100%' },
  selectedHeader: { alignItems: 'center', marginBottom: 24 },
  selectedSiteName: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  selectedUserName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  pinDots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  pinDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#E2E8F0' },
  pinDotFilled: { backgroundColor: colors.primary, borderColor: colors.primary },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  key: { width: '30%', aspectRatio: 1.3, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#F8FAFC' },
  keyText: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
});

export default LoginScreen;
