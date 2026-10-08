import React, { useState, useEffect } from 'react';
import type { ConstructionInvoiceData } from '../types/invoice';
import { calculateConstructionInvoice, formatRupeeAmount } from '../utils/formatters';
import { numberToIndianWords } from '../utils/numberToWords';
import {
  getTodayFormatted,
  getCurrentYear,
  getCurrentMonthUpper,
} from '../utils/dateHelpers';
import {
  getAndConsumeSerial,
  saveSerial,
  incrementSerialNow,
  hasPendingIncrement,
} from '../utils/serialManager';
import {
  FileText,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  UserCheck,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';

interface ConstructionInvoiceFormProps {
  data: ConstructionInvoiceData;
  onChange: (newData: ConstructionInvoiceData) => void;
  onReset: () => void;
}

export const ConstructionInvoiceForm: React.FC<ConstructionInvoiceFormProps> = ({
  data,
  onChange,
  onReset,
}) => {
  const [showSupplierSettings, setShowSupplierSettings] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isCustomTaxRates, setIsCustomTaxRates] = useState(false);
  const [serialNo, setSerialNo] = useState(() => {
    return getAndConsumeSerial('construction', '92');
  });

  useEffect(() => {
    saveSerial('construction', serialNo);
  }, [serialNo]);

  const handleIncrementSerial = () => {
    setSerialNo((prev) => incrementSerialNow('construction', prev));
  };

  const handleResetTaxRates = () => {
    onChange({
      ...data,
      cgstRate: 9,
      sgstRate: 9,
      tdsRate: 2,
    });
    setIsCustomTaxRates(false);
  };

  const totals = calculateConstructionInvoice(
    data.amountBeforeGst,
    data.cgstRate,
    data.sgstRate,
    data.tdsRate
  );

  // Auto-generate invoice number and today's date when locked
  useEffect(() => {
    if (!isManualEdit) {
      const year = getCurrentYear();
      const month = getCurrentMonthUpper();
      const monthCapitalized = month.charAt(0) + month.slice(1).toLowerCase();
      const autoInvoiceNo = `No.SSC${year}/${monthCapitalized}/${serialNo || '92'}`;
      const autoToday = getTodayFormatted();

      onChange({
        ...data,
        invoiceNo: autoInvoiceNo,
        dated: autoToday,
      });
    }
  }, [isManualEdit, serialNo]);

  const handleFieldChange = (field: keyof ConstructionInvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSupplierChange = (field: keyof typeof data.supplier, value: string) => {
    onChange({
      ...data,
      supplier: { ...data.supplier, [field]: value },
    });
  };

  const handleBuyerChange = (field: keyof typeof data.buyer, value: any) => {
    onChange({
      ...data,
      buyer: { ...data.buyer, [field]: value },
    });
  };

  const handleParticularChange = (field: keyof typeof data.particular, value: any) => {
    onChange({
      ...data,
      particular: { ...data.particular, [field]: value },
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Construction Invoice Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the particulars to update the Commercial GST Tax Invoice preview.
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          title="Reset to default template values"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* 1. Invoice Metadata Section with Auto/Manual Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" /> Invoice & References
          </h3>

          {/* Toggle Button for Manual Override */}
          <button
            type="button"
            onClick={() => setIsManualEdit(!isManualEdit)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              isManualEdit
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isManualEdit ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                Manual Edit Mode (Unlocked)
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Auto-Generate Enabled (Locked)
              </>
            )}
          </button>
        </div>

        {/* Auto Rule Notice & Serial No */}
        {!isManualEdit && (
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">⚡ Auto-Rules:</span>
              <span>Invoice No = No.SSC[Year]/[Month]/[Serial] | Dated = Today</span>
            </div>
            <div className="flex items-center gap-2">
              {hasPendingIncrement('construction') && (
                <span className="text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium animate-pulse" title="Next serial will load on page refresh">
                  Next on reload: #{Number(serialNo) + 1}
                </span>
              )}
              <label className="text-xs text-slate-400 font-mono">Serial No:</label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                placeholder="92"
              />
              <button
                type="button"
                onClick={handleIncrementSerial}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                title="Increment receipt count (+1)"
              >
                +1 Next
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Invoice No.</span>
              {!isManualEdit && <span className="text-[10px] text-emerald-400 font-mono">Auto</span>}
            </label>
            <input
              type="text"
              value={data.invoiceNo}
              onChange={(e) => handleFieldChange('invoiceNo', e.target.value)}
              readOnly={!isManualEdit}
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition-colors ${
                !isManualEdit
                  ? 'bg-slate-950/50 border-slate-800 text-white font-semibold cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
              placeholder="e.g. No.SSC2026/July/92"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Dated</span>
              {!isManualEdit && <span className="text-[10px] text-emerald-400 font-mono">Today</span>}
            </label>
            <input
              type="text"
              value={data.dated}
              onChange={(e) => handleFieldChange('dated', e.target.value)}
              readOnly={!isManualEdit}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                !isManualEdit
                  ? 'bg-slate-950/50 border-slate-800 text-slate-300 cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
              placeholder="DD-MM-YYYY"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Supplier's Ref.
            </label>
            <input
              type="text"
              value={data.suppliersRef}
              onChange={(e) => handleFieldChange('suppliersRef', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="Optional reference"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Buyers' Order No.
            </label>
            <input
              type="text"
              value={data.buyersOrderNo}
              onChange={(e) => handleFieldChange('buyersOrderNo', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="Optional order number"
            />
          </div>
        </div>
      </div>

      {/* 2. Buyer Information */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4" /> Recipient / Buyer (To)
        </h3>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Buyer Name / Organization <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={data.buyer.name}
            onChange={(e) => handleBuyerChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-semibold"
            placeholder="e.g. ASSAM GANA MUKTI SOCIETY"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Address Lines (One per line)
          </label>
          <textarea
            value={data.buyer.addressLines.join('\n')}
            onChange={(e) =>
              handleBuyerChange('addressLines', e.target.value.split('\n'))
            }
            rows={4}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="Enter address lines..."
          />
        </div>
      </div>

      {/* 3. Particulars Item */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Work Description & Particulars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Work / Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.particular.title}
              onChange={(e) => handleParticularChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder='e.g. Construction of "DIVINE SAVIOUR ENGLISH MEDEM SCHOOL"'
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              HSN Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.particular.hsnCode}
              onChange={(e) => handleParticularChange('hsnCode', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono text-center focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 9954"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Subtitle / Stage Lines (One per line)
          </label>
          <textarea
            value={data.particular.subtitleLines.join('\n')}
            onChange={(e) =>
              handleParticularChange('subtitleLines', e.target.value.split('\n'))
            }
            rows={2}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 1. Construction Mobilization Payment"
          />
        </div>
      </div>

      {/* 4. Financial Calculations */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Financials, Taxes & Deductions
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isCustomTaxRates) {
                  handleResetTaxRates();
                } else {
                  setIsCustomTaxRates(true);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                isCustomTaxRates
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {isCustomTaxRates ? (
                <>
                  <Unlock className="w-3 h-3 text-amber-400" />
                  Custom Rates (Unlocked)
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Standard Rates Fixed (9%, 9%, 2%)
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Amount Before GST (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={data.amountBeforeGst}
              onChange={(e) => handleFieldChange('amountBeforeGst', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/50 rounded-lg text-sm text-white font-mono font-semibold focus:outline-none focus:border-indigo-400"
              placeholder="e.g. 3391724"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>CGST (%)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Standard 9%</span>
            </label>
            <input
              type="number"
              value={data.cgstRate}
              readOnly={!isCustomTaxRates}
              onChange={(e) =>
                handleFieldChange('cgstRate', e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono text-center transition-colors ${
                !isCustomTaxRates
                  ? 'bg-slate-950/60 border-slate-800 text-emerald-400 font-bold cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>SGST (%)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Standard 9%</span>
            </label>
            <input
              type="number"
              value={data.sgstRate}
              readOnly={!isCustomTaxRates}
              onChange={(e) =>
                handleFieldChange('sgstRate', e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono text-center transition-colors ${
                !isCustomTaxRates
                  ? 'bg-slate-950/60 border-slate-800 text-emerald-400 font-bold cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>TDS (%)</span>
              <span className="text-[10px] text-indigo-400 font-mono">Standard 2%</span>
            </label>
            <input
              type="number"
              value={data.tdsRate}
              readOnly={!isCustomTaxRates}
              onChange={(e) =>
                handleFieldChange('tdsRate', e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono text-center transition-colors ${
                !isCustomTaxRates
                  ? 'bg-slate-950/60 border-slate-800 text-indigo-300 font-bold cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* Live Auto-Calculated Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">CGST + SGST ({data.cgstRate + data.sgstRate}%)</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
              {formatRupeeAmount(totals.cgstAmount + totals.sgstAmount)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              CGST: {formatRupeeAmount(totals.cgstAmount)} | SGST: {formatRupeeAmount(totals.sgstAmount)}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">Total Invoice Value</div>
            <div className="text-base font-extrabold text-white font-mono mt-0.5">
              {formatRupeeAmount(totals.totalInvoiceValue)}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5" title={numberToIndianWords(totals.totalInvoiceValue)}>
              {numberToIndianWords(totals.totalInvoiceValue)}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-indigo-900/60">
            <div className="text-[11px] font-medium text-indigo-300">Net Payable After TDS ({data.tdsRate}%)</div>
            <div className="text-base font-extrabold text-emerald-300 font-mono mt-0.5">
              {formatRupeeAmount(totals.totalAfterTds)}
            </div>
            <div className="text-[10px] text-indigo-400/80 truncate mt-0.5" title={numberToIndianWords(totals.totalAfterTds)}>
              {numberToIndianWords(totals.totalAfterTds)}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Supplier Settings (Collapsible) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowSupplierSettings(!showSupplierSettings)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Supplier Details & Tax Settings
          </span>
          {showSupplierSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSupplierSettings && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800 bg-slate-950">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Proprietor Name</label>
              <input
                type="text"
                value={data.supplier.name}
                onChange={(e) => handleSupplierChange('name', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company / Firm Name</label>
              <input
                type="text"
                value={data.supplier.companyName}
                onChange={(e) => handleSupplierChange('companyName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">GSTIN</label>
              <input
                type="text"
                value={data.supplier.gstin}
                onChange={(e) => handleSupplierChange('gstin', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">PAN</label>
              <input
                type="text"
                value={data.supplier.pan}
                onChange={(e) => handleSupplierChange('pan', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Bank Name</label>
              <input
                type="text"
                value={data.supplier.bankName}
                onChange={(e) => handleSupplierChange('bankName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">A/C Number</label>
              <input
                type="text"
                value={data.supplier.accountNo}
                onChange={(e) => handleSupplierChange('accountNo', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
