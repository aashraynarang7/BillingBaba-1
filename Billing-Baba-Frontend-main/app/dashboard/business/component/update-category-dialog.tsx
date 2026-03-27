"use client";
import { useState, useEffect, cloneElement, isValidElement } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { fetchCategories, updateItem } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface UpdateCategoryDialogProps {
  children: React.ReactNode;
  item: any;
  onSuccess?: () => void;
}

export function UpdateCategoryDialog({ children, item, onSuccess }: UpdateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories()
        .then(setCategories)
        .catch(() => toast({ title: "Failed to load categories", variant: "destructive" }));
      setSelected(item?.product?.category || item?.category || "");
      setShowNewCatInput(false);
      setNewCatInput("");
    }
  }, [open]);

  const handleApply = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateItem(item._id, { category: selected });
      toast({ title: `Category updated to "${selected}"`, className: "bg-green-600 text-white" });
      setOpen(false);
      onSuccess?.();
    } catch {
      toast({ title: "Failed to update category", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    const name = newCatInput.trim();
    if (!name) return;
    if (!categories.find((c) => c.name === name)) {
      setCategories((prev) => [...prev, { _id: name, name }]);
    }
    setSelected(name);
    setShowNewCatInput(false);
    setNewCatInput("");
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, { onClick: () => setOpen(true) })
    : children;

  return (
    <>
      {trigger}

      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Update Category</h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Add New Category */}
              <div className="px-5 pt-4">
                {showNewCatInput ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      autoFocus
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
                      placeholder="Category name"
                      className="flex-1 border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={handleAddNew} className="text-sm text-blue-600 font-medium hover:underline">
                      Add
                    </button>
                    <button onClick={() => { setShowNewCatInput(false); setNewCatInput(""); }}>
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewCatInput(true)}
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-2 hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add New Category
                  </button>
                )}
              </div>

              {/* Category list */}
              <div className="px-5 pb-2 max-h-64 overflow-y-auto divide-y divide-gray-100">
                {categories.length === 0 && (
                  <p className="text-sm text-gray-400 py-4 text-center">No categories yet</p>
                )}
                {categories.map((cat: any) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 -mx-5 px-5"
                  >
                    <input
                      type="checkbox"
                      checked={selected === cat.name}
                      onChange={() => setSelected(selected === cat.name ? "" : cat.name)}
                      className="h-5 w-5 accent-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                  </label>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={saving || !selected}
                  className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
