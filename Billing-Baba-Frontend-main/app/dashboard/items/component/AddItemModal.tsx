"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Search, Camera, Plus, Calendar, Info, MinusCircle, ChevronDown, Check } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import SelectUnitModal from './SelectUnitModal';
import AddCategoryModal from './AddCategoryModal';
import ItemSettingsSlideOver from './ItemSettingsSlideOver';

import { createItem, updateItem, fetchCategories, createCategory } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// --- Helper Components ---

const taxRates = ["None", "IGST@0%", "GST@0%", "IGST@0.25%", "GST@0.25%", "IGST@3%", "GST@3%", "IGST@5%", "GST@5%", "IGST@12%", "GST@12%", "IGST@18%", "GST@18%", "IGST@28%", "GST@28%", "Exempt"];

// Modified SplitInput to work with React Hook Form
const SplitInput = ({
    placeholder,
    options,
    inputValue,
    onInputChange,
    selectValue,
    onSelectChange,
    inputType = "number"
}: {
    placeholder: string,
    options: string[],
    inputValue?: string | number,
    onInputChange?: (val: string) => void,
    selectValue?: string,
    onSelectChange?: (val: string) => void,
    inputType?: string
}) => (
    <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
        <input
            type={inputType}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
            className="w-full p-2 border-none focus:ring-0 text-sm outline-none placeholder-gray-400"
        />
        <select
            value={selectValue}
            onChange={(e) => onSelectChange && onSelectChange(e.target.value)}
            className="p-2 border-none border-l border-gray-300 focus:ring-0 text-sm text-gray-700 min-w-[110px] outline-none bg-white cursor-pointer"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const ItemTypeToggle = ({ type, setType }: { type: string, setType: (type: 'Product' | 'Service') => void }) => (
    <div className="flex items-center gap-2 ml-4">
        <span className={`text-sm font-medium ${type === 'Product' ? 'text-blue-600' : 'text-gray-400'}`}>Product</span>
        <div
            className={`w-10 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-colors ${type === 'Product' ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => setType(type === 'Product' ? 'Service' : 'Product')}
        >
            <motion.div
                layout
                className="w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: type === 'Product' ? 0 : 16 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </div>
        <span className={`text-sm font-medium ${type === 'Service' ? 'text-blue-600' : 'text-gray-400'}`}>Service</span>
    </div>
);

// --- Main Component ---

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: any;
    mode?: 'add' | 'edit';
}

export default function AddItemModal({ isOpen, onClose, onSuccess, initialData, mode = 'add' }: AddItemModalProps) {
    const [itemType, setItemType] = useState<'Product' | 'Service'>('Product');
    const [activeTab, setActiveTab] = useState('Pricing');
    const [showWholesale, setShowWholesale] = useState(false);

    // Modals state
    const [isUnitModalOpen, setUnitModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Fetch Categories
    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    // React Hook Form
    const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            name: '',
            hsn: '',
            unit: 'PCS',
            itemCode: '',
            salePrice: '',
            saleTaxType: 'Without Tax',
            discountValue: '',
            discountType: 'Percentage',
            wholesalePrice: '',
            wholesaleTaxType: 'Without Tax',
            minWholesaleQty: '',
            purchasePrice: '',
            purchaseTaxType: 'Without Tax',
            taxRate: 'None',
            openingQuantity: '',
            atPrice: '',
            asOfDate: new Date().toISOString().split('T')[0],
            minStockToMaintain: '',
            location: ''
        }
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                // Populate form for edit
                const details = initialData.product || initialData.service || initialData;
                setItemType(initialData.type === 'service' ? 'Service' : 'Product');

                // Find Category ID
                if (details.category) {
                    const cat = categories.find(c => c.name === details.category);
                    if (cat) setSelectedCategory(cat._id);
                }

                reset({
                    name: initialData.name || '',
                    hsn: details.hsn || '',
                    unit: details.unit || 'PCS',
                    itemCode: details.itemCode || '',
                    salePrice: details.salePrice?.amount || '',
                    saleTaxType: details.salePrice?.taxType === 'withTax' ? 'With Tax' : 'Without Tax',
                    discountValue: details.discount?.value || '',
                    discountType: details.discount?.type === 'amount' ? 'Amount' : 'Percentage',
                    // Wholesale fields - likely need more robust checking if they exist in schema
                    wholesalePrice: '',
                    wholesaleTaxType: 'Without Tax',
                    minWholesaleQty: '',

                    purchasePrice: details.purchasePrice?.amount || '',
                    purchaseTaxType: details.purchasePrice?.taxType === 'withTax' ? 'With Tax' : 'Without Tax',
                    taxRate: typeof details.taxRate === 'number' && details.taxRate > 0
                        ? (taxRates.find(r => r.includes(`${details.taxRate}%`)) || `${details.taxRate}%`)
                        : (details.taxRate === 0 ? 'GST@0%' : 'None'),

                    openingQuantity: details.openingQuantity || '',
                    atPrice: details.atPrice || '',
                    asOfDate: new Date().toISOString().split('T')[0],
                    minStockToMaintain: details.minStockToMaintain || '',
                    location: details.location || ''
                });

            } else {
                reset(); // Reset to defaults
                setItemType('Product');
                setActiveTab('Pricing');
                setSelectedCategory(null);
            }
        }
    }, [isOpen, reset, mode, initialData]);

    // Separate effect to sync category when categories are loaded or initialData changes
    useEffect(() => {
        if (isOpen && mode === 'edit' && initialData && categories.length > 0) {
            const details = initialData.product || initialData.service || initialData;
            if (details.category) {
                const cat = categories.find(c => c.name === details.category);
                if (cat) setSelectedCategory(cat._id);
            }
        }
    }, [isOpen, mode, initialData, categories]);

    const handleAddCategory = async (categoryName: string) => {
        try {
            const existing = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            if (existing) {
                setSelectedCategory(existing._id);
                return;
            }

            const newCategory = await createCategory({ name: categoryName });
            setCategories(prev => [...prev, newCategory]);
            setSelectedCategory(newCategory._id);
        } catch (error) {
            console.error('Failed to create category', error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            // Parse Tax Rate
            let rate = 0;
            if (data.taxRate !== "None") {
                const match = data.taxRate.match(/(\d+(\.\d+)?)%/);
                if (match) rate = parseFloat(match[1]);
            }

            const payload = {
                type: itemType.toLowerCase(),
                name: data.name,
                hsn: data.hsn,
                unit: data.unit,
                category: selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : '',
                itemCode: data.itemCode,
                salePrice: {
                    amount: Number(data.salePrice) || 0,
                    taxType: data.saleTaxType === 'With Tax' ? 'withTax' : 'withoutTax'
                },
                discount: {
                    value: Number(data.discountValue) || 0,
                    type: data.discountType.toLowerCase()
                },
                purchasePrice: {
                    amount: Number(data.purchasePrice) || 0,
                    taxType: data.purchaseTaxType === 'With Tax' ? 'withTax' : 'withoutTax'
                },
                taxRate: rate,
                openingQuantity: Number(data.openingQuantity) || 0,
                atPrice: Number(data.atPrice) || 0,
                minStockToMaintain: Number(data.minStockToMaintain) || 0,
                location: data.location
            };

            if (mode === 'edit' && initialData?._id) {
                const currentQty = initialData?.product?.currentQuantity || 0;
                (payload as any).currentQuantity = currentQty + (Number(data.openingQuantity) || 0);
                await updateItem(initialData._id, payload);
                toast({ title: "Item updated successfully!", className: "bg-green-500 text-white" });
            } else {
                await createItem(payload);
                toast({ title: "Item saved successfully!", className: "bg-green-500 text-white" });
            }

            if (onSuccess) onSuccess();
            onClose();

        } catch (error: any) {
            console.error(error);
            toast({ title: `Error: ${error.message || 'Failed to save'}`, variant: "destructive" });
        }
    };

    if (!isOpen) return null;

    // --- Sub-components requiring form context ---

    const PricingContent = () => (
        <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">Sale Price</h3>
                <div className="w-full md:w-64">
                    <Controller
                        control={control}
                        name="salePrice"
                        render={({ field }) => (
                            <SplitInput
                                placeholder="Sale Price"
                                options={['Without Tax', 'With Tax']}
                                inputValue={field.value}
                                onInputChange={field.onChange}
                                selectValue={watch('saleTaxType')}
                                onSelectChange={(val) => setValue('saleTaxType', val)}
                            />
                        )}
                    />
                </div>

                <h3 className="font-semibold text-gray-800 mt-8 mb-4 text-sm">Wholesale Price</h3>
                <div className="flex flex-wrap gap-4 items-start">
                    <div className="w-full md:w-64">
                        <Controller
                            control={control}
                            name="wholesalePrice"
                            render={({ field }) => (
                                <SplitInput
                                    placeholder="Wholesale Price"
                                    options={['Without Tax', 'With Tax']}
                                    inputValue={field.value}
                                    onInputChange={field.onChange}
                                    selectValue={watch('wholesaleTaxType')}
                                    onSelectChange={(val) => setValue('wholesaleTaxType', val)}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="relative w-full md:w-48">
                            <input {...register('minWholesaleQty')} type="number" placeholder="Minimum Wholesale Qty" className="w-full p-2 border border-gray-300 rounded text-sm outline-none placeholder-gray-400 pr-8" />
                            <Info className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-gray-400 text-xs text-right mt-1 w-full text-right">PCS</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4 text-sm">Purchase Price</h3>
                    <div className="w-full">
                        <Controller
                            control={control}
                            name="purchasePrice"
                            render={({ field }) => (
                                <SplitInput
                                    placeholder="Purchase Price"
                                    options={['Without Tax', 'With Tax']}
                                    inputValue={field.value}
                                    onInputChange={field.onChange}
                                    selectValue={watch('purchaseTaxType')}
                                    onSelectChange={(val) => setValue('purchaseTaxType', val)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4 text-sm">Taxes</h3>
                    <div>
                        <select {...register('taxRate')} className="w-full p-2 border border-gray-300 rounded outline-none text-sm bg-white cursor-pointer">
                            {taxRates.map(rate => (<option key={rate} value={rate}>{rate}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const CategoryDropdown = () => (
        <div>
            <label className="text-xs text-gray-500">Category</label>
            <div className="relative mt-1">
                <button type="button" onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-left flex justify-between items-center">
                    <span>{selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : 'Select Category'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2 space-y-2 max-h-48 overflow-y-auto">
                        <button type="button" onClick={() => { setCategoryModalOpen(true); setCategoryDropdownOpen(false); }} className="w-full text-left text-sm text-blue-600 font-semibold flex items-center gap-2 p-1 hover:bg-gray-100 rounded">
                            <Plus className="h-4 w-4" /> Add New Category
                        </button>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <div key={cat._id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => { setSelectedCategory(cat._id); setCategoryDropdownOpen(false); }}>
                                    {selectedCategory === cat._id && <Check className="h-4 w-4 text-blue-600" />}
                                    <span className={`text-sm w-full ${selectedCategory === cat._id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center">

                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={onClose}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-auto flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-lg font-bold text-gray-800">Add Item</h2>
                                    <ItemTypeToggle type={itemType} setType={setItemType} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Settings
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                    />
                                    <X
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                        onClick={onClose}
                                    />
                                </div>
                            </div>

                            {/* Body */}
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col flex-1 overflow-hidden"
                            >
                                <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                                    {/* General Info */}
                                    <div className="space-y-6 mb-8 mt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                            {/* Item Name */}
                                            <div>
                                                <input {...register('name', { required: true })} className="w-full p-2 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm placeholder-gray-400" placeholder="Item Name *" />
                                            </div>
                                            {/* Item HSN */}
                                            <div className="relative">
                                                <input {...register('hsn')} className="w-full p-2 pr-8 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm placeholder-gray-400" placeholder="Item HSN" />
                                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                            {/* Item Code */}
                                            <div className="relative flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-blue-500">
                                                <input {...register('itemCode')} className="w-full p-2 border-none outline-none text-sm placeholder-gray-400" placeholder="Item Code" />
                                                <button type="button" className="px-3 py-1 mr-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100 whitespace-nowrap">Assign Code</button>
                                            </div>
                                            {/* Select Unit */}
                                            <div className="flex flex-col items-center justify-center -mt-1">
                                                <button type="button" onClick={() => setUnitModalOpen(true)} className="w-[120px] bg-blue-100 text-blue-600 font-semibold py-2 rounded text-sm hover:bg-blue-200 transition-colors">Select Unit</button>
                                                <span className="text-blue-500 text-xs mt-1.5 font-medium uppercase">{watch('unit') || 'PCS'}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                            {/* Category */}
                                            <div className="relative">
                                                <button type="button" onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full p-2 border border-gray-300 rounded bg-white text-sm text-left flex justify-between items-center text-gray-500">
                                                    <span>{selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : 'Category'}</span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isCategoryDropdownOpen && (
                                                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 p-2 space-y-2 max-h-48 overflow-y-auto">
                                                        <button type="button" onClick={() => { setCategoryModalOpen(true); setCategoryDropdownOpen(false); }} className="w-full text-left text-sm text-blue-600 font-semibold flex items-center gap-2 p-1 hover:bg-gray-100 rounded">
                                                            <Plus className="h-4 w-4" /> Add New Category
                                                        </button>
                                                        <div className="space-y-1">
                                                            {categories.map(cat => (
                                                                <div key={cat._id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => { setSelectedCategory(cat._id); setCategoryDropdownOpen(false); }}>
                                                                    {selectedCategory === cat._id && <Check className="h-4 w-4 text-blue-600" />}
                                                                    <span className={`text-sm w-full ${selectedCategory === cat._id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{cat.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Description */}
                                            <div>
                                                <input className="w-full p-2 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm placeholder-gray-400" placeholder="Description" />
                                            </div>
                                            {/* Add Item Image */}
                                            <div className="md:col-span-2 flex items-center h-full">
                                                <button type="button" className="text-blue-500 text-sm flex items-center gap-1.5 font-semibold hover:underline">
                                                    <Camera className="h-4 w-4" /> Add Item Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex border-b mb-6 gap-8">
                                        {['Pricing', 'Stock', 'Online Store', 'Manufacturing'].map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveTab(tab)}
                                                className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    {activeTab === 'Pricing' && <PricingContent />}

                                    {activeTab === 'Stock' && (
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">Opening Quantity</label>
                                                    <input {...register('openingQuantity')} type="number" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" placeholder="0" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">At Price</label>
                                                    <input {...register('atPrice')} type="number" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" placeholder="0" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">As of Date</label>
                                                    <div className="relative">
                                                        <input {...register('asOfDate')} type="date" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">Min Stock To Maintain</label>
                                                    <input {...register('minStockToMaintain')} type="number" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" placeholder="0" />
                                                </div>
                                                <div className="space-y-1 md:col-span-2">
                                                    <label className="text-xs text-gray-500">Location</label>
                                                    <input {...register('location')} type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none" placeholder="Ex: Rack A-12" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Footer */}
                                <div className="flex justify-end items-center p-4 border-t gap-3 bg-white">
                                    {/* Video link on left */}
                                    <div className="flex-1 text-sm text-gray-500 flex items-center gap-2">
                                        <div className="bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                            Learn how to use Manufacturing
                                            <a href="#" className="font-semibold text-blue-600 inline-flex items-center flex-row hover:underline">
                                                <svg className="w-4 h-4 text-blue-600 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                Watch Video
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="border border-gray-300 text-gray-500 px-6 py-2 rounded font-semibold hover:bg-gray-50 transition-colors"
                                        onClick={() => {
                                            handleSubmit(onSubmit)();
                                            setTimeout(() => setIsSettingsOpen(false), 500);
                                        }}
                                    >
                                        Save & New
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Nested Modals (Higher Z-Index) */}
            <SelectUnitModal
                isOpen={isUnitModalOpen}
                onClose={() => setUnitModalOpen(false)}
            />

            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onAddCategory={handleAddCategory}
            />

            <ItemSettingsSlideOver
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}