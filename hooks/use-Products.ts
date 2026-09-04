'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchProducts() {
    const response = await fetch('/api/products');

    if (!response.ok) {
        throw new Error('Erro ao buscar produtos.');
    }

    return response.json();
}

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });
}