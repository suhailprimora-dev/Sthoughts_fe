"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Utensils,
  ClipboardList,
  BarChart3,
  Users,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/billing",
    label: "Billing POS",
    icon: Utensils,
    description: "New orders & billing",
  },
  {
    href: "/orders",
    label: "Order History",
    icon: ClipboardList,
    description: "Past bills & receipts",
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
    description: "Revenue & P&L",
  },
  {
    href: "/staff",
    label: "Staff",
    icon: Users,
    description: "Attendance & salary",
  },
  {
    href: "/reports/payroll",
    label: "Payroll Tracker",
    icon: ClipboardList,
    description: "Monthly salary status",
  },
  {
    href: "/menu",
    label: "Menu",
    icon: UtensilsCrossed,
    description: "Items & categories",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [shopName, setShopName] = useState("S Cafe");
  const [subdomain, setSubdomain] = useState("scafe.Thoughtit.com");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShop = localStorage.getItem("user_business_name");
      const storedSub = localStorage.getItem("user_subdomain");
      if (storedShop) setShopName(storedShop);
      if (storedSub) setSubdomain(storedSub.replace("www.", ""));
    }
  }, []);

  // Hide sidebar on root landing page, marketing & authentication pages
  const isPublicPage =
    pathname === "/" ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/pricing") ||
    pathname?.startsWith("/welcome");

  if (isPublicPage) {
    return null;
  }

  return (
    <aside
      className={`no-print h-screen sticky top-0 flex flex-col bg-primary-950 border-r border-primary-900 transition-all duration-300 z-50 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      {/* Dynamic Shop Logo & Thoughtit Branding */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-900 overflow-hidden">
        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-xl text-black font-black text-sm shadow-glow flex items-center justify-center w-9 h-9">
          {shopName ? shopName.charAt(0).toUpperCase() : "S"}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white truncate max-w-[130px]" title={shopName}>
                {shopName}
              </span>
              <span className="text-[9px] font-bold tracking-widest text-black bg-gold-400 px-1.5 py-0.5 rounded flex-shrink-0">
                POS
              </span>
            </div>
            <span className="text-[10px] text-gold-400/90 font-medium truncate block -mt-0.5">
              Powered by Thoughtit
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
        const isActive =
            item.href === "/billing"
              ? pathname === "/billing"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-gold-600 text-white shadow-glow"
                  : "text-primary-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
              {!collapsed && (
                <div className="min-w-0 overflow-hidden">
                  <div className="text-xs font-bold truncate">{item.label}</div>
                  <div className="text-[10px] text-primary-400 group-hover:text-primary-300 truncate transition-colors">
                    {item.description}
                  </div>
                </div>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse & Sign Out Controls */}
      <div className="p-2 border-t border-primary-900 space-y-1">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-primary-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-bold"
          title="Sign Out to Website"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
