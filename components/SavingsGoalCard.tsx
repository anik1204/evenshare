import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PiggyBank, Target } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';

interface SavingsGoalProps {
  target: number;
  current: number;
  description: string;
  deadline?: Date;
  onPress: () => void;
}

export default function SavingsGoalCard({ 
  target, 
  current, 
  description, 
  deadline,
  onPress 
}: SavingsGoalProps) {
  const progress = (current / target) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <PiggyBank size={24} color={Colors.primary} />
          <Text style={styles.title}>{description}</Text>
        </View>
        <Target size={20} color={Colors.textSecondary} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.currentAmount}>
            {formatCurrency(current)}
          </Text>
          <Text style={styles.targetAmount}>
            {formatCurrency(target)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {progress.toFixed(1)}% complete
        </Text>
        {deadline && (
          <Text style={styles.deadline}>
            Due by {deadline.toLocaleDateString()}
          </Text>
        )}
      </View>
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
    marginBottom: 16,
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
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  targetAmount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  deadline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});