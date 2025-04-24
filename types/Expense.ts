export interface ExpenseType {
  id: string;
  amount: number;
  description: string;
  paid_by: string;
  group_id: string;
  split_method: 'equal' | 'percentage' | 'custom';
  shares: {
    profile_id: string;
    amount: number;
    paid: boolean;
    paid_at?: string;
    reminder_sent?: string;
  }[];
  date: string;
  category?: string;
  receipt_url?: string;
  notes?: string;
  reactions?: {
    profile_id: string;
    emoji: string;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface SettlementType {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  group_id: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ReminderType {
  id: string;
  expenseId: string;
  userId: string;
  message: string;
  date: Date;
  status: 'pending' | 'sent' | 'read';
}