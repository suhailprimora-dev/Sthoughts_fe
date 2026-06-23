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
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Billing",
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
    href: "/menu",
    label: "Menu",
    icon: UtensilsCrossed,
    description: "Items & categories",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`no-print h-screen sticky top-0 flex flex-col bg-primary-950 border-r border-primary-900 transition-all duration-300 z-50 ${
        collapsed ? "w-[68px]" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-900 overflow-hidden">
        <div className="flex-shrink-0 p-2 bg-gold-600 rounded-xl text-white shadow-glow">
          <Utensils className="w-4 h-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight uppercase text-white">Aura</span>
              <span className="text-[9px] font-bold tracking-widest text-gold-400 uppercase bg-white/10 px-1.5 py-0.5 rounded">
                DINE
              </span>
            </div>
            <span className="text-[10px] text-primary-300 font-semibold block -mt-0.5">
              Restaurant System
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
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

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-primary-900">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-primary-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
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
      </div>
    </aside>
  );
}
