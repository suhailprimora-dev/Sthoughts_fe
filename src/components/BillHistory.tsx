import React, { useState } from "react";
import { X, Search, Printer, Receipt, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { Bill } from "@/types/billing";

interface BillHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  onReprintBill: (bill: Bill) => void;
}

export default function BillHistory({
  isOpen,
  onClose,
  bills,
  onReprintBill,
}: BillHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  if (!isOpen) return null;

  const filteredBills = bills.filter(
    (bill) =>
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.tableNo || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPaymentBadge = (method?: string) => {
    switch (method) {
      case "cash":
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Cash</span>;
      case "card":
        return <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Card</span>;
      case "upi":
        return <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">UPI</span>;

      default:
        return <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Unpaid</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary-950 text-white">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Sales & Billing Records</h2>
            <p className="text-xs text-primary-200 mt-0.5">
              Review and reprint receipts for completed settlements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Panel Layout */}
        <div className="flex-1 flex overflow-hidden bg-slate-50">
          
          {/* Left Panel: Bills List */}
          <div className="w-1/2 flex flex-col border-r border-slate-200/80 bg-white">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customer or bill ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredBills.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No billing history found.
                </div>
              ) : (
                filteredBills.map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                      selectedBill?.id === bill.id
                        ? "border-primary-500 bg-primary-50/50 shadow-sm"
                        : "border-slate-150 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          #{bill.id}
                        </span>
                        {getPaymentBadge(bill.paymentMethod)}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate mt-1">
                        {bill.customerName || "Walk-in Customer"}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {bill.tableNo ? `Table ${bill.tableNo}` : "No Table"} · {new Date(bill.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-primary-600">
                      <span className="text-sm font-extrabold text-slate-700">
                        ₹{bill.total.toFixed(0)}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Selected Bill Detail */}
          <div className="w-1/2 flex flex-col bg-slate-50">
            {selectedBill ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Invoice Receipt Detail */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Receipt Box */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium relative">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-dashed border-slate-200">
                      <div className="inline-flex p-2 bg-primary-50 rounded-full text-primary-600 mb-2">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-850">AURA DINE</h3>
                      <p className="text-[10px] text-slate-400">Restaurant & Fine Dining</p>
                      <div className="text-xs font-mono text-slate-500 mt-2 bg-slate-50 px-2 py-1 rounded">
                        Invoice ID: #{selectedBill.id}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="py-4 border-b border-dashed border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date:</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(selectedBill.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer:</span>
                        <span className="font-semibold text-slate-700">
                          {selectedBill.customerName || "Walk-in Customer"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Table No:</span>
                        <span className="font-semibold text-slate-700">
                          {selectedBill.tableNo ? `Table ${selectedBill.tableNo}` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Settled:</span>
                        <span className="font-semibold text-slate-700 uppercase">
                          {selectedBill.paymentMethod?.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="py-4 border-b border-dashed border-slate-200 space-y-3">
                      {selectedBill.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-xs">
                          <div className="pr-4">
                            <div className="font-bold text-slate-750">{item.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {item.qty} × ₹{item.price.toFixed(2)}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-slate-700">
                            ₹{(item.qty * item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-mono">₹{selectedBill.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedBill.discount > 0 && (
                        <div className="flex justify-between text-rose-500">
                          <span>Discount</span>
                          <span className="font-mono">-₹{selectedBill.discount.toFixed(2)}</span>
                        </div>
                      )}
                      {selectedBill.serviceCharge > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>Service Charge (5%)</span>
                          <span className="font-mono">₹{selectedBill.serviceCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-500">
                        <span>GST (10%)</span>
                        <span className="font-mono">₹{selectedBill.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-800 pt-2 border-t border-slate-100">
                        <span>Grand Total</span>
                        <span className="font-mono text-gold-600 text-base">
                          ₹{selectedBill.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Button Footer */}
                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => onReprintBill(selectedBill)}
                    className="w-full py-3 bg-primary-950 hover:bg-primary-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Printer className="w-4 h-4" /> Reprint Receipt
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <Receipt className="w-12 h-12 text-slate-300 stroke-[1.25] mb-2" />
                <h3 className="text-slate-700 font-bold text-sm">No Invoice Selected</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-[200px]">
                  Select a bill from the left list to review or print its receipt details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
