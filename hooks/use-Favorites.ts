'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

const FAVORITES_KEY = '@reuse_favorites';
const FAVORITES_EVENT = 'reuse-favorites-changed';

function readFavorites(): Product[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeFavorites(list: Product[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Product[]>([]);

    useEffect(() => {
        const sync = () => setFavorites(readFavorites());
        sync();
        window.addEventListener(FAVORITES_EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(FAVORITES_EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const isFavorite = useCallback(
        (id: Product['id']) => favorites.some((item) => item.id === id),
        [favorites],
    );

    const toggleFavorite = useCallback((product: Product) => {
        const current = readFavorites();
        const exists = current.some((item) => item.id === product.id);
        const next = exists ? current.filter((item) => item.id !== product.id) : [...current, product];
        writeFavorites(next);
    }, []);

    return { favorites, isFavorite, toggleFavorite };
}
