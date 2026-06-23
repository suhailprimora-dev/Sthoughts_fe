import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aura Dine - Restaurant Management System",
  description: "Complete restaurant management: billing, orders, reports, staff and menu management.",
};

import { MenuProvider } from "@/context/MenuContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans bg-slate-50 antialiased">
        <MenuProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </MenuProvider>
      </body>
    </html>
  );
}
