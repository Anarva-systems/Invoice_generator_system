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

      {/* Main Content Area (Z-10) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Company Header Banner */}
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
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                borderRadius: '50%',
                border: '1px solid #cccccc',
                padding: '2px',
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: '21px',
                  fontWeight: 'bold',
                  letterSpacing: '0.04em',
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#000000',
                }}
              >
                {data.supervisor.companyName || 'SATYA SAI CONSTRUCTIONS'}
              </h1>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#222222' }}>
                Civil Engineering, Builders & Commercial Contractors
              </div>
              <div style={{ fontSize: '11px', color: '#444444' }}>
                Site Office: {data.siteLocation || 'Project Construction Site'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '11.5px', lineHeight: 1.35 }}>
            <div style={{ fontWeight: 'bold', color: '#000000', letterSpacing: '0.03em' }}>LABOR WAGE DISBURSEMENT</div>
            <div><span style={{ fontWeight: 'bold' }}>Voucher No:</span> <span style={{ color: '#000000', fontWeight: 'bold' }}>{data.voucherNo}</span></div>
            <div><span style={{ fontWeight: 'bold' }}>Date:</span> {data.paymentDate}</div>
          </div>
        </div>

        {/* Title Banner */}
        <div style={{ textAlign: 'center', margin: '8px 0 12px 0' }}>
          <h2
            style={{
              fontSize: '17px',
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
          <div style={{ fontSize: '11px', color: '#444444', marginTop: '2px' }}>
            (దినసరి కూలీ చెల్లింపు పత్రం / వర్కర్ పే స్లిప్)
          </div>
        </div>

        {/* Worker & Location Card (Worker ID Removed) */}
        <div
          style={{
            border: '1px solid #000000',
            backgroundColor: '#f8fafc',
            padding: '8px 12px',
            marginBottom: '14px',
            fontSize: '12px',
            lineHeight: 1.45,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px 16px' }}>
            <div>
              <span style={{ fontWeight: 'normal', color: '#444444' }}>Worker / In-Charge Name (కార్మికుడి పేరు): </span>
              <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#000000' }}>{data.worker.name}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: '#444444' }}>Wage Period: </span>
              <span style={{ fontWeight: 'bold', color: '#000000' }}>{data.wagePeriod}</span>
            </div>
            {data.worker.trade && (
              <div>
                <span style={{ fontWeight: 'normal', color: '#444444' }}>Role / Trade (వృత్తి): </span>
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

        {/* 5-Column Wage & Labor Breakdown Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #000000',
            fontSize: '12px',
            marginBottom: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000000', textAlign: 'center' }}>
              <th style={{ padding: '7px 8px', borderRight: '1px solid #000000', width: '8%', color: '#000000' }}>S.No</th>
              <th style={{ padding: '7px 10px', borderRight: '1px solid #000000', textAlign: 'left', color: '#000000' }}>
                Labour Type (కూలీ రకం)
              </th>
              <th style={{ padding: '7px 8px', borderRight: '1px solid #000000', width: '22%', color: '#000000' }}>
                Number of Labours
              </th>
              <th style={{ padding: '7px 8px', borderRight: '1px solid #000000', width: '20%', textAlign: 'right', color: '#000000' }}>
                Rate / Unit (₹)
              </th>
              <th style={{ padding: '7px 10px', width: '24%', textAlign: 'right', color: '#000000' }}>
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
                  <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #000000', color: '#000000' }}>
                    {item.sNo || index + 1}
                  </td>
                  <td style={{ padding: '7px 10px', borderRight: '1px solid #000000', fontWeight: 'bold', color: '#000000' }}>
                    {item.laborType || 'General Labor'}
                  </td>
                  <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #000000', fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' }}>
                    {count} {count === 1 ? 'Worker' : 'Workers'}
                  </td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #000000', fontFamily: 'monospace', color: '#000000' }}>
                    ₹ {rate.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                    ₹ {amt.toLocaleString('en-IN')}/-
                  </td>
                </tr>
              );
            })}

            {/* Total Summary Row */}
            <tr style={{ borderTop: '2px solid #000000', borderBottom: '1px solid #000000', backgroundColor: '#f1f5f9' }}>
              <td colSpan={2} style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 'bold', borderRight: '1px solid #000000', color: '#000000' }}>
                Total Labour Count & Gross Amount:
              </td>
              <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #000000', fontFamily: 'monospace', color: '#000000' }}>
                {totalLaborsCount} Workers
              </td>
              <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #000000', color: '#444444' }}>
                Total:
              </td>
              <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000', fontSize: '13px' }}>
                ₹ {totalGrossAmount.toLocaleString('en-IN')}/-
              </td>
            </tr>

            {advance > 0 && (
              <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#fafafa' }}>
                <td colSpan={4} style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 'normal', borderRight: '1px solid #000000', color: '#000000' }}>
                  Less: Advance / Prior Deduction (అడ్వాన్స్ మినహాయింపు):
                </td>
                <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace', color: '#000000' }}>
                  - ₹ {advance.toLocaleString('en-IN')}/-
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Net Wages Highlight Banner (Clean Black & Grayscale) */}
        <div
          style={{
            border: '2px solid #000000',
            backgroundColor: '#ffffff',
            padding: '10px 14px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #000000',
              padding: '8px 12px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#000000' }}>
                NET WAGES PAID IN HAND:
              </span>
              <span style={{ fontSize: '11px', color: '#444444', marginLeft: '6px', fontStyle: 'italic' }}>
                (నికరంగా చెల్లించిన నగదు)
              </span>
              <div style={{ fontSize: '11px', color: '#333333', marginTop: '2px' }}>
                Payment Method: <strong style={{ color: '#000000' }}>{data.paymentMode || 'Cash'}</strong>
                {data.transactionRef ? ` (Ref: ${data.transactionRef})` : ''}
              </div>
            </div>
            <div
              style={{
                fontSize: '22px',
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
              marginTop: '6px',
              padding: '6px 2px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#000000',
            }}
          >
            <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Amount in words: </span>
            {amountInWords}
          </div>
        </div>

        {/* Worker Declaration Note */}
        <div style={{ fontSize: '11px', color: '#333333', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.45 }}>
          "మేము/నేను పైన పేర్కొన్న పనికి సంబంధించి పూర్తి వేతనమును నగదు/బ్యాంక్ ద్వారా అందుకున్నాము. ఎటువంటి బకాయిలు లేవు."
          <br />
          (We/I hereby acknowledge receipt of full wages for the labor work mentioned above without any balance due.)
        </div>
      </div>

      {/* Signature Section with Worker Thumb Impression Box */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '12px',
          }}
        >
          {/* Thumb Impression / Signature Box */}
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div
              style={{
                width: '120px',
                height: '70px',
                border: '1px dashed #000000',
                backgroundColor: '#f8fafc',
                margin: '0 auto 6px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#444444',
                textAlign: 'center',
                padding: '4px',
              }}
            >
              Left Thumb Impression / Sign<br />(వేలిముద్ర / సంతకం)
            </div>
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold', color: '#000000' }}>
              Worker / Mestri Signature
            </div>
          </div>

          {/* Site Incharge / Supervisor */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ height: '70px' }} />
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold', color: '#000000' }}>
              {data.supervisor.siteIncharge || 'Site Supervisor'}
            </div>
            <div style={{ fontSize: '10px', color: '#444444' }}>
              Verified & Paid By
            </div>
          </div>

          {/* Authorized Contractor Sign */}
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '55px', color: '#000000' }}>
              For {data.supervisor.companyName}
            </div>
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold', color: '#000000' }}>
              {data.supervisor.supervisorName || 'B. Satyanarayana'}
            </div>
            <div style={{ fontSize: '10px', color: '#444444' }}>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
