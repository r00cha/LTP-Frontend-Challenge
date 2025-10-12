/**
 * Converts a "-" separated string to a display-friendly title case string.
 * Example: "beauty-products" -> "Beauty Products"
 */
export function toDisplayName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Currency formatter for Euros (EUR).
 * Format: 12,99€ (symbol after, comma for decimals)
 */
export const formatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});
