'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes — data stays fresh
            gcTime: 10 * 60 * 1000,         // 10 minutes — keep unused data in cache
            refetchOnWindowFocus: false,     // Don't refetch every time user switches tabs
            retry: 1,
        },
    },
});
