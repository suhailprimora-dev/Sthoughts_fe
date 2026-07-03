import { api } from "./api";

export interface CheckoutPayload {
  planName: string;
  amount: number;
  paymentMethod: string;
}

export const paymentService = {
  checkout: async (payload: CheckoutPayload): Promise<any> => {
    const response = await api.post("/api/payments/checkout", payload);
    return response.data;
  },

  getPlans: async (): Promise<any> => {
    const response = await api.get("/api/payments/plans");
    return response.data;
  },
};
