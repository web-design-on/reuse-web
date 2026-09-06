'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

const CART_KEY = '@reuse_cart';
const CART_EVENT = 'reuse-cart-changed';

function readCart(): Product[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCart(list: Product[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(CART_EVENT));
}

export function useCart() {
    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        const sync = () => setItems(readCart());
        sync();
        window.addEventListener(CART_EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(CART_EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const isInCart = useCallback(
        (id: Product['id']) => items.some((item) => item.id === id),
        [items],
    );

    const toggleCartItem = useCallback((product: Product) => {
        const current = readCart();
        const exists = current.some((item) => item.id === product.id);
        const next = exists ? current.filter((item) => item.id !== product.id) : [...current, product];
        writeCart(next);
    }, []);

    const removeFromCart = useCallback((id: Product['id']) => {
        writeCart(readCart().filter((item) => item.id !== id));
    }, []);

    const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0);

    return { items, isInCart, toggleCartItem, removeFromCart, total };
}
