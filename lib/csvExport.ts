import { ReportTransaction } from './types';

/**
 * Formats date into exact M/D/YYYY string wrapped in double quotes.
 * Example: "4/20/2023", "7/1/2025", "10/1/2025"
 */
export const formatCSVDate = (dateVal?: string | null): string => {
  if (!dateVal) return '""';
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
    const [year, month, day] = dateVal.slice(0, 10).split('-').map(Number);
    return `"${month}/${day}/${year}"`;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return `"${dateVal}"`;
  return `"${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}"`;
};

/**
 * Returns unquoted title-cased status string matching EezySend report template:
 * - Awaiting Collection
 * - Reversed
 * - Collected
 */
export const formatCSVStatus = (narrative?: string, dateCollected?: string | null): string => {
  const n = (narrative || '').toUpperCase();
  if (n.includes('REVERSED')) return 'Reversed';
  if (dateCollected || n.includes('COLLECTED')) return 'Collected';
  return 'Awaiting Collection';
};

/**
 * Formats Fee without quotes: e.g. 5.00, 2.00, 3, 0.00, 0
 */
export const formatCSVFee = (charge?: string | number | null): string => {
  if (charge === null || charge === undefined || charge === '') return '0.00';
  return String(charge).trim();
};

/**
 * Formats Amount without quotes: e.g. 350.74, 96, 10
 */
export const formatCSVAmount = (amount?: number | string | null): string | number => {
  if (amount === null || amount === undefined || amount === '') return 0;
  return amount;
};

/**
 * Formats full name with middle name inside double quotes with quote-escaping.
 * Example: "NIALL IGOE", "Faston David Vonganai Murimirwa"
 */
export const formatCSVName = (first?: string, middle?: string, last?: string): string => {
  const parts = [first, middle, last].filter((p): p is string => typeof p === 'string' && p !== '');
  if (parts.length === 0) return '""';
  if (parts.length === 1) return `"${parts[0].replace(/"/g, '""')}"`;
  const cleanedParts = parts.map(p => p.trim()).filter(Boolean);
  const name = cleanedParts.length > 0 ? cleanedParts.join(' ') : parts.join(' ');
  return `"${name.replace(/"/g, '""')}"`;
};

/**
 * Generates CSV string matching the exact EezySend remittance report template:
 * Header: Reference,Date,Status,Amount,Currency,Fee,Sender,Receiver,Sender Branch,Payout Branch
 */
export const generateTransactionsCSV = (transactions: ReportTransaction[]): string => {
  const headers = [
    "Reference",
    "Date",
    "Status",
    "Amount",
    "Currency",
    "Fee",
    "Sender",
    "Receiver",
    "Sender Branch",
    "Payout Branch"
  ];

  const rows = transactions.map(t => [
    `"${(t.transactionReference || '').replace(/"/g, '""')}"`,
    formatCSVDate(t.dateCreated),
    formatCSVStatus(t.narrative, t.dateCollected),
    formatCSVAmount(t.amount),
    `"${(t.currency || 'USD').replace(/"/g, '""')}"`,
    formatCSVFee(t.charge),
    formatCSVName(t.senderFirstName, t.senderMiddleName, t.senderLastName),
    formatCSVName(t.receiverFirstName, t.receiverMiddleName, t.receiverLastName),
    `"${(t.senderBranch || '').replace(/"/g, '""')}"`,
    `"${(t.receiverBranch || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
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
 * Generates an Excel XLS (HTML XML Workbook) table
 */
export const generateTransactionsXLS = (transactions: ReportTransaction[]): string => {
  const headers = [
    "Reference", "Date", "Status", "Amount", "Currency", "Fee", "Sender", "Receiver", "Sender Branch", "Payout Branch"
  ];
  
  const headerHtml = headers.map(h => `<th style="background-color:#0A3E94;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px 12px;font-family:sans-serif;">${h}</th>`).join("");
  
  const rowsHtml = transactions.map(t => {
    const cols = [
      t.transactionReference || '',
      formatCSVDate(t.dateCreated).replace(/"/g, ''),
      formatCSVStatus(t.narrative, t.dateCollected),
      t.amount ?? 0,
      t.currency || 'USD',
      formatCSVFee(t.charge),
      formatCSVName(t.senderFirstName, t.senderMiddleName, t.senderLastName).replace(/"/g, ''),
      formatCSVName(t.receiverFirstName, t.receiverMiddleName, t.receiverLastName).replace(/"/g, ''),
      t.senderBranch || '',
      t.receiverBranch || ''
    ];
    return `<tr>${cols.map(c => `<td style="border:1px solid #e2e8f0;padding:6px 10px;font-family:sans-serif;">${c}</td>`).join("")}</tr>`;
  }).join("");

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Remittance Report</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
  </head>
  <body>
    <table>
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </body>
</html>`.trim();
};

/**
 * Triggers a browser download of the XLS workbook
 */
export const downloadXLS = (xlsContent: string, filename: string): void => {
  const safeFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  const blob = new Blob([xlsContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
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
 * Content-Disposition headers and sets the exact filename and .csv / .xls extension.
 */
export const downloadViaHttp = (
  data: unknown,
  format: 'csv' | 'xls',
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
