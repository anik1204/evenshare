import { format } from 'date-fns';

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Handle negative amounts specially
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  if (isNegative) {
    return '-' + formatter.format(absAmount);
  } else {
    return formatter.format(absAmount);
  }
}

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param text The text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d');
}