import React, { useState } from "react";
import { X, Check, Landmark, CreditCard, DollarSign, Percent, User, Hash } from "lucide-react";
import { PaymentMethod } from "@/types/billing";

interface SettleModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  gstRate?: number; // percentage e.g. 10 for 10%
  onSettle: (params: {
    discount: number;
    paymentMethod: PaymentMethod;
    serviceCharge: number;
    tax: number;
    customerName: string;
    tableNo: string;
  }) => void;
}

export default function SettleModal({
  isOpen,
  onClose,
  subtotal,
  gstRate = 10,
  onSettle,
}: SettleModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountVal, setDiscountVal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [includeServiceCharge, setIncludeServiceCharge] = useState(true);

  if (!isOpen) return null;

  // Real-time calculation helpers
  const enteredVal = parseFloat(discountVal) || 0;
  const calculatedDiscount =
    discountType === "percentage"
      ? (subtotal * enteredVal) / 100
      : enteredVal;

  const validDiscount = Math.min(Math.max(calculatedDiscount, 0), subtotal);

  const serviceCharge = includeServiceCharge ? subtotal * 0.05 : 0;
  const taxableAmount = Math.max(subtotal - validDiscount, 0);
  const tax = taxableAmount * (gstRate / 100);
  const total = taxableAmount + serviceCharge + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettle({
      discount: validDiscount,
      paymentMethod,
      serviceCharge,
      tax,
      customerName: customerName.trim() || "Walk-in Customer",
      tableNo: tableNo.trim(),
    });
    // Reset form after settling
    setCustomerName("");
    setTableNo("");
    setDiscountVal("");
    setPaymentMethod("cash");
    setIncludeServiceCharge(true);
  };

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "cash",
      label: "Cash",
      icon: <DollarSign className="w-5 h-5" />,
      desc: "Physical cash collection",
    },
    {
      id: "upi",
      label: "UPI Transfer",
      icon: <Landmark className="w-5 h-5" />,
      desc: "PhonePe, GPay, Paytm QR",
    },
    {
      id: "card",
      label: "Card",
      icon: <CreditCard className="w-5 h-5" />,
      desc: "POS terminal swipe",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary-950 text-white">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Settle Bill</h2>
            <p className="text-xs text-primary-200 mt-0.5">Fill in details and confirm payment</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Customer & Table Details */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Order Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Table No."
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Discount Block */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Apply Discount
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  placeholder={discountType === "percentage" ? "Enter % discount" : "Enter flat amount"}
                  value={discountVal}
                  onChange={(e) => setDiscountVal(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold pointer-events-none">
                  {discountType === "percentage" ? "%" : "₹"}
                </span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    discountType === "percentage"
                      ? "bg-white text-primary-850 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> %
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("flat")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    discountType === "flat"
                      ? "bg-white text-primary-850 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ₹ Flat
                </button>
              </div>
            </div>
          </div>

          {/* Service Charge */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Service Charge
            </label>
            <label className="flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={includeServiceCharge}
                onChange={(e) => setIncludeServiceCharge(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-800">Add 5% Service Charge</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Applied to dining and table service</p>
              </div>
            </label>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col items-start gap-2 transition-all relative ${
                    paymentMethod === opt.id
                      ? "border-primary-500 bg-primary-50/50 shadow-sm ring-1 ring-primary-500"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      paymentMethod === opt.id
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                  {paymentMethod === opt.id && (
                    <span className="absolute right-3.5 top-3.5 p-0.5 bg-primary-600 text-white rounded-full">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Final Receipt Summary */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Item Subtotal</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            {validDiscount > 0 && (
              <div className="flex justify-between text-xs text-rose-500">
                <span>Discount Applied</span>
                <span className="font-mono font-semibold">-₹{validDiscount.toFixed(2)}</span>
              </div>
            )}
            {serviceCharge > 0 && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Service Charge (5%)</span>
                <span className="font-mono font-semibold">₹{serviceCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-slate-500 pb-2.5 border-b border-dashed border-slate-200">
              <span>GST / Taxes ({gstRate}%)</span>
              <span className="font-mono font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 pt-1">
              <span className="text-sm font-extrabold">Final Payable Total</span>
              <span className="text-xl font-black text-gold-600 font-mono">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold transition-all"
          >
            Go Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-primary-950 hover:bg-primary-900 text-white rounded-xl font-bold transition-all shadow-md"
          >
            Confirm & Print Receipt
          </button>
        </div>
      </form>
    </div>
  );
}
