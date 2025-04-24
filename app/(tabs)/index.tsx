import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useGroups } from '@/hooks/useGroups';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseItem from '@/components/ExpenseItem';

export default function HomeScreen() {
  const router = useRouter();
  const { groups, loading: groupsLoading } = useGroups();
  const { expenses, loading: expensesLoading } = useExpenses();

  const recentExpenses = expenses.slice(0, 5); // Show only 5 most recent expenses

  if (groupsLoading || expensesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/groups')}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.groupsContainer}
        >
          <TouchableOpacity 
            style={styles.createGroupCard}
            onPress={() => router.push('/create-group')}
          >
            <View style={styles.createGroupIcon}>
              <Plus size={24} color={Colors.white} />
            </View>
            <Text style={styles.createGroupText}>Create Group</Text>
          </TouchableOpacity>

          {groups.map(group => (
            <TouchableOpacity 
              key={group.id}
              style={styles.groupCard}
              onPress={() => router.push(`/groups/${group.id}`)}
            >
              <View style={styles.groupIconContainer}>
                <Text style={styles.groupIconText}>
                  {group.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMemberCount}>
                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/activity')}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.expensesContainer}>
          {recentExpenses.length > 0 ? (
            recentExpenses.map(expense => (
              <ExpenseItem 
                key={expense.id} 
                expense={expense}
                onPress={() => router.push(`/transaction/${expense.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent expenses</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  groupsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  createGroupCard: {
    width: 120,
    height: 160,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  createGroupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  createGroupText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  groupCard: {
    width: 120,
    height: 160,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.white,
  },
  groupName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  groupMemberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expensesContainer: {
    paddingHorizontal: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});