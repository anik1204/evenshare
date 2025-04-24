import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ExpenseType } from '@/types/Expense';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

interface RecurringExpenseItemProps {
  expense: ExpenseType;
  onPress: () => void;
}

export default function RecurringExpenseItem({ expense, onPress }: RecurringExpenseItemProps) {
  const isOverdue = expense.nextDueDate && new Date() > expense.nextDueDate;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.title}>{expense.description}</Text>
        </View>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Frequency:</Text>
          <Text style={styles.infoValue}>
            {expense.recurringInterval?.charAt(0).toUpperCase() + 
             expense.recurringInterval?.slice(1)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Next due:</Text>
          <Text style={[
            styles.infoValue,
            isOverdue && styles.overdueText
          ]}>
            {expense.nextDueDate ? format(expense.nextDueDate, 'MMM d, yyyy') : 'N/A'}
          </Text>
        </View>
      </View>

      {isOverdue && (
        <View style={styles.warningContainer}>
          <AlertCircle size={16} color={Colors.error} />
          <Text style={styles.warningText}>Payment overdue</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  overdueText: {
    color: Colors.error,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.error,
    marginLeft: 8,
  },
});