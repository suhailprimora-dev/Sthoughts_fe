"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Building2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { contactService } from "@/services/contact.service";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "Restaurant / Fine Dining",
    outlets: "1 - 3 Outlets",
    message: "",
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: `${formData.industry} (${formData.outlets})`,
        message: formData.message
      });
    } catch (err) {
      console.error("Contact Axios fallback:", err);
    }
    setSubmitted(true);
  }, [formData]);

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 relative">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Header Title */}
        <div className="max-w-3xl mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs font-extrabold uppercase tracking-widest text-gold-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>CONNECT WITH OUR EXPERTS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Let&apos;s Engineer Your Cloud POS Strategy.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Whether you need custom hardware integration for a 50-store bakery chain or express onboarding for your fine dining restaurant, our specialized sales engineers are ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          {/* Left Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#131822] border border-gold-500/30 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-2xl font-bold mb-2 text-gold-400">Priority Enterprise Support</h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Direct channel to our technical solutions architects and on-site hardware deployment partners.
              </p>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Direct Sales Helpline</div>
                    <div className="font-bold text-base text-white">+91 (800) 555-KCLOUD</div>
                    <div className="text-xs text-gray-400 mt-0.5">Mon - Sat, 9:00 AM - 8:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Email inquiries</div>
                    <div className="font-bold text-base text-white">enterprise@thoughtit.com</div>
                    <div className="text-xs text-gray-400 mt-0.5">Avg response under 30 mins</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Corporate HQ</div>
                    <div className="font-bold text-white leading-snug">
                      Thoughtit Cloud Technologies Pvt. Ltd.<br />
                      TechPark Towers, Level 14, Outer Ring Road<br />
                      Bengaluru, Karnataka 560103
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats card */}
            <div className="bg-[#131822] p-8 rounded-3xl border border-gold-500/20 shadow-md">
              <h4 className="font-bold text-white mb-4 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>Express Onboarding Guarantee</span>
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Once approved, our team imports your existing menu, staff lists, and tax slabs into Thoughtit Cloud in under 24 hours with zero downtime.
              </p>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-[#131822] p-8 md:p-12 rounded-3xl border border-gold-500/30 shadow-xl">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 text-black rounded-full flex items-center justify-center mx-auto shadow-lg shadow-gold-500/30">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-3xl font-bold text-white">Message Received</h3>
                <p className="text-gray-300 max-w-md mx-auto text-base leading-relaxed">
                  Thank you, <span className="font-semibold text-gold-400">{formData.name}</span>. Our solutions advisor has been assigned to your request for <span className="font-semibold text-gold-400">{formData.industry}</span> and will contact you within 30 minutes.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-extrabold text-sm shadow-lg shadow-gold-500/20 hover:opacity-95 transition-all cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gold-500/20 pb-4 mb-6">
                  <h3 className="text-2xl font-bold text-white">Request Custom Demo or Quote</h3>
                  <p className="text-sm text-gray-400 mt-1">Fill out the details below and we will tailor the demo to your exact business workflow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@restaurant.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Industry / Business Sector
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white cursor-pointer"
                    >
                      <option value="Fine Dining Restaurant">Fine Dining Restaurant & Bar</option>
                      <option value="Artisanal Bakery">Artisanal Bakery & Confectionery</option>
                      <option value="Luxury Hotel & Resort">Luxury Hotel & Resort PMS</option>
                      <option value="Cafe & Quick Service">Cafe & Quick Service (QSR)</option>
                      <option value="Supermarket & Retail">Supermarket & Multi-brand Retail</option>
                      <option value="Other Sector">Other Sector</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Number of Locations / Outlets
                  </label>
                  <select
                    value={formData.outlets}
                    onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white cursor-pointer"
                  >
                    <option value="1 Outlet (Single Store)">1 Outlet (Single Store)</option>
                    <option value="2 - 5 Outlets">2 - 5 Outlets</option>
                    <option value="6 - 15 Outlets">6 - 15 Outlets (Growing Chain)</option>
                    <option value="15+ Outlets (Enterprise Network)">15+ Outlets (Enterprise Network)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Requirements or Existing POS Challenges
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your hardware setup, printer preferences, or custom software integration requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-gold-500/30 focus:border-gold-400 outline-none transition-all text-sm font-medium text-white placeholder-gray-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-extrabold text-base transition-all shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Consultation Request</span>
                  <Send className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-gray-400">
                  By submitting, you agree to receive technical demo scheduling details via phone or email.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
