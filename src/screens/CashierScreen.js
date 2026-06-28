import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Button, Card, Input } from '../components';
import { formatFCFA, PAYMENT_METHODS, TAX_RATE } from '../utils/constants';

const CashierScreen = ({ user, orderData, onBack, onLogout }) => {
  const { width } = useWindowDimensions();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isTablet = width >= 600;

  // Calculer les totaux
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.priceTTC * item.quantity,
    0
  );
  const taxAmount = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxAmount;

  // Calculer le change
  const received = parseInt(receivedAmount) || 0;
  const change = received - total;

  const handleCompletePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner un mode de paiement');
      return;
    }

    if (selectedPaymentMethod === 'cash' && received < total) {
      Alert.alert('Erreur', 'Le montant reçu est insuffisant');
      return;
    }

    setIsProcessing(true);

    // Simuler le traitement du paiement
    setTimeout(() => {
      Alert.alert(
        'Succès',
        `Paiement de ${formatFCFA(total)} complété via ${
          PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsProcessing(false);
              onBack();
            },
          },
        ]
      );
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    mainContent: {
      flex: 1,
      flexDirection: isTablet ? 'row' : 'column',
    },
    leftPanel: {
      flex: isTablet ? 1 : 0,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderRightWidth: isTablet ? 1 : 0,
      borderRightColor: theme.colors.border,
    },
    rightPanel: {
      flex: isTablet ? 1 : 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.lg,
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    orderItemName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    orderItemQty: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    orderItemPrice: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      textAlign: 'right',
    },
    totalSection: {
      marginTopHorizontal: theme.spacing.lg,
      paddingTopHorizontal: theme.spacing.lg,
      borderTopWidth: 2,
      borderTopColor: theme.colors.border,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottomVertical: theme.spacing.md,
    },
    totalLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    totalValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    grandTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    grandTotalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    grandTotalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    paymentMethodsContainer: {
      gap: theme.spacing.md,
      marginBottomVertical: theme.spacing.lg,
    },
    paymentMethodButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    paymentMethodButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: 'rgba(30, 64, 175, 0.05)',
    },
    paymentMethodIcon: {
      fontSize: 28,
    },
    paymentMethodName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    paymentMethodDesc: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    cashInputContainer: {
      marginTopVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottomVertical: theme.spacing.sm,
    },
    changeDisplay: {
      marginTopVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderLeftWidth: 4,
      borderLeftColor: change >= 0 ? theme.colors.success : theme.colors.error,
    },
    changeLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    changeValue: {
      fontSize: 16,
      fontWeight: '700',
      color: change >= 0 ? theme.colors.success : theme.colors.error,
      marginTopVertical: theme.spacing.sm,
    },
    actionButtons: {
      gap: theme.spacing.md,
      marginTopVertical: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Caisse</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.lg }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '600' }}>
              ← Retour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={{ color: theme.colors.error, fontSize: 13, fontWeight: '600' }}>
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Left Panel - Order Summary */}
        <ScrollView style={styles.leftPanel} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Résumé de la Commande</Text>

          {orderData.items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQty}>Quantité: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatFCFA(item.priceTTC * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>{formatFCFA(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (18%)</Text>
              <Text style={styles.totalValue}>{formatFCFA(taxAmount)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatFCFA(total)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Right Panel - Payment */}
        <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Mode de Paiement</Text>

          <View style={styles.paymentMethodsContainer}>
            {PAYMENT_METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPaymentMethod(method.id)}
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === method.id && styles.paymentMethodButtonActive,
                ]}
              >
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <Text style={styles.paymentMethodDesc}>
                  {method.id === 'cash'
                    ? 'Paiement en espèces'
                    : method.id === 'card'
                    ? 'Carte bancaire'
                    : 'Mobile Money'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedPaymentMethod === 'cash' && (
            <View style={styles.cashInputContainer}>
              <Text style={styles.inputLabel}>Montant Reçu (FCFA)</Text>
              <Input
                placeholder="Entrez le montant reçu"
                value={receivedAmount}
                onChangeText={setReceivedAmount}
                keyboardType="numeric"
              />

              {receivedAmount && (
                <View style={styles.changeDisplay}>
                  <Text style={styles.changeLabel}>Monnaie à rendre</Text>
                  <Text style={styles.changeValue}>
                    {change >= 0 ? '+' : ''} {formatFCFA(change)}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.actionButtons}>
            <Button
              label={`Valider le Paiement (${formatFCFA(total)})`}
              variant="primary"
              size="lg"
              onPress={handleCompletePayment}
              disabled={isProcessing}
            />
            <Button
              label="Annuler"
              variant="secondary"
              size="md"
              onPress={onBack}
              disabled={isProcessing}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CashierScreen;
