import { X } from 'lucide-react';

interface SelectUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// List of all units from your image
const unitsList = [
    "None", "BAGS (Bag)", "BOTTLES (Btl)", "BOX (Box)", "BUNDLES (Bdl)",
    "CANS (Can)", "CARTONS (Ctn)", "DOZENS (Dzn)", "GRAMMES (Gm)",
    "KILOGRAMS (Kg)", "LITRE (Ltr)", "METERS (Mtr)", "MILILITRE (Ml)",
    "NUMBERS (Nos)", "PACKS (Pac)", "PAIRS (Prs)", "PIECES (Pcs)", "QUINTAL (Qtl)"
];

export default function SelectUnitModal({ isOpen, onClose }: SelectUnitModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 bg-blue-50/50 border-b border-gray-200 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Select Unit</h2>
                    <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={onClose} />
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-blue-600">BASE UNIT</label>
                            <select className="w-full mt-1 p-2 border-2 border-gray-300 rounded-md bg-white text-sm focus:border-orange-500 focus:ring-0">
                                {unitsList.map(unit => <option key={`base-${unit}`}>{unit}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">SECONDARY UNIT</label>
                            <select className="w-full mt-1 p-2 border-2 border-gray-300 rounded-md bg-white text-sm focus:border-orange-500 focus:ring-0">
                                {unitsList.map(unit => <option key={`sec-${unit}`}>{unit}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <button onClick={onClose} className="bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700">SAVE</button>
                </div>
            </div>
        </div>
    );
}