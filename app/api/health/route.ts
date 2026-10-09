import { NextResponse } from 'next/server';

const NLB_HEALTH_URL = "http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend/health";

export async function GET() {
  // Live probe to AWS NLB
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(NLB_HEALTH_URL, {
      method: 'GET',
      headers: { 'Accept': '*/*' },
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    const headerMap: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      headerMap[key] = val;
    });

    let bodyJson: Record<string, unknown> = {};
    try {
      bodyJson = await res.json();
    } catch {
      const text = await res.text().catch(() => '');
      bodyJson = { raw: text };
    }

    const rawHealth = typeof bodyJson.health === 'string' ? bodyJson.health.toUpperCase() : '';
    let healthStatus = 'UP';
    if (!res.ok || rawHealth === 'DOWN') {
      healthStatus = 'DOWN';
    } else if (latencyMs > 1500) {
      healthStatus = 'DEGRADED';
    } else if (rawHealth) {
      healthStatus = rawHealth;
    }

    return NextResponse.json({
      health: healthStatus,
      statusCode: res.status,
      statusText: res.statusText || 'OK',
      latencyMs,
      endpointUrl: NLB_HEALTH_URL,
      headers: headerMap,
      rawJson: JSON.stringify(bodyJson, null, 2),
      isLive: true
    }, { status: res.status });
  } catch (err: unknown) {
    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    const errorMsg = err instanceof Error ? err.message : 'Connection failed';

    return NextResponse.json({
      health: 'DOWN',
      statusCode: 0,
      statusText: 'Connection Failed / Unreachable',
      latencyMs,
      endpointUrl: NLB_HEALTH_URL,
      headers: {
        'date': new Date().toUTCString(),
        'error': errorMsg
      },
      rawJson: JSON.stringify({
        health: 'DOWN',
        status: 0,
        error: errorMsg,
        message: 'Could not establish connection to EezySend NLB health endpoint',
        timestamp: new Date().toISOString()
      }, null, 2),
      error: errorMsg,
      isLive: true
    }, { status: 503 });
  }
}
