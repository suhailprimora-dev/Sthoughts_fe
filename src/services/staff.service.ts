import { api } from "./api";
import { StaffMember } from "@/types/billing";

export const staffService = {
  getStaff: async (): Promise<StaffMember[]> => {
    const response = await api.get("/api/staff");
    return response.data;
  },

  addStaff: async (staff: Partial<StaffMember>): Promise<StaffMember> => {
    const response = await api.post("/api/staff", staff);
    return response.data;
  },

  updateStaff: async (id: string, staff: Partial<StaffMember>): Promise<StaffMember> => {
    const response = await api.put(`/api/staff/${id}`, staff);
    return response.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await api.delete(`/api/staff/${id}`);
  }
};
