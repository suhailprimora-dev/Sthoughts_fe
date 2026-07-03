import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Thoughtit - Multi-Tenant Enterprise Cloud POS",
  description: "Custom branded multi-tenant cloud POS management: billing, orders, reports, staff and menu management powered by Thoughtit.",
};

import { MenuProvider } from "@/context/MenuContext";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-slate-50 antialiased" suppressHydrationWarning>
        <MenuProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </MenuProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}
