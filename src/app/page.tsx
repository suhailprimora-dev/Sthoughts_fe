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
import { MenuItem, DraftItem, Bill, PaymentMethod } from "@/types/billing";
import SettleModal from "@/components/SettleModal";
import { orderService, OrderDto, OrderItemDto } from "@/services/order.service";
import { useMenu } from "@/context/MenuContext";

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

  // Load from localStorage and backend on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("billing_history");
    if (savedHistory) {
      setBillsHistory(JSON.parse(savedHistory));
    }
    
    // Fetch active order from backend
    orderService.getActiveOrder().then(order => {
      setActiveOrder(order);
    }).catch(err => console.error("Failed to fetch active order", err));
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

  // Filter items
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Start new bill draft
  const startNewBill = async () => {
    try {
      const order = await orderService.getActiveOrder();
      setActiveOrder(order);
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel bill draft
  const cancelActiveBill = async () => {
    if (window.confirm("Are you sure you want to cancel and clear the active draft?")) {
      await orderService.cancelActiveOrder();
      setActiveOrder(null);
    }
  };

  // Add to draft list
  const addToDraft = async (item: MenuItem) => {
    let orderId = activeOrder?.id;
    if (!orderId) {
      const order = await orderService.getActiveOrder();
      orderId = order.id;
    }
    
    try {
      const updated = await orderService.addItem(orderId, {
        menuItemId: Number(item.id),
        name: item.name,
        price: item.price,
        quantity: 1
      });
      setActiveOrder(updated);
    } catch (err) {
      console.error("Failed to add item", err);
    }
  };

  // Change quantity of item in draft
  const changeQty = async (itemId: number, delta: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.updateItemQuantity(activeOrder.id, itemId, delta);
      setActiveOrder(updated);
    } catch (err) {
      console.error("Failed to update qty", err);
    }
  };

  // Remove item completely from draft
  const removeFromDraft = async (itemId: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.removeItem(activeOrder.id, itemId);
      setActiveOrder(updated);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const updateGstRate = async (rate: number) => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.updateGstRate(activeOrder.id, rate);
      setActiveOrder(updated);
    } catch (err) {
      console.error("Failed to update GST", err);
    }
  };

  // Settle bill
  const handleSettle = async ({
    discount,
    paymentMethod,
    serviceCharge,
    tax,
    customerName,
    tableNo,
  }: any) => {
    if (!activeOrder) return;
    try {
      const settledOrder = await orderService.settleOrder(activeOrder.id, {
        discount,
        paymentMethod,
        serviceCharge,
        customerName,
        tableNo
      });

      setPrintedBill(settledOrder);
      setShowSettleModal(false);

      setTimeout(() => {
        window.print();
        setActiveOrder(null);
      }, 100);
    } catch (err) {
      console.error("Failed to settle", err);
    }
  };

  // Reprint historical bill
  const handleReprintBill = (bill: Bill) => {
    setPrintedBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Add new item to catalog
  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    const created: MenuItem = {
      ...newItem,
      id: Date.now(),
    };
    const updated = [created, ...items];
    syncItems(updated);
  };

  // Update menu item
  const handleUpdateItem = (updatedItem: MenuItem) => {
    // handled by MenuContext in real app, omitted local state sync for draft
  };

  // Delete menu item
  const handleDeleteItem = (id: string | number) => {
    // handled by MenuContext in real app
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <header className="bg-primary-950 text-white shadow-md border-b border-primary-900 sticky top-0 z-40 no-print px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gold-600 rounded-xl text-white shadow-glow">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight uppercase">Aura</span>
                <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase bg-white/10 px-1.5 py-0.5 rounded">DINE</span>
              </div>
              <span className="text-[10px] text-primary-200 block -mt-0.5 font-semibold">Restaurant Billing System</span>
            </div>
          </div>

          {/* Active Bill Badge */}
          {activeOrder && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
              <span className="text-gold-400 text-xs font-bold">Bill: #{activeOrder.billNo}</span>
            </div>
          )}

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <History className="w-4 h-4 text-gold-400" />
              <span>Order History</span>
            </Link>
            <Link
              href="/menu"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Settings className="w-4 h-4 text-gold-400" />
              <span>Manage Menu</span>
            </Link>
            
            {!activeOrder && (
              <button
                onClick={startNewBill}
                className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Order</span>
              </button>
            )}
          </div>

        </div>
      </header>



      {/* MAIN BILLING INTERFACE */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col md:flex-row gap-6 items-start no-print">
        
        {/* LEFT PANEL: Menu Items Catalog */}
        <section className="flex-1 w-full flex flex-col min-w-0">
          
          {/* Search, Filter Tabs Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-primary-950 text-white border-primary-950 shadow-sm"
                      : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Menu Items Cards Grid */}
          {isLoading ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-premium">
              <Utensils className="w-12 h-12 text-slate-300 stroke-[1.25] mx-auto mb-3 animate-pulse" />
              <h3 className="text-slate-700 font-bold text-base animate-pulse">Loading Menu...</h3>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-premium">
              <Utensils className="w-12 h-12 text-slate-350 stroke-[1.25] mx-auto mb-3" />
              <h3 className="text-slate-700 font-bold text-base">No Menu Items Found</h3>
              <p className="text-slate-400 text-xs mt-1">
                Add dishes to the menu or adjust your search / category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleItems.map((item) => {
                const inDraft = activeOrder?.items.find((d) => d.menuItemId === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[9px] font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-primary-855 transition-colors">
                        {item.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-gold-600">
                        {formatRs(item.price)}
                      </span>

                      {!inDraft ? (
                        <button
                          onClick={() => addToDraft(item)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-primary-950 text-slate-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-primary-950 text-white rounded-xl p-0.5 shadow-sm">
                          <button
                            onClick={() => changeQty(inDraft.id, -1)}
                            className="p-1 text-white hover:text-gold-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{inDraft.quantity}</span>
                          <button
                            onClick={() => changeQty(inDraft.id, 1)}
                            className="p-1 text-white hover:text-gold-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
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

        {/* RIGHT PANEL: Current Bill Draft */}
        <section className="w-full md:w-80 bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden sticky top-[72px] flex flex-col max-h-[calc(100vh-96px)]">
          {/* Panel Header */}
          <div className="p-4 bg-primary-950 text-white flex items-center justify-between border-b border-primary-900">
            <div>
              <h3 className="text-sm font-bold">Order Summary</h3>
              <p className="text-[10px] text-primary-200 mt-0.5">
                {activeOrder ? `Bill No: #${activeOrder.billNo}` : "No Active Order"}
              </p>
            </div>
            {activeOrder && (
              <button
                onClick={cancelActiveBill}
                className="p-1 hover:bg-white/10 text-rose-400 hover:text-rose-500 rounded transition-colors"
                title="Cancel Order"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Draft Item Rows */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {!activeOrder || activeOrder.items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <Receipt className="w-10 h-10 text-slate-300 stroke-[1.25] mb-2" />
                <h4 className="text-slate-700 font-bold text-xs">No Active Order</h4>
                <p className="text-slate-400 text-[10px] mt-1 max-w-[150px] leading-relaxed mx-auto">
                  Pick dishes from the menu to start a new order.
                </p>
                {!activeOrder && (
                  <button
                    onClick={startNewBill}
                    className="mt-4 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-lg text-[10px] font-bold transition-all"
                  >
                    Start New Order
                  </button>
                )}
              </div>
            ) : (
              activeOrder.items.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start justify-between gap-3 pb-3 border-b border-dashed border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 leading-normal truncate">
                      {d.name}
                    </h5>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-semibold">
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
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Totals Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold">{formatRs(activeOrder?.subtotal || 0)}</span>
              </div>
              {/* Customizable GST Row */}
              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span>GST</span>
                  <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
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
              <div className="flex justify-between items-center text-slate-800 pt-1.5 border-t border-slate-200/80">
                <span className="font-bold text-xs">Est. Total</span>
                <span className="font-mono text-sm font-black text-gold-600">
                  {formatRs(activeOrder?.totalAmount || 0)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSettleModal(true)}
              disabled={!activeOrder || activeOrder.items.length === 0}
              className="w-full py-3 bg-primary-950 disabled:bg-slate-200 hover:bg-primary-900 disabled:text-slate-400 text-white rounded-2xl font-bold flex items-center justify-center gap-1.5 shadow-md disabled:shadow-none transition-all text-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>Settle & Print Bill</span>
            </button>
          </div>
        </section>

      </main>

      {/* MODALS */}
      <SettleModal
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        subtotal={activeOrder?.subtotal || 0}
        gstRate={activeOrder?.gstRate || 0}
        onSettle={handleSettle}
      />

      {/* PRINT-ONLY AREA: standard POS thermal layout */}
      {printedBill && (
        <div className="hidden print:block print-receipt select-none text-black bg-white p-2">
          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0" }}>AURA DINE</h2>
            <p style={{ fontSize: "10px", margin: "2px 0" }}>Restaurant & Fine Dining</p>
            <p style={{ fontSize: "9px", margin: "0" }}>GSTIN: 36729103859</p>
          </div>

          {/* Details */}
          <div style={{ fontSize: "10px", borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Bill No:</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>#{printedBill.id}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td style={{ textAlign: "right" }}>{new Date(printedBill.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Customer:</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>{printedBill.customerName}</td>
                </tr>
                {printedBill.tableNo && (
                  <tr>
                    <td>Table No:</td>
                    <td style={{ textAlign: "right" }}>Table {printedBill.tableNo}</td>
                  </tr>
                )}
                <tr>
                  <td>Payment:</td>
                  <td style={{ textAlign: "right", textTransform: "uppercase" }}>{printedBill.paymentMethod?.replace("_", " ")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items */}
          <div style={{ borderBottom: "1px dashed black", paddingBottom: "10px", marginBottom: "10px" }}>
            <table style={{ width: "100%", fontSize: "10px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid black" }}>
                  <th style={{ textAlign: "left", width: "50%" }}>Item</th>
                  <th style={{ textAlign: "center", width: "15%" }}>Qty</th>
                  <th style={{ textAlign: "right", width: "35%" }}>Amt (₹)</th>
                </tr>
              </thead>
              <tbody>
                {printedBill.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation */}
          <div style={{ fontSize: "10px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td style={{ textAlign: "right" }}>{printedBill.subtotal.toFixed(2)}</td>
                </tr>
                {printedBill.discount > 0 && (
                  <tr>
                    <td>Discount</td>
                    <td style={{ textAlign: "right", color: "red" }}>-{(printedBill.discount || 0).toFixed(2)}</td>
                  </tr>
                )}
                {printedBill.serviceCharge > 0 && (
                  <tr>
                    <td>Service Charge</td>
                    <td style={{ textAlign: "right" }}>{(printedBill.serviceCharge || 0).toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <td>CGST ({(printedBill.gstRate || 0) / 2}%)</td>
                  <td style={{ textAlign: "right" }}>{(((printedBill.subtotal - (printedBill.discount || 0) + (printedBill.serviceCharge || 0)) * (printedBill.gstRate / 100)) / 2).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>SGST ({(printedBill.gstRate || 0) / 2}%)</td>
                  <td style={{ textAlign: "right" }}>{(((printedBill.subtotal - (printedBill.discount || 0) + (printedBill.serviceCharge || 0)) * (printedBill.gstRate / 100)) / 2).toFixed(2)}</td>
                </tr>
                <tr style={{ fontWeight: "bold", fontSize: "12px", borderTop: "1px dashed black" }}>
                  <td style={{ paddingTop: "6px" }}>Net Payable</td>
                  <td style={{ textAlign: "right", paddingTop: "6px" }}>{printedBill.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer message */}
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "9px", borderTop: "1px dashed black", paddingTop: "10px" }}>
            <p style={{ margin: "2px 0", fontWeight: "bold" }}>Thank you for dining at Aura!</p>
            <p style={{ margin: "0" }}>Please visit again. Bon Appétit!</p>
          </div>
        </div>
      )}

    </div>
  );
}
