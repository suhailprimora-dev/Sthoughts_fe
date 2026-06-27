"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, CheckCircle, Clock, IndianRupee, FileText } from "lucide-react";
import Link from "next/link";
import { StaffMember, SalaryStructure, PayrollRecord } from "@/types/billing";
import { staffService } from "@/services/staff.service";

export default function PayrollReportPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [salaries, setSalaries] = useState<SalaryStructure[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    staffService.getStaff()
      .then(data => {
        if (data && data.length > 0) setStaff(data.filter(s => s.isActive));
      })
      .catch(console.error);

    const sal = localStorage.getItem("staff_salaries");
    const pr = localStorage.getItem("staff_payroll");

    if (sal) setSalaries(JSON.parse(sal));
    if (pr) setPayrollRecords(JSON.parse(pr));
  }, []);

  const getNetSalary = (staffId: string) => {
    const sal = salaries.find((s) => s.staffId === staffId);
    if (!sal) return staff.find(s => s.id === staffId)?.salary || 0;
    const gross = sal.basic + sal.hra + sal.foodAllowance + sal.travelAllowance;
    const deductions = sal.pfDeduction + sal.taxDeduction;
    return gross - deductions;
  };

  const monthRecords = payrollRecords.filter(r => r.month === selectedMonth);
  
  // Calculate Totals
  const totalPayroll = staff.reduce((sum, member) => sum + getNetSalary(member.id), 0);
  const totalPaid = monthRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalPending = totalPayroll - totalPaid;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/staff" className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-800">Payroll Tracker</h1>
              <p className="text-xs text-slate-500 font-medium">Monthly Salary Reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <div className="pl-3 py-1 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 focus:outline-none focus:ring-0 pr-3 py-1 cursor-pointer"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Payroll</p>
              <h3 className="text-3xl font-black text-slate-800">₹{totalPayroll.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-[0_8px_30px_rgb(16,185,129,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-wider mb-1">Amount Paid</p>
              <h3 className="text-3xl font-black text-emerald-600">₹{totalPaid.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-[0_8px_30px_rgb(244,63,94,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-sm font-bold text-rose-600/80 uppercase tracking-wider mb-1">Pending Amount</p>
              <h3 className="text-3xl font-black text-rose-600">₹{totalPending.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary-600" />
              Employee Salary Status
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Net Salary</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((member) => {
                  const netSalary = getNetSalary(member.id);
                  const record = monthRecords.find(r => r.staffId === member.id);
                  const isPaid = !!record;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 text-sm">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase">{member.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-700 text-sm">₹{netSalary.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        {isPaid ? (
                          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-black uppercase tracking-wide">Paid</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-black uppercase tracking-wide">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-slate-500">
                          {isPaid && record.paidAt ? new Date(record.paidAt).toLocaleDateString("en-IN", {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                      No active staff found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
