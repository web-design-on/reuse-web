'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/app/actions/products';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
}
