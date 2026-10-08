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
}

export interface ChargesInfo {
  serviceCharges: number | string;
  gstRate: number; // Default 18
}

export interface ValuerInfo {
  name: string;
  accountNo: string;
  bankName: string;
  branchName: string;
}

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  valuationDate: string;
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
  invoiceNo: string;
  dated: string;
  suppliersRef: string;
  buyersOrderNo: string;
  supplier: ConstructionSupplierInfo;
  buyer: ConstructionBuyerInfo;
  particular: ConstructionParticularItem;
  amountBeforeGst: number | string;
  cgstRate: number; // default 9%
  sgstRate: number; // default 9%
  tdsRate: number; // default 2%
}

export type ActiveTemplate = 'valuation' | 'construction';
