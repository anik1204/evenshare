import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SettlementType } from '@/types/Expense';
import { mockGroups, mockUsers } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

interface SettlementItemProps {
  settlement: SettlementType;
}

export default function SettlementItem({ settlement }: SettlementItemProps) {
  const router = useRouter();
  
  const group = mockGroups.find(g => g.id === settlement.groupId);
  const fromUser = mockUsers.find(u => u.id === settlement.fromUserId);
  const toUser = mockUsers.find(u => u.id === settlement.toUserId);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/settlements/${settlement.id}`)}
    >
      <View style={styles.userImages}>
        <Image source={{ uri: fromUser?.avatar }} style={styles.userAvatar} />
        <View style={styles.arrowContainer}>
          <ArrowRight size={16} color={Colors.white} />
        </View>
        <Image source={{ uri: toUser?.avatar }} style={styles.userAvatar} />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>
          {fromUser?.name} paid {toUser?.name}
        </Text>
        <Text style={styles.secondaryText}>
          {group?.name} • {format(settlement.date, 'MMM d')}
        </Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(settlement.amount)}</Text>
        <View 
          style={[
            styles.statusBadge,
            settlement.status === 'completed' ? styles.completedBadge :
            settlement.status === 'pending' ? styles.pendingBadge :
            styles.cancelledBadge
          ]}
        >
          <Text 
            style={[
              styles.statusText,
              settlement.status === 'completed' ? styles.completedText :
              settlement.status === 'pending' ? styles.pendingText :
              styles.cancelledText
            ]}
          >
            {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.settlement,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  secondaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: Colors.success + '20', // 20% opacity
  },
  pendingBadge: {
    backgroundColor: Colors.warning + '20',
  },
  cancelledBadge: {
    backgroundColor: Colors.error + '20',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
});