import React from 'react';
import type { InvoiceData } from '../types/invoice';
import {
  formatPropertyValue,
  formatServiceCharge,
  formatGstAmount,
  formatTotalAmount,
  formatSummaryTotal,
  calculateValuationInvoice,
} from '../utils/formatters';
import { numberToIndianWords } from '../utils/numberToWords';

interface InvoiceTemplateProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const valCalc = calculateValuationInvoice(data.charges);
  const gstMode = data.charges.gstMode || 'split';
  const isSplit = gstMode === 'split';
  const isNone = gstMode === 'none';
  const isOther = gstMode === 'other';
  const isSingle = data.exportPortion === 'single';

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
        lineHeight: 1.2,
      }}
    >
      {/* Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '3px' }}>
        <h1
          style={{
            fontSize: '15px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textDecoration: 'underline',
            letterSpacing: '0.04em',
            margin: 0,
            color: '#000000',
          }}
        >
          {data.headerTitle || 'INVOICE CASH/CREDIT CARD'}
        </h1>
      </div>

      {/* Recipient and Meta Info Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '3px',
          fontSize: '11.5px',
          lineHeight: 1.2,
        }}
      >
        {/* Left: Recipient */}
        <div>
          <div style={{ fontWeight: 'normal', marginBottom: '1px' }}>To</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.to || 'The Branch Manager'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.bank || 'State Bank of India'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.branch || 'Main Branch'}</div>
          <div style={{ fontWeight: 'bold' }}>{data.recipient.district || 'Srikakulam District'}</div>
        </div>

        {/* Right: Invoice Meta */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '13px' }}>
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
      <div style={{ fontSize: '11.5px', marginBottom: '3px', fontWeight: 'normal' }}>
        Please arrange service charges for valuations of below mentioned property
      </div>

      {/* Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #000000',
          fontSize: '11px',
          marginBottom: '4px',
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #000000', textAlign: 'center', verticalAlign: 'top' }}>
            <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: '5%' }}>
              S.<br />No
            </th>
            <th
              style={{
                borderRight: '1px solid #000000',
                padding: '2.5px 4px',
                fontWeight: 'normal',
                width: isNone ? '41%' : isSplit ? '36%' : '38%',
                textAlign: 'left',
              }}
            >
              Owner Name and Address of <br />the property
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: isNone ? '13%' : '11%' }}>
              Type of <br />property
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: isNone ? '17%' : '15%' }}>
              Completion of <br />the property <br />Rupees
            </th>
            <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: isNone ? '13%' : '11%' }}>
              Service <br />Charges in <br />Rupees
            </th>

            {/* Split GST Headers (2 Parts) */}
            {isSplit && (
              <>
                <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: '6%' }}>
                  CGST <br />{data.charges.cgstRate ?? 9}%
                </th>
                <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: '6%' }}>
                  SGST <br />{data.charges.sgstRate ?? 9}%
                </th>
              </>
            )}

            {/* Other GST Header */}
            {isOther && (
              <th style={{ borderRight: '1px solid #000000', padding: '2.5px 3px', fontWeight: 'normal', width: '7%' }}>
                GST <br />{data.charges.otherRate ?? 18}%
              </th>
            )}

            <th style={{ padding: '2.5px 3px', fontWeight: 'normal', width: isNone ? '11%' : '10%' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Main Data Row */}
          <tr style={{ verticalAlign: 'top', borderBottom: '1px solid #000000' }}>
            {/* S. No */}
            <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center', fontWeight: 'bold' }}>
              1
            </td>

            {/* Owner & Address Details */}
            <td style={{ borderRight: '1px solid #000000', padding: '3px 4px', lineHeight: 1.2 }}>
              {data.property.ownerCompany && (
                <div style={{ fontWeight: 'bold' }}>{data.property.ownerCompany}</div>
              )}
              {data.property.propertyName && (
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{data.property.propertyName},</div>
              )}

              {/* Numbered Owners */}
              {data.property.owners && data.property.owners.filter((o) => o.trim() !== '').length > 0 && (
                <div style={{ marginBottom: '2px' }}>
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

              {/* Additional Property Info (Optional) */}
              {data.property.additionalInfo && data.property.additionalInfo.trim() !== '' && (
                <div style={{ marginTop: '2px', fontStyle: 'italic', color: '#111827' }}>
                  {data.property.additionalInfo}
                </div>
              )}
            </td>

            {/* Type of Property */}
            <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center' }}>
              {data.property.propertyType}
            </td>

            {/* Completion of Property */}
            <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center', fontWeight: 'bold' }}>
              {formatPropertyValue(data.property.propertyValue)}
            </td>

            {/* Service Charges */}
            <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center' }}>
              {formatServiceCharge(valCalc.baseAmount)}
            </td>

            {/* Split GST Row Cells (2 Parts) */}
            {isSplit && (
              <>
                <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center' }}>
                  {formatGstAmount(valCalc.cgstAmount)}
                </td>
                <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center' }}>
                  {formatGstAmount(valCalc.sgstAmount)}
                </td>
              </>
            )}

            {/* Other GST Row Cell */}
            {isOther && (
              <td style={{ borderRight: '1px solid #000000', padding: '3px 3px', textAlign: 'center' }}>
                {formatGstAmount(valCalc.gstAmount)}
              </td>
            )}

            {/* Total Row Cell */}
            <td style={{ padding: '3px 3px', textAlign: 'center' }}>
              {formatTotalAmount(valCalc.totalAmount)}
            </td>
          </tr>

          {/* Total Summary Row */}
          <tr style={{ verticalAlign: 'middle' }}>
            <td
              colSpan={isNone ? 5 : isSplit ? 7 : 6}
              style={{ borderRight: '1px solid #000000', padding: '2.5px 6px', fontWeight: 'bold', textAlign: 'left' }}
            >
              Total
              {valCalc.otherAmount > 0 ? ` (Incl. Other: Rs. ${valCalc.otherAmount}/-)` : ''}
            </td>
            <td style={{ padding: '2.5px 3px', textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {formatSummaryTotal(valCalc.totalAmount)}
            </td>
          </tr>

          {/* Amount in Words Row */}
          <tr style={{ verticalAlign: 'middle', borderTop: '1px solid #000000' }}>
            <td
              colSpan={isNone ? 6 : isSplit ? 8 : 7}
              style={{
                padding: '2.5px 6px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '10.5px',
                backgroundColor: '#ffffff',
              }}
            >
              Amount in words: <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{numberToIndianWords(valCalc.totalAmount)}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2px', fontSize: '11.5px', lineHeight: 1.2 }}>
        {/* From / Valuer Info */}
        <div>
          <div style={{ fontWeight: 'normal', marginBottom: '1px' }}>From</div>
          <div style={{ fontWeight: 'bold' }}>{data.valuer.name}</div>
          <div style={{ fontWeight: 'bold' }}>{data.valuer.accountNo}</div>
          <div style={{ fontWeight: 'normal' }}>{data.valuer.bankName}</div>
          <div style={{ fontWeight: 'normal' }}>{data.valuer.branchName}</div>
          {data.valuer.ifsc && data.valuer.ifsc.trim() !== '' && (
            <div style={{ fontWeight: 'normal' }}>IFSC: {data.valuer.ifsc}</div>
          )}
          {data.valuer.other && data.valuer.other.trim() !== '' && (
            <div style={{ fontWeight: 'normal' }}>{data.valuer.other}</div>
          )}
        </div>

        {/* Sign of Valuer */}
        <div style={{ fontWeight: 'bold', textAlign: 'right', paddingBottom: '2px' }}>
          Sign., Of Valuer
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="invoice-print-area"
      data-portion={isSingle ? 'single' : 'full'}
      className="print-area font-serif box-border mx-auto shadow-2xl print:shadow-none"
      style={{
        width: '210mm',
        height: isSingle ? '148.5mm' : '297mm',
        minHeight: isSingle ? '148.5mm' : '297mm',
        padding: isSingle ? '8mm 14mm 6mm 14mm' : '12mm 14mm 8mm 14mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isSingle ? 'flex-start' : 'space-between',
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      {isSingle ? (
        /* Single Portion (Half Page Copy) */
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <InvoiceCopy />
        </div>
      ) : (
        /* Full Dual-Copy Invoice (Original 2-Copy Master Document) */
        <>
          {/* Top Invoice Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '4px' }}>
            <InvoiceCopy />
          </div>

          {/* Dashed Separator between Copies */}
          <div
            style={{
              width: '100%',
              marginTop: '5px',
              marginBottom: '5px',
              borderBottom: '1px dashed #777777',
            }}
          />

          {/* Bottom Invoice Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingBottom: '2px' }}>
            <InvoiceCopy />
          </div>
        </>
      )}
    </div>
  );
};
