import { GroupType } from '@/types/Group';
import { ExpenseType, SettlementType } from '@/types/Expense';

// Mock user data
export const mockUsers = [
  {
    id: 'user-1',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    avatar_url: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    full_name: 'John Smith',
    email: 'john@example.com',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-3',
    full_name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-4',
    full_name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Mock groups
export const mockGroups: GroupType[] = [
  {
    id: 'group-1',
    name: 'Apartment 4B',
    image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Shared expenses for our apartment',
    created_by: 'user-1',
    members: mockUsers,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
    currency: 'USD',
  },
  {
    id: 'group-2',
    name: 'Summer Trip 2023',
    image_url: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Our amazing summer vacation',
    created_by: 'user-2',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    created_at: '2023-05-20T00:00:00Z',
    updated_at: '2023-05-20T00:00:00Z',
    currency: 'EUR',
  },
  {
    id: 'group-3',
    name: 'Friday Dinner Club',
    image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Weekly dinner expenses',
    created_by: 'user-1',
    members: [mockUsers[0], mockUsers[3]],
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z',
    currency: 'USD',
  },
];

// Mock expenses
export const mockExpenses: ExpenseType[] = [
  {
    id: 'expense-1',
    amount: 120.50,
    description: 'Groceries',
    paid_by: 'user-1',
    group_id: 'group-1',
    split_method: 'equal',
    shares: [
      { profile_id: 'user-1', amount: 30.13, paid: false },
      { profile_id: 'user-2', amount: 30.13, paid: false },
      { profile_id: 'user-3', amount: 30.13, paid: false },
      { profile_id: 'user-4', amount: 30.11, paid: false }
    ],
    date: '2023-09-15T00:00:00Z',
    category: 'Food',
    created_at: '2023-09-15T00:00:00Z',
    updated_at: '2023-09-15T00:00:00Z'
  },
  {
    id: 'expense-2',
    amount: 75.00,
    description: 'Dinner at Italian Restaurant',
    paid_by: 'user-2',
    group_id: 'group-3',
    split_method: 'equal',
    shares: [
      { profile_id: 'user-1', amount: 37.50, paid: false },
      { profile_id: 'user-4', amount: 37.50, paid: false }
    ],
    date: '2023-09-10T00:00:00Z',
    category: 'Food',
    created_at: '2023-09-10T00:00:00Z',
    updated_at: '2023-09-10T00:00:00Z'
  },
  {
    id: 'expense-3',
    amount: 350.00,
    description: 'Hotel booking',
    paid_by: 'user-1',
    group_id: 'group-2',
    split_method: 'equal',
    shares: [
      { profile_id: 'user-1', amount: 116.67, paid: false },
      { profile_id: 'user-2', amount: 116.67, paid: false },
      { profile_id: 'user-3', amount: 116.66, paid: false }
    ],
    date: '2023-08-05T00:00:00Z',
    category: 'Travel',
    created_at: '2023-08-05T00:00:00Z',
    updated_at: '2023-08-05T00:00:00Z'
  },
  {
    id: 'expense-4',
    amount: 200.00,
    description: 'Electricity bill',
    paid_by: 'user-3',
    group_id: 'group-1',
    split_method: 'equal',
    shares: [
      { profile_id: 'user-1', amount: 50.00, paid: false },
      { profile_id: 'user-2', amount: 50.00, paid: false },
      { profile_id: 'user-3', amount: 50.00, paid: false },
      { profile_id: 'user-4', amount: 50.00, paid: false }
    ],
    date: '2023-09-01T00:00:00Z',
    category: 'Utilities',
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2023-09-01T00:00:00Z'
  }
];

// Mock settlements
export const mockSettlements: SettlementType[] = [
  {
    id: 'settlement-1',
    from_user_id: 'user-2',
    to_user_id: 'user-1',
    amount: 100.00,
    group_id: 'group-1',
    date: '2023-09-20T00:00:00Z',
    status: 'completed',
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z'
  },
  {
    id: 'settlement-2',
    from_user_id: 'user-3',
    to_user_id: 'user-1',
    amount: 75.50,
    group_id: 'group-2',
    date: '2023-09-18T00:00:00Z',
    status: 'pending',
    created_at: '2023-09-18T00:00:00Z',
    updated_at: '2023-09-18T00:00:00Z'
  }
];

// Calculate balances
export const calculateBalances = () => {
  const balances: { [userId: string]: number } = {};

  // Initialize balances for all users
  mockUsers.forEach(user => {
    balances[user.id] = 0;
  });

  // Calculate from expenses
  mockExpenses.forEach(expense => {
    // Add the full amount to the payer
    balances[expense.paid_by] += expense.amount;

    // Subtract each participant's share
    expense.shares.forEach(share => {
      balances[share.profile_id] -= share.amount;
    });
  });

  // Apply settlements
  mockSettlements.forEach(settlement => {
    if (settlement.status === 'completed') {
      balances[settlement.from_user_id] += settlement.amount;
      balances[settlement.to_user_id] -= settlement.amount;
    }
  });

  return balances;
};

// Get recent activity
export const getRecentActivity = () => {
  const allActivities = [
    ...mockExpenses.map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      data: expense,
      date: expense.date,
    })),
    ...mockSettlements.map(settlement => ({
      id: settlement.id,
      type: 'settlement' as const,
      data: settlement,
      date: settlement.date,
    })),
  ];

  // Sort by date, most recent first
  return allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
};