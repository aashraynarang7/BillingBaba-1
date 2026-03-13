import { X } from 'lucide-react';
import { useState } from 'react';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCategory: (categoryName: string) => void;
}

export default function AddCategoryModal({ isOpen, onClose, onAddCategory }: AddCategoryModalProps) {
    const [categoryName, setCategoryName] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (categoryName.trim()) {
            onAddCategory(categoryName.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Add Category</h2>
                    <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={onClose} />
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <label className="text-sm font-semibold text-blue-600">Enter Category Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Grocery"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        autoFocus
                        className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-0"
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 mr-2">Cancel</button>
                    <button onClick={handleCreate} className="bg-blue-600 text-white font-bold px-8 py-2 rounded-lg hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
}