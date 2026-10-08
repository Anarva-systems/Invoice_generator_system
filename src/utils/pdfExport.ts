import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function downloadInvoicePDF(
  invoiceNo: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  const element = document.getElementById('invoice-print-area');
  if (!element) {
    alert('Invoice template element not found');
    return;
  }

  try {
    if (onStart) onStart();

    // 1. Render DOM directly to PNG using native browser SVG rendering engine
    // (This avoids html2canvas "oklch" color function parsing errors in Tailwind v4)
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2.5, // 300 DPI high resolution output
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
        boxShadow: 'none',
      },
    });

    // 2. Create A4 PDF and insert PNG
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    const safeInvoiceNo = (invoiceNo || 'invoice').replace(/[\/\\?%*:|"<>]/g, '_');
    pdf.save(`Invoice_${safeInvoiceNo}.pdf`);
  } catch (error) {
    console.error('html-to-image failed, trying html2canvas-pro fallback:', error);
    try {
      const html2canvasPro = (await import('html2canvas-pro')).default;
      const canvas = await html2canvasPro(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      const safeInvoiceNo = (invoiceNo || 'invoice').replace(/[\/\\?%*:|"<>]/g, '_');
      pdf.save(`Invoice_${safeInvoiceNo}.pdf`);
    } catch (fallbackErr) {
      console.error('All PDF export methods failed:', fallbackErr);
      alert('Export failed. Please click "Print Invoice" and select "Save as PDF" in the print dialog.');
    }
  } finally {
    if (onEnd) onEnd();
  }
}
