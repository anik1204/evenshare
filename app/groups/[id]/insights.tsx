import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, TrendingUp, ChartPie as PieChart, Users, Calendar, ArrowUpRight, CircleDollarSign } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockGroups } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { calculateGroupBalances } from '@/utils/balance';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/context/AuthContext';

export default function GroupInsightsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { expenses: groupExpenses } = useExpenses(id as string);
  const { user } = useAuth();
  
  const group = mockGroups.find(g => g.id === id);
  if (!group) return null;

  const balances = calculateGroupBalances(groupExpenses);

  // Calculate total group spending
  const totalGroupSpending = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate spending by member
  const spendingByMember = group.members.reduce((acc, member) => {
    const memberExpenses = groupExpenses.filter(e => e.paid_by === member.id);
    acc[member.id] = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate spending by category
  const spendingByCategory = groupExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly trend
  const monthlySpending = groupExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<number, number>);

  // Get top spender
  const topSpender = Object.entries(spendingByMember)
    .sort(([, a], [, b]) => b - a)[0];
  const topSpenderUser = group.members.find(m => m.id === topSpender?.[0]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{group.name} Insights</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Group Overview</Text>
          <Text style={styles.overviewAmount}>{formatCurrency(totalGroupSpending)}</Text>
          <Text style={styles.overviewDescription}>Total group spending</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>{groupExpenses.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Members</Text>
              <Text style={styles.statValue}>{group.members.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Categories</Text>
              <Text style={styles.statValue}>
                {Object.keys(spendingByCategory).length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsGrid}>
          <View style={[styles.insightCard, { backgroundColor: Colors.primary + '15' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.primary }]}>
              <Users size={24} color={Colors.white} />
            </View>
            <Text style={styles.insightTitle}>Top Spender</Text>
            <Text style={styles.insightValue}>{topSpenderUser?.name}</Text>
            <Text style={styles.insightDescription}>
              {formatCurrency(topSpender?.[1] || 0)}
            </Text>
          </View>

          <View style={[styles.insightCard, { backgroundColor: Colors.complementary + '15' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.complementary }]}>
              <CircleDollarSign size={24} color={Colors.white} />
            </View>
            <Text style={styles.insightTitle}>Average Expense</Text>
            <Text style={styles.insightValue}>
              {formatCurrency(totalGroupSpending / groupExpenses.length)}
            </Text>
            <Text style={styles.insightDescription}>per expense</Text>
          </View>

          <View style={[styles.insightCard, { backgroundColor: Colors.accent + '15' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.accent }]}>
              <TrendingUp size={24} color={Colors.white} />
            </View>
            <Text style={styles.insightTitle}>Monthly Trend</Text>
            <Text style={styles.insightValue}>
              {monthlySpending[new Date().getMonth()] > 
               (monthlySpending[new Date().getMonth() - 1] || 0) 
                ? '↑ Increased' 
                : '↓ Decreased'}
            </Text>
            <Text style={styles.insightDescription}>from last month</Text>
          </View>

          <View style={[styles.insightCard, { backgroundColor: Colors.info + '15' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.info }]}>
              <PieChart size={24} color={Colors.white} />
            </View>
            <Text style={styles.insightTitle}>Top Category</Text>
            <Text style={styles.insightValue}>
              {Object.entries(spendingByCategory)
                .sort(([, a], [, b]) => b - a)[0][0]}
            </Text>
            <Text style={styles.insightDescription}>most expenses</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Contributions</Text>
          {group.members.map(member => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberBalance}>
                  {formatCurrency(balances[member.id] || 0)}
                </Text>
              </View>
              <View style={styles.contributionBar}>
                <View 
                  style={[
                    styles.spendingBar,
                    { 
                      width: `${(spendingByMember[member.id] / totalGroupSpending) * 100}%`,
                      backgroundColor: member.id === user?.id ? Colors.primary : Colors.complementary
                    }
                  ]} 
                />
              </View>
              <Text style={styles.contributionPercentage}>
                {((spendingByMember[member.id] / totalGroupSpending) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(spendingByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(category) }
                  ]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <View style={styles.categoryValues}>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(amount)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {((amount / totalGroupSpending) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
        </View>
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
    textAlign: 'center',
  },
  overviewAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  overviewDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    marginBottom: 16,
  },
  insightCard: {
    width: '50%',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  insightValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  insightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  memberRow: {
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  memberBalance: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  contributionBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  spendingBar: {
    height: '100%',
    borderRadius: 4,
  },
  contributionPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});