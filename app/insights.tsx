import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, TrendingUp, ChartPie as PieChart, Calendar, ArrowUpRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockExpenses, currentUser } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { useMemo } from 'react';
import { isSameMonth } from 'date-fns';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function InsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    totalSpending,
    spendingByCategory,
    monthOverMonthChange,
    topCategory,
    averageExpense
  } = useMemo(() => {
    // Calculate total spending
    const total = mockExpenses.reduce((sum, expense) => {
      const userShare = expense.participants.find(p => p.userId === currentUser.id)?.amount || 0;
      return sum + userShare;
    }, 0);

    // Calculate spending by category
    const byCategory = mockExpenses.reduce((acc, expense) => {
      const userShare = expense.participants.find(p => p.userId === currentUser.id)?.amount || 0;
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + userShare;
      return acc;
    }, {} as Record<string, number>);

    // Calculate month-over-month change
    const currentMonth = new Date();
    const currentMonthTotal = mockExpenses
      .filter(e => isSameMonth(e.date, currentMonth))
      .reduce((sum, e) => {
        const userShare = e.participants.find(p => p.userId === currentUser.id)?.amount || 0;
        return sum + userShare;
      }, 0);

    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const lastMonthTotal = mockExpenses
      .filter(e => isSameMonth(e.date, lastMonth))
      .reduce((sum, e) => {
        const userShare = e.participants.find(p => p.userId === currentUser.id)?.amount || 0;
        return sum + userShare;
      }, 0);

    const change = lastMonthTotal ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    // Get top spending category
    const top = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)[0];

    // Calculate average expense
    const average = total / mockExpenses.length;

    return {
      totalSpending: total,
      spendingByCategory: byCategory,
      monthOverMonthChange: change,
      topCategory: top,
      averageExpense: average
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Insights</Text>
          <TouchableOpacity 
            style={styles.personalButton}
            onPress={() => router.push('/personal-insights')}
          >
            <Text style={styles.personalButtonText}>Personal</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Animated.View 
          entering={FadeIn.delay(200)}
          style={styles.overviewCard}
        >
          <Text style={styles.overviewTitle}>Monthly Overview</Text>
          <Text style={styles.overviewAmount}>{formatCurrency(totalSpending)}</Text>
          <Text style={styles.overviewDescription}>Total spending this month</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TrendingUp size={20} color={Colors.textSecondary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Monthly Change</Text>
                <Text style={[
                  styles.statValue,
                  monthOverMonthChange > 0 ? styles.increaseText : styles.decreaseText
                ]}>
                  {monthOverMonthChange > 0 ? '↑' : '↓'} {Math.abs(monthOverMonthChange).toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <Calendar size={20} color={Colors.textSecondary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(averageExpense)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(spendingByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <TouchableOpacity 
                key={category}
                style={styles.categoryRow}
                onPress={() => router.push(`/insights/${category}`)}
              >
                <View style={styles.categoryInfo}>
                  <View style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(category) }
                  ]} />
                  <View>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryPercentage}>
                      {((amount / totalSpending) * 100).toFixed(1)}% of total
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.amountText}>
                    {formatCurrency(amount)}
                  </Text>
                  <ArrowUpRight size={20} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'food':
      return Colors.categoryFood;
    case 'transport':
      return Colors.categoryTransport;
    case 'utilities':
      return Colors.categoryUtilities;
    case 'entertainment':
      return Colors.categoryEntertainment;
    case 'rent':
      return Colors.categoryRent;
    default:
      return Colors.categoryOther;
  }
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
  personalButton: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  personalButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  overviewAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  overviewDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  increaseText: {
    color: Colors.error,
  },
  decreaseText: {
    color: Colors.success,
  },
  section: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 8,
  },
});