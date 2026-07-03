"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Trash2,
  Receipt,
  Settings,
  History,
  Search,
  CreditCard,
  Utensils,
  X,
} from "lucide-react";
import { MenuItem, Bill } from "@/types/billing";
import SettleModal from "@/components/SettleModal";
import { orderService, OrderDto } from "@/services/order.service";
import { useMenu } from "@/context/MenuContext";
import { toast } from "react-toastify";

function formatRs(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RestaurantBillingPage() {
  const { items, categories: menuCategories, isLoading } = useMenu();
  const [activeOrder, setActiveOrder] = useState<OrderDto | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [billsHistory, setBillsHistory] = useState<Bill[]>([]);
  
  // Modals state
  const [showSettleModal, setShowSettleModal] = useState(false);
  
  // Temp printed bill storage for printing process
  const [printedBill, setPrintedBill] = useState<any>(null);
  const [shopName, setShopName] = useState("Thoughtit POS");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_business_name");
      if (stored) setShopName(stored);
    }
  }, []);

  // Load from localStorage and backend on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("billing_history");
    if (savedHistory) {
      setBillsHistory(JSON.parse(savedHistory));
    }
    
    // Check if coming from Order History Edit button fallback
    const fallbackEdit = localStorage.getItem("edit_order_fallback");
    if (fallbackEdit) {
      localStorage.removeItem("edit_order_fallback");
      try {
        const parsed = JSON.parse(fallbackEdit);
        setActiveOrder(parsed);
      } catch (e) {}
    } else {
      // Fetch active order from backend
      orderService.getActiveOrder().then(order => {
        setActiveOrder(order);
      }).catch(err => toast.error("Failed to fetch active order"));
    }
  }, []);

  // Sync history helper
  const syncHistory = (newHistory: Bill[]) => {
    setBillsHistory(newHistory);
    localStorage.setItem("billing_history", JSON.stringify(newHistory));
  };

  // Categories derived from context plus "All"
  const categories = useMemo(() => {
    return ["All", ...menuCategories];
  }, [menuCategories]);

  // Filtered menu items
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Start new bill draft
  const startNewBill = async () => {
    try {
      const order = await orderService.getActiveOrder();
      setActiveOrder(order);
    } catch (e) {
      toast.error("Failed to start order");
    }
  };

  // Cancel active draft
  const cancelActiveBill = async () => {
    if (!activeOrder) return;
    try {
      await orderService.cancelActiveOrder();
      setActiveOrder(null);
      toast.info("Order cleared");
    } catch (e) {
      toast.error("Failed to cancel order");
    }
  };

  // Add item to draft
  const addToDraft = async (item: MenuItem) => {
    if (!activeOrder) {
      try {
        const order = await orderService.getActiveOrder();
        const updated = await orderService.addItem(order.id, {
          menuItemId: Number(item.id),
          name: item.name,
          price: item.price,
          quantity: 1
        });
        setActiveOrder(updated);
      } catch (e) {
        toast.error("Failed to add item");
      }
      return;
    }

    try {
      const updated = await orderService.addItem(activeOrder.id, {
        menuItemId: Number(item.id),
        name: item.name,
        price: item.price,
        quantity: 1
      });
      setActiveOrder(updated);
    } catch (e) {
      toast.error("Failed to add item");
    }
  };

  // Change quantity (+1 or -1)
  const changeQty = async (itemId: number, delta: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.updateItemQuantity(activeOrder.id, itemId, delta);
      setActiveOrder(updated);
    } catch (e) {
      toast.error("Failed to update item quantity");
    }
  };

  // Remove item completely from draft
  const removeFromDraft = async (itemId: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.removeItem(activeOrder.id, itemId);
      setActiveOrder(updated);
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  // Update GST Rate
  const updateGstRate = async (rate: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.updateGstRate(activeOrder.id, rate);
      setActiveOrder(updated);
    } catch (e) {
      toast.error("Failed to update GST");
    }
  };

  // Final Settle process
  const handleSettle = async (settleDetails: any) => {
    if (!activeOrder) return;
    try {
      const settled = await orderService.settleOrder(activeOrder.id, settleDetails);
      setShowSettleModal(false);
      setActiveOrder(null);
      toast.success("Order settled successfully!");
      
      // Auto print
      setPrintedBill(settled);
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (e) {
      toast.error("Failed to settle order");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER SECTION (Compact Height) */}
      <header className="bg-primary-950 text-white shadow-md border-b border-primary-900 sticky top-0 z-40 no-print px-4 sm:px-6 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo Title */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gold-600 rounded-lg text-white shadow-glow">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight uppercase">{shopName}</span>
                <span className="text-[9px] font-bold tracking-widest text-gold-400 uppercase bg-white/10 px-1 py-0.5 rounded">POS</span>
              </div>
            </div>
          </div>

          {/* Active Bill Badge */}
          {activeOrder && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
              <span className="text-gold-400 text-xs font-bold">Bill: #{activeOrder.billNo}</span>
            </div>
          )}

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Order History</span>
            </Link>
            <Link
              href="/menu"
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Manage Menu</span>
            </Link>
            
            {!activeOrder && (
              <button
                onClick={startNewBill}
                className="px-3.5 py-1.5 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-glow hover:shadow-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Order</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MAIN BILLING INTERFACE (Full Width & Compact Heights) */}
      <main className="max-w-[1700px] w-full mx-auto px-3 sm:px-6 py-3 flex-1 flex flex-col lg:flex-row gap-4 items-start no-print">
        
        {/* LEFT PANEL: Menu Items Catalog */}
        <section className="flex-1 w-full flex flex-col min-w-0">
          
          {/* Search, Filter Tabs Bar */}
          <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary-950 text-white border-primary-950 shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Search */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Compact Menu Items Cards Grid */}
          {isLoading ? (
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <Utensils className="w-10 h-10 text-slate-300 stroke-[1.25] mx-auto mb-2 animate-pulse" />
              <h3 className="text-slate-700 font-bold text-sm animate-pulse">Loading Menu...</h3>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <Utensils className="w-10 h-10 text-slate-300 stroke-[1.25] mx-auto mb-2" />
              <h3 className="text-slate-700 font-bold text-sm">No Menu Items Found</h3>
              <p className="text-slate-400 text-xs mt-1">
                Add dishes to the menu or adjust your search / category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5">
              {visibleItems.map((item) => {
                const inDraft = activeOrder?.items.find((d) => d.menuItemId === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 shadow-2xs hover:shadow-md hover:border-primary-300 transition-all duration-200 flex items-center justify-between gap-3 group h-[60px]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-extrabold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate group-hover:text-primary-700 transition-colors">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-black text-gold-600 font-mono">
                        {formatRs(item.price)}
                      </span>

                      {!inDraft ? (
                        <button
                          onClick={() => addToDraft(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-primary-950 text-slate-700 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-primary-950 text-white rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => changeQty(inDraft.id, -1)}
                            className="p-1 text-white hover:text-gold-400 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{inDraft.quantity}</span>
                          <button
                            onClick={() => changeQty(inDraft.id, 1)}
                            className="p-1 text-white hover:text-gold-400 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT PANEL: Current Bill Draft (Compact Sticky Sidebar) */}
        <section className="w-full lg:w-80 xl:w-96 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden sticky top-[60px] flex flex-col max-h-[calc(100vh-76px)] flex-shrink-0">
          {/* Panel Header */}
          <div className="p-3 bg-primary-950 text-white flex items-center justify-between border-b border-primary-900">
            <div>
              <h3 className="text-xs font-bold">Order Summary</h3>
              <p className="text-[10px] text-primary-200 mt-0.5">
                {activeOrder ? `Bill No: #${activeOrder.billNo}` : "No Active Order"}
              </p>
            </div>
            {activeOrder && (
              <button
                onClick={cancelActiveBill}
                className="p-1 hover:bg-white/10 text-rose-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                title="Cancel Order"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Draft Item Rows */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {!activeOrder || activeOrder.items.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <Receipt className="w-8 h-8 text-slate-300 stroke-[1.25] mb-2" />
                <h4 className="text-slate-700 font-bold text-xs">No Active Order</h4>
                <p className="text-slate-400 text-[10px] mt-1 max-w-[150px] leading-relaxed mx-auto">
                  Pick dishes from the menu to start a new order.
                </p>
                {!activeOrder && (
                  <button
                    onClick={startNewBill}
                    className="mt-3 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Start New Order
                  </button>
                )}
              </div>
            ) : (
              activeOrder.items.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start justify-between gap-2 pb-2.5 border-b border-dashed border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 leading-snug truncate">
                      {d.name}
                    </h5>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-semibold">
                      <span>{d.quantity} x</span>
                      <span>{formatRs(d.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {formatRs(d.quantity * d.price)}
                    </span>
                    <button
                      onClick={() => removeFromDraft(d.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Totals Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold">{formatRs(activeOrder?.subtotal || 0)}</span>
              </div>
              {/* Customizable GST Row */}
              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span>GST</span>
                  <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={activeOrder?.gstRate || 0}
                      onChange={(e) => updateGstRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-8 text-xs font-bold text-slate-700 text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">%</span>
                  </div>
                </div>
                <span className="font-mono font-semibold">{formatRs((activeOrder?.subtotal || 0) * ((activeOrder?.gstRate || 0) / 100))}</span>
              </div>
              <div className="flex justify-between items-center text-slate-800 pt-1 border-t border-slate-200/80">
                <span className="font-bold text-xs">Est. Total</span>
                <span className="font-mono text-sm font-black text-gold-600">
                  {formatRs(activeOrder?.totalAmount || 0)}
                </span>
              </div>
            </div>

            <SettleModal
              isOpen={showSettleModal}
              onClose={() => setShowSettleModal(false)}
              subtotal={activeOrder?.subtotal || 0}
              gstRate={activeOrder?.gstRate || 0}
              onSettle={handleSettle}
            />

            <button
              onClick={() => setShowSettleModal(true)}
              disabled={!activeOrder || activeOrder.items.length === 0}
              className="w-full py-2.5 bg-primary-950 disabled:bg-slate-200 hover:bg-primary-900 disabled:text-slate-400 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:shadow-none transition-all text-xs cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Settle & Print Bill</span>
            </button>
          </div>
        </section>

      </main>

      {/* PRINT-ONLY AREA: standard POS thermal layout */}
      {printedBill && (
        <div className="hidden print:block print-receipt select-none text-black bg-white p-2">
          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0" }}>{shopName.toUpperCase()}</h2>
            <p style={{ fontSize: "10px", margin: "2px 0" }}>Powered by Thoughtit Cloud</p>
            <p style={{ fontSize: "9px", margin: "0" }}>GSTIN: 36729103859</p>
          </div>

          {/* Details */}
          <div style={{ fontSize: "10px", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Bill No:</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>#{printedBill.billNo || printedBill.id}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td style={{ textAlign: "right" }}>{new Date().toLocaleString()}</td>
                </tr>
                {printedBill.customerName && (
                  <tr>
                    <td>Customer:</td>
                    <td style={{ textAlign: "right" }}>{printedBill.customerName}</td>
                  </tr>
                )}
                {printedBill.tableNo && (
                  <tr>
                    <td>Table:</td>
                    <td style={{ textAlign: "right" }}>Table {printedBill.tableNo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Items */}
          <div style={{ borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%", fontSize: "10px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid black" }}>
                  <th style={{ textAlign: "left" }}>Item</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Amt (₹)</th>
                </tr>
              </thead>
              <tbody>
                {printedBill.items.map((item: any) => (
                  <tr key={item.id || item.name}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ fontSize: "10px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td style={{ textAlign: "right" }}>{printedBill.subtotal?.toFixed(2) || "0.00"}</td>
                </tr>
                {printedBill.discount != null && printedBill.discount > 0 && (
                  <tr>
                    <td>Discount</td>
                    <td style={{ textAlign: "right", color: "red" }}>-{printedBill.discount.toFixed(2)}</td>
                  </tr>
                )}
                {printedBill.serviceCharge != null && printedBill.serviceCharge > 0 && (
                  <tr>
                    <td>Service Charge</td>
                    <td style={{ textAlign: "right" }}>{printedBill.serviceCharge.toFixed(2)}</td>
                  </tr>
                )}
                <tr style={{ fontWeight: "bold", borderTop: "1px dashed black" }}>
                  <td style={{ paddingTop: "6px" }}>Grand Total</td>
                  <td style={{ textAlign: "right", paddingTop: "6px" }}>{printedBill.totalAmount?.toFixed(2) || "0.00"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "9px", borderTop: "1px dashed black", paddingTop: "10px" }}>
            <p style={{ fontWeight: "bold" }}>Thank you for dining with us!</p>
            <p>Please visit again.</p>
          </div>
        </div>
      )}

    </div>
  );
}
