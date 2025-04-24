import { ExpenseType, ReminderType } from '@/types/Expense';
import { MemberType } from '@/types/Group';

const reminderTemplates = {
  friendly: [
    "Yo {name}, time to pay your share of {expense} 🍿",
    "Hey {name}! Don't forget about the {expense} payment 💫",
    "Quick reminder about {expense}, {name}! 🌟",
    "Your share of {expense} is waiting, {name}! 🎯"
  ],
  subscription: [
    "Time to chip in for {expense}! 📺",
    "{expense} payment due soon! 🎬",
    "Don't miss out on {expense}! 🎮"
  ],
  rent: [
    "Rent time! Your share of {expense} is due 🏠",
    "Home sweet home! Time for {expense} 🔑",
    "Monthly {expense} reminder! 🏢"
  ]
};

export function generateReminderMessage(
  expense: ExpenseType,
  member: MemberType
): string {
  const templates = expense.category?.toLowerCase().includes('subscription')
    ? reminderTemplates.subscription
    : expense.category?.toLowerCase().includes('rent')
    ? reminderTemplates.rent
    : reminderTemplates.friendly;

  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template
    .replace('{name}', member.name.split(' ')[0])
    .replace('{expense}', expense.description);
}

export function shouldSendReminder(
  expense: ExpenseType,
  participant: ExpenseType['participants'][0]
): boolean {
  if (participant.paid) return false;
  
  const lastReminder = participant.reminderSent;
  if (!lastReminder) return true;
  
  const now = new Date();
  const daysSinceLastReminder = Math.floor(
    (now.getTime() - lastReminder.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastReminder >= 3; // Send reminder every 3 days
}

export function createReminder(
  expense: ExpenseType,
  member: MemberType
): ReminderType {
  return {
    id: Math.random().toString(36).substr(2, 9),
    expenseId: expense.id,
    userId: member.id,
    message: generateReminderMessage(expense, member),
    date: new Date(),
    status: 'pending'
  };
}