"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, MoreVertical, Plus } from "lucide-react";

export default function CompanyListPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCompany = (companyId: string) => {
        // "Start Session" logic
        localStorage.setItem("activeCompanyId", companyId);
        // Ideally user might also want to call an API here as requested
        // But REST APIs are typically stateless. We just use the ID for future requests.
        router.push("/dashboard/home");
    };

    const handleCreateNew = () => {
        router.push("/dashboard/company/new");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col h-[600px]">

                {/* Header */}
                <div className="bg-slate-900 text-white p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold">Company List</h1>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Company"
                                className="pl-9 pr-4 py-2 bg-slate-800 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-slate-600 w-64 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                    {/* Tabs in Header Area */}
                    <div className="mt-6 flex gap-8 text-sm font-medium">
                        <button className="pb-2 text-gray-400 hover:text-white transition-colors">Companies Shared with Me</button>
                        <button className="pb-2 border-b-2 border-white text-white">My Companies</button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-2">
                        <span>Below are the company that are created by you</span>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 hover:underline cursor-pointer">Browse Files (.vyp)</span>
                            <button onClick={loadCompanies} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><RotateCw className="h-4 w-4 text-blue-500" /></button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">Loading companies...</div>
                        ) : companies.length > 0 ? (
                            companies.map((company) => (
                                <div key={company._id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-800 text-base">{company.name}</h3>
                                            {company.businessType && (
                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">• Current Company</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Last Sale Created: -</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <span className="scale-75">🖥️</span> SYNC OFF
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                                        <Button
                                            variant="outline"
                                            className="text-blue-600 border-gray-200 hover:bg-blue-50 px-6"
                                            onClick={() => handleOpenCompany(company._id)}
                                        >
                                            Open
                                        </Button>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400 bg-white rounded-md border border-dashed border-gray-300">
                                No companies found. Create one to get started.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-3">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 font-semibold">
                        Restore backup
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold" onClick={handleCreateNew}>
                        New Company
                    </Button>
                </div>
            </div>

            {/* Bottom Login Link (Outside Card) */}
            <div className="absolute bottom-4 right-8 text-right">
                <button className="text-sm text-blue-600 font-medium hover:underline block ml-auto" onClick={() => router.push('/login')}>Login</button>
                <p className="text-xs text-gray-400 mt-1">Login to join or create a sync company</p>
            </div>
        </div>
    );
}
