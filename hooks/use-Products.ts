'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/app/actions/products';

export function useProducts(category?: string) {
    return useQuery({
        queryKey: ['products', category ?? 'all'],
        queryFn: () => getProducts(category),
    });
}
