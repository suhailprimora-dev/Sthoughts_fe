"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  ShieldCheck,
  WifiOff,
  TrendingUp,
  Users,
  Layers,
  Utensils,
  Cake,
  Hotel,
  CheckCircle2,
  Sparkles,
  Award,
  Quote,
} from "lucide-react";

export default function WelcomeLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const industries = [
    {
      id: "restaurant",
      title: "Fine Dining & Restaurants",
      tagline: "Table management & multi-kitchen KOT routing",
      description:
        "Seamless table layout maps, course-wise firing, split billing, captain app ordering, and automated inventory depletion per recipe dish.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
      stats: "0.3s Table Turnaround",
      icon: Utensils,
    },
    {
      id: "bakery",
      title: "Artisanal Bakeries & Cafes",
      tagline: "High-speed barcode scanner & scale billing",
      description:
        "Instant weight-scale integration, barcode shelf-label generation, recipe batch costing, customized cake preorder scheduling, and expiry tracking.",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
      stats: "2-Second Hotkey Checkout",
      icon: Cake,
    },
    {
      id: "hotel",
      title: "Luxury Hotels & Resorts",
      tagline: "Unified room posting & banquet invoicing",
      description:
        "Charge restaurant, spa, and mini-bar bills directly to guest folio numbers. Automated GST credit note handling and daily audit settlements.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      stats: "100% PMS Sync",
      icon: Hotel,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-gold-500 selection:text-black overflow-x-hidden">
      
      {/* CUSTOM KEYFRAME ANIMATIONS FOR RICH DYNAMIC MOTION */}
      <style jsx>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(3deg); }
        }
        @keyframes floatX {
          0%, 100% { transform: translateX(0px) scale(1); }
          50% { transform: translateX(30px) scale(1.08); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.18); opacity: 0.55; }
        }
        .animate-float-y {
          animation: floatY 8s ease-in-out infinite;
        }
        .animate-float-x {
          animation: floatX 12s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 35s linear infinite;
        }
        .animate-pulse-ring {
          animation: pulseRing 7s ease-in-out infinite;
        }
      `}</style>

      {/* NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/90 backdrop-blur-2xl border-b border-gold-500/30 transition-all shadow-xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/welcome" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-gold-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              T
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
                Thoughtit
              </span>
              <span className="ml-1.5 text-xs font-extrabold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/40 animate-pulse">
                CLOUD
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-300">
            <a href="#industries" className="hover:text-gold-400 hover:scale-105 transition-all duration-200">
              Industries
            </a>
            <a href="#features" className="hover:text-gold-400 hover:scale-105 transition-all duration-200">
              Features
            </a>
            <Link href="/pricing" className="hover:text-gold-400 hover:scale-105 transition-all duration-200">
              Rates
            </Link>
            <a href="#spotlight" className="hover:text-gold-400 hover:scale-105 transition-all duration-200">
              Testimonials
            </a>
            <Link href="/contact" className="hover:text-gold-400 hover:scale-105 transition-all duration-200">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded-full text-sm font-bold text-gold-400 hover:text-white border border-gold-500/30 hover:bg-gold-500/20 transition-all hover:scale-105 duration-200"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 rounded-full text-sm font-extrabold text-black bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:opacity-95 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gold-400 hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#10151e] border-b border-gold-500/20 px-6 py-6 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-4 font-medium text-base">
              <a
                href="#industries"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                Industries
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                Features
              </a>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                Rates
              </Link>
              <a
                href="#spotlight"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                Testimonials
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors"
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-gold-500/20 flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-bold text-gold-400 border border-gold-500/30 rounded-xl hover:bg-gold-500/10 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center font-extrabold text-black bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-xl shadow-lg shadow-gold-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION WITH DYNAMIC FLOATING RINGS & ORBS */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#0b0e14] text-white pt-32 pb-20">
        {/* Animated luxury grid backdrop */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]"></div>
        
        {/* Animated ambient gold spotlights */}
        <div className="absolute -top-40 -left-40 w-[38rem] h-[38rem] bg-gold-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-ring"></div>
        <div className="absolute top-1/3 -right-40 w-[42rem] h-[42rem] bg-gold-600/15 rounded-full blur-[160px] pointer-events-none animate-float-x"></div>

        {/* Floating 3D Geometric Gold Rings */}
        <div className="absolute top-1/4 left-10 md:left-24 w-64 h-64 rounded-full border border-gold-500/25 pointer-events-none animate-float-y shadow-[0_0_50px_rgba(212,175,55,0.08)]"></div>
        <div className="absolute bottom-12 right-12 md:right-32 w-80 h-80 rounded-full border border-dashed border-gold-400/30 pointer-events-none animate-spin-slow"></div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-8 flex-1 flex flex-col items-center justify-center text-center z-10">
          {/* Animated Live Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/40 backdrop-blur-xl mb-8 shadow-xl shadow-gold-500/10 animate-bounce duration-[3000ms]">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-black tracking-widest uppercase text-gold-300">
              NEXT-GEN LUXURY ENTERPRISE BILLING & POS
            </span>
          </div>

          {/* Overlapping Gold Typography Effect */}
          <div className="mb-8 font-normal tracking-tighter leading-none hover:scale-[1.01] transition-transform duration-500">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gray-500/60 font-light select-none tracking-tight">
              Effortless.
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold -mt-2 sm:-mt-4 md:-mt-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-200 to-gold-400 drop-shadow-[0_15px_30px_rgba(212,175,55,0.25)]">
              Precision.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The ultra-luxury billing operating system engineered for fine restaurants, artisanal bakeries, luxury hotels, and retail stores. Lightning-fast offline billing meets intelligent business automation.
          </p>

          {/* High-Width Email Input Box & Start Demo Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/auth/signup";
            }}
            className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-[#121824]/90 backdrop-blur-2xl border border-gold-500/40 rounded-3xl sm:rounded-full shadow-[0_25px_70px_-15px_rgba(212,175,55,0.3)] focus-within:border-gold-400 focus-within:shadow-[0_30px_90px_-10px_rgba(212,175,55,0.5)] transition-all duration-500"
          >
            <input
              type="email"
              required
              placeholder="Enter your work email address..."
              className="w-full sm:flex-1 px-6 py-4 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base font-semibold rounded-3xl sm:rounded-full"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl sm:rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-black text-sm md:text-base whitespace-nowrap shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* INDUSTRY SOLUTIONS SECTION WITH 3D HOVER LIFT */}
      <section id="industries" className="py-24 px-6 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-gold-500/15 border border-gold-500/40 px-4 py-1.5 rounded-full shadow-md shadow-gold-500/10">
            UNIVERSAL COMPATIBILITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-4 mb-3">
            Engineered For Every Sector.
          </h2>
          <p className="text-base text-gray-400">
            From table-service fine dining to high-speed supermarket barcode checkout, Thoughtit adapts its interface precisely to your business model.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="group bg-[#131822]/90 backdrop-blur-xl rounded-[2.5rem] border border-gold-500/25 overflow-hidden shadow-xl hover:border-gold-400/70 hover:shadow-[0_30px_70px_-15px_rgba(212,175,55,0.3)] hover:-translate-y-3 transition-all duration-500 flex flex-col cursor-pointer"
              >
                {/* Image header with zoom motion */}
                <div className="relative h-60 overflow-hidden bg-gray-900">
                  <img
                    src={ind.image}
                    alt={ind.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131822] via-black/20 to-transparent" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-5 left-5 p-3.5 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-black shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Icon className="w-6 h-6 font-bold" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-xs font-black tracking-wider uppercase text-gold-300 bg-black/70 border border-gold-500/40 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg">
                      {ind.stats}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-gold-300 transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-sm font-bold text-gold-400 mb-4">
                      {ind.tagline}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {ind.description}
                    </p>
                  </div>

                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-between text-sm font-black text-gold-400 group-hover:text-white transition-colors pt-5 border-t border-gold-500/20"
                  >
                    <span>Deploy for {ind.title.split(" ")[0]}</span>
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 group-hover:bg-gold-500 flex items-center justify-center text-gold-400 group-hover:text-black transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE BENEFITS & FEATURES SECTION (LUXURY SINGLE-LINE 4-CONTAINER LAYOUT OVER BACKGROUND IMAGE) */}
      <section id="features" className="relative py-28 px-6 md:px-8 border-y border-gold-500/30 overflow-hidden">
        {/* Dark Luxury Texture Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Reliability Background"
            className="w-full h-full object-cover opacity-35 transform scale-105 animate-spin-slow duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14] via-[#0b0e14]/90 to-[#0b0e14]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Centered Title with Gold Underline */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Gold Standard in Reliability.
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4 mb-14 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>

          {/* 4 Containers in a Single Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gold-500/20 bg-[#121824]/80 backdrop-blur-2xl border border-gold-500/40 rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Container 1 */}
            <div className="group p-8 lg:p-10 text-center hover:bg-gold-500/10 transition-all duration-300 flex flex-col items-center justify-start cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300 shadow-md">
                <WifiOff className="w-7 h-7 text-gold-400 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                Zero-Downtime Offline
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Never lose a sale during WiFi outages. Automated local token printing & silent cloud sync upon reconnection.
              </p>
            </div>

            {/* Container 2 */}
            <div className="group p-8 lg:p-10 text-center hover:bg-gold-500/10 transition-all duration-300 flex flex-col items-center justify-start cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300 shadow-md">
                <Zap className="w-7 h-7 text-gold-400 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                Sub-Second Billing
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                High-speed keyboard hotkeys let cashiers complete item lookup and cash settlement in under 2 seconds flat.
              </p>
            </div>

            {/* Container 3 */}
            <div className="group p-8 lg:p-10 text-center hover:bg-gold-500/10 transition-all duration-300 flex flex-col items-center justify-start cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300 shadow-md">
                <Layers className="w-7 h-7 text-gold-400 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                Multi-Kitchen KOT
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Automatically route beverages to bar thermal printers, appetizers to pantry, and entrees to main kitchen.
              </p>
            </div>

            {/* Container 4 */}
            <div className="group p-8 lg:p-10 text-center hover:bg-gold-500/10 transition-all duration-300 flex flex-col items-center justify-start cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300 shadow-md">
                <ShieldCheck className="w-7 h-7 text-gold-400 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                Audit Ready GST
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Pre-configured tax slabs, automated B2B invoice numbering, and one-click financial export for your accountants.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ANIMATED TESTIMONIAL / FOUNDER SPOTLIGHT SECTION */}
      <section id="spotlight" className="py-24 px-6 md:px-8 max-w-7xl mx-auto relative">
        {/* Floating animated gold orb */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gold-500/15 rounded-full blur-[150px] pointer-events-none animate-float-y"></div>

        <div className="bg-[#131822]/90 backdrop-blur-2xl rounded-[3rem] border border-gold-500/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_30px_90px_-20px_rgba(212,175,55,0.25)] hover:border-gold-400 transition-all duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Image Column featuring the smiling entrepreneur with rotating ring */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Rotating decorative background hoop */}
              <div className="absolute inset-2 rounded-[2.5rem] border-2 border-dashed border-gold-400/40 animate-spin-slow pointer-events-none"></div>

              <div className="relative rounded-[2.2rem] border-2 border-gold-400 overflow-hidden shadow-2xl aspect-[4/5] max-w-md w-full bg-[#1c2331] group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="POS Experience Showcase"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/25 border border-gold-400 text-gold-300 text-xs font-bold mb-2 backdrop-blur-md shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Gen Cloud Interface</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Seamless User Experience</h4>
                  <p className="text-xs text-gold-300 font-medium mt-0.5">
                    Intuitive Touch-Screen Billing & Live KOT Kitchen Routing
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text / Features Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-xs font-bold uppercase tracking-widest text-gold-300 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>INTELLIGENT POS DESIGN</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Engineered for High-Speed Commercial Hospitality & Retail Excellence.
              </h2>

              <p className="text-gray-300 text-base leading-relaxed font-normal">
                Thoughtit Cloud replaces complex, bulky legacy setups with an intuitive, lightning-fast operating system. From uninterrupted offline billing during network outages to automated kitchen workflow dispatch, every feature is designed for maximum speed and accuracy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gold-500/25">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-gray-200">99.99% Offline Reliability</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-gray-200">10-Minute Staff Training</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-gray-200">Automated KOT Kitchen Routing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-gray-200">15% Reduction in Food Waste</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/auth/signup"
                  className="group relative inline-flex items-center rounded-full p-[2px] bg-gradient-to-r from-[#ffe082] via-[#d4af37] to-[#997316] shadow-[0_15px_45px_rgba(212,175,55,0.35)] hover:shadow-[0_20px_70px_rgba(212,175,55,0.7)] hover:-translate-y-1.5 transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-full bg-gold-400 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative px-8 sm:px-10 py-4 rounded-full bg-gradient-to-b from-[#ffea9f] via-[#d4af37] to-[#b38728] border border-white/50 flex items-center gap-3.5">
                    <span className="text-[#0a0d14] font-black tracking-wider uppercase text-xs sm:text-sm drop-shadow-sm">
                      Deploy Thoughtit for Your Outlet
                    </span>
                    <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-[#0a0d14] stroke-[2.5]" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY GOLD CTA BANNER WITH RICH MOTION */}
      <section className="py-24 px-6 md:px-8 bg-gradient-to-r from-[#0d121c] via-[#161f30] to-[#0d121c] border-y border-gold-500/35 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none animate-float-x"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Elevate Your Business Operations Today.
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto font-normal">
            Experience the precision of luxury cloud billing. No hardware lock-in, quick 10-minute setup.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            {/* Create Free Account Button (Apple Grade Luxury Gold Sheen) */}
            <Link
              href="/auth/signup"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center rounded-full p-[2px] bg-gradient-to-r from-[#ffe082] via-[#d4af37] to-[#997316] shadow-[0_15px_45px_rgba(212,175,55,0.35)] hover:shadow-[0_20px_70px_rgba(212,175,55,0.7)] hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-full bg-gold-400 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative w-full px-8 sm:px-10 py-4 rounded-full bg-gradient-to-b from-[#ffea9f] via-[#d4af37] to-[#b38728] border border-white/50 flex items-center justify-center gap-3.5">
                <span className="text-[#0a0d14] font-black tracking-wider uppercase text-xs sm:text-sm drop-shadow-sm">
                  Create Free Account
                </span>
                <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4 text-[#0a0d14] stroke-[2.5]" />
                </div>
              </div>
            </Link>

            {/* Request Custom Demo Button (Apple Grade Dark Glassmorphic Pill) */}
            <Link
              href="/contact"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-4 rounded-full bg-[#111824]/90 hover:bg-[#1a2335] text-gold-300 hover:text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm border-2 border-gold-500/40 hover:border-gold-400 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_45px_rgba(212,175,55,0.4)] backdrop-blur-2xl flex items-center justify-center gap-3"
            >
              <span>Request Custom Demo</span>
              <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080b0f] text-gray-400 py-16 px-6 md:px-8 border-t border-gold-500/25">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-black flex items-center justify-center font-black text-lg">
                T
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Thoughtit Cloud
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier SaaS POS & hospitality billing operating system. Powering fine dining, bakeries, luxury hotels, and retail enterprises.
            </p>
          </div>

          <div>
            <h4 className="text-gold-400 font-bold mb-4 text-sm uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#industries" className="hover:text-white transition-colors">Fine Dining POS</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Bakery Barcode Billing</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Hotel & Resort PMS</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Cafe Touch Screen</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Supermarket Inventory</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-bold mb-4 text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Offline Architecture</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Staff Payroll Tracker</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">GST Tax Audit</a></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Rates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-bold mb-4 text-sm uppercase tracking-wider">
              Account & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Register Account</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><a href="#spotlight" className="hover:text-white transition-colors">Customer Spotlight</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gold-500/15 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>&copy; {new Date().getFullYear()} Thoughtit Cloud Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="flex gap-6">
            <span className="hover:text-gold-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gold-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gold-400 cursor-pointer transition-colors">Security Audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
