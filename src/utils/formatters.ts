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

// -------------------------------------------------------------
// Construction Invoice Calculations (Invoice-1.pdf)
// -------------------------------------------------------------

export function calculateConstructionInvoice(
  amountBeforeGst: number | string,
  cgstRate: number = 9,
  sgstRate: number = 9,
  tdsRate: number = 2
) {
  const baseAmount = parseFloat(amountBeforeGst.toString().replace(/,/g, '')) || 0;
  const cgstAmount = Math.round(baseAmount * (cgstRate / 100));
  const sgstAmount = Math.round(baseAmount * (sgstRate / 100));
  const totalInvoiceValue = baseAmount + cgstAmount + sgstAmount;
  const tdsAmount = Math.round(baseAmount * (tdsRate / 100));
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
