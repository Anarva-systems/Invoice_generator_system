import React from 'react';
import type { LaborPayslipData } from '../types/invoice';
import { numberToIndianWords } from '../utils/numberToWords';

interface LaborPayslipTemplateProps {
  data: LaborPayslipData;
}

export const LaborPayslipTemplate: React.FC<LaborPayslipTemplateProps> = ({ data }) => {
  const laborItems = data.laborItems || [];

  const totalLaborsCount = laborItems.reduce((acc, item) => {
    const count = typeof item.numberOfLabors === 'number'
      ? item.numberOfLabors
      : parseFloat(String(item.numberOfLabors || 0).replace(/[^0-9.]/g, '')) || 0;
    return acc + count;
  }, 0);

  const totalGrossAmount = laborItems.reduce((acc, item) => {
    const amt = typeof item.amount === 'number'
      ? item.amount
      : parseFloat(String(item.amount || 0).replace(/[^0-9.]/g, '')) || 0;
    return acc + amt;
  }, 0);

  const advance = typeof data.advanceDeduction === 'number'
    ? data.advanceDeduction
    : parseFloat(String(data.advanceDeduction || 0).replace(/[^0-9.]/g, '')) || 0;

  const netWagesPaid = Math.max(0, totalGrossAmount - advance);
  const amountInWords = numberToIndianWords(netWagesPaid);
  const isSingle = data.exportPortion === 'single';

  const PayslipCopy = () => (
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

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Company Header Banner */}
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
                {data.supervisor.companyName || 'SATYA SAI CONSTRUCTIONS'}
              </h1>
              <div style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#222222', lineHeight: 1.2 }}>
                Civil Engineering, Builders & Commercial Contractors
              </div>
              <div style={{ fontSize: '8.5px', color: '#333333', lineHeight: 1.2 }}>
                Upstairs: B.M.P.S, Near Diamond Park, New Colony, SRIKAKULAM - 532001
              </div>
              <div style={{ fontSize: '8px', color: '#555555' }}>
                Mob: +91 98490 17375 | Phone: +91 8942 227475 | Email: satyasaiconstructions04@gmail.com
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '9px', lineHeight: 1.25 }}>
            <div style={{ fontWeight: 'bold', color: '#000000', letterSpacing: '0.02em', fontSize: '9.5px' }}>
              LABOR WAGE DISBURSEMENT
            </div>
            <div><span style={{ fontWeight: 'bold' }}>Voucher No:</span> <span style={{ color: '#000000', fontWeight: 'bold' }}>{data.voucherNo}</span></div>
            <div><span style={{ fontWeight: 'bold' }}>Date:</span> {data.paymentDate}</div>
          </div>
        </div>

        {/* Title Banner (Telugu Subtitle Removed) */}
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
            DAILY LABOR WAGE SLIP / PAYMENT VOUCHER
          </h2>
        </div>

        {/* Worker & Location Card (Clean English Only) */}
        <div
          style={{
            border: '1px solid #000000',
            backgroundColor: '#f8fafc',
            padding: '4px 8px',
            marginBottom: '4px',
            fontSize: '9.5px',
            lineHeight: 1.35,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3px 12px' }}>
            <div>
              <span style={{ fontWeight: 'normal', color: '#444444' }}>Worker / In-Charge Name: </span>
              <span style={{ fontWeight: 'bold', fontSize: '10.5px', color: '#000000' }}>{data.worker.name}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: '#444444' }}>Wage Period: </span>
              <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.wagePeriod}</span>
            </div>
            {data.worker.trade && (
              <div>
                <span style={{ fontWeight: 'normal', color: '#444444' }}>Role / Trade: </span>
                <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.worker.trade}</span>
              </div>
            )}
            {data.worker.phone && (
              <div>
                <span style={{ fontWeight: 'normal', color: '#444444' }}>Contact Phone: </span>
                <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.worker.phone}</span>
              </div>
            )}
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontWeight: 'normal', color: '#444444' }}>Project Site Location: </span>
              <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.siteLocation}</span>
            </div>
          </div>
        </div>

        {/* 5-Column Wage & Labor Breakdown Table (Clean English Only) */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #000000',
            fontSize: '9.5px',
            marginBottom: '4px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000000', textAlign: 'center' }}>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #000000', width: '8%', color: '#000000' }}>S.No</th>
              <th style={{ padding: '3px 8px', borderRight: '1px solid #000000', textAlign: 'left', color: '#000000' }}>
                Labour Type
              </th>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #000000', width: '22%', color: '#000000' }}>
                Number of Labours
              </th>
              <th style={{ padding: '3px 6px', borderRight: '1px solid #000000', width: '20%', textAlign: 'right', color: '#000000' }}>
                Rate / Unit (₹)
              </th>
              <th style={{ padding: '3px 8px', width: '24%', textAlign: 'right', color: '#000000' }}>
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {laborItems.map((item, index) => {
              const count = typeof item.numberOfLabors === 'number'
                ? item.numberOfLabors
                : parseFloat(String(item.numberOfLabors || 0).replace(/[^0-9.]/g, '')) || 0;
              const rate = typeof item.ratePerUnit === 'number'
                ? item.ratePerUnit
                : parseFloat(String(item.ratePerUnit || 0).replace(/[^0-9.]/g, '')) || 0;
              const amt = typeof item.amount === 'number'
                ? item.amount
                : parseFloat(String(item.amount || 0).replace(/[^0-9.]/g, '')) || 0;

              return (
                <tr
                  key={item.id || index}
                  style={{
                    borderBottom: '1px solid #000000',
                    backgroundColor: index % 2 === 1 ? '#fafafa' : '#ffffff',
                  }}
                >
                  <td style={{ padding: '3px 6px', textAlign: 'center', borderRight: '1px solid #000000', color: '#000000' }}>
                    {item.sNo || index + 1}
                  </td>
                  <td style={{ padding: '3px 8px', borderRight: '1px solid #000000', fontWeight: 'bold', color: '#000000' }}>
                    {item.laborType || 'General Labor'}
                  </td>
                  <td style={{ padding: '3px 6px', textAlign: 'center', borderRight: '1px solid #000000', fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' }}>
                    {count} {count === 1 ? 'Worker' : 'Workers'}
                  </td>
                  <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #000000', fontFamily: 'monospace', color: '#000000' }}>
                    ₹ {rate.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                    ₹ {amt.toLocaleString('en-IN')}/-
                  </td>
                </tr>
              );
            })}

            {/* Total Summary Row */}
            <tr style={{ borderTop: '1.5px solid #000000', borderBottom: '1px solid #000000', backgroundColor: '#f1f5f9' }}>
              <td colSpan={2} style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 'bold', borderRight: '1px solid #000000', color: '#000000' }}>
                Total Labour Count & Gross:
              </td>
              <td style={{ padding: '3px 6px', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #000000', fontFamily: 'monospace', color: '#000000' }}>
                {totalLaborsCount} Workers
              </td>
              <td style={{ padding: '3px 6px', textAlign: 'right', borderRight: '1px solid #000000', color: '#444444' }}>
                Gross Total:
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000', fontSize: '10.5px' }}>
                ₹ {totalGrossAmount.toLocaleString('en-IN')}/-
              </td>
            </tr>

            {advance > 0 && (
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#fafafa' }}>
                <td colSpan={4} style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 'normal', borderRight: '1px solid #000000', color: '#000000' }}>
                  Less: Advance / Prior Deduction:
                </td>
                <td style={{ padding: '3px 8px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                  - ₹ {advance.toLocaleString('en-IN')}/-
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Net Wages Highlight - Simple, Clean & Minimal (Without explicit boxes or table structures) */}
        <div
          style={{
            borderTop: '1.5px solid #000000',
            borderBottom: '1.5px solid #000000',
            padding: '5px 2px',
            marginBottom: '4px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#000000' }}>
                NET WAGES PAID IN HAND:
              </div>
              <div style={{ fontSize: '9px', color: '#333333', marginTop: '1px' }}>
                Payment Method: <strong style={{ color: '#000000' }}>{data.paymentMode || 'Cash'}</strong>
                {data.transactionRef ? ` (Ref: ${data.transactionRef})` : ''}
              </div>
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: "'Times New Roman', serif",
                color: '#000000',
              }}
            >
              ₹ {netWagesPaid.toLocaleString('en-IN')}/-
            </div>
          </div>

          <div
            style={{
              marginTop: '3px',
              fontSize: '9.5px',
              fontStyle: 'italic',
              color: '#000000',
            }}
          >
            <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Amount in words: </span>
            {amountInWords}
          </div>
        </div>

        {/* Signature Section */}
        <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            {/* Thumb Impression / Signature Box */}
            <div style={{ textAlign: 'center', width: '160px' }}>
              <div
                style={{
                  width: '90px',
                  height: '42px',
                  border: '1px dashed #000000',
                  backgroundColor: '#ffffff',
                  margin: '0 auto 4px auto',
                }}
              />
              <div style={{ borderTop: '1px solid #000000', paddingTop: '2px', fontSize: '9.5px', fontWeight: 'bold', color: '#000000' }}>
                Worker / Mestri Signature
              </div>
            </div>

            {/* Site Incharge / Supervisor */}
            <div style={{ textAlign: 'center', width: '150px' }}>
              <div style={{ height: '42px' }} />
              <div style={{ borderTop: '1px solid #000000', paddingTop: '2px', fontSize: '9.5px', fontWeight: 'bold', color: '#000000' }}>
                {data.supervisor.siteIncharge || 'Site Supervisor'}
              </div>
              <div style={{ fontSize: '8px', color: '#444444' }}>
                Verified & Paid By
              </div>
            </div>

            {/* Authorized Contractor Sign */}
            <div style={{ textAlign: 'center', width: '180px' }}>
              <div style={{ fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '32px', color: '#000000' }}>
                For {data.supervisor.companyName || 'SATYA SAI CONSTRUCTIONS'}
              </div>
              <div style={{ borderTop: '1px solid #000000', paddingTop: '2px', fontSize: '9.5px', fontWeight: 'bold', color: '#000000' }}>
                {data.supervisor.supervisorName || 'B. Satyanarayana'}
              </div>
              <div style={{ fontSize: '8px', color: '#444444' }}>
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
          <PayslipCopy />
        </div>
      ) : (
        /* Full Dual-Copy Labor Payslip (2 in 1 Master Document) */
        <>
          {/* Top Payslip Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <PayslipCopy />
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

          {/* Bottom Payslip Copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <PayslipCopy />
          </div>
        </>
      )}
    </div>
  );
};
