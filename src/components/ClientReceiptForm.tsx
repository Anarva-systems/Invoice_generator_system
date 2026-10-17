import React, { useState } from 'react';
import type { ClientReceiptData, PaymentMode } from '../types/invoice';
import {
  Receipt,
  RotateCcw,
  User,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
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

  const totalBillNum = typeof data.payment.totalBillAmount === 'number'
    ? data.payment.totalBillAmount
    : parseFloat(String(data.payment.totalBillAmount || 0).replace(/,/g, '')) || 0;

  const handleAmountChange = (rawVal: string) => {
    const clean = rawVal.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean) || 0;
    const balance = totalBillNum > num ? totalBillNum - num : 0;

    onChange({
      ...data,
      payment: {
        ...data.payment,
        amount: clean,
        balanceRemaining: balance > 0 ? balance : '',
      },
    });
  };

  const handleTotalBillChange = (rawVal: string) => {
    const clean = rawVal.replace(/[^0-9.]/g, '');
    const bill = parseFloat(clean) || 0;
    const balance = bill > numericAmount ? bill - numericAmount : 0;

    onChange({
      ...data,
      payment: {
        ...data.payment,
        totalBillAmount: clean,
        balanceRemaining: balance > 0 ? balance : '',
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
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Payment Transaction & Amount
        </h3>

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
          <div className="md:col-span-2 bg-slate-900/90 p-3.5 rounded-xl border border-indigo-950/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Amount Received (వచ్చిన నగదు) <span className="text-red-400">*</span>
              </label>
              <span className="text-xs text-indigo-400 font-mono">INR (₹)</span>
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
              Total Project / Bill Amount (Optional)
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
              Balance Outstanding (Auto-Calculated)
            </label>
            <input
              type="text"
              value={data.payment.balanceRemaining || ''}
              onChange={(e) => handleFieldChange('payment.balanceRemaining', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 350000"
            />
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
