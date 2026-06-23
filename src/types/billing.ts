export interface MenuItem {
  id: string | number;
  name: string;
  price: number;
  category: string;
}

export interface DraftItem extends MenuItem {
  qty: number;
}

export type PaymentMethod = "cash" | "card" | "upi";

export type BillStatus = "draft" | "settled";

export interface Bill {
  id: string;
  customerName: string;
  tableNo: string;
  items: DraftItem[];
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  total: number;
  paymentMethod?: PaymentMethod;
  status: BillStatus;
  createdAt: string;
}

export interface BillStats {
  totalRevenue: number;
  settledCount: number;
  pendingCount: number;
  activeDraftsCount: number;
}

// ─── Staff Management Types ───────────────────────────────────────────────────

export type StaffRole = "Manager" | "Waiter" | "Chef" | "Cashier" | "Cleaner" | "Helper";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  isActive: boolean;
}

export type AttendanceStatus = "present" | "absent" | "half-day" | "leave";

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string; // ISO date string YYYY-MM-DD
  status: AttendanceStatus;
}

export type LeaveType = "Casual" | "Sick" | "Unpaid" | "Festival";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  staffId: string;
  fromDate: string;
  toDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface SalaryStructure {
  staffId: string;
  basic: number;
  hra: number;           // House Rent Allowance
  foodAllowance: number;
  travelAllowance: number;
  pfDeduction: number;   // Provident Fund
  taxDeduction: number;
}
