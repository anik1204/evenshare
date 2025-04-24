import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Clock, Filter } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ExpenseItem from '@/components/ExpenseItem';
import SettlementItem from '@/components/SettlementItem';
import { format } from 'date-fns';
import { useActivity } from '@/hooks/useActivity';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ActivityScreen() {
  const router = useRouter();
  const { activities, loading, error, filter, setFilter } = useActivity();

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'expense') {
      return <ExpenseItem expense={item.data} />;
    } else if (item.type === 'settlement') {
      return <SettlementItem settlement={item.data} />;
    }
    return null;
  };

  const renderSectionHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let headerText;
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      headerText = 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      headerText = 'Yesterday';
    } else {
      headerText = format(date, 'MMMM d, yyyy');
    }
    
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{headerText}</Text>
      </View>
    );
  };

  // Group items by date
  const groupedActivities = activities.reduce((groups, item) => {
    const date = format(item.date, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, any[]>);

  // Convert to array for FlatList
  const sectionsData = Object.keys(groupedActivities).map(date => ({
    date: new Date(date),
    data: groupedActivities[date],
  }));

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading activity</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.replace('/activity')}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text 
            style={[
              styles.filterText, 
              filter === 'all' && styles.activeFilterText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'expenses' && styles.activeFilterTab]}
          onPress={() => setFilter('expenses')}
        >
          <Text 
            style={[
              styles.filterText, 
              filter === 'expenses' && styles.activeFilterText
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'settlements' && styles.activeFilterTab]}
          onPress={() => setFilter('settlements')}
        >
          <Text 
            style={[
              styles.filterText, 
              filter === 'settlements' && styles.activeFilterText
            ]}
          >
            Settlements
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading activity...</Text>
        </View>
      ) : (
        <Animated.View 
          entering={FadeIn}
          style={styles.content}
        >
          <FlatList
            data={sectionsData}
            keyExtractor={(item) => item.date.toISOString()}
            renderItem={({ item }) => (
              <View>
                {renderSectionHeader(item.date)}
                <View style={styles.sectionContent}>
                  {item.data.map(activity => (
                    <View key={activity.id}>
                      {renderItem({ item: activity })}
                    </View>
                  ))}
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Clock size={64} color={Colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>No activity yet</Text>
                <Text style={styles.emptyDescription}>
                  Your recent expenses and settlements will appear here
                </Text>
              </View>
            )}
            contentContainerStyle={activities.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sectionContent: {
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});