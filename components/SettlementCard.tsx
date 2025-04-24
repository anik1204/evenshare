import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SettlementType } from '@/types/Expense';
import { MemberType } from '@/types/Group';
import { formatCurrency } from '@/utils/formatters';

interface SettlementCardProps {
  settlement: SettlementType;
  fromUser: MemberType;
  toUser: MemberType;
  onPress: () => void;
}

export default function SettlementCard({ 
  settlement, 
  fromUser, 
  toUser, 
  onPress 
}: SettlementCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.userContainer}>
          <Image source={{ uri: fromUser.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{fromUser.name}</Text>
        </View>
        
        <View style={styles.arrowContainer}>
          <ArrowRight size={20} color={Colors.white} />
        </View>
        
        <View style={styles.userContainer}>
          <Image source={{ uri: toUser.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{toUser.name}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.amount}>
          {formatCurrency(settlement.amount)}
        </Text>
        <View style={[
          styles.statusBadge,
          settlement.status === 'completed' ? styles.completedBadge :
          settlement.status === 'pending' ? styles.pendingBadge :
          styles.cancelledBadge
        ]}>
          <Text style={[
            styles.statusText,
            settlement.status === 'completed' ? styles.completedText :
            settlement.status === 'pending' ? styles.pendingText :
            styles.cancelledText
          ]}>
            {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.date}>
        {settlement.date.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userContainer: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedBadge: {
    backgroundColor: Colors.success + '20',
  },
  pendingBadge: {
    backgroundColor: Colors.warning + '20',
  },
  cancelledBadge: {
    backgroundColor: Colors.error + '20',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  completedText: {
    color: Colors.success,
  },
  pendingText: {
    color: Colors.warning,
  },
  cancelledText: {
    color: Colors.error,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});