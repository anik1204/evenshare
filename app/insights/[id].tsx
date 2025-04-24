import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, TrendingUp, ChartPie as PieChart } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockExpenses } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { format, isSameMonth } from 'date-fns';
import ExpenseItem from '@/components/ExpenseItem';
import { useEffect, useMemo } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function InsightDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Memoize filtered expenses and calculations
  const { categoryExpenses, totalAmount, monthlyTrend, monthOverMonthChange } = useMemo(() => {
    const filteredExpenses = mockExpenses.filter(e => e.category === id);
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Calculate monthly trends
    const trends = filteredExpenses.reduce((acc, expense) => {
      const month = format(expense.date, 'MMM yyyy');
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate month-over-month change
    const currentMonth = new Date();
    const currentMonthTotal = filteredExpenses
      .filter(e => isSameMonth(e.date, currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const lastMonthTotal = filteredExpenses
      .filter(e => isSameMonth(e.date, lastMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    const change = lastMonthTotal ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    return {
      categoryExpenses: filteredExpenses,
      totalAmount: total,
      monthlyTrend: trends,
      monthOverMonthChange: change
    };
  }, [id]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{id} Insights</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Animated.View 
          entering={FadeIn.delay(200)}
          style={styles.overviewCard}
        >
          <Text style={styles.overviewTitle}>Total Spending</Text>
          <Text style={styles.overviewAmount}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.overviewDescription}>
            {categoryExpenses.length} expenses
          </Text>

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
              <PieChart size={20} color={Colors.textSecondary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(totalAmount / categoryExpenses.length)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Monthly Trend</Text>
          {Object.entries(monthlyTrend)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([month, amount], index) => (
              <View key={month} style={styles.trendRow}>
                <Text style={styles.trendMonth}>{month}</Text>
                <View style={styles.trendBarContainer}>
                  <Animated.View 
                    style={[
                      styles.trendBar,
                      { 
                        width: `${(amount / totalAmount) * 100}%`,
                        backgroundColor: getCategoryColor(id as string)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.trendAmount}>{formatCurrency(amount)}</Text>
              </View>
            ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {categoryExpenses
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(expense => (
              <ExpenseItem key={expense.id} expense={expense} />
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
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendMonth: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    width: 100,
  },
  trendBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  trendBar: {
    height: '100%',
    borderRadius: 4,
  },
  trendAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    width: 100,
    textAlign: 'right',
  },
});