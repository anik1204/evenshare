import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Calendar, Receipt, MessageSquare, Share2, MoveVertical as MoreVertical, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { mockExpenses, mockUsers } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import EmojiReactions from '@/components/EmojiReactions';
import { useState } from 'react';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showActions, setShowActions] = useState(false);

  const expense = mockExpenses.find(e => e.id === id);
  if (!expense) return null;

  const paidByUser = mockUsers.find(u => u.id === expense.paidBy);

  const handleEdit = () => {
    setShowActions(false);
    router.push({
      pathname: '/add-expense',
      params: { id: expense.id }
    });
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete expense logic here
            console.log('Deleting expense:', expense.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowActions(!showActions)}
            >
              <MoreVertical size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showActions && (
        <View style={styles.actionsMenu}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleEdit}
          >
            <Edit2 size={20} color={Colors.textPrimary} />
            <Text style={styles.actionText}>Edit Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionItem, styles.deleteAction]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={Colors.error} />
            <Text style={styles.deleteActionText}>Delete Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <Animated.View 
          entering={FadeIn.delay(200)}
          style={styles.mainCard}
        >
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          <Text style={styles.description}>{expense.description}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Calendar size={20} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {format(expense.date, 'MMM d, yyyy')}
              </Text>
            </View>
            {expense.category && (
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(expense.category) + '20' }]}>
                <Text style={[styles.categoryText, { color: getCategoryColor(expense.category) }]}>
                  {expense.category}
                </Text>
              </View>
            )}
          </View>

          {expense.receipt && (
            <View style={styles.receiptContainer}>
              <View style={styles.receiptHeader}>
                <Receipt size={20} color={Colors.textSecondary} />
                <Text style={styles.receiptTitle}>Receipt</Text>
              </View>
              <Image source={{ uri: expense.receipt }} style={styles.receiptImage} />
            </View>
          )}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Paid by</Text>
          <View style={styles.userContainer}>
            <Image source={{ uri: paidByUser?.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{paidByUser?.name}</Text>
              <Text style={styles.userMeta}>Paid the full amount</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Split Details</Text>
          {expense.participants.map(participant => {
            const user = mockUsers.find(u => u.id === participant.userId);
            if (!user) return null;

            return (
              <View key={user.id} style={styles.splitRow}>
                <View style={styles.userContainer}>
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userMeta}>
                      {((participant.amount / expense.amount) * 100).toFixed(1)}% of total
                    </Text>
                  </View>
                </View>
                <Text style={styles.splitAmount}>
                  {formatCurrency(participant.amount)}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800)}
          style={styles.section}
        >
          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>Comments & Reactions</Text>
            <TouchableOpacity style={styles.addCommentButton}>
              <MessageSquare size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <EmojiReactions 
            reactions={expense.reactions || []}
            onAddReaction={(emoji) => {
              console.log('Add reaction:', emoji);
            }}
          />

          {/* Add comments section here */}
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
  mainCard: {
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
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  receiptContainer: {
    width: '100%',
    marginTop: 24,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  receiptTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  splitAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  actionsMenu: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  deleteAction: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deleteActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 12,
  },
});