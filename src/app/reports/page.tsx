"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Receipt,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { 
  analyticsService, 
  AnalyticsOverviewDto, 
  TodayYesterdayDto, 
  DailyRevenueDto, 
  PaymentMethodBreakdownDto, 
  TopItemDto 
} from "@/services/analytics.service";

function formatRs(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function ReportsPage() {
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");
  
  const [overview, setOverview] = useState<AnalyticsOverviewDto | null>(null);
  const [todayYest, setTodayYest] = useState<TodayYesterdayDto | null>(null);
  const [dailyRev, setDailyRev] = useState<DailyRevenueDto[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentMethodBreakdownDto | null>(null);
  const [topItems, setTopItems] = useState<TopItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      analyticsService.getOverview(range),
      analyticsService.getTodayYesterday(),
      analyticsService.getDailyRevenue(range),
      analyticsService.getPaymentBreakdown(range),
      analyticsService.getTopItems(range)
    ]).then(([overviewData, todayYestData, dailyRevData, paymentData, topItemsData]) => {
      if (isMounted) {
        setOverview(overviewData);
        setTodayYest(todayYestData);
        setDailyRev(dailyRevData);
        setPaymentBreakdown(paymentData);
        setTopItems(topItemsData);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [range]);

  const maxDayRevenue = Math.max(...dailyRev.map((d) => d.revenue), 1);
  const maxItemRevenue = Math.max(...topItems.map((i) => i.revenue), 1);

  if (isLoading || !overview || !todayYest || !paymentBreakdown) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 font-bold animate-pulse">Loading Analytics...</div>
      </div>
    );
  }

  const dayDelta = todayYest.changePercentage;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-primary-300 mt-0.5">Revenue, profit & loss overview</p>
          </div>
          {/* Range selector */}
          <div className="flex bg-white/10 p-1 rounded-xl gap-1">
            {(["7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === r ? "bg-white text-primary-900 shadow-sm" : "text-primary-200 hover:text-white"
                }`}
              >
                {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: formatRs(overview.totalRevenue), icon: IndianRupee, color: "emerald", sub: `${overview.totalBills} bills` },
            { label: "Total Discount", value: formatRs(overview.totalDiscount), icon: TrendingDown, color: "rose", sub: "Given to customers" },
            { label: "Total Tax (GST)", value: formatRs(overview.totalTax), icon: Receipt, color: "blue", sub: "CGST + SGST collected" },
            { label: "Avg. Bill Value", value: formatRs(overview.avgBillValue), icon: BarChart3, color: "purple", sub: "Per transaction" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            const colorMap: Record<string, string> = {
              emerald: "bg-emerald-50 text-emerald-600",
              rose: "bg-rose-50 text-rose-600",
              blue: "bg-blue-50 text-blue-600",
              purple: "bg-purple-50 text-purple-600",
            };
            return (
              <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{kpi.label}</p>
                  <div className={`p-2 rounded-lg ${colorMap[kpi.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl font-black text-slate-800">{kpi.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Today vs Yesterday */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Today vs Yesterday</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Today</p>
              <p className="text-2xl font-black text-slate-800">{formatRs(todayYest.todayRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Yesterday</p>
              <p className="text-2xl font-black text-slate-500">{formatRs(todayYest.yesterdayRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Change</p>
              <div className="flex items-center gap-1.5">
                {dayDelta >= 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-rose-500" />
                )}
                <p className={`text-2xl font-black ${dayDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {dayDelta >= 0 ? "+" : ""}{dayDelta.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Daily Revenue — Last {range === '30d' ? '30' : (range === 'all' ? '30' : '7')} Days</h2>
            <div className="flex items-end gap-2 h-40">
              {dailyRev.map((day) => {
                const pct = maxDayRevenue > 0 ? (day.revenue / maxDayRevenue) * 100 : 0;
                const d = new Date(day.date);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{day.revenue.toFixed(0)}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg relative overflow-hidden" style={{ height: "120px" }}>
                      <div
                        className="absolute bottom-0 w-full bg-primary-600 rounded-t-lg transition-all duration-500"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {d.getDate()}{MONTH_NAMES[d.getMonth()].substring(0,3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Revenue by Payment Method</h2>
            <div className="space-y-3">
              {[
                { key: "cash", label: "Cash", color: "bg-emerald-500", val: paymentBreakdown.cash },
                { key: "upi", label: "UPI", color: "bg-purple-500", val: paymentBreakdown.upi },
                { key: "card", label: "Card", color: "bg-blue-500", val: paymentBreakdown.card },
              ].map((m) => {
                const val = m.val;
                const pct = overview.totalRevenue > 0 ? (val / overview.totalRevenue) * 100 : 0;
                return (
                  <div key={m.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-600">{m.label}</span>
                      <span className="font-bold text-slate-800">{formatRs(val)} <span className="text-slate-400">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${m.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Profit & Loss Summary */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">P&L Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Revenue</span>
                  <span className="font-bold text-emerald-600">{formatRs(overview.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discount Given</span>
                  <span className="font-bold text-rose-500">-{formatRs(overview.totalDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Charge Collected</span>
                  <span className="font-bold text-blue-600">+{formatRs(overview.totalServiceCharge)}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 mt-1">
                  <span className="font-bold text-slate-700">Net Revenue</span>
                  <span className="font-black text-slate-900">{formatRs(overview.totalRevenue - overview.totalDiscount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Top Selling Items</h2>
          {topItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No sales data yet. Start taking orders!
            </div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => {
                const pct = maxItemRevenue > 0 ? (item.revenue / maxItemRevenue) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-300 w-4">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{item.name}</span>
                        <span className="text-slate-500 font-mono">{item.qty} sold · {formatRs(item.revenue)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-600 to-gold-500 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
