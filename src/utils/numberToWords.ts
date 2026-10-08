/**
 * Converts a number to Indian Currency words string.
 * Example: 4002234 -> "Rupees Forty Lakh Two Thousand Two Hundred and Thirty Four only"
 * Example: 3934400 -> "Rupees Thirty Nine Lakh Thirty Four Thousand Four Hundred only"
 */
export function numberToIndianWords(num: number | string): string {
  const rawStr = num.toString().replace(/,/g, '').trim();
  const n = parseFloat(rawStr);
  if (isNaN(n) || n === 0) return 'Rupees Zero only';

  const isNegative = n < 0;
  let absNum = Math.abs(Math.round(n));

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ];

  function convertBelowThousand(val: number): string {
    let str = '';
    if (val >= 100) {
      str += units[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
      if (val > 0) str += 'and ';
    }
    if (val >= 20) {
      str += tens[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      str += units[val] + ' ';
    }
    return str.trim();
  }

  let words = '';

  const crore = Math.floor(absNum / 10000000);
  absNum %= 10000000;

  const lakh = Math.floor(absNum / 100000);
  absNum %= 100000;

  const thousand = Math.floor(absNum / 1000);
  absNum %= 1000;

  const remaining = absNum;

  if (crore > 0) {
    words += convertBelowThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + ' Thousand ';
  }
  if (remaining > 0) {
    words += convertBelowThousand(remaining) + ' ';
  }

  const result = `Rupees ${words.trim()} only`;
  return (isNegative ? 'Minus ' : '') + result;
}
