"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Plus,
  Trash2,
  X,
  FileText,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  StaffMember,
  StaffRole,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveType,
  LeaveStatus,
  SalaryStructure,
  PayrollRecord,
} from "@/types/billing";
import { staffService } from "@/services/staff.service";
import { attendanceService } from "@/services/attendance.service";
import { toast } from "react-toastify";

const ROLES: StaffRole[] = ["Manager", "Waiter", "Chef", "Cashier", "Cleaner", "Helper"];
const LEAVE_TYPES: LeaveType[] = ["Casual", "Sick", "Unpaid", "Festival"];

const ROLE_COLORS: Record<StaffRole, string> = {
  Manager:  "bg-purple-100 text-purple-700",
  Waiter:   "bg-blue-100 text-blue-700",
  Chef:     "bg-amber-100 text-amber-700",
  Cashier:  "bg-green-100 text-green-700",
  Cleaner:  "bg-slate-100 text-slate-600",
  Helper:   "bg-orange-100 text-orange-700",
};

const ATTENDANCE_CONFIG: Record<AttendanceStatus, { label: string; short: string; bg: string; text: string; dot: string }> = {
  present:   { label: "Present",  short: "P", bg: "bg-emerald-500", text: "text-white", dot: "bg-emerald-500" },
  "half-day":{ label: "Half Day", short: "H", bg: "bg-amber-400",   text: "text-white", dot: "bg-amber-400" },
  absent:    { label: "Absent",   short: "A", bg: "bg-rose-500",    text: "text-white", dot: "bg-rose-500" },
  leave:     { label: "Leave",    short: "L", bg: "bg-blue-400",    text: "text-white", dot: "bg-blue-400" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function formatSalary(s: SalaryStructure) {
  const gross = s.basic + s.hra + s.foodAllowance + s.travelAllowance;
  const deductions = s.pfDeduction + s.taxDeduction;
  return { gross, deductions, net: gross - deductions };
}

const SAMPLE_STAFF: StaffMember[] = [
  { id: "s1", name: "Raju Kumar",    role: "Manager",  phone: "9876543210", email: "raju@auradine.com",   joinDate: "2023-01-15", salary: 35000, isActive: true },
  { id: "s2", name: "Priya Sharma",  role: "Chef",     phone: "9845678901", email: "priya@auradine.com",  joinDate: "2023-03-10", salary: 30000, isActive: true },
  { id: "s3", name: "Suresh Reddy",  role: "Waiter",   phone: "9812345678", email: "suresh@auradine.com", joinDate: "2023-06-20", salary: 18000, isActive: true },
  { id: "s4", name: "Meena Patel",   role: "Cashier",  phone: "9898765432", email: "meena@auradine.com",  joinDate: "2023-08-05", salary: 22000, isActive: true },
];

const SAMPLE_SALARIES: SalaryStructure[] = [
  { staffId: "s1", basic: 25000, hra: 5000, foodAllowance: 2000, travelAllowance: 1500, pfDeduction: 3000, taxDeduction: 1500 },
  { staffId: "s2", basic: 22000, hra: 4000, foodAllowance: 2000, travelAllowance: 1000, pfDeduction: 2640, taxDeduction: 1000 },
  { staffId: "s3", basic: 13000, hra: 2500, foodAllowance: 1500, travelAllowance: 800,  pfDeduction: 1560, taxDeduction: 0 },
  { staffId: "s4", basic: 16000, hra: 3000, foodAllowance: 1500, travelAllowance: 1000, pfDeduction: 1920, taxDeduction: 0 },
];

type Tab = "employees" | "attendance" | "leaves" | "salary";

// ─── Employee Detail View ─────────────────────────────────────────────────────
function EmployeeDetailView({
  member,
  attendance,
  leaves,
  salary,
  payrollRecords,
  onBack,
}: {
  member: StaffMember;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  salary?: SalaryStructure;
  payrollRecords: PayrollRecord[];
  onBack: () => void;
}) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
  const [viewPayslip, setViewPayslip] = useState<PayrollRecord | null>(null);

  const myAttendance = useMemo(
    () => attendance.filter((a) => a.staffId === member.id),
    [attendance, member.id]
  );

  const myLeaves = useMemo(
    () => leaves.filter((l) => l.staffId === member.id),
    [leaves, member.id]
  );

  const myPayroll = useMemo(
    () => payrollRecords.filter((p) => p.staffId === member.id).sort((a, b) => b.month.localeCompare(a.month)),
    [payrollRecords, member.id]
  );

  // Year summary
  const yearSummary = useMemo(() => {
    const yearRec = myAttendance.filter((a) => a.date.startsWith(`${viewYear}`));
    const counts = { present: 0, "half-day": 0, absent: 0, leave: 0 };
    yearRec.forEach((a) => { counts[a.status]++; });
    return counts;
  }, [myAttendance, viewYear]);

  // Month calendar
  const calendarData = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
    const dayMap: Record<string, AttendanceStatus> = {};
    myAttendance
      .filter((a) => a.date.startsWith(prefix))
      .forEach((a) => { dayMap[a.date] = a.status; });
    return { firstDay, daysInMonth, dayMap, prefix };
  }, [myAttendance, viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const salaryInfo = salary ? formatSalary(salary) : null;
  const approvedLeaves = myLeaves.filter((l) => l.status === "approved");
  const totalLeaveDays = approvedLeaves.reduce((s, l) => {
    return s + Math.ceil((new Date(l.toDate).getTime() - new Date(l.fromDate).getTime()) / 86400000) + 1;
  }, 0);

  const joiningDate = new Date(member.joinDate);
  const tenure = Math.floor((Date.now() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-slate-800">Employee Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-primary-950 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/20 border-2 border-gold-500/40 flex items-center justify-center text-2xl font-black text-gold-300 flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black truncate">{member.name}</h2>
            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mt-1 ${ROLE_COLORS[member.role]} bg-opacity-20`}>
              {member.role}
            </span>
            <p className="text-primary-300 text-xs mt-1">
              Joined {new Date(member.joinDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} · {tenure} months tenure
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex items-center gap-2 text-xs text-primary-200">
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            {member.phone || "—"}
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-200">
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            {member.email || "—"}
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-200">
            <IndianRupee className="w-3.5 h-3.5 text-gold-400" />
            ₹{member.salary.toLocaleString()} / month
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-200">
            <AlertCircle className="w-3.5 h-3.5 text-gold-400" />
            {totalLeaveDays} approved leave days
          </div>
        </div>
      </div>

      {/* Year Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700">Year Summary</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewYear((y) => y - 1)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-bold text-slate-800 w-12 text-center">{viewYear}</span>
            <button onClick={() => setViewYear((y) => y + 1)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(["present", "half-day", "absent", "leave"] as AttendanceStatus[]).map((s) => {
            const cfg = ATTENDANCE_CONFIG[s];
            return (
              <div key={s} className="text-center p-3 bg-slate-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center text-white text-xs font-black mx-auto mb-2`}>
                  {cfg.short}
                </div>
                <p className="text-xl font-black text-slate-800">{yearSummary[s]}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cfg.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month Attendance Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700">Monthly Attendance</h3>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-bold text-slate-800 w-32 text-center">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first week */}
          {Array.from({ length: calendarData.firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${calendarData.prefix}${String(day).padStart(2, "0")}`;
            const status = calendarData.dayMap[dateStr];
            const isToday = dateStr === todayISO();
            const cfg = status ? ATTENDANCE_CONFIG[status] : null;
            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${
                  cfg ? `${cfg.bg}` : "bg-slate-50"
                } ${isToday ? "ring-2 ring-gold-500 ring-offset-1" : ""}`}
              >
                <span className={`text-[11px] font-bold ${cfg ? cfg.text : "text-slate-400"}`}>{day}</span>
                {cfg && (
                  <span className={`text-[8px] font-black ${cfg.text} opacity-80`}>{cfg.short}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100">
          {(Object.keys(ATTENDANCE_CONFIG) as AttendanceStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${ATTENDANCE_CONFIG[s].bg}`} />
              <span className="text-[10px] text-slate-500 font-semibold">{ATTENDANCE_CONFIG[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Breakdown */}
      {salaryInfo && salary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Salary Structure</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Earnings</p>
              {[
                { label: "Basic Pay", val: salary.basic },
                { label: "HRA", val: salary.hra },
                { label: "Food Allowance", val: salary.foodAllowance },
                { label: "Travel Allowance", val: salary.travelAllowance },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-700">₹{val.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-dashed border-slate-200">
                <span className="font-bold text-emerald-600">Gross</span>
                <span className="font-black text-emerald-600">₹{salaryInfo.gross.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Deductions</p>
              {[
                { label: "PF Deduction", val: salary.pfDeduction },
                { label: "Tax Deduction", val: salary.taxDeduction },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-rose-500">-₹{val.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-dashed border-slate-200">
                <span className="font-bold text-slate-700">Net Take-Home</span>
                <span className="font-black text-primary-700">₹{salaryInfo.net.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Leave History</h3>
        {myLeaves.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No leave requests on record</p>
        ) : (
          <div className="space-y-2.5">
            {myLeaves.map((l) => {
              const days = Math.ceil((new Date(l.toDate).getTime() - new Date(l.fromDate).getTime()) / 86400000) + 1;
              return (
                <div key={l.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        l.leaveType === "Sick" ? "bg-rose-50 text-rose-700" :
                        l.leaveType === "Casual" ? "bg-blue-50 text-blue-700" :
                        l.leaveType === "Festival" ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{l.leaveType}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        l.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                        l.status === "rejected" ? "bg-rose-50 text-rose-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>{l.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(l.fromDate).toLocaleDateString("en-IN")} → {new Date(l.toDate).toLocaleDateString("en-IN")} · {days} day{days > 1 ? "s" : ""}
                    </p>
                    <p className="text-[11px] text-slate-400 italic mt-0.5">"{l.reason}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Payment History</h3>
        {myPayroll.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No salary payments on record</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myPayroll.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 group">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-800 text-sm">
                        {new Date(p.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-black text-emerald-600 text-sm">₹{p.netSalary.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-500">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN", {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewPayslip(p)}
                        className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payslip Modal */}
      {viewPayslip && salaryInfo && salary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounceIn flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-primary-950 to-primary-800 text-white flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-black tracking-tight">Salary Slip</h2>
                <p className="text-primary-300 text-xs font-medium">
                  {new Date(viewPayslip.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setViewPayslip(null)} className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50">
              {/* Employee Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-dashed border-slate-300">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center font-black text-primary-700 text-lg flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{member.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{member.role}</p>
                </div>
              </div>

              {/* Attendance Summary for the Month */}
              <div className="py-6 border-b border-dashed border-slate-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Attendance Summary</p>
                <div className="grid grid-cols-4 gap-2">
                  {(["present", "half-day", "absent", "leave"] as AttendanceStatus[]).map(s => {
                    // Count days for this specific month
                    const count = myAttendance.filter(a => a.date.startsWith(viewPayslip.month) && a.status === s).length;
                    const cfg = ATTENDANCE_CONFIG[s];
                    return (
                      <div key={s} className="bg-white rounded-xl p-2 text-center border border-slate-100 shadow-sm">
                        <p className="text-lg font-black text-slate-800">{count}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{cfg.short}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="py-6">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
                    {[
                      { label: "Basic Pay", val: salary.basic },
                      { label: "HRA", val: salary.hra },
                      { label: "Food Allowance", val: salary.foodAllowance },
                      { label: "Travel Allowance", val: salary.travelAllowance },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-slate-600 font-medium">{label}</span>
                        <span className="font-bold text-slate-800">₹{val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deductions</p>
                    {[
                      { label: "Provident Fund", val: salary.pfDeduction },
                      { label: "Professional Tax", val: salary.taxDeduction },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-slate-600 font-medium">{label}</span>
                        <span className="font-bold text-rose-500">-₹{val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Payable</p>
                <p className="text-xs text-slate-500 mt-1">
                  Paid on {viewPayslip.paidAt ? new Date(viewPayslip.paidAt).toLocaleDateString() : '-'}
                </p>
              </div>
              <h3 className="text-3xl font-black text-emerald-600">₹{viewPayslip.netSalary.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Staff Page ──────────────────────────────────────────────────────────
export default function StaffPage() {
  const [tab, setTab] = useState<Tab>("employees");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [salaries, setSalaries] = useState<SalaryStructure[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(todayISO());
  const [selectedEmployee, setSelectedEmployee] = useState<StaffMember | null>(null);

  // Payroll Tracking State
  const [payrollMonth, setPayrollMonth] = useState(todayISO().substring(0, 7)); // YYYY-MM
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  // Draft attendance for the selected date (before submitting)
  const [draftAttendance, setDraftAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  // Modals
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({
    id: "", name: "", role: "Waiter", phone: "", email: "", joinDate: todayISO(), salary: 18000, isActive: true,
  });
  const [leaveForm, setLeaveForm] = useState({
    staffId: "", fromDate: todayISO(), toDate: todayISO(), leaveType: "Casual" as LeaveType, reason: "",
  });

  useEffect(() => {
    staffService.getStaff()
      .then(data => {
        if (data && data.length > 0) setStaff(data);
        else {
          setStaff(SAMPLE_STAFF); // Fallback to sample
          // Optionally save samples to db for first run
          SAMPLE_STAFF.forEach(s => staffService.addStaff(s).catch(console.error));
        }
      })
      .catch(console.error);

    const a   = localStorage.getItem("staff_attendance");
    const l   = localStorage.getItem("staff_leaves");
    const sal = localStorage.getItem("staff_salaries");
    const pr  = localStorage.getItem("staff_payroll");
    
    attendanceService.getAttendance()
      .then(data => {
        if (data && data.length > 0) setAttendance(data);
        else if (a) setAttendance(JSON.parse(a));
      })
      .catch(err => {
        console.error(err);
        if (a) setAttendance(JSON.parse(a));
      });

    setLeaves(l   ? JSON.parse(l)   : []);
    setSalaries(sal ? JSON.parse(sal) : SAMPLE_SALARIES);
    setPayrollRecords(pr ? JSON.parse(pr) : []);
    if (!sal) localStorage.setItem("staff_salaries", JSON.stringify(SAMPLE_SALARIES));
  }, []);

  // When date changes, load existing attendance as draft
  useEffect(() => {
    const existing: Record<string, AttendanceStatus> = {};
    attendance
      .filter((a) => a.date === attendanceDate)
      .forEach((a) => { existing[a.staffId] = a.status; });
    setDraftAttendance(existing);
  }, [attendanceDate, attendance]);

  const saveAttendance  = (d: AttendanceRecord[])   => { setAttendance(d); localStorage.setItem("staff_attendance", JSON.stringify(d)); };
  const saveLeaves      = (d: LeaveRequest[])       => { setLeaves(d);     localStorage.setItem("staff_leaves",     JSON.stringify(d)); };
  const saveSalaries    = (d: SalaryStructure[])    => { setSalaries(d);   localStorage.setItem("staff_salaries",   JSON.stringify(d)); };
  const savePayroll     = (d: PayrollRecord[])      => { setPayrollRecords(d); localStorage.setItem("staff_payroll", JSON.stringify(d)); };

  const activeStaff = staff.filter((s) => s.isActive);

  // Set draft status for one employee
  const setDraftStatus = (staffId: string, status: AttendanceStatus) => {
    setDraftAttendance((prev) => ({ ...prev, [staffId]: status }));
    setSubmitted(false);
  };

  // Submit all draft attendance for the date
  const submitAttendance = async () => {
    const todayRecords: AttendanceRecord[] = Object.entries(draftAttendance).map(([staffId, status]) => ({
      id: `${staffId}-${attendanceDate}`,
      staffId,
      date: attendanceDate,
      status,
    }));

    try {
      const updatedAttendance = await attendanceService.submitAttendance(todayRecords);
      saveAttendance(updatedAttendance);
      toast.success("Attendance saved successfully");
    } catch (err) {
      console.error("Failed to save attendance via API, falling back to local storage", err);
      toast.error("Failed to save to database. Saved locally.");
      const otherDays = attendance.filter((a) => a.date !== attendanceDate);
      saveAttendance([...otherDays, ...todayRecords]);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAttendanceDate(todayISO());
    }, 2500);
  };

  const draftCount = Object.keys(draftAttendance).length;
  const todayPresent = Object.values(draftAttendance).filter((s) => s === "present").length;

  // Leave helpers
  const leaveDays = useMemo(() => {
    const map: Record<string, number> = {};
    leaves.filter((l) => l.status === "approved").forEach((l) => {
      const days = Math.ceil((new Date(l.toDate).getTime() - new Date(l.fromDate).getTime()) / 86400000) + 1;
      map[l.staffId] = (map[l.staffId] || 0) + days;
    });
    return map;
  }, [leaves]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const member: Partial<StaffMember> = {
      name: staffForm.name || "",
      role: (staffForm.role as StaffRole) || "Waiter",
      phone: staffForm.phone || "",
      email: staffForm.email || "",
      joinDate: staffForm.joinDate || todayISO(),
      salary: staffForm.salary || 0,
      isActive: true,
    };
    
    try {
      if (staffForm.id) {
        // Edit
        if (staffForm.id.startsWith("s")) {
          // Local update for sample staff
          const updated = { ...member, id: staffForm.id } as StaffMember;
          setStaff(staff.map(s => s.id === updated.id ? updated : s));
        } else {
          const updated = await staffService.updateStaff(staffForm.id, member);
          setStaff(staff.map(s => s.id === updated.id ? updated : s));
        }
        toast.success("Staff updated successfully");
      } else {
        // Add
        const newMember = await staffService.addStaff(member);
        setStaff([...staff, newMember]);
        const defSal: SalaryStructure = {
          staffId: newMember.id, basic: newMember.salary * 0.7, hra: newMember.salary * 0.15,
          foodAllowance: 1500, travelAllowance: 800, pfDeduction: newMember.salary * 0.07, taxDeduction: 0,
        };
        saveSalaries([...salaries, defSal]);
        toast.success("Staff added successfully");
      }
      
      setStaffForm({ id: "", name: "", role: "Waiter", phone: "", email: "", joinDate: todayISO(), salary: 18000, isActive: true });
      setShowAddStaff(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save staff member");
    }
  };

  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      if (!staffToDelete.startsWith("s")) {
        await staffService.deleteStaff(staffToDelete);
      }
      setStaff(staff.filter((s) => s.id !== staffToDelete));
      toast.success("Staff member removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove staff member");
    } finally {
      setStaffToDelete(null);
    }
  };

  const handleEditStaff = (member: StaffMember) => {
    setStaffForm(member);
    setShowAddStaff(true);
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const req: LeaveRequest = {
      id: Date.now().toString(), staffId: leaveForm.staffId,
      fromDate: leaveForm.fromDate, toDate: leaveForm.toDate,
      leaveType: leaveForm.leaveType, reason: leaveForm.reason,
      status: "pending", createdAt: new Date().toISOString(),
    };
    saveLeaves([req, ...leaves]);
    setLeaveForm({ staffId: "", fromDate: todayISO(), toDate: todayISO(), leaveType: "Casual", reason: "" });
    setShowLeaveForm(false);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) =>
    saveLeaves(leaves.map((l) => (l.id === id ? { ...l, status } : l)));

  const updateSalaryField = (staffId: string, field: keyof SalaryStructure, value: number) => {
    const newSalaries = [...salaries];
    const index = newSalaries.findIndex((s) => s.staffId === staffId);
    if (index >= 0) {
      newSalaries[index] = { ...newSalaries[index], [field]: value };
    } else {
      const base = staff.find((s) => s.id === staffId)?.salary || 0;
      newSalaries.push({
        staffId, basic: base * 0.7, hra: base * 0.15, foodAllowance: 1500, travelAllowance: 800, pfDeduction: base * 0.07, taxDeduction: 0,
        [field]: value,
      });
    }
    saveSalaries(newSalaries);
  };

  // Submit Salary for a specific month
  const submitSalary = (memberId: string, netSalary: number) => {
    const existing = payrollRecords.find(r => r.staffId === memberId && r.month === payrollMonth);
    if (existing) {
      toast.info("Salary already paid for this month.");
      return;
    }
    const record: PayrollRecord = {
      id: Date.now().toString(),
      staffId: memberId,
      month: payrollMonth,
      netSalary,
      status: "paid",
      paidAt: new Date().toISOString()
    };
    savePayroll([...payrollRecords, record]);
    toast.success("Salary marked as paid!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Staff Management</h1>
            <p className="text-sm text-primary-300 mt-0.5">
              {activeStaff.length} active staff · {todayPresent} marked present today
            </p>
          </div>
          <button
            onClick={() => {
              setStaffForm({ id: "", name: "", role: "Waiter", phone: "", email: "", joinDate: todayISO(), salary: 18000, isActive: true });
              setShowAddStaff(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all shadow-md border border-white/5"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {(["employees", "attendance", "leaves", "salary"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedEmployee(null); }}
              className={`px-5 py-3.5 text-sm font-bold capitalize border-b-2 transition-all ${
                tab === t ? "border-primary-600 text-primary-700" : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {t === "leaves" ? "Leave Requests" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* ─── Employees Tab ─── */}
        {tab === "employees" && (
          selectedEmployee ? (
            <EmployeeDetailView
              member={selectedEmployee}
              attendance={attendance}
              leaves={leaves}
              salary={salaries.find((s) => s.staffId === selectedEmployee.id)}
              payrollRecords={payrollRecords}
              onBack={() => setSelectedEmployee(null)}
            />
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-semibold mb-1">Click on a staff member to view their full profile</p>
              {activeStaff.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedEmployee(member)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center font-black text-primary-700 text-lg flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary-700 transition-colors">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ROLE_COLORS[member.role]}`}>
                          {member.role}
                        </span>
                        <span className="text-[11px] text-slate-400">{member.phone}</span>
                        <span className="text-[11px] text-slate-400">Joined {new Date(member.joinDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">Monthly Salary</p>
                      <p className="text-sm font-black text-slate-800">₹{member.salary.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${leaveDays[member.id] ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {leaveDays[member.id] || 0}d leave
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditStaff(member); }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <span className="text-xs font-bold px-1">Edit</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStaffToDelete(member.id); }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {activeStaff.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
                  <p className="text-slate-500 font-semibold">No staff members yet</p>
                  <button onClick={() => {
                    setStaffForm({ id: "", name: "", role: "Waiter", phone: "", email: "", joinDate: todayISO(), salary: 18000, isActive: true });
                    setShowAddStaff(true);
                  }} className="mt-3 text-xs text-primary-600 font-bold hover:underline">
                    + Add first staff member
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* ─── Attendance Tab ─── */}
        {tab === "attendance" && (
          <div>
            {/* Date picker + summary */}
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-slate-600">Date:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
              </div>
              <div className="flex gap-3 ml-auto text-xs flex-wrap">
                {(Object.keys(ATTENDANCE_CONFIG) as AttendanceStatus[]).map((s) => {
                  const count = Object.values(draftAttendance).filter((v) => v === s).length;
                  const cfg = ATTENDANCE_CONFIG[s];
                  return (
                    <span key={s} className="flex items-center gap-1.5 text-slate-500 font-semibold">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${cfg.bg}`} />
                      {cfg.label}: <strong>{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Employee attendance rows */}
            <div className="space-y-3 mb-5">
              {activeStaff.map((member) => {
                const current = draftAttendance[member.id] || null;
                return (
                  <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center font-black text-primary-700 text-sm flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{member.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${ROLE_COLORS[member.role]}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Current status badge */}
                      {current ? (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${ATTENDANCE_CONFIG[current].bg}`}>
                          {ATTENDANCE_CONFIG[current].label}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                          Not marked
                        </span>
                      )}
                      {/* P H A L buttons */}
                      <div className="flex gap-1">
                        {(Object.keys(ATTENDANCE_CONFIG) as AttendanceStatus[]).map((s) => {
                          const cfg = ATTENDANCE_CONFIG[s];
                          const isActive = current === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setDraftStatus(member.id, s)}
                              title={cfg.label}
                              className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                                isActive
                                  ? `${cfg.bg} text-white shadow-md scale-105`
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {cfg.short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {draftCount} of {activeStaff.length} employees marked
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Attendance for {new Date(attendanceDate).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={submitAttendance}
                disabled={draftCount === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  submitted
                    ? "bg-emerald-500 text-white"
                    : draftCount === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-primary-950 hover:bg-primary-900 text-white shadow-md"
                }`}
              >
                {submitted ? (
                  <><CheckCircle className="w-4 h-4" /> Attendance Saved!</>
                ) : (
                  <><Calendar className="w-4 h-4" /> Submit Attendance</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── Leaves Tab ─── */}
        {tab === "leaves" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowLeaveForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-950 text-white rounded-xl text-sm font-bold hover:bg-primary-900 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Leave Request
              </button>
            </div>
            <div className="space-y-3">
              {leaves.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2 stroke-[1.25]" />
                  <p className="text-slate-500 font-semibold text-sm">No leave requests yet</p>
                </div>
              ) : (
                leaves.map((leave) => {
                  const member = staff.find((s) => s.id === leave.staffId);
                  const from = new Date(leave.fromDate);
                  const to = new Date(leave.toDate);
                  const days = Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1;
                  return (
                    <div key={leave.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-800">{member?.name || "Unknown"}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              leave.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                              leave.status === "rejected" ? "bg-rose-50 text-rose-700" :
                              "bg-amber-50 text-amber-700"
                            }`}>{leave.status}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full uppercase">{leave.leaveType}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {from.toLocaleDateString("en-IN")} → {to.toLocaleDateString("en-IN")} · {days} day{days > 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 italic">"{leave.reason}"</p>
                        </div>
                        {leave.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => updateLeaveStatus(leave.id, "approved")}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all">
                              Approve
                            </button>
                            <button onClick={() => updateLeaveStatus(leave.id, "rejected")}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all">
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ─── Salary Tab ─── */}
        {tab === "salary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">Monthly Salary Processing</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="month"
                  value={payrollMonth}
                  onChange={(e) => setPayrollMonth(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {activeStaff.map((member) => {
              const sal = salaries.find((s) => s.staffId === member.id) || {
                staffId: member.id, basic: 0, hra: 0, foodAllowance: 0, travelAllowance: 0, pfDeduction: 0, taxDeduction: 0,
              };
              const { gross, deductions, net } = formatSalary(sal);
              return (
                <div key={member.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center font-black text-primary-700 text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{member.name}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${ROLE_COLORS[member.role]}`}>{member.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Net Take-Home</p>
                        <p className="text-lg font-black text-emerald-600">₹{net.toLocaleString()}</p>
                      </div>
                      {payrollRecords.some(r => r.staffId === member.id && r.month === payrollMonth) ? (
                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-bold text-emerald-700">Paid for {new Date(payrollMonth + "-01").toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => submitSalary(member.id, net)}
                          className="px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                          Submit Salary
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { field: "basic" as keyof SalaryStructure, label: "Basic Pay", red: false },
                      { field: "hra" as keyof SalaryStructure, label: "HRA", red: false },
                      { field: "foodAllowance" as keyof SalaryStructure, label: "Food Allow.", red: false },
                      { field: "travelAllowance" as keyof SalaryStructure, label: "Travel Allow.", red: false },
                      { field: "pfDeduction" as keyof SalaryStructure, label: "PF Deduction", red: true },
                      { field: "taxDeduction" as keyof SalaryStructure, label: "Tax Deduction", red: true },
                    ].map(({ field, label, red }) => (
                      <div key={field}>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${red ? "text-rose-400" : "text-slate-400"}`}>{label}</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={(sal as any)[field]}
                            onChange={(e) => updateSalaryField(member.id, field, parseFloat(e.target.value) || 0)}
                            className={`w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white ${red ? "text-rose-500" : "text-slate-700"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4 flex gap-4 text-xs">
                    <span className="text-slate-500">Gross: <strong className="text-slate-700">₹{gross.toLocaleString()}</strong></span>
                    <span className="text-slate-500">Deductions: <strong className="text-rose-600">-₹{deductions.toLocaleString()}</strong></span>
                    <span className="text-slate-500">Net Pay: <strong className="text-emerald-600">₹{net.toLocaleString()}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleAddStaff} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 bg-primary-950 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">{staffForm.id ? "Edit Staff Member" : "Add New Staff"}</h2>
              <button type="button" onClick={() => setShowAddStaff(false)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name *</label>
                <input required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                  placeholder="e.g. Raju Kumar" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role *</label>
                  <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as StaffRole})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Monthly Salary *</label>
                  <input type="number" required min="0" value={staffForm.salary}
                    onChange={e => setStaffForm({...staffForm, salary: parseInt(e.target.value)||0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 [appearance:textfield]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone</label>
                  <input value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})}
                    placeholder="9876543210" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Join Date</label>
                  <input type="date" value={staffForm.joinDate} onChange={e => setStaffForm({...staffForm, joinDate: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
                  <input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                    placeholder="staff@auradine.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setShowAddStaff(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary-950 text-white rounded-xl font-bold text-sm hover:bg-primary-900 transition-all shadow-md">
                {staffForm.id ? "Update Staff" : "Add Staff Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Request Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleAddLeave} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 bg-primary-950 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold">Add Leave Request</h2>
              <button type="button" onClick={() => setShowLeaveForm(false)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Staff Member *</label>
                <select required value={leaveForm.staffId} onChange={e => setLeaveForm({...leaveForm, staffId: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select staff...</option>
                  {activeStaff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">From Date</label>
                  <input type="date" value={leaveForm.fromDate} onChange={e => setLeaveForm({...leaveForm, fromDate: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">To Date</label>
                  <input type="date" value={leaveForm.toDate} onChange={e => setLeaveForm({...leaveForm, toDate: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Leave Type</label>
                <select value={leaveForm.leaveType} onChange={e => setLeaveForm({...leaveForm, leaveType: e.target.value as LeaveType})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t} Leave</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Reason *</label>
                <textarea required value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
                  rows={2} placeholder="Reason for leave..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setShowLeaveForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary-950 text-white rounded-xl font-bold text-sm hover:bg-primary-900 shadow-md">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
            <div className="p-6 pt-8">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Remove Staff Member?</h3>
              <p className="text-sm text-slate-500 px-4">
                Are you sure you want to remove this staff member? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button 
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmDeleteStaff}
                className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Submitted Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-bounceIn">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Submitted!</h3>
            <p className="text-sm text-slate-500">
              Attendance records for <span className="font-bold text-slate-700">{new Date(attendanceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span> have been saved successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
