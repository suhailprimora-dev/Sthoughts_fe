"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Receipt,
  Printer,
  ChevronRight,
  Banknote,
  CreditCard,
  Smartphone,
  Table2,
  Clock,
  Calendar,
} from "lucide-react";
import { OrderDto, orderService } from "@/services/order.service";
import { toast } from "react-toastify";

function formatRs(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const PAYMENT_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  cash: { label: "Cash", icon: Banknote, bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  card: { label: "Card", icon: CreditCard, bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  upi:  { label: "UPI",  icon: Smartphone, bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

function PaymentBadge({ method }: { method?: string }) {
  if (!method) return <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded-full">N/A</span>;
  const cfg = PAYMENT_CONFIG[method];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}


export default function OrderHistoryPage() {
  const [bills, setBills] = useState<OrderDto[]>([]);
  const [selectedBill, setSelectedBill] = useState<OrderDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<"all" | string>("all");
  const [printedBill, setPrintedBill] = useState<OrderDto | null>(null);

  useEffect(() => {
    orderService.getHistory().then(setBills).catch(() => toast.error("Failed to load history"));
  }, []);

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      const matchSearch =
        b.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery.toLowerCase()) ||
        (b.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.tableNo || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = filterMethod === "all" || b.paymentMethod === filterMethod;
      return matchSearch && matchMethod;
    });
  }, [bills, searchQuery, filterMethod]);


  const paymentCounts = useMemo(() => {
    const c: Record<string, number> = { cash: 0, card: 0, upi: 0 };
    bills.forEach(b => { 
      const method = b.paymentMethod?.toLowerCase();
      if (method) c[method] = (c[method] || 0) + 1; 
    });
    return c;
  }, [bills]);

  const handleReprint = (bill: OrderDto) => {
    setPrintedBill(bill);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 no-print shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gold-500/20 rounded-xl">
              <Receipt className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Order History</h1>
              <p className="text-sm text-primary-300 mt-0.5">All settled bills and transaction records</p>
            </div>
          </div>
        </div>
      </div>


      {/* Payment Method Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 mb-6 mt-6 no-print">
        <div className="grid grid-cols-3 gap-4">
          {(["cash", "card", "upi"] as const).map((m) => {
            const cfg = PAYMENT_CONFIG[m];
            const Icon = cfg.icon;
            const count = paymentCounts[m] || 0;
            const rev = bills.filter(b => b.paymentMethod?.toLowerCase() === m).reduce((s, b) => s + b.totalAmount, 0);
            const pct = bills.length > 0 ? Math.round((count / bills.length) * 100) : 0;
            return (
              <div key={m} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{cfg.label} Payments</p>
                  <p className="text-base font-black text-slate-800 mt-0.5">{formatRs(rev)}</p>
                  <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.dot} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className={`text-xs font-black px-2 py-1 rounded-lg ${cfg.bg} ${cfg.text}`}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8 flex gap-5 no-print">
        {/* Left: Bill List */}
        <div className="w-96 flex-shrink-0 flex flex-col gap-3">
          {/* Search + Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customer, bill ID, table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "cash", "upi", "card"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMethod(m)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                    filterMethod === m
                      ? "bg-primary-950 text-white border-primary-950 shadow-sm"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {m === "all" ? "All" : m.toUpperCase()}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-slate-400 font-semibold self-center pr-1">
                {filtered.length} bills
              </span>
            </div>
          </div>

          {/* Bill Cards */}
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-440px)]">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
                <p className="text-slate-500 text-sm font-bold">No orders found</p>
                <p className="text-slate-400 text-xs mt-1">Adjust your search or filters</p>
              </div>
            ) : (
              filtered.map((bill) => (
                <button
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                    selectedBill?.id === bill.id
                      ? "border-primary-400 bg-primary-50 shadow-sm"
                      : "bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">#{bill.billNo}</span>
                    <PaymentBadge method={bill.paymentMethod?.toLowerCase()} />
                  </div>
                  {/* Middle row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {bill.customerName || "Walk-in Customer"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {bill.tableNo ? `Table ${bill.tableNo}` : "No Table"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-slate-800">₹{bill.totalAmount.toFixed(0)}</p>
                      <p className="text-[10px] text-slate-400">{bill.items.length} items</p>
                    </div>
                  </div>
                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(bill.createdAt)} · {formatDate(bill.createdAt)}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-colors ${selectedBill?.id === bill.id ? "text-primary-500" : "text-slate-300 group-hover:text-primary-400"}`} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Bill Detail */}
        <div className="flex-1 min-w-0">
          {selectedBill ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-6">
              {/* Receipt Header */}
              <div className="bg-gradient-to-r from-primary-950 to-primary-800 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-primary-300 uppercase tracking-wider mb-1">Invoice #{selectedBill.billNo}</p>
                    <h2 className="text-xl font-black">{selectedBill.customerName || "Walk-in Customer"}</h2>
                    <div className="flex items-center gap-3 mt-2 text-primary-300 text-xs font-semibold">
                      {selectedBill.tableNo && (
                        <span className="flex items-center gap-1">
                          <Table2 className="w-3.5 h-3.5" /> Table {selectedBill.tableNo}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(selectedBill.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {formatTime(selectedBill.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <PaymentBadge method={selectedBill.paymentMethod?.toLowerCase()} />
                    <button
                      onClick={() => handleReprint(selectedBill)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" /> Reprint
                    </button>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-5">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Items Ordered ({selectedBill.items.length})
                </h3>
                <div className="space-y-1 mb-5 max-h-52 overflow-y-auto pr-1">
                  {selectedBill.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                          {item.quantity}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 font-mono flex-shrink-0 ml-3">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold">₹{selectedBill.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedBill.discount != null && selectedBill.discount > 0 && (
                    <div className="flex justify-between text-xs text-rose-500">
                      <span>Discount Applied</span>
                      <span className="font-mono font-semibold">-₹{selectedBill.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedBill.serviceCharge != null && selectedBill.serviceCharge > 0 && (
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Service Charge (5%)</span>
                      <span className="font-mono font-semibold">₹{selectedBill.serviceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-slate-500 pb-2.5 border-b border-slate-200">
                    <span>GST / Tax</span>
                    <span className="font-mono font-semibold">₹{(selectedBill.subtotal * (selectedBill.gstRate / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-extrabold text-slate-800">Grand Total</span>
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      ₹{selectedBill.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 h-80 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-slate-400 stroke-[1.25]" />
              </div>
              <h3 className="text-slate-700 font-bold text-base">Select a bill to view</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-52">
                Click any order from the list to view its full details and receipt
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Print area */}
      {printedBill && (
        <div className="hidden print:block print-receipt select-none text-black bg-white p-2">
          <div style={{ textAlign: "center", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0" }}>AURA DINE</h2>
            <p style={{ fontSize: "10px", margin: "2px 0" }}>Restaurant & Fine Dining</p>
            <p style={{ fontSize: "9px", margin: "0" }}>GSTIN: 36729103859</p>
          </div>
          <div style={{ fontSize: "10px", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%" }}><tbody>
              <tr><td>Bill No:</td><td style={{ textAlign: "right", fontWeight: "bold" }}>#{printedBill.billNo}</td></tr>
              <tr><td>Date:</td><td style={{ textAlign: "right" }}>{new Date(printedBill.createdAt).toLocaleString()}</td></tr>
              <tr><td>Customer:</td><td style={{ textAlign: "right", fontWeight: "bold" }}>{printedBill.customerName}</td></tr>
              {printedBill.tableNo && <tr><td>Table:</td><td style={{ textAlign: "right" }}>Table {printedBill.tableNo}</td></tr>}
              <tr><td>Payment:</td><td style={{ textAlign: "right", textTransform: "uppercase" }}>{printedBill.paymentMethod}</td></tr>
            </tbody></table>
          </div>
          <div style={{ borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%", fontSize: "10px" }}>
              <thead><tr style={{ borderBottom: "1px solid black" }}>
                <th style={{ textAlign: "left" }}>Item</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Amt (₹)</th>
              </tr></thead>
              <tbody>{printedBill.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ fontSize: "10px" }}>
            <table style={{ width: "100%" }}><tbody>
              <tr><td>Subtotal</td><td style={{ textAlign: "right" }}>{printedBill.subtotal.toFixed(2)}</td></tr>
              {printedBill.discount != null && printedBill.discount > 0 && <tr><td>Discount</td><td style={{ textAlign: "right", color: "red" }}>-{printedBill.discount.toFixed(2)}</td></tr>}
              {printedBill.serviceCharge != null && printedBill.serviceCharge > 0 && <tr><td>Service Charge</td><td style={{ textAlign: "right" }}>{printedBill.serviceCharge.toFixed(2)}</td></tr>}
              <tr><td>CGST</td><td style={{ textAlign: "right" }}>{((printedBill.subtotal * (printedBill.gstRate / 100)) / 2).toFixed(2)}</td></tr>
              <tr><td>SGST</td><td style={{ textAlign: "right" }}>{((printedBill.subtotal * (printedBill.gstRate / 100)) / 2).toFixed(2)}</td></tr>
              <tr style={{ fontWeight: "bold", borderTop: "1px dashed black" }}>
                <td style={{ paddingTop: "6px" }}>Net Payable</td>
                <td style={{ textAlign: "right", paddingTop: "6px" }}>{printedBill.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody></table>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "9px", borderTop: "1px dashed black", paddingTop: "10px" }}>
            <p style={{ fontWeight: "bold" }}>Thank you for dining at Aura!</p>
            <p>Please visit again. Bon Appétit!</p>
          </div>
        </div>
      )}
    </div>
  );
}
