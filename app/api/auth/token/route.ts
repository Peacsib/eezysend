import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  'http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend';

export async function POST(request: Request) {
  try {
    const key = process.env.EEZYSEND_API_KEY || 'eezysendui';
    const secret = process.env.EEZYSEND_API_SECRET || '304bb2b63cd544feb6524055520fefea';

    if (!key || !secret) {
      return NextResponse.json(
        { error: 'API credentials missing from environment variables' },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/security/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, secret }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Authorization failed with status ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to authorize with EezySend Core';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(new Request('http://localhost:3000/api/auth/token', { method: 'POST' }));
}
