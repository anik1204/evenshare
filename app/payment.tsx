import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, CreditCard, Ban as Bank, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockUsers } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { from, to, amount } = useLocalSearchParams();
  
  const fromUser = mockUsers.find(u => u.id === from);
  const toUser = mockUsers.find(u => u.id === to);
  const paymentAmount = parseFloat(amount as string);

  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank'>('card');

  const handlePayment = () => {
    // Process payment
    console.log('Processing payment:', {
      from: fromUser?.id,
      to: toUser?.id,
      amount: paymentAmount,
      method: selectedMethod,
    });
    
    router.push('/payment-success');
  };

  if (!fromUser || !toUser) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make Payment</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.usersContainer}>
          <View style={styles.userInfo}>
            <Image source={{ uri: fromUser.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{fromUser.name}</Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={Colors.white} />
          </View>
          
          <View style={styles.userInfo}>
            <Image source={{ uri: toUser.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{toUser.name}</Text>
          </View>
        </View>

        <Text style={styles.amount}>{formatCurrency(paymentAmount)}</Text>

        <View style={styles.methodsContainer}>
          <Text style={styles.methodsTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[
              styles.methodOption,
              selectedMethod === 'card' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <CreditCard 
              size={24} 
              color={selectedMethod === 'card' ? Colors.primary : Colors.textSecondary} 
            />
            <View style={styles.methodInfo}>
              <Text style={[
                styles.methodTitle,
                selectedMethod === 'card' && styles.selectedMethodText
              ]}>Credit Card</Text>
              <Text style={styles.methodSubtitle}>•••• 4242</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.methodOption,
              selectedMethod === 'bank' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('bank')}
          >
            <Bank 
              size={24} 
              color={selectedMethod === 'bank' ? Colors.primary : Colors.textSecondary} 
            />
            <View style={styles.methodInfo}>
              <Text style={[
                styles.methodTitle,
                selectedMethod === 'bank' && styles.selectedMethodText
              ]}>Bank Account</Text>
              <Text style={styles.methodSubtitle}>•••• 1234</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
  },
  methodsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  methodsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  selectedMethod: {
    backgroundColor: Colors.primary + '10',
  },
  methodInfo: {
    marginLeft: 16,
  },
  methodTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  selectedMethodText: {
    color: Colors.primary,
  },
  methodSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});