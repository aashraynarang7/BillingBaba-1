'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchParties, fetchCompanies, fetchItems } from '@/lib/api';

// Shared hook: fetch all parties for the active company
// Result is cached for 5 minutes — no more duplicate requests per page
export function useParties(searchQuery?: string) {
    return useQuery({
        queryKey: ['parties', searchQuery],
        queryFn: () => fetchParties(searchQuery),
        staleTime: 5 * 60 * 1000,
    });
}

// Shared hook: fetch all companies
export function useCompanies() {
    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
        staleTime: 10 * 60 * 1000, // Companies change rarely
    });
}

// Shared hook: fetch and flatten all items
export function useItems() {
    return useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const itemsData = await fetchItems();
            return itemsData.map((item: any) => {
                const details = item.product || item.service || {};
                return {
                    ...details,
                    ...item,
                    purchasePrice: details.purchasePrice || item.purchasePrice,
                    salePrice: details.salePrice || item.salePrice,
                    taxRate: details.taxRate || item.taxRate,
                    unit: details.unit || item.unit,
                };
            });
        },
        staleTime: 5 * 60 * 1000,
    });
}
