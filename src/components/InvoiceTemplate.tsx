import React from 'react';
import type { InvoiceData } from '../types/invoice';
import {
  formatPropertyValue,
  formatServiceCharge,
  formatGstAmount,
  formatTotalAmount,
  formatSummaryTotal,
  calculateGST,
  calculateTotal,
} from '../utils/formatters';

interface InvoiceTemplateProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const gstAmount = calculateGST(data.charges.serviceCharges, data.charges.gstRate);
  const totalAmount = calculateTotal(data.charges.serviceCharges, gstAmount);

  // Single Invoice Copy Component
  const InvoiceCopy = () => (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Times New Roman', Times, serif",
        color: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: 1.25,
      }}
    >
      {/* Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1
          style={{
            fontSize: '18px',
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

      {/* Recipient and Meta Info Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
          fontSize: '13px',
          lineHeight: 1.3,
        }}
      >
        {/* Left: Recipient */}
        <div>
          <div style={{ fontWeight: 'normal', marginBottom: '2px' }}>To</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.to || 'The Branch Manager'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.bank || 'State Bank of India'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.branch || 'Main Branch'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.district || 'Srikakulam District'}</div>
        </div>

        {/* Right: Invoice Meta */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px' }}>
            No.{data.invoiceNo}
          </div>
          <div>
            <span style={{ fontWeight: 'normal' }}>Date: </span>
            <span style={{ fontWeight: 'normal' }}>{data.invoiceDate}</span>
          </div>
          <div>
            <span style={{ fontWeight: 'normal' }}>Date of Valuation: </span>
            <span style={{ fontWeight: 'normal' }}>{data.valuationDate}</span>
          </div>
        </div>
      </div>

      {/* Request Line */}
      <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: 'normal' }}>
        Please arrange service charges for valuations of below mentioned property
      </div>

      {/* Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #000000',
          fontSize: '12px',
          marginBottom: '10px',
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #000000', textAlign: 'center', verticalAlign: 'top' }}>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '6%' }}>
              S.<br />No
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '38%', textAlign: 'left' }}>
              Owner Name and Address of <br />the property
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '12%' }}>
              Type of <br />property
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '16%' }}>
              Completion of <br />the property <br />Rupees
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '12%' }}>
              Service <br />Charges in <br />Rupees
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '4px', fontWeight: 'normal', width: '7%' }}>
              GST <br />{data.charges.gstRate}%
            </th>
            <th style={{ padding: '4px', fontWeight: 'normal', width: '9%' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Main Data Row */}
          <tr style={{ verticalAlign: 'top', borderBottom: '1px solid #000000' }}>
            {/* S. No */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold' }}>
              1
            </td>

            {/* Owner & Address Details */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 6px', lineHeight: 1.3 }}>
              {data.property.ownerCompany && (
                <div style={{ fontWeight: 'bold' }}>{data.property.ownerCompany}</div>
              )}
              {data.property.propertyName && (
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.property.propertyName},</div>
              )}

              {/* Numbered Owners */}
              {data.property.owners && data.property.owners.filter(o => o.trim() !== '').length > 0 && (
                <div style={{ marginBottom: '4px' }}>
                  {data.property.owners
                    .filter((owner) => owner.trim() !== '')
                    .map((owner, idx) => (
                      <div key={idx} style={{ fontWeight: 'bold' }}>
                        {idx + 1}. {owner}
                      </div>
                    ))}
                </div>
              )}

              {/* Address / Survey details */}
              <div>
                {data.property.surveyNo && <div>{data.property.surveyNo},</div>}
                {data.property.village && <div>{data.property.village} &</div>}
                <div>
                  {[
                    data.property.panchayati,
                    data.property.mandal ? `${data.property.mandal} Mandal` : '',
                  ]
                    .filter(Boolean)
                    .join(', ')}
                  {data.property.panchayati || data.property.mandal ? ',' : ''}
                </div>
                <div>
                  {data.property.district ? `${data.property.district}` : ''}
                  {data.property.pinCode ? `-${data.property.pinCode}.` : '.'}
                </div>
              </div>
            </td>

            {/* Type of Property */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 4px', textAlign: 'center' }}>
              {data.property.propertyType}
            </td>

            {/* Completion of Property */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 4px', textAlign: 'center', fontWeight: 'bold' }}>
              {formatPropertyValue(data.property.propertyValue)}
            </td>

            {/* Service Charges */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 4px', textAlign: 'center' }}>
              {formatServiceCharge(data.charges.serviceCharges)}
            </td>

            {/* GST */}
            <td style={{ borderRight: '1px solid #000000', padding: '6px 4px', textAlign: 'center' }}>
              {formatGstAmount(gstAmount)}
            </td>

            {/* Total */}
            <td style={{ padding: '6px 4px', textAlign: 'center' }}>
              {formatTotalAmount(totalAmount)}
            </td>
          </tr>

          {/* Total Summary Row */}
          <tr style={{ verticalAlign: 'middle' }}>
            <td colSpan={6} style={{ borderRight: '1px solid #000000', padding: '4px 8px', fontWeight: 'bold', textAlign: 'left' }}>
              Total
            </td>
            <td style={{ padding: '4px 4px', textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {formatSummaryTotal(totalAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px', fontSize: '13px', lineHeight: 1.3 }}>
        {/* From / Valuer Info */}
        <div>
          <div style={{ fontWeight: 'normal', marginBottom: '2px' }}>From</div>
          <div style={{ fontWeight: 'bold' }}>{data.valuer.name}</div>
          <div style={{ fontWeight: 'bold' }}>{data.valuer.accountNo}</div>
          <div style={{ fontWeight: 'normal' }}>{data.valuer.bankName}</div>
          <div style={{ fontWeight: 'normal' }}>{data.valuer.branchName}</div>
        </div>

        {/* Sign of Valuer */}
        <div style={{ fontWeight: 'bold', textAlign: 'right', paddingBottom: '4px' }}>
          Sign., Of Valuer
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="invoice-print-area"
      className="print-area font-serif box-border mx-auto shadow-2xl print:shadow-none"
      style={{
        width: '210mm',
        height: '297mm',
        padding: '12mm 16mm 10mm 16mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      {/* Top Invoice Copy */}
      <div style={{ height: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '4px' }}>
        <InvoiceCopy />
      </div>

      {/* Dashed Separator between Copies */}
      <div
        style={{
          width: '100%',
          marginTop: '8px',
          marginBottom: '8px',
          borderBottom: '1px dashed #666666',
        }}
      />

      {/* Bottom Invoice Copy */}
      <div style={{ height: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '4px' }}>
        <InvoiceCopy />
      </div>
    </div>
  );
};
