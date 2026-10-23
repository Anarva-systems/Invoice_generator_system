export interface RecipientInfo {
  to: string;
  bank: string;
  branch: string;
  district: string;
  gstin?: string;
  other?: string;
}

export interface PropertyInfo {
  ownerCompany: string;
  propertyName: string;
  owners: string[];
  surveyNo: string;
  village: string;
  panchayati: string;
  mandal: string;
  district: string;
  pinCode: string;
  propertyType: string;
  propertyValue: number | string;
  additionalInfo?: string; // Optional extra property details
}

export type GstMode = 'split' | 'none' | 'other';
export type InvoicePortion = 'single' | 'full';

export interface ChargesInfo {
  serviceCharges: number | string;
  gstMode: GstMode; // 'split' (2 parts: CGST + SGST), 'none' (Without GST), 'other' (Other / Custom)
  cgstRate: number; // Default 9%
  sgstRate: number; // Default 9%
  otherRate: number; // Default 18% or custom
  otherCharges: number | string; // Optional extra other charges
  otherDescription?: string; // Optional description for other charges
}

export interface ValuerInfo {
  name: string;
  accountNo: string;
  bankName: string;
  branchName: string;
  address?: string; // Office address
  ifsc?: string; // Optional IFSC Code
  gstNo?: string; // Optional GST Number
  other?: string; // Optional custom footer/valuer info
}

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  valuationDate: string;
  headerTitle: string; // 'TAX INVOICE CASH/CREDIT'
  exportPortion: InvoicePortion; // 'single' | 'full'
  recipient: RecipientInfo;
  property: PropertyInfo;
  charges: ChargesInfo;
  valuer: ValuerInfo;
}

// -------------------------------------------------------------
// Construction / Commercial GST Tax Invoice Data (Invoice-1.pdf)
// -------------------------------------------------------------

export interface ConstructionSupplierInfo {
  name: string;
  proprietorTitle: string;
  companyName: string;
  address?: string;
  gstin: string;
  state: string;
  stateCode: string;
  pan: string;
  accountNo: string;
  bankName: string;
  branchName: string;
}

export interface ConstructionBuyerInfo {
  name: string;
  addressLines: string[];
}

export interface ConstructionParticularItem {
  sNo: string;
  title: string;
  subtitleLines: string[];
  hsnCode: string;
}

export interface ConstructionInvoiceData {
  headerTitle?: string;
  invoiceNo: string;
  dated: string;
  suppliersRef: string;
  buyersOrderNo: string;
  supplier: ConstructionSupplierInfo;
  buyer: ConstructionBuyerInfo;
  particular: ConstructionParticularItem;
  amountBeforeGst: number | string;
  gstMode?: 'manual' | 'none' | 'auto'; // 'manual' for direct rupee entry, 'none' for without GST, 'auto' for standard %
  cgstRate: number | string; // e.g. 9 or custom manual %
  sgstRate: number | string; // e.g. 9 or custom manual %
  manualCgstAmount?: number | string;
  manualSgstAmount?: number | string;
  tdsRate: number | string; // e.g. 2 or 0 or custom %
}

// -------------------------------------------------------------
// Client Payment Receipt / Slip (Money received from client)
// -------------------------------------------------------------
export type PaymentMode = 'Cash' | 'Cheque' | 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Other';

export interface ClientReceiptData {
  receiptNo: string;
  receiptDate: string;
  referenceNo: string; // Ref Invoice No / Agreement No
  headerTitle: string; // e.g. 'CLIENT PAYMENT RECEIPT'
  client: {
    name: string;
    companyName: string;
    phone: string;
    address: string;
    gstin?: string;
  };
  payment: {
    mode: PaymentMode;
    amount: number | string;
    otherTagged?: string; // Tag / Milestone / Stage / Category
    pastAmountReceived?: number | string; // Manually entered past payment history
    transactionRef: string; // Cheque No / UTR / Txn ID
    transactionDate: string;
    bankName: string;
    paymentTowards: string; // Purpose
    totalBillAmount?: number | string; // Optional total project amount
    balanceRemaining?: number | string; // Optional pending balance
  };
  company: {
    name: string;
    tagline: string;
    address: string;
    gstin: string;
    pan: string;
    authorizedSignatory: string;
  };
  notes?: string;
  exportPortion?: 'single' | 'full';
  showPaymentTable?: boolean;
}

// -------------------------------------------------------------
// Daily Labor Wage Payslip (Money paid to daily labors / workers)
// -------------------------------------------------------------
export type LaborTrade =
  | 'Mason'
  | 'Male Helper'
  | 'Female Helper'
  | 'Carpenter'
  | 'Bar Bender'
  | 'Painter'
  | 'Electrician'
  | 'Plumber'
  | 'General Labor';

export interface LaborItem {
  id: string;
  sNo: number;
  laborType: string;
  numberOfLabors: number | string;
  ratePerUnit: number | string;
  amount: number | string;
}

export interface LaborPayslipData {
  voucherNo: string;
  paymentDate: string;
  wagePeriod: string; // e.g. "Weekly / Daily: 11-10-2026 to 17-10-2026"
  siteLocation: string; // e.g. "Peddapalem School Site, Srikakulam"
  worker: {
    name: string; // In-charge / Mestri / Worker Name
    trade?: string;
    phone?: string;
    aadhaarLast4?: string;
  };
  laborItems: LaborItem[];
  advanceDeduction?: number | string;
  paymentMode: 'Cash' | 'Bank / UPI Transfer';
  transactionRef?: string;
  supervisor: {
    companyName: string;
    supervisorName: string;
    siteIncharge: string;
  };
  remarks?: string;
  exportPortion?: 'single' | 'full';
}

export type ActiveTemplate = 'valuation' | 'construction' | 'client_receipt' | 'labor_payslip';
