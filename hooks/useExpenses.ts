import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

type Expense = Database['public']['Tables']['expenses']['Row'];
type ExpenseShare = Database['public']['Tables']['expense_shares']['Row'];
type ExpenseReaction = Database['public']['Tables']['expense_reactions']['Row'];

interface ExpenseWithDetails extends Expense {
  shares: ExpenseShare[];
  reactions: ExpenseReaction[];
  group: {
    name: string;
    currency: string;
  };
  paid_by_user: {
    full_name: string;
    avatar_url: string;
  };
}

export function useExpenses(groupId?: string) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadExpenses();

    // Subscribe to realtime changes
    const expensesSubscription = supabase
      .channel('expenses_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
      }, () => {
        loadExpenses();
      })
      .subscribe();

    return () => {
      expensesSubscription.unsubscribe();
    };
  }, [user, groupId]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('expenses')
        .select(`
          *,
          shares:expense_shares(*),
          reactions:expense_reactions(*),
          group:groups(name, currency),
          paid_by_user:profiles!expenses_paid_by_fkey(full_name, avatar_url)
        `)
        .order('date', { ascending: false });

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error: expensesError } = await query;

      if (expensesError) throw expensesError;
      setExpenses(data as ExpenseWithDetails[]);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (
    description: string,
    amount: number,
    groupId: string,
    shares: { userId: string; amount: number }[],
    options?: {
      category?: string;
      date?: Date;
      splitMethod?: string;
      receiptUrl?: string;
    }
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          description,
          amount,
          group_id: groupId,
          paid_by: user.id,
          category: options?.category,
          date: options?.date?.toISOString(),
          split_method: options?.splitMethod || 'equal',
          receipt_url: options?.receiptUrl,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Insert shares
      const { error: sharesError } = await supabase
        .from('expense_shares')
        .insert(
          shares.map(share => ({
            expense_id: expense.id,
            user_id: share.userId,
            amount: share.amount,
          }))
        );

      if (sharesError) throw sharesError;

      return expense;
    } catch (err) {
      console.error('Error creating expense:', err);
      throw err;
    }
  };

  const updateExpense = async (
    expenseId: string,
    updates: Partial<Database['public']['Tables']['expenses']['Update']>,
    shares?: { userId: string; amount: number }[]
  ) => {
    try {
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', expenseId)
        .select()
        .single();

      if (expenseError) throw expenseError;

      if (shares) {
        // Delete existing shares
        const { error: deleteError } = await supabase
          .from('expense_shares')
          .delete()
          .eq('expense_id', expenseId);

        if (deleteError) throw deleteError;

        // Insert new shares
        const { error: sharesError } = await supabase
          .from('expense_shares')
          .insert(
            shares.map(share => ({
              expense_id: expenseId,
              user_id: share.userId,
              amount: share.amount,
            }))
          );

        if (sharesError) throw sharesError;
      }

      return expense;
    } catch (err) {
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  };

  const addReaction = async (expenseId: string, emoji: string) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('expense_reactions')
        .insert({
          expense_id: expenseId,
          user_id: user.id,
          emoji,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding reaction:', err);
      throw err;
    }
  };

  const removeReaction = async (reactionId: string) => {
    try {
      const { error } = await supabase
        .from('expense_reactions')
        .delete()
        .eq('id', reactionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error removing reaction:', err);
      throw err;
    }
  };

  const markShareAsPaid = async (expenseId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expense_shares')
        .update({
          paid: true,
          paid_at: new Date().toISOString(),
        })
        .eq('expense_id', expenseId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error marking share as paid:', err);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    addReaction,
    removeReaction,
    markShareAsPaid,
    refresh: loadExpenses,
  };
}