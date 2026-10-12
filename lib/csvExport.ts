import ExcelJS from 'exceljs';
import { ReportTransaction, SMSModel } from './types';

/**
 * Exact 25 column headers matching EezySend institutional template:
 * Columns A through Y:
 * 1. EezySend Reference ID
 * 2. T24 Deposit Reference ID
 * 3. T24 Withdrawal Reference ID
 * 4. Amount
 * 5. Charge
 * 6. Currency
 * 7. Date Created
 * 8. Date Collected
 * 9. Narrative
 * 10. Receiver Address
 * 11. Receiver Branch
 * 12. Receiver Firstname
 * 13. Receiver Lastname
 * 14. Receiver National ID
 * 15. Receiver Phone
 * 16. Receiver Town
 * 17. Sender Address
 * 18. Sender Branch
 * 19. Sender Firstname
 * 20. Sender Lastname
 * 21. Sender National ID
 * 22. Sender Phone
 * 23. Sender Town
 * 24. Tax
 * 25. Channel
 */
export const TRANSACTION_EXPORT_HEADERS = [
  "EezySend Reference ID",
  "T24 Deposit Reference ID",
  "T24 Withdrawal Reference ID",
  "Amount",
  "Charge",
  "Currency",
  "Date Created",
  "Date Collected",
  "Narrative",
  "Receiver Address",
  "Receiver Branch",
  "Receiver Firstname",
  "Receiver Lastname",
  "Receiver National ID",
  "Receiver Phone",
  "Receiver Town",
  "Sender Address",
  "Sender Branch",
  "Sender Firstname",
  "Sender Lastname",
  "Sender National ID",
  "Sender Phone",
  "Sender Town",
  "Tax",
  "Channel"
] as const;

export const SMS_EXPORT_HEADERS = [
  "Voucher Reference",
  "Date Dispatched",
  "Sender Phone",
  "Sender Status",
  "Receiver Phone",
  "Receiver Status"
] as const;

/**
 * Formats date to YYYY-MM-DD HH:mm (e.g. 2026-10-05 11:15)
 */
export const formatExportDate = (dateVal?: string | null): string => {
  if (!dateVal || dateVal.trim() === '') return '';
  const trimmed = dateVal.trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 16).replace('T', ' ');
  }
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return trimmed;
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Formats Amount with decimal: e.g. 20.0, 350.0, 120.5
 */
export const formatExportAmount = (amount?: number | string | null): string => {
  if (amount === null || amount === undefined || amount === '') return '0.0';
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  const str = String(amount).trim();
  return str.includes('.') ? str : `${str}.0`;
};

/**
 * Formats Charge with 2 decimals: e.g. 0.00, 7.00, 3.50
 */
export const formatExportCharge = (charge?: number | string | null): string => {
  if (charge === null || charge === undefined || charge === '') return '0.00';
  const num = Number(charge);
  if (!isNaN(num)) {
    return num.toFixed(2);
  }
  return String(charge);
};

/**
 * Formats Tax: e.g. 0.0, 0.7, 1.0
 */
export const formatExportTax = (tax?: number | string | null): string => {
  if (tax === null || tax === undefined || tax === '') return '0.0';
  const num = Number(tax);
  if (isNaN(num)) return String(tax);
  const str = String(tax).trim();
  return str.includes('.') ? str : `${str}.0`;
};

/**
 * Sanitizes phone numbers by stripping leading + sign (e.g. +263772... -> 263772...)
 * to prevent Excel formula interpretation (#NAME? error) and match standard template.
 */
export const formatExportPhone = (phone?: string | null): string => {
  if (!phone || phone.trim() === '') return '';
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    return trimmed.slice(1);
  }
  return trimmed;
};

/**
 * Formats Narrative: e.g. AWAITING_COLLECTION, COLLECTED, REVERSED, or custom narrative
 */
