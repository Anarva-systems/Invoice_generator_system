import React, { useState, useEffect } from 'react';
import type { InvoiceData } from '../types/invoice';
import { calculateValuationInvoice } from '../utils/formatters';
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
  Percent,
  CheckCircle2,
  Layers,
  CreditCard,
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

  const valCalc = calculateValuationInvoice(data.charges);

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
            Bank Valuation Invoice
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

      {/* Document Format & Header Controls */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              Document Header Title
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 tracking-wide">
              {data.headerTitle || 'INVOICE CASH/CREDIT CARD'}
            </div>
          </div>

          {/* Single Portion vs Full Invoice Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Layout Format:</span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onChange({ ...data, exportPortion: 'single' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                  (data.exportPortion || 'full') === 'single'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Single portion / half page (1 copy)"
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
                title="Full invoice with dual copies like present (2 copies)"
              >
                <Layers className="w-3.5 h-3.5" />
                Full Invoice (2 Copies)
              </button>
            </div>
          </div>
        </div>
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

        {/* Extra / Additional Property Info (Optional) */}
        <div className="pt-1">
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Additional Property Details <span className="text-slate-500 font-normal">(Optional)</span></span>
            <span className="text-[10px] text-slate-500">Leave empty if not needed</span>
          </label>
          <textarea
            rows={2}
            value={data.property.additionalInfo || ''}
            onChange={(e) => handlePropertyChange('additionalInfo', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="e.g. Near Bus Stand, East by R&B Road, Boundary notes, or any extra details..."
          />
        </div>
      </div>

      {/* 4. Charges & Calculations */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Service Charges & Auto Calculations
          </h3>

          {/* GST Mode Segmented Selector */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs gap-1">
            <button
              type="button"
              onClick={() => handleChargesChange('gstMode', 'split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                (data.charges.gstMode || 'split') === 'split'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              2 Parts GST (CGST + SGST)
            </button>
            <button
              type="button"
              onClick={() => handleChargesChange('gstMode', 'none')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                data.charges.gstMode === 'none'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Without GST (Direct)
            </button>
            <button
              type="button"
              onClick={() => handleChargesChange('gstMode', 'other')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                data.charges.gstMode === 'other'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Other
            </button>
          </div>
        </div>

        {/* Inputs & Calculation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Base Service Charges */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Service Charges (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={data.charges.serviceCharges}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              onChange={(e) => handleChargesChange('serviceCharges', e.target.value.replace(/-/g, ''))}
              className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/50 rounded-lg text-sm text-white font-mono font-semibold focus:outline-none focus:border-indigo-400"
              placeholder="e.g. 7500"
              required
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Base valuation service amount
            </span>
          </div>

          {/* Conditional Taxes / Cards */}
          {(data.charges.gstMode || 'split') === 'split' && (
            <>
              {/* CGST Card */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
                  <span>Part 1: CGST (9%)</span>
                  <span className="text-indigo-400 font-mono">Central</span>
                </div>
                <div className="text-base font-bold text-indigo-300 font-mono mt-1">
                  ₹ {valCalc.cgstAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  9% of ₹{valCalc.baseAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* SGST Card */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
                  <span>Part 2: SGST (9%)</span>
                  <span className="text-indigo-400 font-mono">State</span>
                </div>
                <div className="text-base font-bold text-indigo-300 font-mono mt-1">
                  ₹ {valCalc.sgstAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  9% of ₹{valCalc.baseAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </>
          )}

          {data.charges.gstMode === 'none' && (
            <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-emerald-300">
                  Without GST Mode Enabled
                </div>
                <div className="text-[11px] text-emerald-400/90 mt-0.5">
                  No tax is added. Entered Service Charge directly displays as the invoice total.
                </div>
              </div>
            </div>
          )}

          {data.charges.gstMode === 'other' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Other Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.charges.otherRate ?? 18}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                  }}
                  onChange={(e) => handleChargesChange('otherRate', Math.max(0, Number(e.target.value.replace(/-/g, ''))))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
                  placeholder="e.g. 18"
                />
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] font-medium text-slate-400">
                  Calculated Tax ({data.charges.otherRate ?? 18}%)
                </div>
                <div className="text-base font-bold text-amber-400 font-mono mt-1">
                  ₹ {valCalc.gstAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {data.charges.otherRate ?? 18}% of Service Charges
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional Other Charges & Total Payable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Optional Other Charges */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Other Charges (₹)
              </label>
              <span className="text-[10px] text-slate-500">
                Incidental, conveyance, or other charges
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={data.charges.otherCharges ?? 0}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              onChange={(e) => handleChargesChange('otherCharges', e.target.value.replace(/-/g, ''))}
              className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono text-right focus:outline-none focus:border-indigo-500"
              placeholder="0"
            />
          </div>

          {/* Auto-Calculated Total */}
          <div className="bg-gradient-to-r from-slate-950 to-indigo-950/40 p-3 rounded-xl border border-indigo-900/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-indigo-300">
                Total Amount Payable
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {data.charges.gstMode === 'none'
                  ? 'Base Service Charges directly'
                  : data.charges.gstMode === 'other'
                  ? `Service Charges + Tax (${data.charges.otherRate ?? 18}%)`
                  : 'Service Charges + CGST (9%) + SGST (9%)'}
                {valCalc.otherAmount > 0 ? ` + Other (₹${valCalc.otherAmount})` : ''}
              </div>
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              ₹ {valCalc.totalAmount.toLocaleString('en-IN')}
            </div>
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
                placeholder="e.g. State Bank of India"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Branch Name</label>
              <input
                type="text"
                value={data.valuer.branchName}
                onChange={(e) => handleValuerChange('branchName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                placeholder="e.g. Zilla Parishad Jn. Branch, Srikakulam"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">IFSC Code (Optional)</label>
              <input
                type="text"
                value={data.valuer.ifsc || ''}
                onChange={(e) => handleValuerChange('ifsc', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase"
                placeholder="e.g. SBIN0001234"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Other Valuer Info (New / Optional)</label>
              <input
                type="text"
                value={data.valuer.other || ''}
                onChange={(e) => handleValuerChange('other', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                placeholder="e.g. Reg. No / PAN / Phone: 9876543210"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
