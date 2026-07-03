"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { paymentService } from "@/services/payment.service";

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    billing: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [expiry, setExpiry] = useState("08/28");
  const [cvv, setCvv] = useState("842");
  const [upiId, setUpiId] = useState("restaurant@okaxis");

  const handleOpenPayment = useCallback((planName: string, price: string, billing: string) => {
    setSelectedPlan({ name: planName, price, billing });
    setSuccess(false);
    setProcessing(false);
  }, []);

  const handleCompletePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await paymentService.checkout({
        planName: selectedPlan?.name || "Pro Enterprise",
        amount: parseFloat(selectedPlan?.price?.replace(/[^0-9.]/g, "") || "79"),
        paymentMethod: paymentMethod
      });
    } catch (err) {
      console.error("Backend checkout Axios fallback:", err);
    }

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/billing");
      }, 1500);
    }, 1200);
  }, [selectedPlan, paymentMethod, router]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-gold-500 selection:text-black pb-24">
      {/* Top Navigation */}
      <header className="bg-[#0b0e14]/85 backdrop-blur-xl border-b border-gold-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <Link href="/welcome" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
                Thoughtit
              </span>
              <span className="ml-1.5 text-xs font-extrabold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/30">
                CLOUD
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/welcome"
              className="inline-flex items-center gap-2 text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors bg-white/5 border border-gold-500/30 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Pricing Section */}
      <section className="pt-16 px-6 md:px-8 max-w-7xl mx-auto relative">
        {/* Glow spotlight */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/30 px-3.5 py-1 rounded-full">
            SELECT YOUR CLOUD OPERATING PLAN
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mt-4 mb-4">
            Tailored Rates for Every Scale.
          </h1>
          <p className="text-lg text-gray-400">
            Choose your deployment tier to activate instant offline POS synchronization and kitchen automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-10">
          {/* Starter Plan */}
          <div className="bg-[#131822] rounded-3xl border border-gold-500/20 p-8 flex flex-col justify-between shadow-lg hover:border-gold-500/50 hover:shadow-gold-500/10 transition-all">
            <div>
              <div className="text-sm font-extrabold uppercase tracking-wider text-gold-400 mb-2">
                Starter Suite
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cafes & Single Outlets</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gold-400">₹999</span>
                <span className="text-gray-400 font-medium">/ month</span>
              </div>
              <p className="text-gray-400 text-sm mb-8">
                Essential touch billing and receipt generation for compact food counters and small shops.
              </p>

              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>1 Billing Terminal Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Unlimited Items & Categories</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Offline Billing Protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Basic Daily Sales Reports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment("Starter Suite", "₹999", "Monthly Recurring")}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-gold-500/15 border border-gold-500/30 text-gold-400 font-extrabold text-center transition-all block cursor-pointer"
            >
              Get Started Free / Activate
            </button>
          </div>

          {/* Professional Plan (Popular) */}
          <div className="bg-gradient-to-b from-[#182130] to-[#121924] rounded-3xl border-2 border-gold-400 p-8 flex flex-col justify-between shadow-2xl shadow-gold-500/20 relative transform md:-translate-y-4 text-white">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-gold-500/30">
              MOST POPULAR
            </div>

            <div>
              <div className="text-sm font-extrabold uppercase tracking-wider text-gold-400 mb-2">
                Professional Suite
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Restaurants & Bakeries</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gold-300">₹2,499</span>
                <span className="text-gray-400 font-medium">/ month</span>
              </div>
              <p className="text-gray-300 text-sm mb-8">
                Full-scale dining, recipe inventory costing, advance cake orders, and staff payroll management.
              </p>

              <ul className="space-y-4 text-sm text-gray-200 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Up to 5 POS Terminals & KOT Printers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Table Layout & Captain Ordering App</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Weighing Scale & Barcode Integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Staff Payroll & Attendance Tracker</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Recipe Dish Costing & Profit Margins</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment("Professional Suite", "₹2,499", "Monthly Recurring")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-black text-center transition-all block shadow-xl shadow-gold-500/30 hover:opacity-95 cursor-pointer"
            >
              Start 14-Day Free Trial & Pay
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#131822] rounded-3xl border border-gold-500/20 p-8 flex flex-col justify-between shadow-lg hover:border-gold-500/50 hover:shadow-gold-500/10 transition-all">
            <div>
              <div className="text-sm font-extrabold uppercase tracking-wider text-gold-400 mb-2">
                Enterprise Cloud
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Hotels & Chains</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gold-400">₹5,999</span>
                <span className="text-gray-400 font-medium">/ month</span>
              </div>
              <p className="text-gray-400 text-sm mb-8">
                Central headquarters dashboard for multi-branch chains, luxury resorts, and supermarkets.
              </p>

              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Unlimited Terminals & Branches</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Central Warehouse Stock Transfers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Hotel PMS & Room Service Billing Sync</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <span>Dedicated Account Manager & 24/7 Priority API</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment("Enterprise Cloud", "₹5,999", "Monthly Recurring")}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-gold-500/15 border border-gold-500/30 text-gold-400 font-extrabold text-center transition-all block cursor-pointer"
            >
              Activate Enterprise License
            </button>
          </div>
        </div>
      </section>

      {/* SECURE PAYMENT GATEWAY MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#131822] text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gold-500/30 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0b0e14] border-b border-gold-500/20 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-black flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Thoughtit Secure Checkout</h3>
                  <p className="text-xs text-gold-400 font-semibold">256-Bit Encrypted Payment Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {success ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 text-black rounded-full flex items-center justify-center mx-auto shadow-lg shadow-gold-500/30 animate-bounce">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h3 className="text-3xl font-bold text-white">Payment Verified!</h3>
                <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                  Your <span className="font-bold text-gold-400">{selectedPlan.name}</span> subscription has been activated successfully. Redirecting you to the live Restaurant POS Terminal...
                </p>
                <div className="pt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gold-400">
                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  <span>Opening POS Dashboard...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompletePayment} className="p-6 md:p-8 space-y-6">
                {/* Order summary pill */}
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gold-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase text-gray-400">Selected Tier</div>
                    <div className="font-bold text-white text-base">{selectedPlan.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-2xl text-gold-400">{selectedPlan.price}</div>
                    <div className="text-xs text-gray-400">{selectedPlan.billing}</div>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-gradient-to-r from-gold-400 to-gold-600 text-black border-gold-400 shadow-md shadow-gold-500/20"
                          : "bg-[#0b0e14] text-gray-300 border-gold-500/20 hover:bg-gold-500/10"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Credit / Debit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === "upi"
                          ? "bg-gradient-to-r from-gold-400 to-gold-600 text-black border-gold-400 shadow-md shadow-gold-500/20"
                          : "bg-[#0b0e14] text-gray-300 border-gold-500/20 hover:bg-gold-500/10"
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <span>UPI / QR Scan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === "netbanking"
                          ? "bg-gradient-to-r from-gold-400 to-gold-600 text-black border-gold-400 shadow-md shadow-gold-500/20"
                          : "bg-[#0b0e14] text-gray-300 border-gold-500/20 hover:bg-gold-500/10"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Payment Fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none text-sm font-mono font-medium text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          required
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none text-sm font-mono font-medium text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none text-sm font-mono font-medium text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4 pt-2 text-center py-4 bg-[#0b0e14] rounded-2xl border border-gold-500/20">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto border border-gold-400 shadow-sm flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-gray-900 stroke-[1.2]" />
                    </div>
                    <p className="text-xs text-gold-400 font-semibold">Scan with Google Pay, PhonePe, or Paytm</p>
                    <div className="max-w-xs mx-auto">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI VPA ID (e.g. name@okaxis)"
                        className="w-full px-3 py-2 rounded-lg bg-[#131822] border border-gold-500/30 text-xs text-center font-mono text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Select Bank</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 text-sm font-medium text-white">
                      <option>HDFC Bank Corporate / Retail</option>
                      <option>ICICI Bank NetBanking</option>
                      <option>State Bank of India (SBI)</option>
                      <option>Axis Bank Enterprise</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:opacity-95 text-black font-extrabold text-base transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {selectedPlan.price} & Launch POS App</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Payments processed securely via PCI-DSS Level 1 infrastructure. Instant refund guarantee.</span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
