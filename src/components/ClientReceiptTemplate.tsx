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

  return (
    <div
      id="invoice-print-area"
      className="print-area font-serif box-border mx-auto shadow-2xl print:shadow-none"
      style={{
        position: 'relative',
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm 14mm 16mm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Subtle Company Logo Watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '380px',
          height: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          opacity: 0.065,
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

      {/* Main Content (Z-10) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Header with Logo & Letterhead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #000000',
            paddingBottom: '8px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/satya_sai_logo.png"
              alt="Satya Sai Logo"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                borderRadius: '50%',
                border: '1px solid #cccccc',
                padding: '2px',
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  letterSpacing: '0.04em',
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#000000',
                }}
              >
                {data.company.name}
              </h1>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333333' }}>
                {data.company.tagline}
              </div>
              <div style={{ fontSize: '11px', color: '#444444' }}>
                {data.company.address}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '11.5px', lineHeight: 1.3 }}>
            <div><span style={{ fontWeight: 'bold' }}>GSTIN:</span> {data.company.gstin}</div>
            <div><span style={{ fontWeight: 'bold' }}>PAN:</span> {data.company.pan}</div>
            <div style={{ color: '#047857', fontWeight: 'bold' }}>OFFICIAL PAYMENT VOUCHER</div>
          </div>
        </div>

        {/* Document Title Banner */}
        <div style={{ textAlign: 'center', margin: '8px 0 14px 0' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              letterSpacing: '0.06em',
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
            padding: '7px 12px',
            fontSize: '12.5px',
            marginBottom: '14px',
          }}
        >
          <div>
            <span style={{ fontWeight: 'normal' }}>Receipt No: </span>
            <span style={{ fontWeight: 'bold', color: '#b91c1c' }}>{data.receiptNo}</span>
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
            padding: '10px 14px',
            marginBottom: '14px',
            fontSize: '12.5px',
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666666', fontWeight: 'bold', marginBottom: '4px' }}>
            Received With Thanks From:
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#000000' }}>
            {data.client.name}
          </div>
          {data.client.companyName && (
            <div style={{ fontWeight: 'bold' }}>
              {data.client.companyName}
            </div>
          )}
          {data.client.address && (
            <div style={{ color: '#222222' }}>
              {data.client.address}
            </div>
          )}
          <div style={{ display: 'flex', gap: '20px', marginTop: '4px', fontSize: '12px' }}>
            {data.client.phone && <div><span style={{ fontWeight: 'bold' }}>Phone:</span> {data.client.phone}</div>}
            {data.client.gstin && <div><span style={{ fontWeight: 'bold' }}>GSTIN:</span> {data.client.gstin}</div>}
          </div>
        </div>

        {/* Payment Particulars Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #000000',
            fontSize: '12px',
            marginBottom: '14px',
          }}
        >
          <tbody>
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ width: '32%', padding: '6px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                Payment Purpose / Towards
              </td>
              <td style={{ padding: '6px 10px', fontWeight: 'normal' }}>
                {data.payment.paymentTowards || 'Payment towards Construction & Civil Works'}
              </td>
            </tr>
            {data.payment.otherTagged && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '6px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                  Stage / Milestone / Other Tag
                </td>
                <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#1e3a8a' }}>
                  {data.payment.otherTagged}
                </td>
              </tr>
            )}
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '6px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                Payment Mode
              </td>
              <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#1e3a8a' }}>
                {data.payment.mode}
              </td>
            </tr>
            {data.payment.transactionRef && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '6px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                  Cheque / Txn / UTR Ref.
                </td>
                <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {data.payment.transactionRef}
                  {data.payment.transactionDate ? ` (Dated: ${data.payment.transactionDate})` : ''}
                </td>
              </tr>
            )}
            {data.payment.bankName && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '6px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                  Drawn On Bank / Branch
                </td>
                <td style={{ padding: '6px 10px' }}>
                  {data.payment.bankName}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* High-Impact Amount Received & Complete History Ledger Box */}
        <div
          style={{
            border: '2px solid #000000',
            backgroundColor: '#ffffff',
            padding: '12px 14px',
            marginBottom: '14px',
          }}
        >
          {/* Main Present Voucher Amount Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              padding: '8px 12px',
              borderRadius: '4px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#166534' }}>
                Current Amount Received:
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', marginLeft: '6px', fontStyle: 'italic' }}>
                (ఈ రశీదు ద్వారా అందిన మొత్తం)
              </span>
            </div>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: "'Times New Roman', serif",
                color: '#15803d',
              }}
            >
              ₹ {numericAmount.toLocaleString('en-IN')}/-
            </span>
          </div>

          {/* Amount in words */}
          <div
            style={{
              marginTop: '6px',
              padding: '6px 2px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#1e293b',
            }}
          >
            <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Amount in words: </span>
            {amountInWords}
          </div>

          {/* Detailed Ledger Breakdown Table (History, Present, Cumulative, Balance) */}
          <table
            style={{
              width: '100%',
              marginTop: '8px',
              borderCollapse: 'collapse',
              border: '1px solid #000000',
              fontSize: '11.5px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000000' }}>
                <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 'bold', color: '#0f172a', borderRight: '1px solid #000000' }}>
                  Payment Accounting Breakdown (చెల్లింపుల లెక్కల వివరాలు)
                </th>
                <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a', width: '35%' }}>
                  Amount in INR (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {totalBillNum > 0 && (
                <tr style={{ borderBottom: '1px solid #000000' }}>
                  <td style={{ padding: '5px 8px', color: '#334155', borderRight: '1px solid #000000' }}>
                    1. Total Project / Contract Value (మొత్తం ఒప్పందం విలువ):
                  </td>
                  <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    ₹ {totalBillNum.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '5px 8px', color: '#1e40af', borderRight: '1px solid #000000' }}>
                  2. Past Payments Received - History (గతంలో అందిన మొత్తం):
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#1e40af' }}>
                  ₹ {pastAmountNum.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '5px 8px', color: '#166534', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  3. Present Payment Received - Now (ప్రస్తుతం ఈ రశీదులో అందినది):
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#15803d' }}>
                  ₹ {numericAmount.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#eff6ff' }}>
                <td style={{ padding: '5px 8px', color: '#0f172a', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  4. Total Cumulative Received to Date (మొత్తం ఇప్పటివరకు అందినది - [2 + 3]):
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#0f172a' }}>
                  ₹ {totalReceivedNum.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ backgroundColor: '#fef2f2' }}>
                <td style={{ padding: '6px 8px', color: '#991b1b', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                  5. Net Balance Amount to Pay (ఇంకా చెల్లించవలసిన మిగులు బాకీ):
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '13px', color: '#b91c1c' }}>
                  ₹ {balanceNum.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {data.notes && (
          <div style={{ fontSize: '11px', color: '#555555', fontStyle: 'italic', marginBottom: '14px' }}>
            * Note: {data.notes}
          </div>
        )}
      </div>

      {/* Signature Section at the bottom */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '12px',
          }}
        >
          {/* Client Sign Box */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ height: '50px' }} />
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              Customer / Payer's Signature
            </div>
          </div>

          {/* Company Stamp & Authorized Signatory */}
          <div style={{ textAlign: 'center', width: '240px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '40px' }}>
              For {data.company.name}
            </div>
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              {data.company.authorizedSignatory}
            </div>
            <div style={{ fontSize: '10.5px', color: '#444444' }}>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
