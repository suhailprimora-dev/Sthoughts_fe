"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { MenuItem } from "@/types/billing";
import { menuService } from "@/services/menu.service";
import { toast } from "react-toastify";

interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<MenuItem>;
  updateMenuItem: (id: string | number, item: Omit<MenuItem, "id">) => Promise<MenuItem>;
  deleteMenuItem: (id: string | number) => Promise<void>;
  // We keep categories management simple for now, deriving from items.
  // The user can add a category manually which will be preserved in localStorage 
  // or until they refresh, unless the backend supports a categories endpoint.
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [itemsData, catsData] = await Promise.all([
        menuService.getMenuItems(),
        menuService.getCategories().catch(() => [])
      ]);
      
      setItems(itemsData);
      setDbCategories(catsData.map(c => c.name));
    } catch (err: any) {
      setError(err.message || "Failed to fetch menu data");
      console.error("Menu fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Derive all unique categories (from items + db categories)
  const categories = useMemo(() => {
    const itemCats = items.map((i) => i.category);
    const unique = Array.from(new Set([...itemCats, ...dbCategories]));
    return unique.filter(Boolean).sort();
  }, [items, dbCategories]);

  const addCategory = async (name: string) => {
    if (!categories.includes(name)) {
      try {
        await menuService.addCategory(name);
        setDbCategories(prev => [...prev, name]);
      } catch (err) {
        console.error("Failed to add category to backend:", err);
        toast.error("Failed to add category to backend");
      }
    }
  };

  const deleteCategory = async (name: string) => {
    try {
      await menuService.deleteCategory(name);
      setDbCategories(prev => prev.filter(c => c !== name));
    } catch (err) {
      console.error("Failed to delete category from backend:", err);
      toast.error("Failed to delete category from backend");
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    const newItem = await menuService.addMenuItem(item);
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateMenuItem = async (id: string | number, item: Omit<MenuItem, "id">) => {
    const updated = await menuService.updateMenuItem(id, item);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const deleteMenuItem = async (id: string | number) => {
    await menuService.deleteMenuItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        isLoading,
        error,
        fetchItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
