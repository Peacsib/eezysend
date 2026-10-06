"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeftRight,
  MessageSquare,
  Activity,
  LogOut,
  Building2,
  ChevronRight,
} from "lucide-react";

export type DashboardTab = 'reporting' | 'transactions' | 'sms' | 'health';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
}: SidebarProps) {
  const [username, setUsername] = React.useState<string>("Tinashe Zvihwati");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("eezysend_username");
      if (stored && stored.trim()) {
        setUsername(stored.trim());
      }
    }
  }, []);

  const initials = React.useMemo(() => {
    const parts = username.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase() || "US";
  }, [username]);

  const navItems = [
    {
      id: 'reporting' as DashboardTab,
      label: 'Reporting',
      subtitle: 'Audit & Settlements',
      icon: FileText,
      badge: 'Active',
    },
    {
      id: 'transactions' as DashboardTab,
      label: 'Transactions',
      subtitle: 'Transfers & Lookups',
      icon: ArrowLeftRight,
      badge: null,
    },
    {
      id: 'sms' as DashboardTab,
      label: 'SMS Center',
      subtitle: 'Delivery & Gateway',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'health' as DashboardTab,
      label: 'System Health',
      subtitle: 'NLB & API Status',
      icon: Activity,
      badge: null,
    },
  ];

  return (
    <aside className="w-72 bg-eezysend-blue border-r border-eezysend-blue-hover flex flex-col justify-between p-5 min-h-screen text-white">{/* Top Branding */}
      <div className="space-y-6">
        <div className="flex items-center justify-center pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center justify-center w-full">
            <img
              src="/eezysend-logo-white.svg"
              alt="EezySend Logo"
              className="h-10 w-auto"
            />
          </Link>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-semibold absolute right-0">
            v1.0
          </span>
        </div>

        {/* Institution Info Card */}
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">
              CABS Financial Ops
            </div>
            <div className="text-[11px] text-white/70 truncate">
              Local Remit Portal
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50 px-3 pb-1">
            Operations Workspace
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 group ${
                  isActive
                    ? 'bg-white text-eezysend-blue shadow-sm font-semibold scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-eezysend-blue/10 text-eezysend-blue' : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium leading-tight">
                      {item.label}
                    </div>
                    <div className={`text-[10px] ${isActive ? 'text-eezysend-blue/70' : 'text-white/60'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge ? (
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-eezysend-blue/10 text-eezysend-blue' : 'bg-white/10 text-white'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-eezysend-blue' : 'text-white/60'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Sign Out */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-eezysend-blue font-bold text-xs flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate capitalize">
                {username}
              </div>
              <div className="text-[10px] text-white/70 truncate">
                Operations Officer
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-white/80 hover:text-rose-300 hover:bg-rose-500/20 border border-white/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out of Portal
        </button>
      </div>
    </aside>
  );
}
