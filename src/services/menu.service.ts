import { api } from "./api";
import { MenuItem } from "@/types/billing";

export const menuService = {
  // Get all menu items
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get("/api/menu-items");
    return response.data;
  },

  // Add a new menu item
  addMenuItem: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const response = await api.post("/api/menu-items", item);
    return response.data;
  },

  // Update a menu item (assuming PUT /menu-items/{id})
  updateMenuItem: async (id: string | number, item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const response = await api.put(`/api/menu-items/${id}`, item);
    return response.data;
  },

  // Delete a menu item (assuming DELETE /menu-items/{id})
  deleteMenuItem: async (id: string | number): Promise<void> => {
    await api.delete(`/api/menu-items/${id}`);
  },

  // Get all categories
  getCategories: async (): Promise<{ id: number, name: string }[]> => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  // Add a new category
  addCategory: async (name: string): Promise<{ id: number, name: string }> => {
    const response = await api.post("/api/categories", { name });
    return response.data;
  },

  // Delete a category
  deleteCategory: async (name: string): Promise<void> => {
    await api.delete(`/api/categories/${name}`);
  },
};
