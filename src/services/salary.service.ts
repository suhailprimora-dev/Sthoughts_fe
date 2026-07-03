import { api } from "./api";
import { SalaryStructure, PayrollRecord } from "@/types/billing";

export const salaryService = {
  getSalaryStructures: async (): Promise<SalaryStructure[]> => {
    const response = await api.get("/api/salary-structure");
    return response.data;
  },

  saveOrUpdateSalaryStructure: async (structure: SalaryStructure): Promise<SalaryStructure> => {
    const response = await api.post("/api/salary-structure", structure);
    return response.data;
  },

  getPayrollRecords: async (month?: string, staffId?: string): Promise<PayrollRecord[]> => {
    let url = "/api/payroll";
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (staffId) params.append("staffId", staffId);
    if (params.toString()) url += `?${params.toString()}`;
    const response = await api.get(url);
    return response.data;
  },

  submitPayroll: async (record: PayrollRecord): Promise<PayrollRecord> => {
    const response = await api.post("/api/payroll", record);
    return response.data;
  },

  updatePayrollStatus: async (id: string, status: string): Promise<PayrollRecord> => {
    const response = await api.put(`/api/payroll/${id}/status?status=${status}`);
    return response.data;
  },

  deletePayrollRecord: async (id: string): Promise<void> => {
    await api.delete(`/api/payroll/${id}`);
  }
};
