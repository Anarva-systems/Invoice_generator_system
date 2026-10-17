import React, { useState, useRef } from 'react';
import type {
  InvoiceData,
  ConstructionInvoiceData,
  ClientReceiptData,
  LaborPayslipData,
  ActiveTemplate,
} from './types/invoice';
import {
  DEFAULT_INVOICE_DATA,
  DEFAULT_CONSTRUCTION_INVOICE_DATA,
  DEFAULT_CLIENT_RECEIPT_DATA,
  DEFAULT_LABOR_PAYSLIP_DATA,
} from './constants/defaults';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { ConstructionInvoiceForm } from './components/ConstructionInvoiceForm';
import { ConstructionInvoiceTemplate } from './components/ConstructionInvoiceTemplate';
import { ClientReceiptForm } from './components/ClientReceiptForm';
import { ClientReceiptTemplate } from './components/ClientReceiptTemplate';
import { LaborPayslipForm } from './components/LaborPayslipForm';
import { LaborPayslipTemplate } from './components/LaborPayslipTemplate';
import { Toolbar } from './components/Toolbar';
import { AccessGate } from './components/AccessGate';
import { downloadInvoicePDF } from './utils/pdfExport';
import { markPendingIncrement } from './utils/serialManager';
import { Eye, Edit3, CheckCircle2 } from 'lucide-react';

