import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { GroupType } from '@/types/Group';
import { formatCurrency } from '@/utils/formatters';

interface GroupCardProps {
  group: GroupType;
  balance: number;
  onPress: () => void;
}

export default function GroupCard({ group, balance, onPress }: GroupCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Image source={{ uri: group.image }} style={styles.image} />
        <View style={styles.headerContent}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.memberCount}>
            {group.members.length} members
          </Text>
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={[
          styles.balance,
          balance >= 0 ? styles.positiveBalance : styles.negativeBalance
        ]}>
          {formatCurrency(Math.abs(balance))}
        </Text>
        <Text style={styles.balanceLabel}>
          {balance >= 0 ? 'you are owed' : 'you owe'}
        </Text>
      </View>

      <View style={styles.memberAvatars}>
        {group.members.slice(0, 3).map((member, index) => (
          <Image
            key={member.id}
            source={{ uri: member.avatar }}
            style={[
              styles.memberAvatar,
              { marginLeft: index > 0 ? -12 : 0 }
            ]}
          />
        ))}
        {group.members.length > 3 && (
          <View style={styles.remainingMembers}>
            <Text style={styles.remainingMembersText}>
              +{group.members.length - 3}
            </Text>
          </View>
        )}
      </View>
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
    marginBottom: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  memberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balance: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  positiveBalance: {
    color: Colors.success,
  },
  negativeBalance: {
    color: Colors.error,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  remainingMembers: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  remainingMembersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});