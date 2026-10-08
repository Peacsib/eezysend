import { NextResponse } from 'next/server';
import { generateTransactionsCSV, generateTransactionsXLS } from '@/lib/csvExport';
import type { ReportTransaction } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const format = (formData.get('format') as string) || 'csv';
    const filename = (formData.get('filename') as string) || 'EezySend_Report';
    const type = (formData.get('type') as string) || 'transactions';
    const rawData = formData.get('data') as string;

    if (!rawData) {
      return new NextResponse('No data provided', { status: 400 });
    }

    const data = JSON.parse(rawData);

    if (type === 'sms') {
      const headers = [
        "Voucher Reference", "Date Dispatched", "Sender Phone", "Sender Status", "Receiver Phone", "Receiver Status"
      ];
      const rows = data.map((s: {
        transactionReference?: string;
        dateCreated?: string;
        senderPhone?: string;
        senderStatus?: boolean;
        receiverPhone?: string;
        receiverStatus?: boolean;
      }) => [
        `"${s.transactionReference || ''}"`,
        `"${s.dateCreated ? new Date(s.dateCreated).toLocaleString() : ''}"`,
        `"${s.senderPhone || ''}"`,
        s.senderStatus ? "Delivered" : "Failed",
        `"${s.receiverPhone || ''}"`,
        s.receiverStatus ? "Delivered" : "Failed"
      ]);
      const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
      const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

      return new Response('\uFEFF' + csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        },
      });
    }

    // Remittance / Transactions report
    const transactions = data as ReportTransaction[];
    if (format === 'xls') {
      const xlsContent = generateTransactionsXLS(transactions);
      const safeFilename = filename.endsWith('.xls') ? filename : `${filename}.xls`;

      return new Response(xlsContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        },
      });
    }

    // Default: CSV matching exact remittance template
    const csvContent = generateTransactionsCSV(transactions);
    const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

    return new Response('\uFEFF' + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
      },
    });
  } catch (error) {
    console.error('Export route error:', error);
    return new NextResponse('Export generation failed', { status: 500 });
  }
}
