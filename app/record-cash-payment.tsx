import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockUsers } from '@/data/mockData';
import GroupSelector from '@/components/GroupSelector';

export default function RecordCashPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPayer, setSelectedPayer] = useState(mockUsers[0]);
  const [selectedReceiver, setSelectedReceiver] = useState(mockUsers[1]);

  const handleSave = () => {
    if (!amount || !description) return;

    const payment = {
      amount: parseFloat(amount),
      description,
      payer: selectedPayer.id,
      receiver: selectedReceiver.id,
      date: new Date(),
      type: 'cash',
    };

    console.log('Recording cash payment:', payment);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Record Cash Payment</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.amountContainer}>
          <DollarSign size={24} color={Colors.textPrimary} />
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="What's this payment for?"
          placeholderTextColor={Colors.textTertiary}
        />

        <View style={styles.userSelector}>
          <Text style={styles.label}>Paid by</Text>
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => {/* Show user selector */}}
          >
            <Text style={styles.userName}>{selectedPayer.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userSelector}>
          <Text style={styles.label}>Paid to</Text>
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => {/* Show user selector */}}
          >
            <Text style={styles.userName}>{selectedReceiver.name}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!amount || !description) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!amount || !description}
        >
          <Text style={styles.saveButtonText}>Record Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  form: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  descriptionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userSelector: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  userButton: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});