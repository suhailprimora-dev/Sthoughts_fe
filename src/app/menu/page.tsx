"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Tag,
  UtensilsCrossed,
  ArrowLeft,
  FolderOpen,
  AlertTriangle,
  IndianRupee,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { MenuItem } from "@/types/billing";

import { useMenu } from "@/context/MenuContext";

type View = "items" | "categories" | "add-item" | "edit-item" | "add-category";


export default function MenuPage() {
  const [view, setView] = useState<View>("items");
  const { items, categories, isLoading, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, deleteCategory } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formData, setFormData] = useState({ name: "", price: "", category: "" });

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = filterCat === "All" || item.category === filterCat;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, filterCat, searchQuery]);

  const itemsPerCategory = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => {
      map[i.category] = (map[i.category] || 0) + 1;
    });
    return map;
  }, [items]);

  const handleDeleteItem = async (id: string | number) => {
    if (window.confirm("Delete this menu item?")) {
      try {
        await deleteMenuItem(id);
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    const count = itemsPerCategory[cat] || 0;
    const msg =
      count > 0
        ? `"${cat}" has ${count} item(s). Please reassign or delete them first before deleting the category.`
        : `Delete category "${cat}"?`;
    if (count > 0) {
      toast.warn(msg);
      return;
    }
    if (window.confirm(msg)) {
      try {
        await deleteCategory(cat);
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name || categories.includes(name)) return;
    
    try {
      await addCategory(name);
      setNewCategoryName("");
      setView("categories");
      toast.success("Category added successfully");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price);
    if (!formData.name.trim() || isNaN(priceNum) || priceNum <= 0) return;

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, {
          name: formData.name.trim(),
          price: priceNum,
          category: formData.category,
        });
      } else {
        await addMenuItem({
          name: formData.name.trim(),
          price: priceNum,
          category: formData.category,
        });
      }
      setEditingItem(null);
      setFormData({ name: "", price: "", category: categories[0] || "" });
      setView("items");
      toast.success("Menu item saved successfully");
    } catch (err) {
      toast.error("Failed to save menu item");
    }
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, price: item.price.toString(), category: item.category });
    setView("edit-item");
  };

  const openAddItem = () => {
    setEditingItem(null);
    setFormData({ name: "", price: "", category: categories[0] || "" });
    setView("add-item");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Gradient hero for add/edit views ── */}
      {(view === "add-item" || view === "edit-item" || view === "add-category") ? (
        <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <button
              onClick={() => setView(view === "add-category" ? "categories" : "items")}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {view === "add-item" ? "Add New Menu Item" :
                  view === "edit-item" ? `Edit: ${editingItem?.name || ""}` :
                    "Add New Category"}
              </h1>
              <p className="text-primary-300 text-sm mt-0.5">
                {view === "add-category"
                  ? `${categories.length} categories exist · Add a new one below`
                  : `${items.length} items in menu · Fill in the details below`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Standard header for list views ── */
        <div className="bg-gradient-to-r from-primary-950 to-primary-800 px-6 py-6 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {view === "items" ? "Menu Management" : "Category Management"}
              </h1>
              <p className="text-sm text-primary-300 mt-0.5">{items.length} items · {categories.length} categories</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/10 p-1 rounded-xl gap-1">
                <button onClick={() => setView("items")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "items" ? "bg-white text-primary-900 shadow-sm" : "text-primary-200 hover:text-white"
                    }`}>
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Items
                </button>
                <button onClick={() => setView("categories")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "categories" ? "bg-white text-primary-900 shadow-sm" : "text-primary-200 hover:text-white"
                    }`}>
                  <Tag className="w-3.5 h-3.5" /> Categories
                </button>
              </div>
              {view === "items" ? (
                <button onClick={openAddItem}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-md border border-white/5">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              ) : (
                <button onClick={() => setView("add-category")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-md border border-white/5">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* ─── Items View ─── */}
        {view === "items" && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-3 mb-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search items..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["All", ...categories].map((cat) => (
                  <button key={cat} onClick={() => setFilterCat(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${filterCat === cat ? "bg-primary-950 text-white border-primary-950" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-pulse">
                  <UtensilsCrossed className="w-12 h-12 text-slate-200 mx-auto mb-3 stroke-[1.25]" />
                  <p className="text-slate-400 font-semibold">Loading menu items...</p>
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
                  <p className="text-slate-500 font-semibold">No items found</p>
                  <button onClick={openAddItem} className="mt-3 text-xs text-primary-600 font-bold hover:underline">+ Add first menu item</button>
                </div>
              ) : (
                visibleItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all group">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full uppercase tracking-wide">{item.category}</span>
                        <span className="text-xs font-bold text-gold-600">₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditItem(item)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ─── Categories View ─── */}
        {view === "categories" && (
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = itemsPerCategory[cat] || 0;
              return (
                <div key={cat} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{cat}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{count} item{count !== 1 ? "s" : ""} in this category</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {count > 0 && (
                      <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" />{count} items
                      </div>
                    )}
                    <button onClick={() => handleDeleteCategory(cat)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
                <p className="text-slate-500 font-semibold">No categories yet</p>
                <button onClick={() => setView("add-category")} className="mt-3 text-xs text-primary-600 font-bold hover:underline">+ Add first category</button>
              </div>
            )}
          </div>
        )}

        {/* ─── Add Category Form ─── */}
        {view === "add-category" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Form */}
            <form onSubmit={handleAddCategory} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-800">Category Details</h2>
                <p className="text-xs text-slate-400 mt-0.5">Give your new category a clear, descriptive name</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-2">Category Name *</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5">
                      <Tag className="w-4 h-4 text-slate-400" />
                    </div>
                    <input type="text" required autoFocus
                      placeholder="e.g. Soups, Breads, Juices..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" />
                  </div>
                  {categories.includes(newCategoryName.trim()) && newCategoryName.trim() && (
                    <p className="text-xs text-rose-500 mt-2 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> This category already exists
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setView("categories")}
                    className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all">
                    Cancel
                  </button>
                  <button type="submit"
                    disabled={!newCategoryName.trim() || categories.includes(newCategoryName.trim())}
                    className="flex-1 py-3 bg-primary-950 hover:bg-primary-900 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
              </div>
            </form>

            {/* Existing categories list */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-800">Existing Categories</h2>
                <p className="text-xs text-slate-400 mt-0.5">{categories.length} categories created</p>
              </div>
              <div className="p-4 space-y-2">
                {categories.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-6">No categories yet</p>
                ) : (
                  categories.map((c) => (
                    <div key={c} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
                          <FolderOpen className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{c}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-full">
                        {itemsPerCategory[c] || 0} items
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Add / Edit Item Form ─── */}
        {(view === "add-item" || view === "edit-item") && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* ── Form panel (3/5) ── */}
            <form onSubmit={handleSubmitItem} className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-800">
                  {editingItem ? "Update Item Details" : "New Item Details"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingItem ? "Modify the fields and save changes" : "Fill in the details to add a new dish to the menu"}
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Item Name */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-2">
                    Item Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5">
                      <UtensilsCrossed className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text" required autoFocus
                      placeholder="e.g. Paneer Butter Masala, Chicken Biryani..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none transition-all text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Price + Category row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-2">
                      Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 rounded-l-xl border-2 border-r-0 border-slate-200 text-slate-500 text-sm font-bold">
                        ₹
                      </div>
                      <input
                        type="number" required min="0" step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none transition-all text-sm font-bold text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-2">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full appearance-none px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:outline-none transition-all text-sm font-bold text-slate-800 bg-white pr-10"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                {categories.length > 0 && (
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Quick Select Category</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat} type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${formData.category === cat
                            ? "bg-primary-950 text-white border-primary-950 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-primary-50"
                            }`}
                        >
                          {formData.category === cat && <span className="mr-1">✓</span>}
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setView("items"); }}
                  className="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim() || !formData.price}
                  className="flex-1 py-3.5 bg-gradient-to-r from-primary-950 to-primary-800 hover:from-primary-800 hover:to-primary-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {editingItem ? (
                    <><CheckCircle2 className="w-4 h-4" /> Save Changes</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Create Menu Item</>
                  )}
                </button>
              </div>
            </form>

            {/* ── Live Preview panel (2/5) ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Preview card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Live Preview</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">How it appears on billing screen</p>
                </div>
                <div className="p-5">
                  <div className={`rounded-xl border-2 transition-all ${formData.name ? "border-primary-200 bg-primary-50/30" : "border-dashed border-slate-200 bg-slate-50"
                    } p-4`}>
                    {formData.name ? (
                      <>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-sm font-black text-slate-800 leading-tight flex-1">{formData.name}</h3>
                          <span className="text-base font-black text-emerald-600 flex-shrink-0">
                            {formData.price ? `₹${parseFloat(formData.price).toFixed(0)}` : "₹—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full uppercase tracking-wide">
                            {formData.category || "No category"}
                          </span>
                          <button type="button" className="px-3 py-1.5 bg-primary-950 text-white rounded-lg text-[11px] font-bold opacity-60 cursor-default">
                            + Add
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <UtensilsCrossed className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.25]" />
                        <p className="text-xs text-slate-400 font-semibold">Start typing to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2.5">
                <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">💡 Tips</p>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> Use clear, descriptive names customers recognize</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> Set the correct category for easy filtering</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">•</span> Price must be greater than 0</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
