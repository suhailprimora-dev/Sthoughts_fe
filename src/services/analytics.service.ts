import { api } from "./api";

export interface AnalyticsOverviewDto {
  totalRevenue: number;
  totalDiscount: number;
  totalTax: number;
  totalServiceCharge: number;
  avgBillValue: number;
  totalBills: number;
}

export interface TodayYesterdayDto {
  todayRevenue: number;
  yesterdayRevenue: number;
  changePercentage: number;
}

export interface DailyRevenueDto {
  date: string;
  revenue: number;
}

export interface PaymentMethodBreakdownDto {
  cash: number;
  card: number;
  upi: number;
  totalRevenue: number;
  totalDiscount: number;
  totalServiceCharge: number;
}

export interface TopItemDto {
  name: string;
  qty: number;
  revenue: number;
}

export const analyticsService = {
  getOverview: async (range: string): Promise<AnalyticsOverviewDto> => {
    const response = await api.get(`/analytics/overview?range=${range}`);
    return response.data;
  },

  getTodayYesterday: async (): Promise<TodayYesterdayDto> => {
    const response = await api.get('/analytics/today-vs-yesterday');
    return response.data;
  },

  getDailyRevenue: async (range: string): Promise<DailyRevenueDto[]> => {
    const response = await api.get(`/analytics/daily-revenue?range=${range}`);
    return response.data;
  },

  getPaymentBreakdown: async (range: string): Promise<PaymentMethodBreakdownDto> => {
    const response = await api.get(`/analytics/payment-methods?range=${range}`);
    return response.data;
  },

  getTopItems: async (range: string): Promise<TopItemDto[]> => {
    const response = await api.get(`/analytics/top-items?range=${range}`);
    return response.data;
  }
};
