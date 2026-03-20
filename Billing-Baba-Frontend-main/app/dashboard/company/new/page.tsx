"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { createCompany, updateCompany, fetchCompanies } from '@/lib/api';
import { Camera, Upload, Loader2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const businessTypes = ["Retail", "Wholesale", "Distributor", "Service", "Manufacturing", "Others"];
const businessCategories = ["Accounting", "Advertising", "Agriculture", "Art", "Automobile", "Construction", "Education", "Electronics", "Farming", "Food & Beverage", "Healthcare", "IT", "Logistics", "Real Estate", "Textile", "Travel", "Other"];

interface CompanyForm {
    name: string;
    phone: string;
    gstin: string;
    email: string;
    businessType: string;
    businessCategory: string;
    state: string;
    pincode: string;
    address: string;
    logo: string;
    signature: string;
}

export default function CompanyProfilePage() {
    const router = useRouter(); // Initialize router
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [companyId, setCompanyId] = useState<string | null>(null);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<CompanyForm>({
        defaultValues: {
            name: '',
            phone: '',
            gstin: '',
            email: '',
            businessType: '',
            businessCategory: '',
            state: '',
            pincode: '',
            address: '',
            logo: '',
            signature: '',
        }
    });

    const logo = watch('logo');
    const signature = watch('signature');

    useEffect(() => {
        const loadExisting = async () => {
            const activeId = localStorage.getItem('activeCompanyId');
            if (!activeId) { setIsLoading(false); return; }
            try {
                const companies = await fetchCompanies();
                const company = companies.find((c: any) => c._id === activeId);
                if (company) {
                    setCompanyId(company._id);
                    setValue('name', company.name || '');
                    setValue('phone', company.phone || '');
                    setValue('gstin', company.gstin || '');
                    setValue('email', company.email || '');
                    setValue('businessType', company.businessType || '');
                    setValue('businessCategory', company.businessCategory || '');
                    setValue('state', company.state || '');
                    setValue('pincode', company.pincode || '');
                    setValue('address', company.address || '');
                    setValue('logo', company.logo || '');
                    setValue('signature', company.signature || '');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadExisting();
    }, [setValue]);

    const onSubmit = async (data: CompanyForm) => {
        setIsSaving(true);
        try {
            if (companyId) {
                await updateCompany(companyId, data);
                toast({ title: "Company profile updated" });
            } else {
                const created = await createCompany(data);
                if (created?._id) localStorage.setItem('activeCompanyId', created._id);
                setTimeout(() => router.push('/dashboard/company'), 500);
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save company profile", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'signature') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue(fieldName, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative h-32 w-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group">
                            {logo ? (
                                <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <span className="text-gray-400 text-sm">Add Logo</span>
                                </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                <Camera size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">Business Details</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Name <span className="text-red-500">*</span></label>
                                <Input {...register('name', { required: true })} placeholder="Enter Business Name" className={errors.name ? 'border-red-500' : ''} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                <Input {...register('phone')} placeholder="Enter Phone Number" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">GSTIN</label>
                                <Input {...register('gstin')} placeholder="Enter GSTIN" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Email ID</label>
                                <Input {...register('email')} placeholder="Enter Email ID" />
                            </div>
                        </div>

                        {/* More Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">More Details</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Business Type</label>
                                <Controller
                                    control={control}
                                    name="businessType"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Business Type" /></SelectTrigger>
                                            <SelectContent>
                                                {businessTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Business Category</label>
                                <Controller
                                    control={control}
                                    name="businessCategory"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Business Category" /></SelectTrigger>
                                            <SelectContent>
                                                {businessCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">State</label>
                                <Controller
                                    control={control}
                                    name="state"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                            <SelectContent>
                                                {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Pincode</label>
                                <Input {...register('pincode')} placeholder="Enter Pincode" />
                            </div>
                        </div>

                        {/* Address & Signature (Full width on md, or 2nd col) */}
                        <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Business Address</label>
                                <Textarea {...register('address')} placeholder="Enter Business Address" className="h-32 resize-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Add Signature</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center p-4 bg-gray-50 relative group">
                                    {signature ? (
                                        <img src={signature} alt="Signature" className="h-full object-contain" />
                                    ) : (
                                        <>
                                            <Upload className="text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Upload Signature</span>
                                        </>
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white rounded-lg">
                                        <Edit2 size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'signature')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white min-w-[140px]">
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
