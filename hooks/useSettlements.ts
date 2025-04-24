import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

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

export function useSettlements(groupId?: string) {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadSettlements();

    // Subscribe to realtime changes
    const settlementsSubscription = supabase
      .channel('settlements_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'settlements',
      }, () => {
        loadSettlements();
      })
      .subscribe();

    return () => {
      settlementsSubscription.unsubscribe();
    };
  }, [user, groupId]);

  const loadSettlements = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('settlements')
        .select(`
          *,
          from_user:profiles!settlements_from_user_id_fkey(full_name, avatar_url),
          to_user:profiles!settlements_to_user_id_fkey(full_name, avatar_url),
          group:groups(name, currency)
        `)
        .order('created_at', { ascending: false });

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error: settlementsError } = await query;

      if (settlementsError) throw settlementsError;
      setSettlements(data as Settlement[]);
    } catch (err) {
      console.error('Error loading settlements:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSettlement = async (
    fromUserId: string,
    toUserId: string,
    groupId: string,
    amount: number,
    options?: {
      paymentMethod?: string;
      notes?: string;
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          group_id: groupId,
          amount,
          payment_method: options?.paymentMethod,
          notes: options?.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating settlement:', err);
      throw err;
    }
  };

  const updateSettlementStatus = async (
    settlementId: string,
    status: 'completed' | 'cancelled'
  ) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .update({ status })
        .eq('id', settlementId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating settlement status:', err);
      throw err;
    }
  };

  return {
    settlements,
    loading,
    error,
    createSettlement,
    updateSettlementStatus,
    refresh: loadSettlements,
  };
}