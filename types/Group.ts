export interface MemberType {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface GroupType {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  created_by: string;
  members: MemberType[];
  created_at: string;
  updated_at: string;
  currency: string;
  category?: 'subscription' | 'roommates' | 'trip' | 'other';
  settings?: {
    defaultSplitMethod: 'equal' | 'percentage' | 'custom';
    autoReminders: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'never';
  };
  savingsGoal?: {
    target: number;
    current: number;
    deadline?: string;
    description?: string;
  };
}