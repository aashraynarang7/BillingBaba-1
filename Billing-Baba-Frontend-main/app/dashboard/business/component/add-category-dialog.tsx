"use client";
import { useState, cloneElement, isValidElement } from "react";
import { X, Loader2 } from "lucide-react";
import { createCategory } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface AddCategoryDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddCategoryDialog({ children, onSuccess }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createCategory({ name: name.trim() });
      toast({ title: `Category "${name.trim()}" created`, className: "bg-green-600 text-white" });
      setOpen(false);
      setName("");
      onSuccess?.();
    } catch {
      toast({ title: "Failed to create category", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, { onClick: () => { setName(""); setOpen(true); } })
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
                <h2 className="text-lg font-semibold text-gray-800">Add Category</h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-6 space-y-2">
                <label className="text-sm font-medium text-blue-600">Enter Category Name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g., Grocery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Footer */}
              <div className="px-5 pb-5">
                <button
                  onClick={handleCreate}
                  disabled={saving || !name.trim()}
                  className="w-full py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
