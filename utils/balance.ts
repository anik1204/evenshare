import { ExpenseType, SettlementType } from '@/types/Expense';
import { mockExpenses, mockSettlements } from '@/data/mockData';
import { Database } from '@/types/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  shares: Database['public']['Tables']['expense_shares']['Row'][];
};

export function calculateGroupBalances(expenses: Expense[]) {
  const balances: Record<string, number> = {};
  
  // Calculate from expenses
  expenses.forEach(expense => {
    // Add the full amount to the payer
    if (!balances[expense.paid_by]) balances[expense.paid_by] = 0;
    balances[expense.paid_by] += expense.amount;

    // Subtract each participant's share
    expense.shares.forEach(share => {
      if (!balances[share.user_id]) balances[share.user_id] = 0;
      balances[share.user_id] -= share.amount;
    });
  });

  return balances;
}

export function getSimplifiedDebts(expenses: Expense[]) {
  const balances = calculateGroupBalances(expenses);
  const debts: Array<{ from: string; to: string; amount: number }> = [];

  // Convert balances to a list of users and their balances
  const users = Object.entries(balances)
    .filter(([_, balance]) => balance !== 0)
    .sort((a, b) => a[1] - b[1]); // Sort by balance ascending

  let i = 0; // Index for users who owe money (negative balance)
  let j = users.length - 1; // Index for users who are owed money (positive balance)

  while (i < j) {
    const [debtor, debtorBalance] = users[i];
    const [creditor, creditorBalance] = users[j];

    if (debtorBalance >= 0) {
      i++;
      continue;
    }
    if (creditorBalance <= 0) {
      j--;
      continue;
    }

    const amount = Math.min(Math.abs(debtorBalance), creditorBalance);
    debts.push({
      from: debtor,
      to: creditor,
      amount: amount
    });

    users[i][1] += amount;
    users[j][1] -= amount;

    if (users[i][1] === 0) i++;
    if (users[j][1] === 0) j--;
  }

  return debts;
}

export function formatBalanceText(balance: number): string {
  if (balance > 0) {
    return 'you are owed';
  } else if (balance < 0) {
    return 'you owe';
  }
  return 'you are settled up';
}