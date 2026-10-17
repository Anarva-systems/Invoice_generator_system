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

  const totalBillNum = typeof data.payment.totalBillAmount === 'number'
    ? data.payment.totalBillAmount
    : parseFloat(String(data.payment.totalBillAmount || 0).replace(/,/g, '')) || 0;

  const balanceNum = typeof data.payment.balanceRemaining === 'number'
    ? data.payment.balanceRemaining
    : parseFloat(String(data.payment.balanceRemaining || 0).replace(/,/g, '')) || 0;

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
              <td style={{ width: '30%', padding: '7px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                Payment Purpose / Towards
              </td>
              <td style={{ padding: '7px 10px', fontWeight: 'normal' }}>
                {data.payment.paymentTowards || 'Payment towards Construction & Civil Works'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '7px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                Payment Mode
              </td>
              <td style={{ padding: '7px 10px', fontWeight: 'bold', color: '#1e3a8a' }}>
                {data.payment.mode}
              </td>
            </tr>
            {data.payment.transactionRef && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '7px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                  Cheque / Txn / UTR Ref.
                </td>
                <td style={{ padding: '7px 10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {data.payment.transactionRef}
                  {data.payment.transactionDate ? ` (Dated: ${data.payment.transactionDate})` : ''}
                </td>
              </tr>
            )}
            {data.payment.bankName && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '7px 10px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #000000' }}>
                  Drawn On Bank / Branch
                </td>
                <td style={{ padding: '7px 10px' }}>
                  {data.payment.bankName}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* High-Impact Amount Highlight Box */}
        <div
          style={{
            border: '2px solid #000000',
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Amount Received:
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: "'Times New Roman', serif",
                color: '#047857',
              }}
            >
              ₹ {numericAmount.toLocaleString('en-IN')}/-
            </span>
          </div>

          <div
            style={{
              marginTop: '6px',
              paddingTop: '6px',
              borderTop: '1px dashed #777777',
              fontSize: '12px',
              fontStyle: 'italic',
            }}
          >
            <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Amount in words: </span>
            {amountInWords}
          </div>

          {(totalBillNum > 0 || balanceNum > 0) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                paddingTop: '6px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '11.5px',
                color: '#334155',
              }}
            >
              {totalBillNum > 0 && (
                <div>
                  <span style={{ fontWeight: 'normal' }}>Total Bill Value: </span>
                  <span style={{ fontWeight: 'bold' }}>₹ {totalBillNum.toLocaleString('en-IN')}</span>
                </div>
              )}
              {balanceNum > 0 && (
                <div>
                  <span style={{ fontWeight: 'normal' }}>Balance Outstanding: </span>
                  <span style={{ fontWeight: 'bold', color: '#b91c1c' }}>
                    ₹ {balanceNum.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          )}
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
