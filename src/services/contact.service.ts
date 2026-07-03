import { api } from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export const contactService = {
  submitContact: async (payload: ContactPayload): Promise<any> => {
    const response = await api.post("/api/contact", payload);
    return response.data;
  },
};
