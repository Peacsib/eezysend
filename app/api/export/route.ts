import { NextResponse } from 'next/server';
import { generateTransactionsCSV, generateTransactionsWorkbook, generateSMSCSV } from '@/lib/csvExport';
import type { ReportTransaction, SMSModel } from '@/lib/types';

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

    // SMS Notifications Report
    if (type === 'sms') {
      const smsList = data as SMSModel[];
      const csvContent = generateSMSCSV(smsList);
      const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

      return new Response('\uFEFF' + csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        },
      });
    }

    // Remittance / Transactions report
    const transactions = data as ReportTransaction[];
    if (format === 'xlsx' || format === 'xls') {
      const buffer = await generateTransactionsWorkbook(transactions, 50);
      const safeFilename = filename.endsWith('.xlsx')
        ? filename
        : filename.replace(/\.(xls|xlsx)$/, '') + '.xlsx';

      return new Response(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        },
      });
    }

    // Default: CSV matching exact remittance template (25 columns)
    const csvContent = generateTransactionsCSV(transactions);
    const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

    return new Response('\uFEFF' + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
      },
    });
  } catch {
    return new NextResponse('Export generation failed', { status: 500 });
  }
}
