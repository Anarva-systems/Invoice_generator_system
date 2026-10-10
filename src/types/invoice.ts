export interface RecipientInfo {
  to: string;
  bank: string;
  branch: string;
  district: string;
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
  ifsc?: string; // Optional IFSC Code
  other?: string; // Optional custom footer/valuer info
}

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  valuationDate: string;
  headerTitle: string; // 'INVOICE CASH/CREDIT CARD'
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

export type ActiveTemplate = 'valuation' | 'construction';
