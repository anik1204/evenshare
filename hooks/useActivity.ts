import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  group: {
    name: string;
    currency: string;
  };
  paid_by_user: {
    full_name: string;
    avatar_url: string;
  };
};

type Settlement = Database['public']['Tables']['settlements']['Row'] & {
  from_user: {
    full_name: string;
    avatar_url: string;
  };
  to_user: {
    full_name: string;
    avatar_url: string;
  };
  group: {
    name: string;
    currency: string;
  };
};

type ActivityItem = {
  id: string;
  type: 'expense' | 'settlement';
  date: Date;
  data: Expense | Settlement;
};

export function useActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'expenses' | 'settlements'>('all');

  useEffect(() => {
    if (!user) return;
    loadActivity();

    // Subscribe to realtime changes
    const expensesSubscription = supabase
      .channel('expenses_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
      }, () => {
        loadActivity();
      })
      .subscribe();

    const settlementsSubscription = supabase
      .channel('settlements_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'settlements',
      }, () => {
        loadActivity();
      })
      .subscribe();

    return () => {
      expensesSubscription.unsubscribe();
      settlementsSubscription.unsubscribe();
    };
  }, [user, filter]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          *,
          group:groups(name, currency),
          paid_by_user:profiles!expenses_paid_by_fkey(full_name, avatar_url)
        `)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // Load settlements
      const { data: settlements, error: settlementsError } = await supabase
        .from('settlements')
        .select(`
          *,
          from_user:profiles!settlements_from_user_id_fkey(full_name, avatar_url),
          to_user:profiles!settlements_to_user_id_fkey(full_name, avatar_url),
          group:groups(name, currency)
        `)
        .order('created_at', { ascending: false });

      if (settlementsError) throw settlementsError;

      // Combine and sort activities
      let allActivities: ActivityItem[] = [
        ...expenses.map(expense => ({
          id: expense.id,
          type: 'expense' as const,
          date: new Date(expense.date),
          data: expense,
        })),
        ...settlements.map(settlement => ({
          id: settlement.id,
          type: 'settlement' as const,
          date: new Date(settlement.created_at),
          data: settlement,
        })),
      ];

      // Apply filter
      if (filter === 'expenses') {
        allActivities = allActivities.filter(item => item.type === 'expense');
      } else if (filter === 'settlements') {
        allActivities = allActivities.filter(item => item.type === 'settlement');
      }

      // Sort by date
      allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

      setActivities(allActivities);
    } catch (err) {
      console.error('Error loading activity:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    filter,
    setFilter,
    refresh: loadActivity,
  };
}