/**
 * Date helper utilities for auto-generating Invoice Date (Today),
 * Date of Valuation (Yesterday), and Invoice Number format: SSC[YEAR]/[MONTH]/[SERIAL].
 */

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

/**
 * Returns today's date formatted as DD-MM-YYYY
 */
export function getTodayFormatted(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Returns yesterday's date formatted as DD-MM-YYYY
 */
export function getYesterdayFormatted(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Returns current 4-digit year as string
 */
export function getCurrentYear(): string {
  return String(new Date().getFullYear());
}

/**
 * Returns current month in uppercase string (e.g. "JULY" or "SEPTEMBER")
 */
export function getCurrentMonthUpper(): string {
  return MONTH_NAMES[new Date().getMonth()];
}

/**
 * Generates structured Invoice Number: SSC[YEAR]/[MONTH]/[SERIAL]
 * Example: SSC2026/SEPTEMBER/93
 */
export function generateAutoInvoiceNo(serialNo: string = '93'): string {
  const year = getCurrentYear();
  const month = getCurrentMonthUpper();
  const cleanSerial = serialNo.trim() || '93';
  return `SSC${year}/${month}/${cleanSerial}`;
}
