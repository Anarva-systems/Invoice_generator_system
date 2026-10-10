import React from 'react';
import type { ActiveTemplate } from '../types/invoice';
import { Download, RotateCcw, CheckCircle2, ZoomIn, ZoomOut, Maximize2, Layers, Lock } from 'lucide-react';

interface ToolbarProps {
  activeTemplate: ActiveTemplate;
  onTemplateChange: (template: ActiveTemplate) => void;
  onPrint?: () => void;
  onDownloadPDF: () => void;
  onReset: () => void;
  onGenerate: () => void;
  isGeneratingPDF: boolean;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onLock?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTemplate,
  onTemplateChange,
  onDownloadPDF,
  onReset,
  onGenerate,
  isGeneratingPDF,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onLock,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white px-6 py-3.5 flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-lg no-print">
      {/* Left: Brand & Template Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="font-serif font-extrabold text-white text-lg">I</span>
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              Invoice Generator System
            </h1>
            <p className="text-xs text-slate-400">
              Master Document Replica Generator
            </p>
          </div>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => onTemplateChange('valuation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTemplate === 'valuation'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Bank Valuation (Invoice11)
          </button>
          <button
            onClick={() => onTemplateChange('construction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTemplate === 'construction'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Construction GST (Invoice-1)
          </button>
        </div>
      </div>

      {/* Center: Preview Zoom Controls */}
      <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-slate-400">
        <span className="px-2 font-mono text-[11px] text-slate-300">
          Zoom: {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomOut}
          className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onZoomIn}
          className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-lg transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          Reset Form
        </button>

        <button
          onClick={onGenerate}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-lg transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          Generate Preview
        </button>

        <button
          onClick={onDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-all shadow-md shadow-indigo-600/30"
        >
          <Download className="w-3.5 h-3.5" />
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
        </button>

        {onLock && (
          <button
            onClick={onLock}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-all ml-1"
            title="Lock Session and Require Passcode"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock
          </button>
        )}
      </div>
    </header>
  );
};
