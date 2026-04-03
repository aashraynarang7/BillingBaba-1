"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanies, fetchSharedCompanies } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, MoreVertical } from "lucide-react";

type Tab = "my" | "shared";

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
    salesman:       { label: "Salesman",      className: "bg-blue-100 text-blue-700" },
    biller:         { label: "Biller",         className: "bg-green-100 text-green-700" },
    "stock-keeper": { label: "Stock Keeper",   className: "bg-orange-100 text-orange-700" },
    "ca-accountant":{ label: "CA/Accountant",  className: "bg-purple-100 text-purple-700" },
};

export default function CompanyListPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("my");
    const [companies, setCompanies] = useState<any[]>([]);
    const [sharedCompanies, setSharedCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharedLoading, setIsSharedLoading] = useState(true);

    useEffect(() => {
        loadCompanies();
        loadSharedCompanies();
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

    const loadSharedCompanies = async () => {
        setIsSharedLoading(true);
        try {
            const data = await fetchSharedCompanies();
            setSharedCompanies(data);
        } catch (error) {
            console.error("Failed to fetch shared companies", error);
        } finally {
            setIsSharedLoading(false);
        }
    };

    const handleOpenCompany = (companyId: string) => {
        localStorage.setItem("activeCompanyId", companyId);
        localStorage.removeItem("activeCompanyRole");
        localStorage.removeItem("isSharedCompany");
        router.push("/dashboard/home");
    };

    const handleOpenSharedCompany = (companyId: string, role: string) => {
        localStorage.setItem("activeCompanyId", companyId);
        localStorage.setItem("activeCompanyRole", role);
        localStorage.setItem("isSharedCompany", "true");
        router.push("/dashboard/home");
    };

    const handleCreateNew = () => {
        router.push("/dashboard/company/new");
    };

    const handleRefresh = () => {
        loadCompanies();
        loadSharedCompanies();
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
                    {/* Tabs */}
                    <div className="mt-6 flex gap-8 text-sm font-medium">
                        <button
                            onClick={() => setTab("shared")}
                            className={`pb-2 transition-colors ${tab === "shared" ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Companies Shared with Me
                        </button>
                        <button
                            onClick={() => setTab("my")}
                            className={`pb-2 transition-colors ${tab === "my" ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            My Companies
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">

                    {tab === "my" && (
                        <>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-2">
                                <span>Below are the companies created by you</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 hover:underline cursor-pointer">Browse Files (.vyp)</span>
                                    <button onClick={handleRefresh} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                        <RotateCw className="h-4 w-4 text-blue-500" />
                                    </button>
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
                        </>
                    )}

                    {tab === "shared" && (
                        <>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-2">
                                <span>Companies shared with you by other owners</span>
                                <button onClick={handleRefresh} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                    <RotateCw className="h-4 w-4 text-blue-500" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {isSharedLoading ? (
                                    <div className="p-8 text-center text-gray-500">Loading shared companies...</div>
                                ) : sharedCompanies.length > 0 ? (
                                    sharedCompanies.map((company) => {
                                        const badge = ROLE_BADGE[company.role] ?? { label: company.role, className: "bg-gray-100 text-gray-700" };
                                        return (
                                            <div key={company._id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-gray-800 text-base">{company.name}</h3>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badge.className}`}>
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">Shared with you as {badge.label}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="outline"
                                                        className="text-blue-600 border-gray-200 hover:bg-blue-50 px-6"
                                                        onClick={() => handleOpenSharedCompany(company._id, company.role)}
                                                    >
                                                        Open
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-12 text-center text-gray-400 bg-white rounded-md border border-dashed border-gray-300">
                                        No companies have been shared with you yet.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
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

            {/* Bottom Login Link */}
            <div className="absolute bottom-4 right-8 text-right">
                <button className="text-sm text-blue-600 font-medium hover:underline block ml-auto" onClick={() => router.push('/login')}>Login</button>
                <p className="text-xs text-gray-400 mt-1">Login to join or create a sync company</p>
            </div>
        </div>
    );
}
