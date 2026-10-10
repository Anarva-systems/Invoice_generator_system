/**
 * Formats a number according to the Indian numbering system.
 * Example: 54595000 -> "5,45,95,000"
 */
export function formatIndianNumber(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '0';
  const str = val.toString().trim();
  const num = parseFloat(str.replace(/,/g, ''));
  if (isNaN(num)) return str;

  const isNegative = num < 0;
  const parts = Math.abs(num).toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? '.' + parts[1] : '';

  if (integerPart.length <= 3) {
    return (isNegative ? '-' : '') + integerPart + decimalPart;
  }

  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + formattedOther + ',' + lastThree + decimalPart;
}

/**
 * Formats Rupee currency with symbol: e.g. "₹ 33,91,724.00"
 */
export function formatRupeeAmount(val: number | string, includeDecimals: boolean = true): string {
  if (val === '' || val === null || val === undefined) return '₹ 0.00';
  const str = val.toString().replace(/,/g, '').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return `₹ ${val}`;
  
  const formatted = formatIndianNumber(Math.round(num));
  return includeDecimals ? `₹ ${formatted}.00` : `₹ ${formatted}`;
}

/**
 * Formats Completion of Property value: e.g. "Rs. 5,45,95,000/-"
 */
export function formatPropertyValue(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const formatted = formatIndianNumber(val);
  return `Rs. ${formatted}/-`;
}

/**
 * Formats Service Charge value: e.g. "Rs. 7500/-"
 */
export function formatServiceCharge(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const str = val.toString().replace(/,/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return `Rs. ${val}/-`;
  return `Rs. ${num}/-`;
}

/**
 * Formats GST Amount: e.g. "1350/-"
 */
export function formatGstAmount(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const str = val.toString().replace(/,/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return `${val}/-`;
  return `${num}/-`;
}

/**
 * Formats Total Amount in data row: e.g. "8850/-"
 */
export function formatTotalAmount(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const str = val.toString().replace(/,/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return `${val}/-`;
  return `${num}/-`;
}

/**
 * Formats Total Amount in summary row: e.g. "Rs. 8850/-"
 */
export function formatSummaryTotal(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const str = val.toString().replace(/,/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return `Rs. ${val}/-`;
  return `Rs. ${num}/-`;
}

/**
 * Calculates GST amount (18% of service charges by default)
 */
export function calculateGST(serviceCharges: number | string, gstRate: number = 18): number {
  const num = parseFloat(serviceCharges.toString().replace(/,/g, ''));
  if (isNaN(num)) return 0;
  return Math.round(num * (gstRate / 100));
}

/**
 * Calculates Total amount (Service Charges + GST)
 */
export function calculateTotal(serviceCharges: number | string, gstAmount: number): number {
  const num = parseFloat(serviceCharges.toString().replace(/,/g, ''));
  if (isNaN(num)) return 0;
  return num + gstAmount;
}

export interface ValuationCalculations {
  baseAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  gstAmount: number;
  otherAmount: number;
  totalAmount: number;
}

/**
 * Computes all charges and taxes for the Bank Valuation Invoice
 */
export function calculateValuationInvoice(charges: {
  serviceCharges: number | string;
  gstMode?: 'split' | 'none' | 'other';
  cgstRate?: number;
  sgstRate?: number;
  otherRate?: number;
  otherCharges?: number | string;
}): ValuationCalculations {
  const base = Math.max(0, parseFloat((charges.serviceCharges || 0).toString().replace(/,/g, '')) || 0);
  const other = Math.max(0, parseFloat((charges.otherCharges || 0).toString().replace(/,/g, '')) || 0);
  const mode = charges.gstMode || 'split';

  let cgst = 0;
  let sgst = 0;
  let gst = 0;

  if (mode === 'split') {
    const cgstRate = Math.max(0, charges.cgstRate ?? 9);
    const sgstRate = Math.max(0, charges.sgstRate ?? 9);
    cgst = Math.max(0, Math.round(base * (cgstRate / 100)));
    sgst = Math.max(0, Math.round(base * (sgstRate / 100)));
    gst = cgst + sgst;
  } else if (mode === 'other') {
    const otherRate = Math.max(0, charges.otherRate ?? 18);
    gst = Math.max(0, Math.round(base * (otherRate / 100)));
  } else {
    // 'none' -> Without GST
    cgst = 0;
    sgst = 0;
    gst = 0;
  }

  const total = base + gst + other;

  return {
    baseAmount: base,
    cgstAmount: cgst,
    sgstAmount: sgst,
    gstAmount: gst,
    otherAmount: other,
    totalAmount: total,
  };
}

// -------------------------------------------------------------
// Construction Invoice Calculations (Invoice-1.pdf)
// -------------------------------------------------------------

export function calculateConstructionInvoice(
  amountBeforeGst: number | string,
  cgstRate: number | string = 9,
  sgstRate: number | string = 9,
  tdsRate: number | string = 2,
  gstMode: 'manual' | 'none' | 'auto' = 'manual',
  _manualCgstAmount?: number | string,
  _manualSgstAmount?: number | string
) {
  const baseAmount = Math.max(0, parseFloat((amountBeforeGst ?? 0).toString().replace(/,/g, '')) || 0);
  const numCgstRate = Math.max(0, parseFloat((cgstRate ?? 0).toString()) || 0);
  const numSgstRate = Math.max(0, parseFloat((sgstRate ?? 0).toString()) || 0);
  const numTdsRate = Math.max(0, parseFloat((tdsRate ?? 0).toString()) || 0);

  let cgstAmount = 0;
  let sgstAmount = 0;

  if (gstMode === 'none') {
    cgstAmount = 0;
    sgstAmount = 0;
  } else {
    // Percentage model (manual entered percentage, strictly non-negative)
    cgstAmount = Math.max(0, Math.round(baseAmount * (numCgstRate / 100)));
    sgstAmount = Math.max(0, Math.round(baseAmount * (numSgstRate / 100)));
  }

  const totalInvoiceValue = baseAmount + cgstAmount + sgstAmount;
  const tdsAmount = Math.max(0, Math.round(baseAmount * (numTdsRate / 100)));
  const totalAfterTds = totalInvoiceValue - tdsAmount;

  return {
    baseAmount,
    cgstAmount,
    sgstAmount,
    totalInvoiceValue,
    tdsAmount,
    totalAfterTds,
  };
}
