import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { mockGroups, mockUsers, currentUser } from '@/data/mockData';
import { getSimplifiedDebts } from '@/utils/balance';
import SettlementCard from '@/components/SettlementCard';

export default function SettleUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Calculate who needs to pay whom
  const debts = getSimplifiedDebts(mockGroups[0].id);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settle Up</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Settlements</Text>
          <Text style={styles.sectionDescription}>
            Here's the simplest way to settle all debts
          </Text>

          {debts.map((debt, index) => {
            const fromUser = mockUsers.find(u => u.id === debt.from);
            const toUser = mockUsers.find(u => u.id === debt.to);
            
            if (!fromUser || !toUser) return null;

            return (
              <TouchableOpacity 
                key={index}
                style={styles.settlementCard}
                onPress={() => {
                  // Handle settlement
                  router.push({
                    pathname: '/payment',
                    params: {
                      from: debt.from,
                      to: debt.to,
                      amount: debt.amount,
                    }
                  });
                }}
              >
                <View style={styles.settlementUsers}>
                  <Text style={styles.userName}>{fromUser.name}</Text>
                  <View style={styles.arrowContainer}>
                    <ArrowRight size={16} color={Colors.white} />
                  </View>
                  <Text style={styles.userName}>{toUser.name}</Text>
                </View>
                <Text style={styles.amount}>
                  ${debt.amount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Options</Text>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push('/record-cash-payment')}
          >
            <Text style={styles.optionButtonText}>Record cash payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  settlementCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settlementUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  arrowContainer: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: Colors.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});