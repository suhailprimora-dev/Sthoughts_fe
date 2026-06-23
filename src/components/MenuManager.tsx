import React, { useState } from "react";
import { X, Plus, Search, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { MenuItem } from "@/types/billing";

interface MenuManagerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  categories: string[];
  onAddItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string | number) => void;
}

export default function MenuManager({
  isOpen,
  onClose,
  items,
  categories,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: MenuManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: categories[0] || "Food",
  });

  if (!isOpen) return null;

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price);
    if (!formData.name.trim() || isNaN(priceNum) || priceNum <= 0) return;

    if (editingItem) {
      onUpdateItem({
        id: editingItem.id,
        name: formData.name.trim(),
        price: priceNum,
        category: formData.category,
      });
      setEditingItem(null);
    } else {
      onAddItem({
        name: formData.name.trim(),
        price: priceNum,
        category: formData.category,
      });
    }

    setFormData({ name: "", price: "", category: categories[0] || "Food" });
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingItem(null);
    setFormData({ name: "", price: "", category: categories[0] || "Food" });
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary-950 text-white">
          <div className="flex items-center gap-3">
            {showForm && (
              <button onClick={cancelForm} className="hover:text-gold-400 transition-colors mr-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {showForm ? (editingItem ? "Edit Menu Item" : "Add Menu Item") : "Manage Menu Directory"}
              </h2>
              <p className="text-xs text-primary-200 mt-0.5">
                {items.length} items registered in system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {showForm ? (
          /* Form UI */
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Item Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Traditional Paneer Butter Masala"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="240.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={cancelForm}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-xl font-semibold transition-all shadow-glow hover:shadow-lg"
              >
                {editingItem ? "Save Changes" : "Create Item"}
              </button>
            </div>
          </form>
        ) : (
          /* List UI */
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Search and Action Row */}
            <div className="p-4 bg-white border-b border-slate-100 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search catalog items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2.5 bg-primary-950 hover:bg-primary-900 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm font-medium">
                    No items match your search criteria.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-primary-200 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-gold-600">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
