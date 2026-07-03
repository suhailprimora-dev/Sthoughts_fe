"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Receipt,
  Printer,
  Banknote,
  CreditCard,
  Smartphone,
  Table2,
  Clock,
  Calendar,
  Eye,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

interface DateRangeControlProps {
  fromDate: string;
  toDate: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onClear: () => void;
  isDark?: boolean;
}

function DateRangeControl({ fromDate, toDate, onFromChange, onToChange, onClear, isDark }: DateRangeControlProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs font-semibold shadow-2xs ${
      isDark ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200 text-slate-700"
    }`}>
      <div className="flex items-center gap-1 px-2 py-0.5">
        <Calendar className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-primary-300" : "text-primary-600"}`} />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromChange(e.target.value)}
          max={toDate || new Date().toISOString().split("T")[0]}
          style={{ colorScheme: isDark ? "dark" : "light" }}
          className={`bg-transparent font-bold cursor-pointer outline-none text-xs ${isDark ? "text-white" : "text-slate-800"}`}
        />
      </div>

      <span className={isDark ? "text-white/40 font-black shrink-0 hidden sm:inline" : "text-slate-300 font-black shrink-0 hidden sm:inline"}>→</span>

      <div className="flex items-center gap-1 px-2 py-0.5">
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToChange(e.target.value)}
          min={fromDate}
          max={new Date().toISOString().split("T")[0]}
          style={{ colorScheme: isDark ? "dark" : "light" }}
          className={`bg-transparent font-bold cursor-pointer outline-none text-xs ${isDark ? "text-white" : "text-slate-800"}`}
        />
      </div>

      {(fromDate || toDate) && (
        <button
          type="button"
          onClick={onClear}
          title="Clear Dates"
          className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isDark ? "hover:bg-white/20 text-rose-300" : "hover:bg-rose-100 text-rose-600"
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [bills, setBills] = useState<OrderDto[]>([]);
  const [allBillsFallback, setAllBillsFallback] = useState<OrderDto[]>([]);
  const [selectedBill, setSelectedBill] = useState<OrderDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<"all" | string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [printedBill, setPrintedBill] = useState<OrderDto | null>(null);
  const [shopName, setShopName] = useState("THOUGHTIT POS");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_business_name");
      if (stored) setShopName(stored.toUpperCase());
    }
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isServerPaginated, setIsServerPaginated] = useState(true);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filterMethod, fromDate, toDate]);

  useEffect(() => {
    const fetchPaginated = async () => {
      try {
        const res = await orderService.getHistoryPaginated({
          page: currentPage,
          size: pageSize,
          search: searchQuery,
          paymentMethod: filterMethod,
          fromDate,
          toDate,
        });
        setBills(res.content || []);
        setTotalElements(res.totalElements || 0);
        setTotalPages(res.totalPages || 1);
        setIsServerPaginated(true);
      } catch (err) {
        // Fallback if backend paginated endpoint returns 404 before Spring Boot restart
        setIsServerPaginated(false);
        try {
          const fullList = await orderService.getHistory();
          setAllBillsFallback(fullList || []);
        } catch (e) {
          toast.error("Failed to load history");
        }
      }
    };
    fetchPaginated();
  }, [currentPage, pageSize, searchQuery, filterMethod, fromDate, toDate]);

  const displayedBills = useMemo(() => {
    if (isServerPaginated) return bills;
    const clientFiltered = allBillsFallback.filter((b) => {
      const matchSearch =
        b.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery.toLowerCase()) ||
        (b.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.tableNo || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = filterMethod === "all" || b.paymentMethod === filterMethod;
      let matchDate = true;
      if (b.createdAt) {
        const orderDate = new Date(b.createdAt).toISOString().split("T")[0];
        if (fromDate && orderDate < fromDate) matchDate = false;
        if (toDate && orderDate > toDate) matchDate = false;
      }
      return matchSearch && matchMethod && matchDate;
    });

    const start = currentPage * pageSize;
    return clientFiltered.slice(start, start + pageSize);
  }, [isServerPaginated, bills, allBillsFallback, searchQuery, filterMethod, fromDate, toDate, currentPage, pageSize]);

  const activeTotalElements = useMemo(() => {
    if (isServerPaginated) return totalElements;
    const clientFiltered = allBillsFallback.filter((b) => {
      const matchSearch =
        b.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery.toLowerCase()) ||
        (b.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.tableNo || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = filterMethod === "all" || b.paymentMethod === filterMethod;
      let matchDate = true;
      if (b.createdAt) {
        const orderDate = new Date(b.createdAt).toISOString().split("T")[0];
        if (fromDate && orderDate < fromDate) matchDate = false;
        if (toDate && orderDate > toDate) matchDate = false;
      }
      return matchSearch && matchMethod && matchDate;
    });
    return clientFiltered.length;
  }, [isServerPaginated, totalElements, allBillsFallback, searchQuery, filterMethod, fromDate, toDate]);

  const activeTotalPages = useMemo(() => {
    if (isServerPaginated) return totalPages;
    return pageSize > 0 ? Math.ceil(activeTotalElements / pageSize) : 1;
  }, [isServerPaginated, totalPages, activeTotalElements, pageSize]);

  const paymentCounts = useMemo(() => {
    const sourceList = isServerPaginated ? bills : allBillsFallback;
    const c: Record<string, number> = { cash: 0, card: 0, upi: 0 };
    sourceList.forEach(b => { 
      const method = b.paymentMethod?.toLowerCase();
      if (method) c[method] = (c[method] || 0) + 1; 
    });
    return c;
  }, [isServerPaginated, bills, allBillsFallback]);

  const handleReprint = (bill: OrderDto) => {
    setPrintedBill(bill);
    setTimeout(() => window.print(), 100);
  };

  const handleEditBill = async (bill: OrderDto) => {
    try {
      await orderService.reopenOrder(bill.id);
      toast.success(`Opening Bill #${bill.billNo} for editing...`);
    } catch (e) {
      localStorage.setItem("edit_order_fallback", JSON.stringify({ ...bill, status: "ACTIVE" }));
      toast.info(`Opening Bill #${bill.billNo} in POS editor...`);
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gold-500/20 rounded-2xl">
              <Receipt className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Order History</h1>
              <p className="text-sm text-primary-300 mt-0.5">View all settled bills, track payments & print invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 mb-6 mt-6 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["cash", "card", "upi"] as const).map((m) => {
            const cfg = PAYMENT_CONFIG[m];
            const Icon = cfg.icon;
            const count = paymentCounts[m] || 0;
            const revList = isServerPaginated ? bills : allBillsFallback;
            const rev = revList.filter(b => b.paymentMethod?.toLowerCase() === m).reduce((s, b) => s + b.totalAmount, 0);
            const totalCount = revList.length;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={m} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 shadow-2xs">
                <div className={`p-3 rounded-xl ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{cfg.label} Payments</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{formatRs(rev)}</p>
                  <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className={`text-xs font-black px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.text}`}>{count} orders</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-6 pb-12 no-print">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Filters Top Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/60">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoice #, customer name, table no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-2xs"
              />
            </div>

            {/* Filter Group: Payment Method + Date Range */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {(["all", "cash", "card", "upi"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMethod(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterMethod === m
                        ? "bg-primary-950 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {m === "all" ? "All Methods" : m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <DateRangeControl
                fromDate={fromDate}
                toDate={toDate}
                onFromChange={(d) => setFromDate(d)}
                onToChange={(d) => setToDate(d)}
                onClear={() => {
                  setFromDate("");
                  setToDate("");
                }}
                isDark={false}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100/70 text-slate-500 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 text-center w-14">S.No</th>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Customer & Table</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6 text-center">Items</th>
                  <th className="py-3.5 px-6">Payment Method</th>
                  <th className="py-3.5 px-6 text-right">Total Amount</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
                      <p className="text-slate-600 text-sm font-bold">No orders matched your filters</p>
                      <p className="text-slate-400 text-xs mt-1">Try resetting dates or clearing the search query</p>
                    </td>
                  </tr>
                ) : (
                  displayedBills.map((bill, idx) => (
                    <tr
                      key={bill.id}
                      className="border-b border-slate-100 hover:bg-primary-50/40 transition-colors group"
                    >
                      <td className="py-4 px-4 text-center font-bold text-slate-500 text-xs">
                        {currentPage * pageSize + idx + 1}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 text-xs">
                        <span className="px-2.5 py-1 bg-slate-100 group-hover:bg-primary-100 group-hover:text-primary-800 rounded-lg transition-colors">
                          #{bill.billNo}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 text-sm">
                          {bill.customerName || "Walk-in Customer"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          {bill.tableNo ? (
                            <>
                              <Table2 className="w-3 h-3 text-slate-400" />
                              <span>Table {bill.tableNo}</span>
                            </>
                          ) : (
                            <span>Takeaway / Direct</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(bill.createdAt)}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTime(bill.createdAt)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          {bill.items.length} {bill.items.length === 1 ? "item" : "items"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <PaymentBadge method={bill.paymentMethod?.toLowerCase()} />
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-800 font-mono text-base">
                        ₹{bill.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedBill(bill)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs group-hover:shadow-sm cursor-pointer"
                            title="View Receipt Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEditBill(bill)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs group-hover:shadow-sm cursor-pointer"
                            title="Edit Bill in POS"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span>
                Showing <strong className="text-slate-800">{activeTotalElements > 0 ? currentPage * pageSize + 1 : 0}</strong> to{" "}
                <strong className="text-slate-800">{Math.min((currentPage + 1) * pageSize, activeTotalElements)}</strong> of{" "}
                <strong className="text-slate-800">{activeTotalElements}</strong> entries
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-2xs"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-2">
                <span className="text-xs font-bold text-slate-700">
                  Page {currentPage + 1} of {Math.max(1, activeTotalPages)}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(activeTotalPages - 1, currentPage + 1))}
                disabled={currentPage >= activeTotalPages - 1 || activeTotalPages <= 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Order Details Modal Overlay */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-950 to-primary-800 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedBill(null)}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-[11px] font-bold text-primary-300 uppercase tracking-wider mb-1">
                Order Receipt details
              </p>
              <h2 className="text-xl font-black">{selectedBill.customerName || "Walk-in Customer"}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-primary-300 text-xs font-semibold">
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white font-bold">#{selectedBill.billNo}</span>
                {selectedBill.tableNo && <span>· Table {selectedBill.tableNo}</span>}
                <span>· {formatDate(selectedBill.createdAt)} at {formatTime(selectedBill.createdAt)}</span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Payment details badge */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Payment Status</span>
                <PaymentBadge method={selectedBill.paymentMethod?.toLowerCase()} />
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                  Ordered Items ({selectedBill.items.length})
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedBill.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-primary-100 text-primary-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                          {item.quantity}x
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">₹{item.price.toFixed(2)} / unit</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-800 font-mono flex-shrink-0 ml-3">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 space-y-2.5 border border-slate-200/60">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{selectedBill.subtotal.toFixed(2)}</span>
                </div>
                {selectedBill.discount != null && selectedBill.discount > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-rose-500">
                    <span>Discount Applied</span>
                    <span className="font-mono">-₹{selectedBill.discount.toFixed(2)}</span>
                  </div>
                )}
                {selectedBill.serviceCharge != null && selectedBill.serviceCharge > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Service Charge</span>
                    <span className="font-mono">₹{selectedBill.serviceCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold text-slate-600 pb-2.5 border-b border-slate-200">
                  <span>GST / Tax ({selectedBill.gstRate}%)</span>
                  <span className="font-mono">₹{(selectedBill.subtotal * (selectedBill.gstRate / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-black text-slate-800">Net Payable Amount</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    ₹{selectedBill.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleReprint(selectedBill)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Hidden Print Receipt Template */}
      {printedBill && (
        <div className="hidden print:block print-receipt select-none text-black bg-white p-2">
          <div style={{ textAlign: "center", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0" }}>{shopName}</h2>
            <p style={{ fontSize: "10px", margin: "2px 0" }}>Powered by Thoughtit</p>
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
            <p style={{ fontWeight: "bold" }}>Thank you for dining at {shopName}!</p>
            <p>Powered by Thoughtit Cloud</p>
          </div>
        </div>
      )}
    </div>
  );
}