export const formatExportNarrative = (narrative?: string, dateCollected?: string | null, status?: boolean): string => {
  if (status === false) return 'REVERSED';
  if (dateCollected && dateCollected.trim() !== '') return 'COLLECTED';
  if (narrative && narrative.trim() !== '') return narrative.trim();
  return 'AWAITING_COLLECTION';
};

/**
 * RFC 4180 standard cell escaping for CSV:
 * - Null/undefined becomes empty quoted string ""
 * - Wraps all cells in quotes and escapes internal double-quotes
 */
export const formatCSVCell = (val: unknown): string => {
  if (val === null || val === undefined) return '""';
  const s = String(val).trim();
  return `"${s.replace(/"/g, '""')}"`;
};

/**
 * Extracts the 25 values for a transaction matching exact column specification
 */
export const getTransactionRowValues = (t: ReportTransaction): (string | number)[] => [
  t.transactionReference || '',
  t.internalReferenceID || '',
  t.withdrawalReference || '',
  formatExportAmount(t.amount),
  formatExportCharge(t.charge),
  t.currency || 'USD',
  formatExportDate(t.dateCreated),
  formatExportDate(t.dateCollected),
  formatExportNarrative(t.narrative, t.dateCollected, t.status),
  t.receiverAddress || '',
  t.receiverBranch || '',
  t.receiverFirstName || '',
  t.receiverLastName || '',
  t.receiverNationalId || '',
  formatExportPhone(t.receiverPhone),
  t.receiverTown || '',
  t.senderAddress || '',
  t.senderBranch || '',
  t.senderFirstName || '',
  t.senderLastName || '',
  t.senderNationalId || '',
  formatExportPhone(t.senderPhone),
  t.senderTown || '',
  formatExportTax(t.tax),
  t.channel || ''
];

/**
 * Generates CSV string matching the exact 25-column institutional specification:
 * Header: EezySend Reference ID,T24 Deposit Reference ID,T24 Withdrawal Reference ID,Amount,Charge,Currency,Date Created,Date Collected,Narrative,Receiver Address,Receiver Branch,Receiver Firstname,Receiver Lastname,Receiver National ID,Receiver Phone,Receiver Town,Sender Address,Sender Branch,Sender Firstname,Sender Lastname,Sender National ID,Sender Phone,Sender Town,Tax,Channel
 */
export const generateTransactionsCSV = (transactions: ReportTransaction[]): string => {
  const headerLine = TRANSACTION_EXPORT_HEADERS.map(h => `"${h}"`).join(',');

  const rows = transactions.map(t => {
    const values = getTransactionRowValues(t);
    return values.map(formatCSVCell).join(',');
  });

  return [headerLine, ...rows].join('\r\n');
};

/**
 * Generates SMS CSV log matching delivery reporting template
 */
export const generateSMSCSV = (smsList: Partial<SMSModel>[]): string => {
  const headerLine = SMS_EXPORT_HEADERS.map(h => `"${h}"`).join(',');

  const rows = smsList.map(s => {
    const values = [
      s.transactionReference || '',
      formatExportDate(s.dateCreated),
      formatExportPhone(s.senderPhone),
      s.senderStatus ? 'Delivered' : 'Failed',
      formatExportPhone(s.receiverPhone),
      s.receiverStatus ? 'Delivered' : 'Failed'
    ];
    return values.map(formatCSVCell).join(',');
  });

  return [headerLine, ...rows].join('\r\n');
};

/**
 * Generates an Excel Workbook (.xlsx) with:
 * 1. Column headings formatted in BOLD
 * 2. Multi-sheet pagination (at most 50 rows per sheet)
 * 3. Informative, clean sheet names: e.g. "Page 1 (1-50)", "Page 2 (51-100)", "Page 3 (101-125)"
 * 4. Clean white background (NO blue headers) with subtle borders
 * 5. String formatting for phone numbers and IDs to preserve leading zeroes
 */
