"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, Globe, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react";

const COUNTRY_CODES = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States / Canada", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    countryCode: "+91",
    mobileNumber: "",
    country: "India",
    pincode: "",
    state: "",
    district: "",
    password: "",
    sector: "Fine Dining Restaurant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  // Compute live subdomain URL dynamically
  const cleanSubdomain = formData.businessName
    ? formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, "")
    : "yourshop";

  const handlePincodeChange = async (val: string) => {
    setFormData((prev) => ({ ...prev, pincode: val }));
    setPinSuccess(false);

    // Auto-lookup for Indian 6-digit PIN codes
    if (val.length === 6 && /^\d+$/.test(val) && formData.country === "India") {
      setPinLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            pincode: val,
            state: postOffice.State || prev.state,
            district: postOffice.District || prev.district,
          }));
          setPinSuccess(true);
        }
      } catch (err) {
        console.error("Failed to fetch PIN details", err);
      } finally {
        setPinLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_business_name", formData.businessName || "My Business");
      localStorage.setItem("user_subdomain", `www.${cleanSubdomain}.Thoughtit.com`);
      localStorage.setItem("user_phone", `${formData.countryCode} ${formData.mobileNumber}`);
      localStorage.setItem("user_address", `${formData.district}, ${formData.state} (${formData.pincode})`);
    }

    setTimeout(() => {
      setLoading(false);
      router.push("/pricing");
    }, 1000);
  };

  const handleSocialRegister = async (provider: string) => {
    setLoading(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_business_name", formData.businessName || "My Business");
      localStorage.setItem("user_subdomain", `www.${cleanSubdomain}.Thoughtit.com`);
    }
    setTimeout(() => {
      setLoading(false);
      router.push("/pricing");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-[#05070a] text-white selection:bg-gold-500 selection:text-black">
      
      {/* LEFT HALF: Custom Image Background Showcase */}
      <div className="w-full lg:w-1/2 min-h-[420px] lg:min-h-screen relative overflow-hidden bg-[#070a0e] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gold-500/30">
        
        {/* User's Custom Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/2b5a4927d53e78992073b3d7b7cc9c6b.jpg"
            alt="Thoughtit Cloud POS Enterprise"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
          />
          {/* Enhanced Dark Overlay & Shadows for Perfect Text Legibility */}
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-black/50 to-black/40"></div>
        </div>

        {/* Top Header: Circular Back Icon Button & Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/welcome"
            title="Back to Home"
            className="w-11 h-11 rounded-full bg-black/60 hover:bg-gold-500/20 text-gold-400 hover:text-white backdrop-blur-xl border border-gold-500/40 flex items-center justify-center transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-gold-400/50 backdrop-blur-md text-xs font-bold text-gold-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>Thoughtit Multi-Tenant POS</span>
          </div>
        </div>

        {/* Main Hero Content (Just Texts Only, No Container Box) */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-black text-xl shadow-lg shadow-gold-500/30">
            <span>Thoughtit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
            Custom Branded Enterprise Cloud POS.
          </h1>
          <p className="text-white font-medium text-sm sm:text-base leading-relaxed drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
            Register your business with Thoughtit Cloud. Get your personalized shop subdomain (<span className="text-gold-300 font-bold">www.yourshop.Thoughtit.com</span>) and instantly deploy multi-outlet terminals with your own custom branding.
          </p>
        </div>

        {/* Bottom Footer Credit */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gold-400/80 font-medium pt-4 border-t border-gold-500/25">
          <span>THOUGHTIT ENTERPRISE &bull; v2.4</span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Live Subdomain Provisioning</span>
          </div>
        </div>
      </div>

      {/* RIGHT HALF: Luxury Obsidian Register Panel */}
      <div className="w-full lg:w-1/2 bg-[#0a0e16] flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
        
        {/* Top Navigation Notice */}
        <div className="flex justify-end items-center text-xs sm:text-sm text-gray-400 mb-4">
          <span>Already have an account? </span>
          <Link
            href="/auth/login"
            className="font-bold text-gold-400 underline underline-offset-4 ml-1.5 hover:text-gold-300 transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* Centered Register Form Box */}
        <div className="max-w-[480px] w-full mx-auto my-auto py-4">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-gray-400 mt-1">Setup your outlet, mobile contact & live subdomain.</p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleSocialRegister("google")}
              className="w-full py-2.5 px-4 rounded-xl border border-gold-500/30 hover:border-gold-400 bg-black/40 hover:bg-gold-500/10 text-gray-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 15.9C3.5 19.7 7.4 23 12 23z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialRegister("twitter")}
              className="w-full py-2.5 px-4 rounded-xl border border-gold-500/30 hover:border-gold-400 bg-black/40 hover:bg-gold-500/10 text-gray-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 fill-[#1DA1F2] flex-shrink-0" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
              </svg>
              <span>Twitter</span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gold-500/20"></div>
            <span className="px-3 text-[10px] font-bold text-gold-400 uppercase tracking-widest">BUSINESS DETAILS & CONTACT</span>
            <div className="flex-1 border-t border-gold-500/20"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm text-white placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
                  Business / Shop name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. S Cafe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm text-white placeholder-gray-600"
                />
              </div>
            </div>

            {/* LIVE DYNAMIC SUBDOMAIN PREVIEW CARD */}
            <div className="p-2.5 rounded-xl bg-[#0d121c]/90 border border-gold-500/40 shadow-md flex items-center justify-between text-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-2 overflow-hidden">
                <Globe className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span className="text-gray-400">Subdomain:</span>
                <span className="font-mono font-bold text-gold-400 truncate">
                  www.{cleanSubdomain}.Thoughtit.com
                </span>
              </div>
              <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded font-bold uppercase border border-gold-500/30 flex-shrink-0">
                Active
              </span>
            </div>

            {/* MOBILE NUMBER INPUT WITH COUNTRY DIALING CODE */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="relative w-28 flex-shrink-0">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm text-white font-semibold cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.name} value={c.code} className="bg-[#0a0e16] text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="Enter mobile number..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm text-white placeholder-gray-600"
                  />
                  <Phone className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
                Work email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm text-white placeholder-gray-600"
              />
            </div>

            {/* LOCATION / PINCODE / STATE / DISTRICT */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-gold-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location & Postal Address</span>
                </div>
                {pinSuccess && (
                  <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Detected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-xs text-white cursor-pointer"
                  >
                    <option value="India" className="bg-[#0a0e16]">India</option>
                    <option value="United States" className="bg-[#0a0e16]">United States</option>
                    <option value="United Kingdom" className="bg-[#0a0e16]">United Kingdom</option>
                    <option value="United Arab Emirates" className="bg-[#0a0e16]">United Arab Emirates</option>
                    <option value="Australia" className="bg-[#0a0e16]">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center justify-between">
                    <span>PIN / Postal Code</span>
                    {pinLoading && <Loader2 className="w-3 h-3 text-gold-400 animate-spin" />}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="e.g. 560001"
                    maxLength={8}
                    className="w-full px-3 py-2 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-xs text-white placeholder-gray-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State name"
                    className="w-full px-3 py-2 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-xs text-white placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    District / City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="District or City"
                    className="w-full px-3 py-2 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-xs text-white placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD & SECTOR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-gray-400 hover:text-gold-300 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <Eye className="w-3 h-3 text-gold-400" /> : <EyeOff className="w-3 h-3 text-gold-400" />}
                    <span>{showPassword ? "Show" : "Hide"}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 characters..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-sm text-white placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
                  Primary sector
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040609] border border-gold-500/30 focus:border-gold-400 text-xs sm:text-sm text-white cursor-pointer"
                >
                  <option value="Fine Dining Restaurant" className="bg-[#0a0e16] text-white">Fine Dining Restaurant</option>
                  <option value="Artisanal Bakery & Cafe" className="bg-[#0a0e16] text-white">Artisanal Bakery & Cafe</option>
                  <option value="Luxury Hotel & Resort" className="bg-[#0a0e16] text-white">Luxury Hotel & Resort</option>
                  <option value="Retail & Supermarket Chain" className="bg-[#0a0e16] text-white">Retail & Supermarket Chain</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-4 rounded-2xl font-black text-sm transition-all cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 ${
                formData.email && formData.password && formData.mobileNumber
                  ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:opacity-95 text-black shadow-xl shadow-gold-500/30 scale-[1.01]"
                  : "bg-white/10 border border-gold-500/20 text-gray-300 hover:bg-white/15 hover:text-white"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Provisioning Subdomain...</span>
                </div>
              ) : (
                <span>Register & Provision Subdomain</span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom spacer / copyright */}
        <div className="text-center text-[11px] text-gray-400 font-medium hidden lg:block pt-3 border-t border-gold-500/20">
          Protected by 256-bit SSL encryption & enterprise SSO.
        </div>
      </div>

    </div>
  );
}
