"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Check,
  Copy,
  Server,
  Activity,
  AlertTriangle,
  XCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import StatusBadge, { getStatusBadgeClasses } from "@/components/ui/StatusBadge";

interface HealthLogEntry {
  id: string;
  time: string;
  statusCode: number;
  statusText: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
}

interface LiveHealthData {
  health: 'UP' | 'DEGRADED' | 'DOWN';
  statusCode: number;
  statusText: string;
  latencyMs: number;
  endpointUrl: string;
  headers: Record<string, string>;
  rawJson: string;
  lastCheckedTime: string;
}

const DEFAULT_ENDPOINT = "http://eezysend-nlb-871901cdb8bcb72b.elb.eu-west-1.amazonaws.com/eezysend/health";

export default function HealthTab() {
  const { showToast } = useToast();
  
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [autoPing, setAutoPing] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [healthData, setHealthData] = useState<LiveHealthData>({
    health: "UP",
    statusCode: 200,
    statusText: "OK",
    latencyMs: 493,
    endpointUrl: DEFAULT_ENDPOINT,
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
      "connection": "keep-alive",
      "content-type": "application/json",
      "date": new Date().toUTCString(),
      "pragma": "no-cache",
      "transfer-encoding": "chunked",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "x-xss-protection": "1; mode=block",
    },
    rawJson: JSON.stringify({ health: "UP" }, null, 2),
    lastCheckedTime: new Date().toLocaleTimeString(),
  });

  const [history, setHistory] = useState<HealthLogEntry[]>([
    {
      id: "1",
      time: new Date().toLocaleTimeString(),
      statusCode: 200,
      statusText: "OK",
      status: "UP",
      latencyMs: 493,
    }
  ]);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runHealthCheck = useCallback(async (silent = false) => {
    setIsPinging(true);

    if (!silent) {
      showToast('Pinging live AWS NLB /health endpoint...', 'info');
    }

    const start = performance.now();
    try {
      const res = await fetch('/api/health', {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store",
      });

      const latencyMs = Math.max(1, Math.round(performance.now() - start));
      const nowStr = new Date().toLocaleTimeString();
      const data = await res.json().catch(() => ({}));

      const rawHealth: string = (data.health || '').toUpperCase();
      let determinedHealth: 'UP' | 'DEGRADED' | 'DOWN' = 'UP';

      if (!res.ok || rawHealth === 'DOWN' || data.statusCode >= 500 || data.statusCode === 0) {
        determinedHealth = 'DOWN';
      } else if (latencyMs > 1200 || rawHealth === 'DEGRADED') {
        determinedHealth = 'DEGRADED';
      } else {
        determinedHealth = 'UP';
      }

      const statusCode = data.statusCode ?? res.status;
      const statusText = data.statusText || (determinedHealth === 'DOWN' ? 'Service Unavailable' : 'OK');

      setHealthData({
        health: determinedHealth,
        statusCode,
        statusText,
        latencyMs: data.latencyMs ?? latencyMs,
        endpointUrl: DEFAULT_ENDPOINT,
        headers: data.headers || {},
        rawJson: data.rawJson || JSON.stringify(data, null, 2),
        lastCheckedTime: nowStr,
      });

      setHistory(prev => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          time: nowStr,
          statusCode,
          statusText,
          status: determinedHealth,
          latencyMs: data.latencyMs ?? latencyMs,
        },
        ...prev.slice(0, 7),
      ]);

      if (!silent) {
        if (determinedHealth === 'DOWN') {
          showToast(`Health Alert: DOWN (${statusCode} ${statusText})`, 'error');
        } else if (determinedHealth === 'DEGRADED') {
          showToast(`Health Warning: DEGRADED (Latency: ${latencyMs}ms)`, 'info');
        } else {
          showToast(`Health Check: UP (${latencyMs}ms)`, 'success');
        }
      }
    } catch (err: unknown) {
      const latencyMs = Math.max(1, Math.round(performance.now() - start));
      const nowStr = new Date().toLocaleTimeString();
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';

      setHealthData({
        health: 'DOWN',
        statusCode: 0,
        statusText: 'Connection Refused / Network Error',
        latencyMs,
        endpointUrl: DEFAULT_ENDPOINT,
        headers: { "error": errorMsg, "date": new Date().toUTCString() },
        rawJson: JSON.stringify({ health: "DOWN", error: errorMsg }, null, 2),
        lastCheckedTime: nowStr,
      });

      setHistory(prev => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          time: nowStr,
          statusCode: 0,
          statusText: 'Network Failed',
          status: 'DOWN',
          latencyMs,
        },
        ...prev.slice(0, 7),
      ]);

      if (!silent) {
        showToast(`Health Check: DOWN (Server Unreachable)`, 'error');
      }
    } finally {
      setIsPinging(false);
    }
  }, [showToast]);

  // Initial check on mount
  useEffect(() => {
    void runHealthCheck(true);
  }, [runHealthCheck]);

  // Auto-ping timer (every 15s)
  useEffect(() => {
    if (!autoPing) return;
    const interval = setInterval(() => {
      void runHealthCheck(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoPing, runHealthCheck]);

  const curlCommand = `curl -X 'GET' '${DEFAULT_ENDPOINT}' -H 'accept: */*'`;

  // Status visual configurations using shared design tokens
  const getStatusConfig = (status: 'UP' | 'DEGRADED' | 'DOWN') => {
    const styling = getStatusBadgeClasses(status);
    switch (status) {
      case 'UP':
        return {
          label: 'UP',
          subtext: '(Operational)',
          textColor: styling.textColor,
          subtextColor: styling.subtextColor,
          badgeBg: styling.badge,
          dotBg: styling.dot,
          cardBorder: 'border-white/60 hover:border-emerald-300/40',
        };
      case 'DEGRADED':
        return {
          label: 'DEGRADED',
          subtext: '(High Latency)',
          textColor: styling.textColor,
          subtextColor: styling.subtextColor,
          badgeBg: styling.badge,
          dotBg: styling.dot,
          cardBorder: 'border-slate-200/80 hover:border-slate-300',
        };
      case 'DOWN':
        return {
          label: 'DOWN',
          subtext: '(Outage / Unreachable)',
          textColor: styling.textColor,
          subtextColor: styling.subtextColor,
          badgeBg: styling.badge,
          dotBg: styling.dot,
          cardBorder: 'border-rose-200/80 hover:border-rose-300',
        };
    }
  };

  const statusConfig = getStatusConfig(healthData.health);

  // Latency styling
  const getLatencyInfo = (ms: number) => {
    if (ms < 300) return { label: 'Optimal (<300ms)', color: 'text-emerald-600' };
    if (ms < 800) return { label: 'Normal', color: 'text-slate-500' };
    if (ms < 1500) return { label: 'Elevated (>800ms)', color: 'text-[#C7510A]' };
    return { label: 'High Latency (>1.5s)', color: 'text-rose-600 font-bold' };
  };

  const latencyInfo = getLatencyInfo(healthData.latencyMs);

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header: Calm, clean, live status indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>System Health</span>
            <StatusBadge status={healthData.health} dot={true} />
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time status of the EezySend backend service from <span className="font-mono text-slate-700">/health</span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">

          <button
            onClick={() => setAutoPing(!autoPing)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              autoPing
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs'
            }`}
          >
            Auto-Ping (15s): {autoPing ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => void runHealthCheck(false)}
            disabled={isPinging}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? "Checking..." : "Check Health Now"}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics - 4 Responsive Cards with Dynamic Statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Service Status */}
        <div className={`group relative p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-xl border ${statusConfig.cardBorder} shadow-[0_8px_32px_rgba(10,62,148,0.07)] hover:shadow-[0_14px_36px_rgba(10,62,148,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default flex flex-col justify-between`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Status</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-lg font-bold tracking-tight ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
            <span className={`text-[11px] font-medium ${statusConfig.subtextColor}`}>
              {statusConfig.subtext}
            </span>
          </div>
        </div>

        {/* HTTP Response */}
        <div className="group relative p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-white/60 hover:border-eezysend-blue/20 shadow-[0_8px_32px_rgba(10,62,148,0.07)] hover:shadow-[0_14px_36px_rgba(10,62,148,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HTTP Response</span>
          <span className={`text-lg font-bold block mt-1 tracking-tight ${
            healthData.statusCode >= 200 && healthData.statusCode < 300 
              ? 'text-slate-900' 
              : healthData.statusCode >= 400 && healthData.statusCode < 500
              ? 'text-amber-700'
              : 'text-rose-700'
          }`}>
            {healthData.statusCode === 0 ? 'ERR' : healthData.statusCode} 
            <span className="text-[11px] font-normal ml-1 text-slate-500">
              {healthData.statusText}
            </span>
          </span>
        </div>

        {/* Round-Trip Latency */}
        <div className="group relative p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-white/60 hover:border-eezysend-blue/20 shadow-[0_8px_32px_rgba(10,62,148,0.07)] hover:shadow-[0_14px_36px_rgba(10,62,148,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Round-Trip Latency</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-lg font-bold tracking-tight ${
              healthData.latencyMs > 1500 ? 'text-rose-700' : healthData.latencyMs > 800 ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {healthData.latencyMs}
            </span>
            <span className="text-[11px] font-normal text-slate-500">ms</span>
            <span className={`text-[10px] ml-auto font-medium ${latencyInfo.color}`}>
              {latencyInfo.label}
            </span>
          </div>
        </div>

        {/* Last Checked */}
        <div className="group relative p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-white/60 hover:border-eezysend-blue/20 shadow-[0_8px_32px_rgba(10,62,148,0.07)] hover:shadow-[0_14px_36px_rgba(10,62,148,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Checked</span>
          <span className="text-lg font-bold text-slate-900 block mt-1 tracking-tight">
            {healthData.lastCheckedTime}
          </span>
        </div>
      </div>

      {/* 3. Endpoint & cURL Request Card */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Health Endpoint Request</span>
          </div>
          <button
            onClick={() => handleCopy(curlCommand, 'cURL command')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
          >
            {copiedKey === 'cURL command' ? <Check className="w-3.5 h-3.5 text-slate-700" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedKey === 'cURL command' ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-200">
              GET
            </span>
            <span className="text-slate-700 truncate select-all">{DEFAULT_ENDPOINT}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-slate-700 text-xs overflow-x-auto select-all">
            {curlCommand}
          </div>
        </div>
      </div>

      {/* 4. Live Server Response: Body & Headers (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Response Body */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Response Body (JSON)
              </span>
              <button
                onClick={() => handleCopy(healthData.rawJson, 'Response body')}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
              >
                {copiedKey === 'Response body' ? <Check className="w-3.5 h-3.5 text-slate-700" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedKey === 'Response body' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-slate-800 text-xs leading-relaxed select-all max-h-60 overflow-y-auto">
              <pre>{healthData.rawJson}</pre>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Returned directly by EezySend Spring Boot Health Controller.
          </p>
        </div>

        {/* Right: Response Headers */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Response Headers
              </span>
              <button
                onClick={() => handleCopy(
                  Object.entries(healthData.headers).map(([k, v]) => `${k}: ${v}`).join('\n'),
                  'Headers'
                )}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
              >
                {copiedKey === 'Headers' ? <Check className="w-3.5 h-3.5 text-slate-700" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedKey === 'Headers' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs font-mono max-h-56 overflow-y-auto pr-1">
              {Object.entries(healthData.headers).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between py-1 border-b border-slate-50 gap-2">
                  <span className="text-slate-400 shrink-0">{key}:</span>
                  <span className="text-slate-700 text-right truncate select-all">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Live HTTP/1.1 response headers from the AWS NLB gateway.
          </p>
        </div>
      </div>

      {/* 5. Heartbeat Ping Log (Recent Checks) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recent Heartbeat Checks
          </span>
          <span className="text-[11px] text-slate-400">
            Showing last {history.length} pings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Endpoint</th>
                <th className="py-2.5 px-4">HTTP Status</th>
                <th className="py-2.5 px-4 text-center">Health Result</th>
                <th className="py-2.5 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.map((entry, idx) => {
                const isDown = entry.status === 'DOWN' || entry.statusCode >= 500 || entry.statusCode === 0;
                const isDegraded = entry.status === 'DEGRADED' || entry.latencyMs > 1200;
                return (
                  <tr key={`${entry.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{entry.time}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">/health</td>
                    <td className="py-2.5 px-4 font-mono">
                      <span className={isDown ? 'text-rose-600 font-bold' : isDegraded ? 'text-[#C7510A] font-bold' : 'text-slate-700'}>
                        {entry.statusCode === 0 ? 'CONNECTION FAILED' : `${entry.statusCode} ${entry.statusText}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span className={entry.latencyMs > 1500 ? 'text-rose-600 font-bold' : entry.latencyMs > 800 ? 'text-[#C7510A]' : 'text-slate-600'}>
                        {entry.latencyMs} ms
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
