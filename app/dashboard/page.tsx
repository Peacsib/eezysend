"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { DashboardTab } from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ReportsTab from "@/components/dashboard/ReportsTab";
import TransactionsTab from "@/components/dashboard/TransactionsTab";
import SMSTab from "@/components/dashboard/SMSTab";
import HealthTab from "@/components/dashboard/HealthTab";
import {
  ArrowLeftRight,
  MessageSquare,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('reporting');

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-slate-50/90 to-blue-100/70 text-slate-900 flex flex-col md:flex-row font-body selection:bg-eezysend-blue/20 relative overflow-hidden">
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(10,62,148,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06)_0%,transparent_50%)] pointer-events-none" />
      {/* Sidebar Navigation */}
      <div className="relative z-10">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'reporting' && <ReportsTab />}

          {/* Transactions Controller (Voucher status, T24 inquiries, and reversals) */}
          {activeTab === 'transactions' && <TransactionsTab />}

          {/* SMS Controller (Gateway logs, status verification, and resend) */}
          {activeTab === 'sms' && <SMSTab />}

          {/* Health Controller (Live heartbeat, NLB ping, and subsystem connectivity) */}
          {activeTab === 'health' && <HealthTab />}
        </main>
      </div>
    </div>
  );
}
