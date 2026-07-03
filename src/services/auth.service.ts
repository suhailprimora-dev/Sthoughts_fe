import { api } from "./api";

export interface SignupPayload {
  fullName?: string;
  businessName?: string;
  email?: string;
  password?: string;
  sector?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  token?: string;
  subdomain?: string;
  fullSubdomainUrl?: string;
  businessName?: string;
  email?: string;
}

export const authService = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/signup", payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  },
};
