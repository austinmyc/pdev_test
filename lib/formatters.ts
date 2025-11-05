/**
 * Utility functions for formatting numbers and values
 */

/**
 * Format a number as currency
 * @param value - Number to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as percentage
 * @param value - Number to format (as decimal, e.g., 0.05 for 5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number with commas
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse percentage string to decimal
 * @param value - Percentage string (e.g., "5%" or "5")
 * @returns Decimal value (e.g., 0.05)
 */
export function parsePercentage(value: string): number {
  const cleaned = value.replace("%", "").trim();
  return parseFloat(cleaned) / 100;
}

/**
 * Parse currency string to number
 * @param value - Currency string (e.g., "$1,000.00")
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned);
}
