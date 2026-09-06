'use client';

import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useCategories } from '@/hooks/use-Categories';
import { useProducts } from '@/hooks/use-Products';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(selectedCategory ?? undefined);

  const selectedCategoryName =
    categories?.find((category) => category.slug === selectedCategory)?.name ?? selectedCategory;

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        {selectedCategory ? (
          <>
            <button type="button" className={styles.back} onClick={() => setSelectedCategory(null)}>
              <FaArrowLeft /> <span>Voltar para Categorias</span>
            </button>
            <h1 className={styles.title}>{selectedCategoryName}</h1>

            {productsLoading ? (
              <p className={styles.empty}>Carregando produtos...</p>
            ) : productsError ? (
              <p className={styles.empty}>Não foi possível carregar os produtos.</p>
            ) : !products || products.length === 0 ? (
              <p className={styles.empty}>Nenhum produto encontrado nesta categoria.</p>
            ) : (
              <div className={styles.grid}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className={styles.title}>Categorias</h1>

            {categoriesLoading ? (
              <p className={styles.empty}>Carregando categorias...</p>
            ) : categoriesError ? (
              <p className={styles.empty}>Não foi possível carregar as categorias.</p>
            ) : !categories || categories.length === 0 ? (
              <p className={styles.empty}>Nenhuma categoria encontrada.</p>
            ) : (
              <div className={styles.categoryList}>
                {categories.map((category) => (
                  <CategoryCard key={category.slug} category={category} onSelect={setSelectedCategory} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