export const generateTransactionsWorkbook = async (
  transactions: ReportTransaction[],
  pageSize: number = 50
): Promise<Uint8Array> => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EezySend Financial Operations';
  wb.created = new Date();

  const total = transactions.length;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;

  for (let i = 0; i < totalPages; i++) {
    const startIdx = i * pageSize;
    const endIdx = Math.min((i + 1) * pageSize, total);
    const pageTransactions = total > 0 ? transactions.slice(startIdx, endIdx) : [];

    // Simple, informative sheet name: e.g. "Page 1 (1-50)", "Page 2 (51-100)"
    const sheetName = total > 0 ? `Page ${i + 1} (${startIdx + 1}-${endIdx})` : 'Page 1 (0 records)';
    const ws = wb.addWorksheet(sheetName, {
      views: [{ showGridLines: true }]
    });

    // Row 1: The 25 column headers in BOLD
    const headerRow = ws.addRow([...TRANSACTION_EXPORT_HEADERS]);
    headerRow.height = 24;

    headerRow.eachCell((cell) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
        bold: true, // Column heading is BOLD
        color: { argb: 'FF000000' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' } // Clean white background (NO blue headers)
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };
    });

    // Rows 2..N: Data rows
    pageTransactions.forEach(t => {
      const rowValues = getTransactionRowValues(t);
      const dataRow = ws.addRow(rowValues);
      dataRow.height = 20;

      dataRow.eachCell((cell) => {
        cell.font = {
          name: 'Calibri',
          size: 11,
          color: { argb: 'FF000000' }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left'
        };
        cell.numFmt = '@'; // Force text format to preserve leading zeroes
      });
    });

    // Auto-fit column widths
    ws.columns.forEach((column, colIdx) => {
      let maxLen = TRANSACTION_EXPORT_HEADERS[colIdx]?.length || 15;
      pageTransactions.forEach(t => {
        const val = String(getTransactionRowValues(t)[colIdx] ?? '');
        if (val.length > maxLen) {
          maxLen = Math.min(val.length, 36);
        }
      });
      column.width = Math.max(maxLen + 3, 14);
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  return new Uint8Array(buffer);
};

/**
 * Triggers a browser download of the CSV content with meaningful filename and extension
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  // Prepend UTF-8 BOM so Microsoft Excel cleanly parses columns and accented/special characters
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = safeFilename;
  a.setAttribute("download", safeFilename);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }, 2000);
};

/**
 * Triggers a browser download of the XLSX workbook
 */
export const downloadXLSX = (workbookBuffer: Uint8Array, filename: string): void => {
  const safeFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  const blob = new Blob([workbookBuffer as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = safeFilename;
  a.setAttribute("download", safeFilename);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }, 2000);
};

/**
 * Triggers a native HTTP download via the server /api/export endpoint.
 * This guarantees the browser's download manager receives standard
 * Content-Disposition headers and sets the exact filename and .csv / .xlsx extension.
 */
export const downloadViaHttp = (
  data: unknown,
  format: 'csv' | 'xlsx',
  filename: string,
  type: 'transactions' | 'sms' = 'transactions'
): void => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/api/export';
  form.style.display = 'none';

  const formatInput = document.createElement('input');
  formatInput.type = 'hidden';
  formatInput.name = 'format';
  formatInput.value = format;
  form.appendChild(formatInput);

  const filenameInput = document.createElement('input');
  filenameInput.type = 'hidden';
  filenameInput.name = 'filename';
  filenameInput.value = filename;
  form.appendChild(filenameInput);

  const typeInput = document.createElement('input');
  typeInput.type = 'hidden';
  typeInput.name = 'type';
  typeInput.value = type;
  form.appendChild(typeInput);

  const dataInput = document.createElement('input');
  dataInput.type = 'hidden';
  dataInput.name = 'data';
  dataInput.value = JSON.stringify(data);
  form.appendChild(dataInput);

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => {
    if (document.body.contains(form)) {
      document.body.removeChild(form);
    }
  }, 1500);
};
