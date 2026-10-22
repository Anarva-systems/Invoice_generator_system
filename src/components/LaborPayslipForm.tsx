import React, { useState } from 'react';
import type { LaborPayslipData, LaborTrade, LaborItem } from '../types/invoice';
import {
  Users,
  RotateCcw,
  UserCheck,
  Calendar,
  MapPin,
  Banknote,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import { numberToIndianWords } from '../utils/numberToWords';

interface LaborPayslipFormProps {
  data: LaborPayslipData;
  onChange: (data: LaborPayslipData) => void;
  onReset: () => void;
}

export const LaborPayslipForm: React.FC<LaborPayslipFormProps> = ({
  data,
  onChange,
  onReset,
}) => {
  const [showSupervisorSettings, setShowSupervisorSettings] = useState(false);

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

  const tradePresets: LaborTrade[] = [
    'Mason (మేస్త్రి)',
    'Male Helper (పురుష కూలీ)',
    'Female Helper (మహిళా కూలీ)',
    'Carpenter (వడ్రంగి)',
    'Bar Bender (ఐరన్ వర్కర్)',
    'Painter (పెయింటర్)',
    'Electrician (ఎలక్ట్రీషియన్)',
    'Plumber (ప్లంబర్)',
    'General Labor (సాధారణ కూలీ)',
  ];

  const laborItems = data.laborItems || [];

  // Handle updates to individual item fields
  const handleItemChange = (index: number, field: keyof LaborItem, val: any) => {
    const updated = [...laborItems];
    const current = { ...updated[index] };

    if (field === 'numberOfLabors' || field === 'ratePerUnit') {
      current[field] = val;
      const count = parseFloat(String(field === 'numberOfLabors' ? val : current.numberOfLabors || 0).replace(/[^0-9.]/g, '')) || 0;
      const rate = parseFloat(String(field === 'ratePerUnit' ? val : current.ratePerUnit || 0).replace(/[^0-9.]/g, '')) || 0;
      current.amount = count * rate;
    } else if (field === 'amount') {
      current.amount = val;
    } else {
      (current as any)[field] = val;
    }

    updated[index] = current;
    onChange({ ...data, laborItems: updated });
  };

  // Add new labor item row
  const handleAddItem = (presetType?: string) => {
    const nextSNo = laborItems.length + 1;
    const newItem: LaborItem = {
      id: Date.now().toString(),
      sNo: nextSNo,
      laborType: presetType || 'Male Helper (పురుష కూలీ)',
      numberOfLabors: 1,
      ratePerUnit: 650,
      amount: 650,
    };
    onChange({
      ...data,
      laborItems: [...laborItems, newItem],
    });
  };

  // Delete labor item row
  const handleDeleteItem = (index: number) => {
    const filtered = laborItems.filter((_, i) => i !== index);
    const renumbered = filtered.map((item, idx) => ({
      ...item,
      sNo: idx + 1,
    }));
    onChange({ ...data, laborItems: renumbered });
  };

  // Calculations
  const totalLaborsCount = laborItems.reduce((acc, item) => {
    const count = typeof item.numberOfLabors === 'number'
      ? item.numberOfLabors
      : parseFloat(String(item.numberOfLabors || 0).replace(/[^0-9.]/g, '')) || 0;
    return acc + count;
  }, 0);

  const totalGrossAmount = laborItems.reduce((acc, item) => {
    const amt = typeof item.amount === 'number'
      ? item.amount
      : parseFloat(String(item.amount || 0).replace(/[^0-9.]/g, '')) || 0;
    return acc + amt;
  }, 0);

  const advance = typeof data.advanceDeduction === 'number'
    ? data.advanceDeduction
    : parseFloat(String(data.advanceDeduction || 0).replace(/[^0-9.]/g, '')) || 0;

  const netWagesPaid = Math.max(0, totalGrossAmount - advance);

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Daily Labor Wage Slip (దినసరి కూలీ రశీదు)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate wage disbursement slip / voucher for daily labors and construction site workers.
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

      {/* 1. Voucher Meta Information */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Voucher & Site Particulars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Voucher No. <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.voucherNo}
              onChange={(e) => handleFieldChange('voucherNo', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. SSC-LABOR-2026/108"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Payment Date <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.paymentDate}
              onChange={(e) => handleFieldChange('paymentDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="DD-MM-YYYY"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Wage Period (వారం / రోజులు)
            </label>
            <input
              type="text"
              value={data.wagePeriod}
              onChange={(e) => handleFieldChange('wagePeriod', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Daily / Weekly: 11-10-2026 to 17-10-2026"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Project Construction Site Location
            </label>
            <input
              type="text"
              value={data.siteLocation}
              onChange={(e) => handleFieldChange('siteLocation', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Divine Saviour English Medium School Site, Peddapalem, Surubujjili"
            />
          </div>
        </div>
      </div>

      {/* 2. Worker / Mestri / In-Charge Profile (Worker ID Removed) */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          Worker / In-Charge Profile (కార్మికుడు / మేస్త్రి వివరాలు)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Worker / In-Charge Name (కార్మికుడి పేరు) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.worker.name}
              onChange={(e) => handleFieldChange('worker.name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-semibold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. K. Appa Rao (Mason In-Charge)"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Role / Trade (వృత్తి)
            </label>
            <input
              type="text"
              value={data.worker.trade || ''}
              onChange={(e) => handleFieldChange('worker.trade', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Mason & Civil Works"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Phone / Mobile (Optional)
            </label>
            <input
              type="text"
              value={data.worker.phone || ''}
              onChange={(e) => handleFieldChange('worker.phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 9988776655"
            />
          </div>
        </div>
      </div>

      {/* 3. Wage Calculation & Labor Table (Dynamic Multi-Row) */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Banknote className="w-4 h-4 text-emerald-400" />
              Wage Calculation & Labour Table (కూలీల వివరాలు)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter labor types, counts, and rates. Amount can be calculated automatically or manually overridden.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddItem()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/30 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Labour Row
          </button>
        </div>

        {/* Quick Trade Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Quick Add:</span>
          {tradePresets.slice(0, 5).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAddItem(preset)}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors"
            >
              + {preset.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Multi-Row Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                <th className="py-2.5 px-3 text-center w-12 font-semibold">S.No</th>
                <th className="py-2.5 px-3 font-semibold min-w-[200px]">Labour Type (కూలీ రకం)</th>
                <th className="py-2.5 px-3 text-center font-semibold w-36">Number of Labours</th>
                <th className="py-2.5 px-3 text-right font-semibold w-36">Rate / Unit (₹)</th>
                <th className="py-2.5 px-3 text-right font-semibold w-40">Amount (₹)</th>
                <th className="py-2.5 px-3 text-center w-12 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 font-sans">
              {laborItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-900/50 transition-colors">
                  {/* S.No */}
                  <td className="py-2 px-3 text-center text-slate-400 font-mono font-medium">
                    {item.sNo || index + 1}
                  </td>

                  {/* Labour Type */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.laborType}
                      onChange={(e) => handleItemChange(index, 'laborType', e.target.value)}
                      placeholder="e.g. Mason (మేస్త్రి) / Helper"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </td>

                  {/* Number of Labours */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.numberOfLabors}
                      onChange={(e) => handleItemChange(index, 'numberOfLabors', e.target.value)}
                      placeholder="1"
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-center font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </td>

                  {/* Rate / Unit (₹) */}
                  <td className="py-2 px-3">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={item.ratePerUnit}
                        onChange={(e) => handleItemChange(index, 'ratePerUnit', e.target.value)}
                        placeholder="650"
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-right font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </td>

                  {/* Amount (₹) */}
                  <td className="py-2 px-3">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-right font-mono font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      disabled={laborItems.length <= 1}
                      title="Delete row"
                      className={`p-1.5 rounded-md transition-colors ${
                        laborItems.length <= 1
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-400 hover:text-red-400 hover:bg-red-950/40'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Ledger Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Total Labours */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">Total No. of Labours:</span>
            <span className="text-base font-bold font-mono text-white">
              {totalLaborsCount} Workers
            </span>
          </div>

          {/* Advance Deduction (Optional) */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">Advance / Deductions:</span>
            <div className="flex items-center gap-1 w-32">
              <span className="text-xs text-red-400 font-mono">-₹</span>
              <input
                type="number"
                min="0"
                value={data.advanceDeduction || ''}
                onChange={(e) => handleFieldChange('advanceDeduction', e.target.value)}
                placeholder="0"
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-right text-red-400 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Gross Wage Total */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">Gross Total Wages:</span>
            <span className="text-base font-bold font-mono text-indigo-400">
              ₹ {totalGrossAmount.toLocaleString('en-IN')}/-
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Payment Method (చెల్లింపు విధానం)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange('paymentMode', 'Cash')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  data.paymentMode === 'Cash'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Cash in Hand (నగదు)
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('paymentMode', 'Bank / UPI Transfer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  data.paymentMode === 'Bank / UPI Transfer'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Bank / UPI Transfer
              </button>
            </div>
          </div>

          {data.paymentMode === 'Bank / UPI Transfer' && (
            <div className="flex-1 sm:max-w-xs">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                UPI / Txn Ref No
              </label>
              <input
                type="text"
                value={data.transactionRef || ''}
                onChange={(e) => handleFieldChange('transactionRef', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                placeholder="UPI / UTR ref"
              />
            </div>
          )}
        </div>

        {/* Net Wages Paid Card */}
        <div className="bg-gradient-to-r from-slate-950 to-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Net Wages Paid (నికరంగా చెల్లించిన నగదు)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Total for {totalLaborsCount} Labours across {laborItems.length} categories {advance > 0 ? ` (after ₹${advance} advance)` : ''}
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              ₹ {netWagesPaid.toLocaleString('en-IN')}/-
            </div>
          </div>
          <div className="text-[11px] text-emerald-300/90 italic pt-1 border-t border-emerald-900/40">
            <span className="font-semibold not-italic text-emerald-200">Amount in Words: </span>
            {numberToIndianWords(netWagesPaid)}
          </div>
        </div>
      </div>

      {/* 4. Remarks */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
        <label className="block text-xs font-medium text-slate-400">
          Remarks / Settlement Note
        </label>
        <input
          type="text"
          value={data.remarks || ''}
          onChange={(e) => handleFieldChange('remarks', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
          placeholder="e.g. Daily labor wage settlement cleared in cash."
        />
      </div>

      {/* 5. Supervisor & Site In-charge Settings (Collapsible) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowSupervisorSettings(!showSupervisorSettings)}
          className="w-full px-4 py-3 flex justify-between items-center text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            Supervisor & In-Charge Settings
          </span>
          {showSupervisorSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSupervisorSettings && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800 bg-slate-950">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={data.supervisor.companyName}
                onChange={(e) => handleFieldChange('supervisor.companyName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Supervisor Name</label>
              <input
                type="text"
                value={data.supervisor.supervisorName}
                onChange={(e) => handleFieldChange('supervisor.supervisorName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Site In-Charge Designation</label>
              <input
                type="text"
                value={data.supervisor.siteIncharge}
                onChange={(e) => handleFieldChange('supervisor.siteIncharge', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
