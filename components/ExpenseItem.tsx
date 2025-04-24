import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Database } from '@/types/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  group: {
    name: string;
    currency: string;
  };
  paid_by_user: {
    full_name: string;
    avatar_url: string;
  };
  shares: Database['public']['Tables']['expense_shares']['Row'][];
};

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
}

export default function ExpenseItem({ expense, onPress }: ExpenseItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ 
            uri: expense.paid_by_user.avatar_url || 'https://www.gravatar.com/avatar/default?d=mp'
          }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.amount}>
            {formatCurrency(expense.amount, expense.group.currency)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.metadata}>
            {expense.paid_by_user.full_name} • {formatDate(new Date(expense.date))}
          </Text>
          <Text style={styles.groupName}>{expense.group.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  description: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadata: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  groupName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});