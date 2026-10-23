import React from 'react';
import type { ClientReceiptData } from '../types/invoice';
import { numberToIndianWords } from '../utils/numberToWords';

interface ClientReceiptTemplateProps {
  data: ClientReceiptData;
}

export const ClientReceiptTemplate: React.FC<ClientReceiptTemplateProps> = ({ data }) => {
  const numericAmount = typeof data.payment.amount === 'number'
    ? data.payment.amount
    : parseFloat(String(data.payment.amount).replace(/,/g, '')) || 0;

  const pastAmountNum = typeof data.payment.pastAmountReceived === 'number'
    ? data.payment.pastAmountReceived
    : parseFloat(String(data.payment.pastAmountReceived || 0).replace(/,/g, '')) || 0;

  const totalBillNum = typeof data.payment.totalBillAmount === 'number'
    ? data.payment.totalBillAmount
    : parseFloat(String(data.payment.totalBillAmount || 0).replace(/,/g, '')) || 0;

  const totalReceivedNum = pastAmountNum + numericAmount;

  const balanceNum = totalBillNum > 0
    ? (totalBillNum > totalReceivedNum ? totalBillNum - totalReceivedNum : 0)
    : (typeof data.payment.balanceRemaining === 'number'
        ? data.payment.balanceRemaining
        : parseFloat(String(data.payment.balanceRemaining || 0).replace(/,/g, '')) || 0);

  const amountInWords = numberToIndianWords(numericAmount);
  const isSingle = data.exportPortion === 'single';
  const showTable = data.showPaymentTable !== false;

  const hasTableRows = !!(
    data.payment.paymentTowards ||
    data.payment.otherTagged ||
    data.payment.mode ||
    data.payment.transactionRef ||
    data.payment.bankName
  );

  const ReceiptCopy = () => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Times New Roman', Times, serif",
        color: '#000000',
        backgroundColor: 'transparent',
        lineHeight: 1.25,
      }}
    >
      {/* Subtle Company Logo Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          opacity: 0.055,
        }}
      >
        <img
          src="/satya_sai_logo.png"
          alt="Watermark"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header with Logo & Letterhead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1.5px solid #000000',
            paddingBottom: '4px',
            marginBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/satya_sai_logo.png"
              alt="Satya Sai Logo"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                borderRadius: '50%',
                border: '1px solid #cccccc',
                padding: '1px',
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  letterSpacing: '0.03em',
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#000000',
                  lineHeight: 1.15,
                }}
              >
                {data.company.name || 'SATYA SAI CONSTRUCTIONS'}
              </h1>
              <div style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#222222', lineHeight: 1.2 }}>
                {data.company.tagline || 'Consultant Civil Engineer, Approved Valuers& Contractors and Builders'}
              </div>
              <div style={{ fontSize: '8.5px', color: '#444444', lineHeight: 1.2 }}>
                {data.company.address}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '9px', lineHeight: 1.25 }}>
            <div><span style={{ fontWeight: 'bold' }}>GSTIN:</span> {data.company.gstin}</div>
            <div><span style={{ fontWeight: 'bold' }}>PAN:</span> {data.company.pan}</div>
            <div style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.02em', fontSize: '9.5px' }}>
              OFFICIAL PAYMENT VOUCHER
            </div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div style={{ textAlign: 'center', margin: '2px 0 4px 0' }}>
          <h2
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              letterSpacing: '0.05em',
              margin: 0,
              display: 'inline-block',
            }}
          >
            {data.headerTitle || 'CLIENT PAYMENT RECEIPT'}
          </h2>
        </div>

        {/* Voucher Meta Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #000000',
            padding: '3px 8px',
            fontSize: '9.5px',
            marginBottom: '4px',
          }}
        >
          <div>
            <span style={{ fontWeight: 'normal' }}>Receipt No: </span>
            <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.receiptNo}</span>
          </div>
          <div>
            <span style={{ fontWeight: 'normal' }}>Date: </span>
            <span style={{ fontWeight: 'bold' }}>{data.receiptDate}</span>
          </div>
          {data.referenceNo && (
            <div>
              <span style={{ fontWeight: 'normal' }}>Ref / Invoice No: </span>
              <span style={{ fontWeight: 'bold' }}>{data.referenceNo}</span>
            </div>
          )}
        </div>

        {/* Payer Details Section */}
        <div
          style={{
            border: '1px solid #000000',
            padding: '4px 8px',
            marginBottom: '4px',
            fontSize: '9.5px',
            lineHeight: 1.3,
          }}
        >
          <div style={{ fontSize: '8.5px', textTransform: 'uppercase', color: '#555555', fontWeight: 'bold' }}>
            Received With Thanks From:
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000000' }}>
            {data.client.name}
          </div>
          {data.client.companyName && (
            <div style={{ fontWeight: 'bold', fontSize: '9.5px' }}>
              {data.client.companyName}
            </div>
          )}
          {data.client.address && (
            <div style={{ color: '#222222', fontSize: '9px' }}>
              {data.client.address}
            </div>
          )}
          <div style={{ display: 'flex', gap: '14px', marginTop: '1px', fontSize: '9px' }}>
            {data.client.phone && <div><span style={{ fontWeight: 'bold' }}>Phone:</span> {data.client.phone}</div>}
            {data.client.gstin && <div><span style={{ fontWeight: 'bold' }}>GSTIN:</span> {data.client.gstin}</div>}
          </div>
        </div>

        {/* Payment Particulars Table (Optional) */}
        {showTable && hasTableRows && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #000000',
              fontSize: '9.5px',
              marginBottom: '4px',
            }}
          >
            <tbody>
              {data.payment.paymentTowards && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ width: '32%', padding: '2.5px 6px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                    Payment Towards
                  </td>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'normal' }}>
                    {data.payment.paymentTowards}
                  </td>
                </tr>
              )}
              {data.payment.otherTagged && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                    Stage / Milestone / Other Tag
                  </td>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', color: '#000000' }}>
                    {data.payment.otherTagged}
                  </td>
                </tr>
              )}
              {data.payment.mode && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                    Payment Mode
                  </td>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', color: '#000000' }}>
                    {data.payment.mode}
                  </td>
                </tr>
              )}
              {data.payment.transactionRef && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                    Cheque / Txn / UTR Ref.
                  </td>
                  <td style={{ padding: '2.5px 6px', fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' }}>
                    {data.payment.transactionRef}
                    {data.payment.transactionDate ? ` (Dated: ${data.payment.transactionDate})` : ''}
                  </td>
                </tr>
              )}
              {data.payment.bankName && (
                <tr>
                  <td style={{ padding: '2.5px 6px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                    Drawn On Bank / Branch
                  </td>
                  <td style={{ padding: '2.5px 6px', color: '#000000' }}>
                    {data.payment.bankName}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Amount Received & Accounting Ledger Box */}
        <div
          style={{
            border: '1.5px solid #000000',
            backgroundColor: '#ffffff',
            padding: '5px 8px',
            marginBottom: '4px',
          }}
        >
          {/* Main Present Voucher Amount Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #000000',
              padding: '4px 8px',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.03em', color: '#000000' }}>
                Current Amount Received:
              </span>
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                fontFamily: "'Times New Roman', serif",
                color: '#000000',
              }}
            >
              ₹ {numericAmount.toLocaleString('en-IN')}/-
            </span>
          </div>

          {/* Amount in words */}
          <div
            style={{
              marginTop: '3px',
              padding: '2px 0',
              fontSize: '9.5px',
              fontStyle: 'italic',
              color: '#000000',
            }}
          >
            <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Amount in words: </span>
            {amountInWords}
          </div>

          {/* Formal Accounting Breakdown Table */}
          <table
            style={{
              width: '100%',
              marginTop: '3px',
              borderCollapse: 'collapse',
              border: '1px solid #000000',
              fontSize: '9px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000000' }}>
                <th style={{ padding: '3px 6px', textAlign: 'left', fontWeight: 'bold', color: '#000000', borderRight: '1px solid #000000' }}>
                  Payment Accounting Breakdown
                </th>
                <th style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', color: '#000000', width: '32%' }}>
                  Amount in INR (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {totalBillNum > 0 && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ padding: '3px 6px', color: '#000000', borderRight: '1px solid #000000' }}>
                    1. Total Project / Contract Value:
                  </td>
                  <td style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                    ₹ {totalBillNum.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#fafafa' }}>
                <td style={{ padding: '3px 6px', color: '#000000', borderRight: '1px solid #000000' }}>
                  2. Past Payments Received - History:
                </td>
                <td style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                  ₹ {pastAmountNum.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#ffffff' }}>
                <td style={{ padding: '3px 6px', color: '#000000', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  3. Present Payment Received - Now:
                </td>
                <td style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                  ₹ {numericAmount.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '3px 6px', color: '#000000', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  4. Total Cumulative Received to Date:
                </td>
                <td style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                  ₹ {totalReceivedNum.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <td style={{ padding: '3px 6px', color: '#000000', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  5. Net Balance Amount to Pay:
                </td>
                <td style={{ padding: '3px 6px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '10.5px', color: '#000000' }}>
                  ₹ {balanceNum.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Section */}
        <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            {/* Client Sign Box */}
            <div style={{ textAlign: 'center', width: '160px' }}>
              <div style={{ height: '24px' }} />
              <div style={{ borderTop: '1px solid #000000', paddingTop: '2px', fontSize: '9.5px', fontWeight: 'bold' }}>
                Customer / Payer's Signature
              </div>
            </div>

            {/* Company Stamp & Authorized Signatory */}
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '18px' }}>
                For {data.company.name || 'SATYA SAI CONSTRUCTIONS'}
              </div>
              <div style={{ borderTop: '1px solid #000000', paddingTop: '2px', fontSize: '9.5px', fontWeight: 'bold' }}>
                {data.company.authorizedSignatory || 'B. Satyanarayana'}
              </div>
              <div style={{ fontSize: '8.5px', color: '#444444' }}>
                Authorised Signatory
              </div>
            </div>
          </div>
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
        padding: isSingle ? '8mm 14mm 6mm 14mm' : '10mm 14mm 8mm 14mm',
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
          <ReceiptCopy />
        </div>
      ) : (
        /* Full Dual-Copy Receipt (2 in 1 Master Document) */
        <>
          {/* Top Receipt Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <ReceiptCopy />
          </div>

          {/* Dashed Separator between Copies */}
          <div
            style={{
              width: '100%',
              marginTop: '4px',
              marginBottom: '4px',
              borderBottom: '1px dashed #777777',
            }}
          />

          {/* Bottom Receipt Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <ReceiptCopy />
          </div>
        </>
      )}
    </div>
  );
};
