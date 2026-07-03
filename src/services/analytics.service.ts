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

function buildUrl(base: string, range: string, startDate?: string, endDate?: string) {
  let url = `${base}?range=${range}`;
  if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
  if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
  return url;
}

export const analyticsService = {
  getOverview: async (range: string, startDate?: string, endDate?: string): Promise<AnalyticsOverviewDto> => {
    const response = await api.get(buildUrl('/api/analytics/overview', range, startDate, endDate));
    return response.data;
  },

  getTodayYesterday: async (): Promise<TodayYesterdayDto> => {
    const response = await api.get('/api/analytics/today-vs-yesterday');
    return response.data;
  },

  getDailyRevenue: async (range: string, startDate?: string, endDate?: string): Promise<DailyRevenueDto[]> => {
    const response = await api.get(buildUrl('/api/analytics/daily-revenue', range, startDate, endDate));
    return response.data;
  },

  getPaymentBreakdown: async (range: string, startDate?: string, endDate?: string): Promise<PaymentMethodBreakdownDto> => {
    const response = await api.get(buildUrl('/api/analytics/payment-methods', range, startDate, endDate));
    return response.data;
  },

  getTopItems: async (range: string, startDate?: string, endDate?: string): Promise<TopItemDto[]> => {
    const response = await api.get(buildUrl('/api/analytics/top-items', range, startDate, endDate));
    return response.data;
  }
};


