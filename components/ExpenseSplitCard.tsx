import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { SquareDivide as DivideSquare } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MemberType } from '@/types/Group';
import { formatCurrency } from '@/utils/formatters';
import { SplitMethod } from './SplitMethodSelector';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface ExpenseSplitCardProps {
  members: MemberType[];
  amounts: Record<string, number>;
  onUpdateSplit: (userId: string, value: number) => void;
  splitMethod: SplitMethod;
  totalAmount: number;
}

export default function ExpenseSplitCard({
  members,
  amounts,
  onUpdateSplit,
  splitMethod,
  totalAmount,
}: ExpenseSplitCardProps) {
  const getInputValue = (userId: string, method: SplitMethod) => {
    const amount = amounts[userId] || 0;
    switch (method) {
      case 'percentage':
        return ((amount / totalAmount) * 100).toFixed(1);
      case 'shares':
        const totalShares = Object.values(amounts).reduce((sum, a) => sum + a, 0);
        return totalShares > 0 ? (amount / (totalAmount / totalShares)).toFixed(1) : '0';
      case 'unequal':
        return amount.toFixed(2);
      default:
        return amount.toFixed(2);
    }
  };

  const handleInputChange = (userId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    switch (splitMethod) {
      case 'percentage':
        onUpdateSplit(userId, (totalAmount * numValue) / 100);
        break;
      case 'shares':
        const totalShares = Object.values(amounts).reduce((sum, a) => sum + a, 0);
        onUpdateSplit(userId, (totalAmount * numValue) / totalShares);
        break;
      case 'unequal':
        onUpdateSplit(userId, numValue);
        break;
    }
  };

  const getInputLabel = (method: SplitMethod) => {
    switch (method) {
      case 'percentage':
        return '%';
      case 'shares':
        return 'shares';
      case 'unequal':
        return formatCurrency(totalAmount);
      default:
        return '';
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn}
      layout={Layout.springify()}
    >
      <View style={styles.header}>
        <DivideSquare size={20} color={Colors.textSecondary} />
        <Text style={styles.title}>Split Details</Text>
      </View>

      {members.map(member => (
        <Animated.View 
          key={member.id} 
          style={styles.memberRow}
          layout={Layout.springify()}
        >
          <View style={styles.memberInfo}>
            <Image source={{ uri: member.avatar }} style={styles.avatar} />
            <Text style={styles.memberName}>{member.name}</Text>
          </View>

          <View style={styles.amountContainer}>
            {splitMethod === 'equal' ? (
              <Text style={styles.amount}>
                {formatCurrency(amounts[member.id] || 0)}
              </Text>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={getInputValue(member.id, splitMethod)}
                    onChangeText={(value) => handleInputChange(member.id, value)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                  <Text style={styles.inputLabel}>
                    {getInputLabel(splitMethod)}
                  </Text>
                </View>
                <Text style={styles.amountLabel}>
                  {formatCurrency(amounts[member.id] || 0)}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={[
          styles.totalAmount,
          Math.abs(Object.values(amounts).reduce((sum, a) => sum + a, 0) - totalAmount) > 0.01 && 
          styles.totalAmountError
        ]}>
          {formatCurrency(Object.values(amounts).reduce((sum, a) => sum + a, 0))}
        </Text>
      </View>
    </Animated.View>
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
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  memberName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    minWidth: 60,
    textAlign: 'right',
    padding: 0,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  amountLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  totalAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  totalAmountError: {
    color: Colors.error,
  },
});