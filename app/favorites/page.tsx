'use client';

import { useFavorites } from '@/hooks/use-Favorites';
import ProductCard from '@/components/ProductCard';
import styles from './favorites.module.css';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        <h1 className={styles.title}>Favoritos</h1>

        {favorites.length === 0 ? (
          <p className={styles.empty}>Você ainda não tem itens favoritados.</p>
        ) : (
          <div className={styles.grid}>
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
