import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Bell, X, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ReminderType } from '@/types/Expense';
import { mockUsers } from '@/data/mockData';

const mockReminders: ReminderType[] = [
  {
    id: '1',
    expenseId: 'expense-1',
    userId: 'user-2',
    message: "Yo John! Time to pay your share of Netflix 🍿",
    date: new Date(),
    status: 'pending'
  },
  {
    id: '2',
    expenseId: 'expense-2',
    userId: 'user-3',
    message: "Hey Michael! Don't forget about the rent payment 🏠",
    date: new Date(),
    status: 'sent'
  }
];

export default function RemindersScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/reminder-settings')}>
              <Settings size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          ),
          title: 'Reminders',
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <FlatList
        data={mockReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const user = mockUsers.find(u => u.id === item.userId);
          return (
            <View style={styles.reminderItem}>
              <View style={styles.reminderHeader}>
                <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                <View style={styles.reminderContent}>
                  <Text style={styles.message}>{item.message}</Text>
                  <Text style={styles.timestamp}>
                    {item.date.toLocaleDateString()} • {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.sendButton]}
                  onPress={() => {/* Send reminder */}}
                >
                  <Text style={styles.actionButtonText}>Send Reminder</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.dismissButton]}
                  onPress={() => {/* Dismiss reminder */}}
                >
                  <Text style={[styles.actionButtonText, styles.dismissButtonText]}>
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Bell size={64} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No reminders</Text>
            <Text style={styles.emptyDescription}>
              All expenses have been settled up!
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  reminderItem: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: Colors.primary,
  },
  dismissButton: {
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  dismissButtonText: {
    color: Colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
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