const AUTH_STORAGE_KEY = 'invoice_app_authenticated';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
      sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    );
  });
  const [activeTemplate, setActiveTemplate] = useState<ActiveTemplate>(() => {
    const saved = localStorage.getItem('invoice_active_template');
    if (
      saved === 'valuation' ||
      saved === 'construction' ||
      saved === 'client_receipt' ||
      saved === 'labor_payslip'
    ) {
      return saved as ActiveTemplate;
    }
    return 'valuation';
  });

  const [valuationData, setValuationData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [constructionData, setConstructionData] = useState<ConstructionInvoiceData>(
    DEFAULT_CONSTRUCTION_INVOICE_DATA
  );
  const [clientReceiptData, setClientReceiptData] = useState<ClientReceiptData>(
    DEFAULT_CLIENT_RECEIPT_DATA
  );
  const [laborPayslipData, setLaborPayslipData] = useState<LaborPayslipData>(
    DEFAULT_LABOR_PAYSLIP_DATA
  );

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleAuthenticate = (remember: boolean) => {
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
    setIsAuthenticated(true);
    showNotification('Access granted. Welcome to Invoice Generator!');
  };

  const handleLock = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset all form inputs to default template values?')
    ) {
      if (activeTemplate === 'valuation') {
        setValuationData(DEFAULT_INVOICE_DATA);
      } else if (activeTemplate === 'construction') {
        setConstructionData(DEFAULT_CONSTRUCTION_INVOICE_DATA);
      } else if (activeTemplate === 'client_receipt') {
        setClientReceiptData(DEFAULT_CLIENT_RECEIPT_DATA);
      } else if (activeTemplate === 'labor_payslip') {
        setLaborPayslipData(DEFAULT_LABOR_PAYSLIP_DATA);
      }
      showNotification('Form reset to reference defaults.');
    }
  };

  const handleGenerate = () => {
    if (activeTemplate === 'valuation') {
      if (!valuationData.invoiceNo.trim()) {
        showNotification('Please enter an Invoice Number.');
        return;
      }
    } else if (activeTemplate === 'construction') {
      if (!constructionData.invoiceNo.trim()) {
        showNotification('Please enter an Invoice Number.');
        return;
      }
    } else if (activeTemplate === 'client_receipt') {
      if (!clientReceiptData.receiptNo.trim()) {
        showNotification('Please enter a Receipt Number.');
        return;
      }
    } else if (activeTemplate === 'labor_payslip') {
      if (!laborPayslipData.voucherNo.trim()) {
        showNotification('Please enter a Voucher Number.');
        return;
      }
    }
    showNotification('Document preview updated successfully!');
  };

  const handleDownloadPDF = () => {
    let currentDocNo = valuationData.invoiceNo;
    if (activeTemplate === 'construction') {
      currentDocNo = constructionData.invoiceNo;
    } else if (activeTemplate === 'client_receipt') {
      currentDocNo = clientReceiptData.receiptNo;
    } else if (activeTemplate === 'labor_payslip') {
      currentDocNo = laborPayslipData.voucherNo;
    }

    downloadInvoicePDF(
      currentDocNo,
      () => setIsGeneratingPDF(true),
      () => {
        setIsGeneratingPDF(false);
        markPendingIncrement(activeTemplate);
        showNotification(
          `Document downloaded! Serial count will auto-advance on next refresh.`
        );
      }
    );
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => setZoomLevel(0.85);

  const getTemplateDisplayName = (tmpl: ActiveTemplate) => {
    switch (tmpl) {
      case 'valuation':
        return 'Bank Valuation';
      case 'construction':
        return 'Construction GST';
      case 'client_receipt':
        return 'Client Payment Slip';
      case 'labor_payslip':
        return 'Daily Labor Wage Slip';
      default:
        return 'Invoice';
    }
  };

  if (!isAuthenticated) {
    return <AccessGate onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMessage}
        </div>
      )}

      {/* Main Top Header & Toolbar with Template Switcher */}
      <Toolbar
        activeTemplate={activeTemplate}
        onTemplateChange={(tmpl) => {
          setActiveTemplate(tmpl);
          localStorage.setItem('invoice_active_template', tmpl);
          showNotification(`Switched to ${getTemplateDisplayName(tmpl)} Template`);
        }}
        onDownloadPDF={handleDownloadPDF}
        onReset={handleReset}
        onGenerate={handleGenerate}
        isGeneratingPDF={isGeneratingPDF}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onLock={handleLock}
      />

      {/* Mobile Tab Toggle */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 no-print">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
            activeTab === 'form'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-4 h-4" /> Edit Parameters
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
            activeTab === 'preview'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" /> Live A4 Preview
        </button>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Input Form */}
        <div
          className={`w-full lg:w-[45%] xl:w-[40%] p-4 lg:p-6 overflow-y-auto no-print ${
            activeTab === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          {activeTemplate === 'valuation' && (
            <InvoiceForm
              data={valuationData}
              onChange={setValuationData}
              onReset={handleReset}
            />
          )}
          {activeTemplate === 'construction' && (
            <ConstructionInvoiceForm
              data={constructionData}
              onChange={setConstructionData}
              onReset={handleReset}
            />
          )}
          {activeTemplate === 'client_receipt' && (
            <ClientReceiptForm
              data={clientReceiptData}
              onChange={setClientReceiptData}
              onReset={handleReset}
            />
          )}
          {activeTemplate === 'labor_payslip' && (
            <LaborPayslipForm
              data={laborPayslipData}
              onChange={setLaborPayslipData}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Right Side: Live A4 Document Preview */}
        <div
          ref={previewContainerRef}
          className={`w-full lg:w-[55%] xl:w-[60%] bg-slate-900/60 p-4 lg:p-8 overflow-auto flex justify-center items-start border-l border-slate-800/80 print:block print:p-0 print:w-full print:border-none ${
            activeTab === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Document Scale Container */}
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="my-2"
            >
              {activeTemplate === 'valuation' && (
                <InvoiceTemplate data={valuationData} />
              )}
              {activeTemplate === 'construction' && (
                <ConstructionInvoiceTemplate data={constructionData} />
              )}
              {activeTemplate === 'client_receipt' && (
                <ClientReceiptTemplate data={clientReceiptData} />
              )}
              {activeTemplate === 'labor_payslip' && (
                <LaborPayslipTemplate data={laborPayslipData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
