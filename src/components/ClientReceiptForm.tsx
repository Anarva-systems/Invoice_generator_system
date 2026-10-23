import React, { useState } from 'react';
import type { ClientReceiptData, PaymentMode, BreakdownRowSettings } from '../types/invoice';
import {
  Receipt,
  RotateCcw,
  User,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { numberToIndianWords } from '../utils/numberToWords';

interface ClientReceiptFormProps {
  data: ClientReceiptData;
  onChange: (data: ClientReceiptData) => void;
  onReset: () => void;
}

export const ClientReceiptForm: React.FC<ClientReceiptFormProps> = ({
  data,
  onChange,
  onReset,
}) => {
  const [showCompanySettings, setShowCompanySettings] = useState(false);

  const handleFieldChange = (path: string, value: any) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      onChange({ ...data, [keys[0]]: value });
    } else if (keys.length === 2) {
      const [parent, child] = keys;
      onChange({
        ...data,
        [parent]: {
          ...(data as any)[parent],
          [child]: value,
        },
      });
    }
  };

  const numericAmount = typeof data.payment.amount === 'number'
    ? data.payment.amount
    : parseFloat(String(data.payment.amount).replace(/,/g, '')) || 0;

  const pastAmountNum = typeof data.payment.pastAmountReceived === 'number'
    ? data.payment.pastAmountReceived
    : parseFloat(String(data.payment.pastAmountReceived || 0).replace(/,/g, '')) || 0;

  const totalBillNum = typeof data.payment.totalBillAmount === 'number'
    ? data.payment.totalBillAmount
    : parseFloat(String(data.payment.totalBillAmount || 0).replace(/,/g, '')) || 0;

  const totalReceivedNum = pastAmountNum + numericAmount;
  const computedBalance = totalBillNum > totalReceivedNum ? totalBillNum - totalReceivedNum : 0;

  const recalculateBalance = (
    presentVal: number | string,
    pastVal: number | string | undefined,
    billVal: number | string | undefined
  ) => {
    const pNum = parseFloat(String(presentVal || 0).replace(/[^0-9.]/g, '')) || 0;
    const pastNum = parseFloat(String(pastVal || 0).replace(/[^0-9.]/g, '')) || 0;
    const bNum = parseFloat(String(billVal || 0).replace(/[^0-9.]/g, '')) || 0;
    const totalRec = pastNum + pNum;
    if (bNum > 0) {
      return bNum > totalRec ? bNum - totalRec : 0;
    }
    return '';
  };

  const handleAmountChange = (rawVal: string) => {
    const clean = rawVal.replace(/[^0-9.]/g, '');
    const newBal = recalculateBalance(clean, data.payment.pastAmountReceived, data.payment.totalBillAmount);

    onChange({
      ...data,
      payment: {
        ...data.payment,
        amount: clean,
        balanceRemaining: newBal !== '' ? newBal : data.payment.balanceRemaining,
      },
    });
  };

  const handlePastAmountChange = (rawVal: string) => {
    const clean = rawVal.replace(/[^0-9.]/g, '');
    const newBal = recalculateBalance(data.payment.amount, clean, data.payment.totalBillAmount);

    onChange({
      ...data,
      payment: {
        ...data.payment,
        pastAmountReceived: clean,
        balanceRemaining: newBal !== '' ? newBal : data.payment.balanceRemaining,
      },
    });
  };

  const handleTotalBillChange = (rawVal: string) => {
    const clean = rawVal.replace(/[^0-9.]/g, '');
    const newBal = recalculateBalance(data.payment.amount, data.payment.pastAmountReceived, clean);

    onChange({
      ...data,
      payment: {
        ...data.payment,
        totalBillAmount: clean,
        balanceRemaining: newBal !== '' ? newBal : '',
      },
    });
  };

  const handleBreakdownSettingChange = (field: keyof BreakdownRowSettings, val: any) => {
    onChange({
      ...data,
      breakdownSettings: {
        ...data.breakdownSettings,
        [field]: val,
      },
    });
  };

  const paymentModes: PaymentMode[] = [
    'Cash',
    'Bank Transfer (NEFT/RTGS)',
    'UPI',
    'Cheque',
    'Other',
  ];

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            Client Payment Receipt
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate official payment acknowledgment slip when client pays money to company.
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Form
        </button>
      </div>

      {/* Layout Format: Single Portion vs Full Dual-Copy */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Print Layout Format
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Choose whether to print 2-in-1 (dual copies on single A4) or a single half-page voucher.
          </div>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onChange({ ...data, exportPortion: 'single' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              (data.exportPortion || 'full') === 'single'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Single Portion (Half)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...data, exportPortion: 'full' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              (data.exportPortion || 'full') === 'full'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Full Dual-Copy (2 in 1)
          </button>
        </div>
      </div>

      {/* 1. Receipt Meta Information */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Receipt Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Receipt No. <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.receiptNo}
              onChange={(e) => handleFieldChange('receiptNo', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. SSC-RCPT-2026/042"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Receipt Date <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.receiptDate}
              onChange={(e) => handleFieldChange('receiptDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="DD-MM-YYYY"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Ref Invoice / Agreement No.
            </label>
            <input
              type="text"
              value={data.referenceNo}
              onChange={(e) => handleFieldChange('referenceNo', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. SSC2026/OCT/96"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Receipt Header Title
          </label>
          <input
            type="text"
            value={data.headerTitle}
            onChange={(e) => handleFieldChange('headerTitle', e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold uppercase text-white tracking-wider focus:outline-none focus:border-indigo-500"
            placeholder="CLIENT PAYMENT RECEIPT"
          />
        </div>
      </div>

      {/* 2. Client / Payer Details */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <User className="w-4 h-4 text-indigo-400" />
          Received From (Client / Party Details)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Client / Contact Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.client.name}
              onChange={(e) => handleFieldChange('client.name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-semibold"
              placeholder="e.g. Sri Varanasi Kantha Rao"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Company / Business Name
            </label>
            <input
              type="text"
              value={data.client.companyName}
              onChange={(e) => handleFieldChange('client.companyName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. M/s. Modern Rice Mill"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Address / Location
            </label>
            <input
              type="text"
              value={data.client.address}
              onChange={(e) => handleFieldChange('client.address', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Lingalavalasa Village, Jalumuru Mandal, Srikakulam Dist."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Phone / Mobile
            </label>
            <input
              type="text"
              value={data.client.phone}
              onChange={(e) => handleFieldChange('client.phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 9848012345"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Client GSTIN (Optional)
            </label>
            <input
              type="text"
              value={data.client.gstin || ''}
              onChange={(e) => handleFieldChange('client.gstin', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 37AAAAA0000A1Z5"
            />
          </div>
        </div>
      </div>

      {/* 3. Payment Details & Amount */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Payment Transaction & Amount
          </h3>

          {/* Table Visibility Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={data.showPaymentTable !== false}
              onChange={(e) => onChange({ ...data, showPaymentTable: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span className="text-slate-300 font-medium">Show Particulars Table in Slip (Optional)</span>
          </label>
        </div>

        {/* Payment Mode Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Payment Mode (చెల్లింపు విధానం)
          </label>
          <div className="flex flex-wrap gap-2">
            {paymentModes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleFieldChange('payment.mode', mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  data.payment.mode === mode
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input with Auto Words Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Current Amount Received */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-950/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Current Amount Received (ప్రస్తుతం వచ్చిన నగదు) <span className="text-red-400">*</span>
              </label>
              <span className="text-xs text-emerald-400 font-mono">Present Payment</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="text"
                value={data.payment.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xl font-bold font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                placeholder="150000"
                required
              />
            </div>
            <div className="text-[11px] text-slate-400 italic">
              <span className="font-semibold text-slate-300">Words: </span>
              {numberToIndianWords(numericAmount)}
            </div>
          </div>

          {/* Past History Amount Received */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-blue-950/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Past Amount Received (గతంలో అందిన మొత్తం)
              </label>
              <span className="text-xs text-blue-400 font-mono">Past History</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="text"
                value={data.payment.pastAmountReceived ?? ''}
                onChange={(e) => handlePastAmountChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xl font-bold font-mono text-blue-400 focus:outline-none focus:border-indigo-500"
                placeholder="100000"
              />
            </div>
            <div className="text-[11px] text-slate-400 italic">
              <span className="font-semibold text-slate-300">Words: </span>
              {pastAmountNum > 0 ? numberToIndianWords(pastAmountNum) : 'Zero Rupees'}
            </div>
          </div>

          {/* Other Tagged Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Other Tagged / Category / Milestone (ఇతర ట్యాగ్)</span>
              <span className="text-[10px] text-indigo-400 font-normal">Optional Tag or Milestone</span>
            </label>
            <input
              type="text"
              value={data.payment.otherTagged || ''}
              onChange={(e) => handleFieldChange('payment.otherTagged', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Milestone 2 - Foundation & Slabs / Material Advance / Phase 1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Purpose / Towards Payment
            </label>
            <input
              type="text"
              value={data.payment.paymentTowards}
              onChange={(e) => handleFieldChange('payment.paymentTowards', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Part Payment for Construction Civil Works"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Cheque / Txn / UTR Ref. No
            </label>
            <input
              type="text"
              value={data.payment.transactionRef}
              onChange={(e) => handleFieldChange('payment.transactionRef', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="e.g. UTR98374829104 / Chq #483920"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Cheque / Transaction Date
            </label>
            <input
              type="text"
              value={data.payment.transactionDate}
              onChange={(e) => handleFieldChange('payment.transactionDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="DD-MM-YYYY"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Bank / Branch Name
            </label>
            <input
              type="text"
              value={data.payment.bankName}
              onChange={(e) => handleFieldChange('payment.bankName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. State Bank of India, Srikakulam"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Total Project / Bill Amount (మొత్తం ప్రాజెక్ట్ విలువ)
            </label>
            <input
              type="text"
              value={data.payment.totalBillAmount || ''}
              onChange={(e) => handleTotalBillChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 500000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Balance Outstanding to Pay (ఇంకా ఇవ్వవలసిన బాకీ - Auto)
            </label>
            <input
              type="text"
              value={data.payment.balanceRemaining || ''}
              onChange={(e) => handleFieldChange('payment.balanceRemaining', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 250000"
            />
          </div>

          {/* Live Calculation Ledger Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                Ledger Summary & Balance Calculation
              </span>
              <span className="text-[11px] text-slate-400">All figures in INR (₹)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {totalBillNum > 0 && (
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase">Total Contract</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    ₹{totalBillNum.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-blue-900/40">
                <div className="text-[10px] text-blue-400 uppercase">Past Received</div>
                <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                  ₹{pastAmountNum.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-emerald-900/40">
                <div className="text-[10px] text-emerald-400 uppercase">Present Received</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  ₹{numericAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-indigo-900/40">
                <div className="text-[10px] text-indigo-300 uppercase">Total Received</div>
                <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                  ₹{totalReceivedNum.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-amber-900/50">
                <div className="text-[10px] text-amber-400 uppercase">Balance Due</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  ₹{(totalBillNum > 0 ? computedBalance : (parseFloat(String(data.payment.balanceRemaining || 0)) || 0)).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Accounting Breakdown Table Manager (Place / Remove & Edit Rows) */}
          <div className="md:col-span-2 bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800">
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  Payment Accounting Breakdown Table
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Manage table placement: place on voucher or remove with one click.
                </div>
              </div>

              {/* Master Place / Remove Toggle Button */}
              <button
                type="button"
                onClick={() => onChange({ ...data, showBreakdownTable: data.showBreakdownTable === false ? true : false })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  data.showBreakdownTable !== false
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {data.showBreakdownTable !== false ? '✓ Table Placed on Voucher' : '✕ Table Removed from Voucher'}
              </button>
            </div>

            {/* Individual Row Manager & Editors (Shown when Placed) */}
            {data.showBreakdownTable !== false && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Row Visibility & Custom Labels (Check to Place, Uncheck or click Remove to exclude):
                </div>

                {/* Row 1: Total Project / Contract Value */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={data.breakdownSettings?.showTotalContractValue !== false}
                    onChange={(e) => handleBreakdownSettingChange('showTotalContractValue', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.breakdownSettings?.totalContractValueLabel ?? 'Total Project / Contract Value:'}
                      onChange={(e) => handleBreakdownSettingChange('totalContractValueLabel', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Total Project / Contract Value:"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-white px-2 whitespace-nowrap">
                    ₹{totalBillNum.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBreakdownSettingChange('showTotalContractValue', !(data.breakdownSettings?.showTotalContractValue !== false))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap"
                  >
                    {data.breakdownSettings?.showTotalContractValue !== false ? 'Remove' : 'Place'}
                  </button>
                </div>

                {/* Row 2: Past Payments Received - History */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={data.breakdownSettings?.showPastPayments !== false}
                    onChange={(e) => handleBreakdownSettingChange('showPastPayments', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.breakdownSettings?.pastPaymentsLabel ?? 'Past Payments Received - History:'}
                      onChange={(e) => handleBreakdownSettingChange('pastPaymentsLabel', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Past Payments Received - History:"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400 px-2 whitespace-nowrap">
                    ₹{pastAmountNum.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBreakdownSettingChange('showPastPayments', !(data.breakdownSettings?.showPastPayments !== false))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap"
                  >
                    {data.breakdownSettings?.showPastPayments !== false ? 'Remove' : 'Place'}
                  </button>
                </div>

                {/* Row 3: Present Payment Received - Now */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={data.breakdownSettings?.showPresentPayment !== false}
                    onChange={(e) => handleBreakdownSettingChange('showPresentPayment', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.breakdownSettings?.presentPaymentLabel ?? 'Present Payment Received - Now:'}
                      onChange={(e) => handleBreakdownSettingChange('presentPaymentLabel', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                      placeholder="Present Payment Received - Now:"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 whitespace-nowrap">
                    ₹{numericAmount.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBreakdownSettingChange('showPresentPayment', !(data.breakdownSettings?.showPresentPayment !== false))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap"
                  >
                    {data.breakdownSettings?.showPresentPayment !== false ? 'Remove' : 'Place'}
                  </button>
                </div>

                {/* Row 4: Total Cumulative Received */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={data.breakdownSettings?.showCumulativeReceived !== false}
                    onChange={(e) => handleBreakdownSettingChange('showCumulativeReceived', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.breakdownSettings?.cumulativeReceivedLabel ?? 'Total Cumulative Received to Date:'}
                      onChange={(e) => handleBreakdownSettingChange('cumulativeReceivedLabel', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                      placeholder="Total Cumulative Received to Date:"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 px-2 whitespace-nowrap">
                    ₹{totalReceivedNum.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBreakdownSettingChange('showCumulativeReceived', !(data.breakdownSettings?.showCumulativeReceived !== false))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap"
                  >
                    {data.breakdownSettings?.showCumulativeReceived !== false ? 'Remove' : 'Place'}
                  </button>
                </div>

                {/* Row 5: Net Balance Amount to Pay */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={data.breakdownSettings?.showNetBalance !== false}
                    onChange={(e) => handleBreakdownSettingChange('showNetBalance', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={data.breakdownSettings?.netBalanceLabel ?? 'Net Balance Amount to Pay:'}
                      onChange={(e) => handleBreakdownSettingChange('netBalanceLabel', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-indigo-500 font-bold text-amber-300"
                      placeholder="Net Balance Amount to Pay:"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 px-2 whitespace-nowrap">
                    ₹{(totalBillNum > 0 ? computedBalance : (parseFloat(String(data.payment.balanceRemaining || 0)) || 0)).toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBreakdownSettingChange('showNetBalance', !(data.breakdownSettings?.showNetBalance !== false))}
                    className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap"
                  >
                    {data.breakdownSettings?.showNetBalance !== false ? 'Remove' : 'Place'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Notes / Terms */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
        <label className="block text-xs font-medium text-slate-400">
          Receipt Notes / Terms
        </label>
        <input
          type="text"
          value={data.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
          placeholder="e.g. Subject to realization of cheque/transfer."
        />
      </div>

      {/* 5. Company & Signatory Settings (Collapsible) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowCompanySettings(!showCompanySettings)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Company Header & Signatory Settings
          </span>
          {showCompanySettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCompanySettings && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800 bg-slate-950">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={data.company.name}
                onChange={(e) => handleFieldChange('company.name', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={data.company.tagline}
                onChange={(e) => handleFieldChange('company.tagline', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Office Address</label>
              <input
                type="text"
                value={data.company.address}
                onChange={(e) => handleFieldChange('company.address', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">GSTIN</label>
              <input
                type="text"
                value={data.company.gstin}
                onChange={(e) => handleFieldChange('company.gstin', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">PAN</label>
              <input
                type="text"
                value={data.company.pan}
                onChange={(e) => handleFieldChange('company.pan', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Authorized Signatory Name</label>
              <input
                type="text"
                value={data.company.authorizedSignatory}
                onChange={(e) => handleFieldChange('company.authorizedSignatory', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-bold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
