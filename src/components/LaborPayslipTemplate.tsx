import React from 'react';
import type { LaborPayslipData } from '../types/invoice';
import { numberToIndianWords } from '../utils/numberToWords';

interface LaborPayslipTemplateProps {
  data: LaborPayslipData;
}

export const LaborPayslipTemplate: React.FC<LaborPayslipTemplateProps> = ({ data }) => {
  const dailyRate = typeof data.wages.dailyRate === 'number'
    ? data.wages.dailyRate
    : parseFloat(String(data.wages.dailyRate).replace(/,/g, '')) || 0;

  const daysWorked = typeof data.wages.daysWorked === 'number'
    ? data.wages.daysWorked
    : parseFloat(String(data.wages.daysWorked).replace(/,/g, '')) || 0;

  const otHours = typeof data.wages.overtimeHours === 'number'
    ? data.wages.overtimeHours
    : parseFloat(String(data.wages.overtimeHours).replace(/,/g, '')) || 0;

  const otRate = typeof data.wages.overtimeRatePerHour === 'number'
    ? data.wages.overtimeRatePerHour
    : parseFloat(String(data.wages.overtimeRatePerHour).replace(/,/g, '')) || 0;

  const advance = typeof data.wages.advanceDeduction === 'number'
    ? data.wages.advanceDeduction
    : parseFloat(String(data.wages.advanceDeduction).replace(/,/g, '')) || 0;

  const allowance = typeof data.wages.otherAllowance === 'number'
    ? data.wages.otherAllowance
    : parseFloat(String(data.wages.otherAllowance).replace(/,/g, '')) || 0;

  const basicWages = dailyRate * daysWorked;
  const otAmount = otHours * otRate;
  const grossWages = basicWages + otAmount + allowance;
  const netWagesPaid = Math.max(0, grossWages - advance);

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
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333333' }}>
                Civil Engineering, Builders & Commercial Contractors
              </div>
              <div style={{ fontSize: '11px', color: '#444444' }}>
                Site Office: {data.siteLocation || 'Project Construction Site'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '11.5px', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 'bold', color: '#047857' }}>LABOR WAGE DISBURSEMENT</div>
            <div><span style={{ fontWeight: 'bold' }}>Voucher No:</span> <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>{data.voucherNo}</span></div>
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
          <div style={{ fontSize: '11px', color: '#555555', marginTop: '2px' }}>
            (దినసరి కూలీ చెల్లింపు పత్రం / వర్కర్ పే స్లిప్)
          </div>
        </div>

        {/* Worker & Location Card */}
        <div
          style={{
            border: '1px solid #000000',
            backgroundColor: '#f8fafc',
            padding: '8px 12px',
            marginBottom: '14px',
            fontSize: '12px',
            lineHeight: 1.4,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <div>
              <span style={{ fontWeight: 'normal', color: '#475569' }}>Worker Name (కార్మికుడి పేరు): </span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{data.worker.name}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: '#475569' }}>Trade / Role (వృత్తి): </span>
              <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{data.worker.trade}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: '#475569' }}>Worker ID: </span>
              <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{data.worker.workerId || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: '#475569' }}>Wage Period: </span>
              <span style={{ fontWeight: 'bold' }}>{data.wagePeriod}</span>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontWeight: 'normal', color: '#475569' }}>Project Site: </span>
              <span style={{ fontWeight: 'bold' }}>{data.siteLocation}</span>
            </div>
          </div>
        </div>

        {/* Wages Breakdown Table */}
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
              <th style={{ padding: '6px 8px', borderRight: '1px solid #000000', width: '8%' }}>S.No</th>
              <th style={{ padding: '6px 8px', borderRight: '1px solid #000000', textAlign: 'left' }}>Wage Item Particulars (వివరాలు)</th>
              <th style={{ padding: '6px 8px', borderRight: '1px solid #000000', width: '20%' }}>Rate / Unit (₹)</th>
              <th style={{ padding: '6px 8px', borderRight: '1px solid #000000', width: '18%' }}>Quantity / Days</th>
              <th style={{ padding: '6px 8px', width: '22%', textAlign: 'right' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>1</td>
              <td style={{ padding: '6px 8px', borderRight: '1px solid #000000', fontWeight: 'bold' }}>
                Daily Wage (దినసరి కూలీ)
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>
                ₹ {dailyRate.toLocaleString('en-IN')} / day
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>
                {daysWorked} Days
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                ₹ {basicWages.toLocaleString('en-IN')}/-
              </td>
            </tr>

            {otHours > 0 && (
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>2</td>
                <td style={{ padding: '6px 8px', borderRight: '1px solid #000000' }}>
                  Overtime Allowance (ఓవర్‌టైమ్)
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>
                  ₹ {otRate.toLocaleString('en-IN')} / hr
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>
                  {otHours} Hours
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                  ₹ {otAmount.toLocaleString('en-IN')}/-
                </td>
              </tr>
            )}

            {allowance > 0 && (
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>3</td>
                <td style={{ padding: '6px 8px', borderRight: '1px solid #000000' }}>
                  Special / Site Allowance (ఇతర భత్యాలు)
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>-</td>
                <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #000000' }}>Lump sum</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                  ₹ {allowance.toLocaleString('en-IN')}/-
                </td>
              </tr>
            )}

            {/* Gross Total Row */}
            <tr style={{ borderTop: '1px solid #000000', borderBottom: '1px solid #000000', backgroundColor: '#f8fafc' }}>
              <td colSpan={4} style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold', borderRight: '1px solid #000000' }}>
                Gross Wages Payable (మొత్తం వేతనం):
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                ₹ {grossWages.toLocaleString('en-IN')}/-
              </td>
            </tr>

            {advance > 0 && (
              <tr style={{ borderBottom: '1px solid #000000', color: '#b91c1c' }}>
                <td colSpan={4} style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'normal', borderRight: '1px solid #000000' }}>
                  Less: Advance / Prior Deduction (అడ్వాన్స్ మినహాయింపు):
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                  - ₹ {advance.toLocaleString('en-IN')}/-
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Net Wages Highlight Banner */}
        <div
          style={{
            border: '2px solid #000000',
            backgroundColor: '#f8fafc',
            padding: '10px 14px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                NET WAGES PAID IN HAND (నికరంగా చెల్లించిన నగదు):
              </span>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                Payment Mode: <strong style={{ color: '#000000' }}>{data.wages.paymentMode}</strong>
                {data.wages.transactionRef ? ` (Ref: ${data.wages.transactionRef})` : ''}
              </div>
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#047857',
              }}
            >
              ₹ {netWagesPaid.toLocaleString('en-IN')}/-
            </div>
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
        </div>

        {/* Worker Declaration Note */}
        <div style={{ fontSize: '11px', color: '#334155', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.4 }}>
          "నేను పైన పేర్కొన్న పని దినములకు సంబంధించి పూర్తి వేతనమును నగదు/బ్యాంక్ ద్వారా అందుకున్నాను. ఎటువంటి బకాయిలు లేవు."
          <br />
          (I hereby acknowledge receipt of my full wages for the period mentioned above without any balance due.)
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
                border: '1px dashed #475569',
                backgroundColor: '#f8fafc',
                margin: '0 auto 6px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#64748b',
                textAlign: 'center',
                padding: '4px',
              }}
            >
              Left Thumb Impression / Sign<br />(వేలిముద్ర / సంతకం)
            </div>
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold' }}>
              Worker's Signature / Thumb
            </div>
          </div>

          {/* Site Incharge / Supervisor */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ height: '70px' }} />
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold' }}>
              {data.supervisor.siteIncharge || 'Site Supervisor'}
            </div>
            <div style={{ fontSize: '10px', color: '#555555' }}>
              Verified & Paid By
            </div>
          </div>

          {/* Authorized Contractor Sign */}
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '55px' }}>
              For {data.supervisor.companyName}
            </div>
            <div style={{ borderTop: '1px solid #000000', paddingTop: '4px', fontSize: '11.5px', fontWeight: 'bold' }}>
              {data.supervisor.supervisorName || 'B. Satyanarayana'}
            </div>
            <div style={{ fontSize: '10px', color: '#555555' }}>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
