import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * Universal helper to export data to Excel (.xlsx) file
 */
export function exportToExcel(data: any[], filename: string, title?: string, columns?: ExportColumn[]) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  showExportToast(`Exporting ${filename}.xlsx...`);

  try {
    const formattedData = data.map(item => {
      if (columns && columns.length > 0) {
        const row: Record<string, any> = {};
        columns.forEach(col => {
          const val = item[col.key];
          row[col.header] = val !== undefined && val !== null ? String(val) : '';
        });
        return row;
      }

      const cleanRow: Record<string, any> = {};
      Object.keys(item).forEach(key => {
        const val = item[key];
        if (val !== undefined && val !== null && typeof val !== 'function') {
          if (typeof val === 'object') {
            cleanRow[key] = val.name || val.title || JSON.stringify(val);
          } else {
            cleanRow[key] = String(val);
          }
        }
      });
      return cleanRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);

    showExportSuccessToast(`Exported ${filename}.xlsx successfully!`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export Excel file. Please try again.');
  }
}

/**
 * Universal helper to export data to PDF (.pdf) file
 */
export function exportToPDF(data: any[], filename: string, title: string, columns?: ExportColumn[]) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  showExportToast(`Generating ${filename}.pdf...`);

  try {
    const doc = new jsPDF();

    // Document Header
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235); // Fortivex Blue
    doc.text(title || 'Fortivex.AI CRM Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString('en-US')}`, 14, 28);

    let headers: string[] = [];
    let rows: string[][] = [];

    if (columns && columns.length > 0) {
      headers = columns.map(c => c.header);
      rows = data.map(item =>
        columns.map(c => {
          const val = item[c.key];
          if (val === undefined || val === null) return '';
          if (typeof val === 'object') return val.name || String(val);
          return String(val);
        })
      );
    } else {
      const sample = data[0];
      headers = Object.keys(sample).filter(
        k => typeof sample[k] !== 'function' && typeof sample[k] !== 'object'
      );
      rows = data.map(item => headers.map(k => (item[k] !== undefined && item[k] !== null ? String(item[k]) : '')));
    }

    autoTable(doc, {
      startY: 34,
      head: [headers],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`${filename}.pdf`);
    showExportSuccessToast(`Exported ${filename}.pdf successfully!`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export PDF file. Please try again.');
  }
}

function showExportToast(msg: string) {
  const existing = document.getElementById('fortivex-export-toast');
  if (existing && document.body.contains(existing)) {
    document.body.removeChild(existing);
  }

  const toast = document.createElement('div');
  toast.id = 'fortivex-export-toast';
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = '#3b82f6';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '12px';
  toast.style.zIndex = '99999';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '0.9rem';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  document.body.appendChild(toast);
}

function showExportSuccessToast(msg: string) {
  const toast = document.getElementById('fortivex-export-toast') || document.createElement('div');
  toast.innerText = msg;
  toast.style.background = '#10b981';
  if (!document.body.contains(toast)) {
    document.body.appendChild(toast);
  }
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
}
