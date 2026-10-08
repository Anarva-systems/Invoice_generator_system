import React from 'react';
import type { ConstructionInvoiceData } from '../types/invoice';
import { calculateConstructionInvoice, formatRupeeAmount } from '../utils/formatters';
import { numberToIndianWords } from '../utils/numberToWords';

interface ConstructionInvoiceTemplateProps {
  data: ConstructionInvoiceData;
}

export const ConstructionInvoiceTemplate: React.FC<ConstructionInvoiceTemplateProps> = ({ data }) => {
  const totals = calculateConstructionInvoice(
    data.amountBeforeGst,
    data.cgstRate,
    data.sgstRate,
    data.tdsRate
  );

  const totalInvoiceWords = numberToIndianWords(totals.totalInvoiceValue);
  const totalAfterTdsWords = numberToIndianWords(totals.totalAfterTds);

  const proprietorTitleText = data.supplier.proprietorTitle
    ? data.supplier.proprietorTitle.trim().endsWith('of')
      ? data.supplier.proprietorTitle.trim()
      : `${data.supplier.proprietorTitle.trim()} of`
    : 'PROPRIETOR of';

  return (
    <div
      id="invoice-print-area"
      className="print-area font-serif box-border mx-auto shadow-2xl print:shadow-none"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '12mm 16mm 12mm 16mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textDecoration: 'underline',
            letterSpacing: '0.05em',
            margin: 0,
            color: '#000000',
          }}
        >
          INVOICE
        </h1>
      </div>

      {/* Main Document Border Box */}
      <div
        style={{
          border: '1px solid #000000',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '13px',
          lineHeight: 1.3,
        }}
      >
        {/* Top Header Row (Supplier & Invoice Meta) */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000000' }}>
          {/* Left: Supplier Block */}
          <div style={{ width: '52%', padding: '6px 8px', borderRight: '1px solid #000000' }}>
            <div style={{ fontWeight: 'normal' }}>From</div>
            <div style={{ fontWeight: 'bold' }}>{data.supplier.name}</div>
            <div style={{ fontWeight: 'bold' }}>{proprietorTitleText}</div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {data.supplier.companyName}
            </div>
            <div>GSTIN &nbsp;&nbsp;: {data.supplier.gstin}</div>
            <div>
              STATE &nbsp;: {data.supplier.state} Code: {data.supplier.stateCode}
            </div>
            <div>PAN &nbsp;&nbsp;&nbsp;&nbsp;: {data.supplier.pan}</div>
            <div>A/C NO &nbsp;: {data.supplier.accountNo}</div>
            <div>BANK &nbsp;&nbsp;&nbsp;: {data.supplier.bankName}</div>
            <div>BRANCH &nbsp;: {data.supplier.branchName}</div>
          </div>

          {/* Right: Invoice Meta & References */}
          <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
            {/* Invoice No & Dated */}
            <div style={{ display: 'flex', borderBottom: '1px solid #000000' }}>
              <div style={{ width: '55%', padding: '6px 8px', borderRight: '1px solid #000000' }}>
                <div>Invoice No:</div>
                <div style={{ fontWeight: 'bold' }}>{data.invoiceNo}</div>
              </div>
              <div style={{ width: '45%', padding: '6px 8px' }}>
                <div>Dated:</div>
                <div style={{ fontWeight: 'bold' }}>{data.dated}</div>
              </div>
            </div>

            {/* Supplier's Ref */}
            <div style={{ padding: '6px 8px', borderBottom: '1px solid #000000', minHeight: '38px' }}>
              <div>Supplier's Ref.</div>
              <div>{data.suppliersRef}</div>
            </div>

            {/* Buyers' Order No */}
            <div style={{ padding: '6px 8px', flex: 1, minHeight: '38px' }}>
              <div>Buyers' Order No.</div>
              <div>{data.buyersOrderNo}</div>
            </div>
          </div>
        </div>

        {/* Recipient Block (To) */}
        <div style={{ padding: '6px 8px', borderBottom: '1px solid #000000' }}>
          <div>To,</div>
          <div style={{ fontWeight: 'bold' }}>{data.buyer.name}</div>
          {data.buyer.addressLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>

        {/* Main Items & Calculation Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            color: '#000000',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left' }}>
              <th style={{ borderRight: '1px solid #000000', padding: '6px 8px', width: '6%' }}>S.NO</th>
              <th style={{ borderRight: '1px solid #000000', padding: '6px 8px', width: '41%' }}>PARTICULARS</th>
              <th style={{ borderRight: '1px solid #000000', padding: '6px 8px', width: '8%', textAlign: 'center' }}>HSN</th>
              <th style={{ padding: '6px 8px', width: '45%', textAlign: 'right' }}>AMOUNT(₹)</th>
            </tr>
          </thead>
          <tbody>
            {/* Particulars Row */}
            <tr style={{ verticalAlign: 'top' }}>
              {/* S.NO */}
              <td style={{ borderRight: '1px solid #000000', padding: '8px', fontWeight: 'bold' }}>
                {data.particular.sNo}
              </td>

              {/* PARTICULARS Text */}
              <td style={{ borderRight: '1px solid #000000', padding: '8px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 'normal' }}>{data.particular.title}</div>
                {data.particular.subtitleLines.map((sub, idx) => (
                  <div key={idx} style={{ marginTop: '2px' }}>
                    {sub}
                  </div>
                ))}
              </td>

              {/* HSN */}
              <td style={{ borderRight: '1px solid #000000', padding: '8px', textAlign: 'center' }}>
                {data.particular.hsnCode}
              </td>

              {/* Calculation Summary Subtable */}
              <td style={{ padding: 0, verticalAlign: 'top' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {/* 1. Total amount before GST */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000', width: '60%' }}>
                        Total amount before GST
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold', width: '40%' }}>
                        {formatRupeeAmount(totals.baseAmount)}
                      </td>
                    </tr>

                    {/* 2. CGST */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000' }}>
                        (add)&nbsp;&nbsp;&nbsp;
                        <span style={{ color: '#0000ff', textDecoration: 'underline' }}>
                          CGST@{data.cgstRate}%
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatRupeeAmount(totals.cgstAmount)}
                      </td>
                    </tr>

                    {/* 3. SGST */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000' }}>
                        (add)&nbsp;&nbsp;&nbsp;
                        <span style={{ color: '#0000ff', textDecoration: 'underline' }}>
                          SGST@{data.sgstRate}%
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatRupeeAmount(totals.sgstAmount)}
                      </td>
                    </tr>

                    {/* 4. TOTAL INVOICE VALUE */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000', fontWeight: 'bold' }}>
                        TOTAL INVOICE VALUE
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatRupeeAmount(totals.totalInvoiceValue)}
                      </td>
                    </tr>

                    {/* 5. Total Invoice Value in Words */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td colSpan={2} style={{ padding: '6px 8px', fontWeight: 'bold' }}>
                        {totalInvoiceWords}
                      </td>
                    </tr>

                    {/* 6. TDS Deduction */}
                    <tr style={{ borderBottom: '1px solid #000000' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000', whiteSpace: 'nowrap' }}>
                        (Less)&nbsp;&nbsp;&nbsp;TDS {data.tdsRate}% of Bill Amount
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatRupeeAmount(totals.tdsAmount)}
                      </td>
                    </tr>

                    {/* 7. Total Amount after TDS */}
                    <tr>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #000000', fontWeight: 'bold' }}>
                        Total amount after TDS
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatRupeeAmount(totals.totalAfterTds)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            {/* Total Amount after TDS Words Row across full table */}
            <tr style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000' }}>
              <td colSpan={4} style={{ padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>
                {totalAfterTdsWords}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Signatory Section */}
        <div
          style={{
            padding: '16px 16px 8px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            minHeight: '110px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold' }}>{data.supplier.name}</div>
            <div style={{ fontWeight: 'bold' }}>
              Proprietor of {data.supplier.companyName}
            </div>
          </div>

          <div style={{ fontWeight: 'bold', paddingTop: '32px' }}>
            Authorised Signatory
          </div>
        </div>
      </div>
    </div>
  );
};
