"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { DashboardTab } from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ReportsTab from "@/components/dashboard/ReportsTab";
import TransactionsTab from "@/components/dashboard/TransactionsTab";
import SMSTab from "@/components/dashboard/SMSTab";
import HealthTab from "@/components/dashboard/HealthTab";
import { ensureLiveToken } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('reporting');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(272);

  // Initialize live production token from .env.local if not present
  useEffect(() => {
    ensureLiveToken();
  }, []);

  // Restore saved width from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("eezysend_sidebar_width");
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (!isNaN(parsed) && parsed >= 200 && parsed <= 420) {
          setSidebarWidth(parsed);
        }
      }
    }
  }, []);

  // Automatically adjust collapsed sidebar based on viewport width
  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 768 && window.innerWidth < 1024) {
          setIsSidebarCollapsed(true);
        } else if (window.innerWidth >= 1024) {
          // Keep user's expanded state on desktop
        } else {
          setIsSidebarCollapsed(false);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar collapse
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    if (typeof window !== "undefined") {
      localStorage.setItem("eezysend_sidebar_width", newWidth.toString());
    }
  };

  const handleToggleCollapse = (forceState?: boolean | unknown) => {
    if (typeof forceState === "boolean") {
      setIsSidebarCollapsed(forceState);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-linear-to-br from-blue-50/80 via-slate-50/90 to-blue-100/70 text-slate-900 flex flex-col md:flex-row font-body selection:bg-eezysend-blue/20 relative">
      {/* Premium background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(10,62,148,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06)_0%,transparent_50%)] pointer-events-none" />

      {/* Sidebar Navigation (Drawer on mobile, Resizable/Draggable flexible rail on desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        sidebarWidth={sidebarWidth}
        onWidthChange={handleWidthChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-hidden relative z-10">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:overflow-y-auto max-w-7xl w-full mx-auto">
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
