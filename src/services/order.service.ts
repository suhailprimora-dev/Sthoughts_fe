import { api } from "./api";

export interface OrderItemDto {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  billNo: string;
  customerName: string | null;
  tableNo: string | null;
  discount: number | null;
  serviceCharge: number | null;
  paymentMethod: string | null;
  gstRate: number;
  subtotal: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export const orderService = {
  // Get active order or create new one
  getActiveOrder: async (): Promise<OrderDto> => {
    const response = await api.get("/orders/active");
    return response.data;
  },

  // Get settled orders history
  getHistory: async (): Promise<OrderDto[]> => {
    const response = await api.get("/orders/history");
    return response.data;
  },

  // Cancel active order
  cancelActiveOrder: async (): Promise<void> => {
    await api.delete("/orders/active");
  },

  // Add item to order
  addItem: async (orderId: number, item: { menuItemId: number, name: string, price: number, quantity: number }): Promise<OrderDto> => {
    const response = await api.post(`/orders/${orderId}/items`, item);
    return response.data;
  },

  // Update item quantity
  updateItemQuantity: async (orderId: number, itemId: number, delta: number): Promise<OrderDto> => {
    const response = await api.put(`/orders/${orderId}/items/${itemId}?delta=${delta}`);
    return response.data;
  },

  // Remove item
  removeItem: async (orderId: number, itemId: number): Promise<OrderDto> => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  },

  // Update GST
  updateGstRate: async (orderId: number, rate: number): Promise<OrderDto> => {
    const response = await api.put(`/orders/${orderId}/gst?rate=${rate}`);
    return response.data;
  },

  // Settle bill
  settleOrder: async (orderId: number, details: any): Promise<OrderDto> => {
    const response = await api.post(`/orders/${orderId}/settle`, details);
    return response.data;
  }
};
