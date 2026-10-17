import React, { useState } from 'react';
import type { LaborPayslipData, LaborTrade } from '../types/invoice';
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

  // Calculations
  const dailyRate = typeof data.wages.dailyRate === 'number'
    ? data.wages.dailyRate
    : parseFloat(String(data.wages.dailyRate).replace(/,/g, '')) || 0;

  const daysWorked = typeof data.wages.daysWorked === 'number'
    ? data.wages.daysWorked
    : parseFloat(String(data.wages.daysWorked).replace(/,/g, '')) || 0;

  const otHours = typeof data.wages.overtimeHours === 'number'
    ? data.wages.overtimeHours
    : parseFloat(String(data.wages.overtimeHours).replace(/,/g, '')) || 0;

  const otRate = typeof data.wages.overtimeRatePerHour === 'number'
    ? data.wages.overtimeRatePerHour
    : parseFloat(String(data.wages.overtimeRatePerHour).replace(/,/g, '')) || 0;

  const advance = typeof data.wages.advanceDeduction === 'number'
    ? data.wages.advanceDeduction
    : parseFloat(String(data.wages.advanceDeduction).replace(/,/g, '')) || 0;

  const allowance = typeof data.wages.otherAllowance === 'number'
    ? data.wages.otherAllowance
    : parseFloat(String(data.wages.otherAllowance).replace(/,/g, '')) || 0;

  const basicWages = dailyRate * daysWorked;
  const otAmount = otHours * otRate;
  const grossWages = basicWages + otAmount + allowance;
  const netWagesPaid = Math.max(0, grossWages - advance);

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-800">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Daily Labor Wage Payslip
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate wage disbursement slip / voucher when paying money to daily site workers.
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
              placeholder="e.g. Weekly: 11-10-2026 to 17-10-2026"
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

      {/* 2. Worker / Labor Information */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          Worker Profile (కార్మికుడి వివరాలు)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Worker Name (కార్మికుడి పేరు) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.worker.name}
              onChange={(e) => handleFieldChange('worker.name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-semibold focus:outline-none focus:border-indigo-500"
              placeholder="e.g. K. Appa Rao"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Trade / Designation (వృత్తి)
            </label>
            <select
              value={data.worker.trade}
              onChange={(e) => handleFieldChange('worker.trade', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {tradePresets.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Labor ID / Badge No
            </label>
            <input
              type="text"
              value={data.worker.workerId}
              onChange={(e) => handleFieldChange('worker.workerId', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="e.g. SSC-LAB-019"
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Aadhaar Last 4 Digits (Optional)
            </label>
            <input
              type="text"
              maxLength={4}
              value={data.worker.aadhaarLast4 || ''}
              onChange={(e) => handleFieldChange('worker.aadhaarLast4', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 4589"
            />
          </div>
        </div>
      </div>

      {/* 3. Wages & Work Days Calculator */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Banknote className="w-4 h-4 text-emerald-400" />
          Wage Calculation & Attendance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Daily Wage Rate (₹ / Day) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
              <input
                type="number"
                min="0"
                value={data.wages.dailyRate}
                onChange={(e) => handleFieldChange('wages.dailyRate', e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                placeholder="950"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Days Worked (పని దినాలు) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={data.wages.daysWorked}
              onChange={(e) => handleFieldChange('wages.daysWorked', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              placeholder="6"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Basic Wages (రూపాయలు)
            </label>
            <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-emerald-400 font-mono font-bold">
              ₹ {basicWages.toLocaleString('en-IN')}/-
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Overtime Hours (OT)
            </label>
            <input
              type="number"
              min="0"
              value={data.wages.overtimeHours}
              onChange={(e) => handleFieldChange('wages.overtimeHours', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              OT Rate (₹ / Hour)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
              <input
                type="number"
                min="0"
                value={data.wages.overtimeRatePerHour}
                onChange={(e) => handleFieldChange('wages.overtimeRatePerHour', e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                placeholder="150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Advance Deduction (- ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">-₹</span>
              <input
                type="number"
                min="0"
                value={data.wages.advanceDeduction}
                onChange={(e) => handleFieldChange('wages.advanceDeduction', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-red-950/60 rounded-lg text-sm text-red-400 font-mono font-semibold focus:outline-none focus:border-red-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Payment Mode (Cash vs Bank) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Payment Method (చెల్లింపు విధానం)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange('wages.paymentMode', 'Cash')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  data.wages.paymentMode === 'Cash'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Cash in Hand (నగదు)
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('wages.paymentMode', 'Bank / UPI Transfer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  data.wages.paymentMode === 'Bank / UPI Transfer'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Bank / UPI Transfer
              </button>
            </div>
          </div>

          {data.wages.paymentMode === 'Bank / UPI Transfer' && (
            <div className="flex-1 sm:max-w-xs">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                UPI / Txn Ref No
              </label>
              <input
                type="text"
                value={data.wages.transactionRef || ''}
                onChange={(e) => handleFieldChange('wages.transactionRef', e.target.value)}
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
                Net Wages Paid (నికరంగా చెల్లించవలసిన నగదు)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Gross: ₹{grossWages.toLocaleString('en-IN')} {advance > 0 ? ` - Advance: ₹${advance}` : ''}
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
          placeholder="e.g. Weekly wage settlement cleared."
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
              <label className="block text-xs font-medium text-slate-400 mb-1">Authorised Signatory</label>
              <input
                type="text"
                value={data.supervisor.supervisorName}
                onChange={(e) => handleFieldChange('supervisor.supervisorName', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Site In-charge Title</label>
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
