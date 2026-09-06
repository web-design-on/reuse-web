'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/app/actions/products';

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id),
        enabled: Boolean(id),
    });
}
