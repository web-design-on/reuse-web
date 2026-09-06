'use client';

import Link from 'next/link';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useFavorites } from '@/hooks/use-Favorites';
import { useCart } from '@/hooks/use-Cart';
import type { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isInCart, toggleCartItem } = useCart();
    const image = product.images?.[0] ?? product.thumbnail;
    const favorite = isFavorite(product.id);
    const inCart = isInCart(product.id);

    return (
        <div className={styles.card}>
            <div className={styles.imageWrap}>
                <Link href={`/products/${product.id}`} className={styles.imageLink}>
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={product.title} className={styles.image} />
                    ) : (
                        <div className={styles.imagePlaceholder} aria-hidden="true" />
                    )}
                </Link>
                <button
                    type="button"
                    className={`${styles.favBtn} ${favorite ? styles.favBtnActive : ''}`}
                    onClick={() => toggleFavorite(product)}
                    aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-pressed={favorite}
                >
                    {favorite ? <FaHeart /> : <FaRegHeart />}
                </button>
            </div>
            <Link href={`/products/${product.id}`} className={styles.infoLink}>
                <p className={styles.name}>{product.title}</p>
            </Link>
            <div className={styles.footer}>
                <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
                <button
                    type="button"
                    className={`${styles.cartBtn} ${inCart ? styles.cartBtnActive : ''}`}
                    onClick={() => toggleCartItem(product)}
                    aria-label={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                    aria-pressed={inCart}
                >
                    <FaShoppingCart />
                </button>
            </div>
        </div>
    );
}
