import { formatCurrency, formatNumber, formatPercent, formatDate } from './formatters';

describe('formatters', () => {
  it('formats currency values in INR', () => {
    const formatted = formatCurrency(24850000);
    expect(formatted).toBe('₹2,48,50,000');
  });

  it('formats numbers with Indian locale separators', () => {
    expect(formatNumber(12847)).toBe('12,847');
  });

  it('formats percent values', () => {
    expect(formatPercent(3.8)).toBe('3.8%');
  });

  it('formats date strings for India timezone', () => {
    const formatted = formatDate('2025-01-15T10:30:00+05:30');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('Jan');
  });
});
