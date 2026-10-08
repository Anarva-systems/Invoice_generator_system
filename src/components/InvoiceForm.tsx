import React, { useState, useEffect } from 'react';
import type { InvoiceData } from '../types/invoice';
import { calculateGST, calculateTotal } from '../utils/formatters';
import {
  getTodayFormatted,
  getYesterdayFormatted,
  generateAutoInvoiceNo,
} from '../utils/dateHelpers';
import {
  getAndConsumeSerial,
  saveSerial,
  incrementSerialNow,
  hasPendingIncrement,
} from '../utils/serialManager';
import {
  User,
  Building,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  RefreshCw,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  onReset: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange, onReset }) => {
  const [showValuerSettings, setShowValuerSettings] = useState(false);
  const [showRecipientSettings, setShowRecipientSettings] = useState(false);

  // Auto-generate vs Manual override toggle
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [serialNo, setSerialNo] = useState(() => {
    return getAndConsumeSerial('valuation', '93');
  });

  // Save serialNo to localStorage when updated
  useEffect(() => {
    saveSerial('valuation', serialNo);
  }, [serialNo]);

  const handleIncrementSerial = () => {
    setSerialNo((prev) => incrementSerialNow('valuation', prev));
  };

  const gstAmount = calculateGST(data.charges.serviceCharges, data.charges.gstRate);
  const totalAmount = calculateTotal(data.charges.serviceCharges, gstAmount);

  // Auto-update meta fields when in Auto mode
  useEffect(() => {
    if (!isManualEdit) {
      const autoInvoiceNo = generateAutoInvoiceNo(serialNo);
      const autoToday = getTodayFormatted();
      const autoYesterday = getYesterdayFormatted();

      onChange({
        ...data,
        invoiceNo: autoInvoiceNo,
        invoiceDate: autoToday,
        valuationDate: autoYesterday,
      });
    }
  }, [isManualEdit, serialNo]);

  // Field change handlers
  const handleMetaChange = (field: keyof InvoiceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleRecipientChange = (field: keyof typeof data.recipient, value: string) => {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    });
  };

  const handlePropertyChange = (field: keyof typeof data.property, value: any) => {
    onChange({
      ...data,
      property: { ...data.property, [field]: value },
    });
  };

  const handleOwnerChange = (index: number, value: string) => {
    const updatedOwners = [...data.property.owners];
    updatedOwners[index] = value;
    handlePropertyChange('owners', updatedOwners);
  };

  const handleAddOwner = () => {
    handlePropertyChange('owners', [...data.property.owners, '']);
  };

  const handleRemoveOwner = (index: number) => {
    const updatedOwners = data.property.owners.filter((_, i) => i !== index);
    handlePropertyChange('owners', updatedOwners);
  };

  const handleChargesChange = (field: keyof typeof data.charges, value: any) => {
    onChange({
      ...data,
      charges: { ...data.charges, [field]: value },
    });
  };

  const handleValuerChange = (field: keyof typeof data.valuer, value: string) => {
    onChange({
      ...data,
      valuer: { ...data.valuer, [field]: value },
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Invoice Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details to update the live invoice preview instantly.
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
            <FileText className="w-4 h-4" /> Invoice & Valuation Meta
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

        {/* Serial Number & Auto Notice */}
        {!isManualEdit && (
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">⚡ Auto-Rules:</span>
              <span>Invoice No = SSC[YEAR]/[MONTH]/[SERIAL] | Date = Today | Valuation = Yesterday</span>
            </div>
            <div className="flex items-center gap-2">
              {hasPendingIncrement('valuation') && (
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
                placeholder="93"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Invoice No.</span>
              {!isManualEdit && (
                <span className="text-[10px] text-emerald-400 font-mono">SSC[Year]/[Month]/[Serial]</span>
              )}
            </label>
            <input
              type="text"
              value={data.invoiceNo}
              onChange={(e) => handleMetaChange('invoiceNo', e.target.value)}
              readOnly={!isManualEdit}
              className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition-colors ${
                !isManualEdit
                  ? 'bg-slate-950/50 border-slate-800 text-red-400 font-semibold cursor-not-allowed opacity-90'
                  : 'bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-indigo-500'
              }`}
              placeholder="e.g. SSC2026/JULY/93"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Invoice Date</span>
              {!isManualEdit && <span className="text-[10px] text-emerald-400 font-mono">Today</span>}
            </label>
            <input
              type="text"
              value={data.invoiceDate}
              onChange={(e) => handleMetaChange('invoiceDate', e.target.value)}
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
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Date of Valuation</span>
              {!isManualEdit && <span className="text-[10px] text-emerald-400 font-mono">Yesterday</span>}
            </label>
            <input
              type="text"
              value={data.valuationDate}
              onChange={(e) => handleMetaChange('valuationDate', e.target.value)}
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
        </div>
      </div>

      {/* 2. Recipient Settings (Collapsible) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowRecipientSettings(!showRecipientSettings)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            Bank & Recipient Information
          </span>
          {showRecipientSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRecipientSettings && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800 bg-slate-950">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">To</label>
              <input
                type="text"
                value={data.recipient.to}
                onChange={(e) => handleRecipientChange('to', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Bank Name</label>
              <input
                type="text"
                value={data.recipient.bank}
                onChange={(e) => handleRecipientChange('bank', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Branch</label>
              <input
                type="text"
                value={data.recipient.branch}
                onChange={(e) => handleRecipientChange('branch', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">District</label>
              <input
                type="text"
                value={data.recipient.district}
                onChange={(e) => handleRecipientChange('district', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Property & Owner Details */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4" /> Property & Owner Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Owner / Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.property.ownerCompany}
              onChange={(e) => handlePropertyChange('ownerCompany', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. M/s. Sri Venkata Santhammani"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Property Description
            </label>
            <input
              type="text"
              value={data.property.propertyName}
              onChange={(e) => handlePropertyChange('propertyName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Modern Rice & Oil Mill"
            />
          </div>
        </div>

        {/* Dynamic Owners List */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Individual Owners
            </label>
            <button
              type="button"
              onClick={handleAddOwner}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Owner
            </button>
          </div>

          {data.property.owners.map((owner, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 w-5">{idx + 1}.</span>
              <input
                type="text"
                value={owner}
                onChange={(e) => handleOwnerChange(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder={`Owner ${idx + 1} Name`}
              />
              {data.property.owners.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOwner(idx)}
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Remove owner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Survey & Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Survey Number</label>
            <input
              type="text"
              value={data.property.surveyNo}
              onChange={(e) => handlePropertyChange('surveyNo', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. S.No. 212-14 & 213-5"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Village</label>
            <input
              type="text"
              value={data.property.village}
              onChange={(e) => handlePropertyChange('village', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. Lingalavalasa Village"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Panchayati / Area</label>
            <input
              type="text"
              value={data.property.panchayati}
              onChange={(e) => handlePropertyChange('panchayati', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. Panchayati"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mandal</label>
            <input
              type="text"
              value={data.property.mandal}
              onChange={(e) => handlePropertyChange('mandal', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. Jalumuru Mandal"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">District</label>
            <input
              type="text"
              value={data.property.district}
              onChange={(e) => handlePropertyChange('district', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. Srikakulam district"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">PIN Code</label>
            <input
              type="text"
              value={data.property.pinCode}
              onChange={(e) => handlePropertyChange('pinCode', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              placeholder="e.g. 532432"
            />
          </div>
        </div>

        {/* Property Type & Valuation Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Type of Property <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.property.propertyType}
              onChange={(e) => handlePropertyChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
              placeholder="e.g. Rice Mill"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Completion / Valuation Value (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={data.property.propertyValue}
              onChange={(e) => handlePropertyChange('propertyValue', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
              placeholder="e.g. 54595000"
              required
            />
          </div>
        </div>
      </div>

      {/* 4. Charges & Calculations */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Service Charges & Auto Calculations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Service Charges (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={data.charges.serviceCharges}
              onChange={(e) => handleChargesChange('serviceCharges', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/50 rounded-lg text-sm text-white font-mono font-semibold focus:outline-none focus:border-indigo-400"
              placeholder="e.g. 7500"
              required
            />
          </div>

          {/* Auto-Calculated GST */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">GST (18% Auto)</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-1">
              ₹ {gstAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">18% of Service Charges</div>
          </div>

          {/* Auto-Calculated Total */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-indigo-950/60">
            <div className="text-[11px] font-medium text-indigo-300">Total Payable</div>
            <div className="text-lg font-extrabold text-white font-mono mt-0.5">
              ₹ {totalAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-indigo-400/80 mt-0.5">Service Charges + GST</div>
          </div>
        </div>
      </div>

      {/* 5. Footer / Valuer Info Settings (Collapsible) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowValuerSettings(!showValuerSettings)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            Valuer & Footer Settings
          </span>
          {showValuerSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showValuerSettings && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800 bg-slate-950">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Valuer Name</label>
              <input
                type="text"
                value={data.valuer.name}
                onChange={(e) => handleValuerChange('name', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Account Number</label>
              <input
                type="text"
                value={data.valuer.accountNo}
                onChange={(e) => handleValuerChange('accountNo', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Valuer Bank</label>
              <input
                type="text"
                value={data.valuer.bankName}
                onChange={(e) => handleValuerChange('bankName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Valuer Branch</label>
              <input
                type="text"
                value={data.valuer.branchName}
                onChange={(e) => handleValuerChange('branchName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
