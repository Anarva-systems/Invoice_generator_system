import type { InvoiceData, ConstructionInvoiceData } from '../types/invoice';

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  invoiceNo: 'SSC2026/JULY/93',
  invoiceDate: '24-07-2026',
  valuationDate: '23-07-2026',
  recipient: {
    to: 'The Branch Manager',
    bank: 'State Bank of India',
    branch: 'Main Branch',
    district: 'Srikakulam District',
  },
  property: {
    ownerCompany: 'M/s. Sri Venkata Santhammani',
    propertyName: 'Modern Rice & Oil Mill',
    owners: [
      'Sri Varanasi Kantha Rao',
      'Sri Varanasi Baskar Rao',
      'Sri Ganapthi Rao',
    ],
    surveyNo: 'S.No. 212-14 & 213-5',
    village: 'Lingalavalasa Village',
    panchayati: 'Panchayati',
    mandal: 'Jalumuru Mandal',
    district: 'Srikakulam district',
    pinCode: '532432',
    propertyType: 'Rice Mill',
    propertyValue: 54595000,
  },
  charges: {
    serviceCharges: 7500,
    gstRate: 18,
  },
  valuer: {
    name: 'B. Satyanarayana',
    accountNo: 'A/C NO.36230328613',
    bankName: 'State Bank of India',
    branchName: 'Zilla Parishad Jn. Branch, Srikakulam',
  },
};

export const DEFAULT_CONSTRUCTION_INVOICE_DATA: ConstructionInvoiceData = {
  invoiceNo: 'No.SSC2026/July/92',
  dated: '04-07-2026',
  suppliersRef: '',
  buyersOrderNo: '',
  supplier: {
    name: 'BURLE SATYANARAYANA',
    proprietorTitle: 'PROPRIETOR of',
    companyName: 'SATYA SAI CONSTRUCTIONS',
    gstin: '37ATPPB5912Q1Z3',
    state: 'ANDHRAPRADESH',
    stateCode: '37',
    pan: 'ATPPB5912Q',
    accountNo: '36230328613',
    bankName: 'STATE BANK OF INDIA',
    branchName: 'ZILLA PARISHAD JN. BRANCH, SRIKAKULAM',
  },
  buyer: {
    name: 'ASSAM GANA MUKTI SOCIETY',
    addressLines: [
      'in S.No. 22-5,22-6,22-7,22-9,22-10 &22-11Part,',
      'Purushottapuram Revenue Village,',
      'Peddapalem Panchayat,',
      'Surubujjili Mandal,',
      'Srikakulam District-532190,',
      'Andhra Pradesh.',
    ],
  },
  particular: {
    sNo: '1.',
    title: 'Construction of "DIVINE SAVIOUR ENGLISH MEDEM SCHOOL"',
    subtitleLines: [
      'Peddapalem Panchayat, Surubujjili Mandal, Srikakulam District-532190, Andhra Pradesh.',
      '1. Construction Mobilization Payment',
    ],
    hsnCode: '9954',
  },
  amountBeforeGst: 3391724,
  cgstRate: 9,
  sgstRate: 9,
  tdsRate: 2,
};
