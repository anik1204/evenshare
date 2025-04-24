import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePayButtonPress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    router.push('/settlements');
  };

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={[
          styles.balanceAmount, 
          balance >= 0 ? styles.positiveBalance : styles.negativeBalance
        ]}>
          {formatCurrency(balance)}
        </Text>
        
        <View style={[
          styles.infoContainer,
          balance >= 0 ? styles.positiveInfo : styles.negativeInfo
        ]}>
          <Text style={[
            styles.infoText,
            balance >= 0 ? styles.positiveInfoText : styles.negativeInfoText
          ]}>
            {balance >= 0 ? "You're owed money" : "You owe money"}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.actionButton,
          balance < 0 ? styles.negativeActionButton : styles.positiveActionButton
        ]}
        onPress={handlePayButtonPress}
      >
        <ArrowUpRight size={18} color={Colors.white} />
        <Text style={styles.actionButtonText}>
          {balance < 0 ? 'Pay' : 'Settle up'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    margin: 16,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    marginBottom: 12,
  },
  positiveBalance: {
    color: Colors.success,
  },
  negativeBalance: {
    color: Colors.error,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  positiveInfo: {
    backgroundColor: Colors.success + '15',
  },
  negativeInfo: {
    backgroundColor: Colors.error + '15',
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  positiveInfoText: {
    color: Colors.success,
  },
  negativeInfoText: {
    color: Colors.error,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  positiveActionButton: {
    backgroundColor: Colors.success,
  },
  negativeActionButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
});