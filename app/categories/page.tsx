'use client';

import { useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useCategories } from '@/hooks/use-Categories';
import { useProducts } from '@/hooks/use-Products';
import ProductCard from '@/components/ProductCard';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(selectedCategory ?? undefined);

  const filterOptions = useMemo(() => {
    if (!categories || categories.length === 0) return ['Todos'];
    return ['Todos', ...categories.map((category) => category.name)];
  }, [categories]);

  const visibleProducts = useMemo(() => {
    if (!products) return products;

    const query = submittedSearch.trim().toLocaleLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      `${product.title} ${product.category}`.toLocaleLowerCase().includes(query),
    );
  }, [products, submittedSearch]);

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        <header className={styles.topbar}>
          <h1 className={styles.title}>Explorar tudo</h1>
        </header>

        <form
          className={styles.toolbar}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedSearch(searchQuery);
          }}
        >
          <label className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
            />
            {(searchQuery || submittedSearch) && (
              <button
                type="button"
                className={styles.clearSearchButton}
                onClick={() => {
                  setSearchQuery('');
                  setSubmittedSearch('');
                }}
                aria-label="Limpar pesquisa"
              >
                <FaTimes />
              </button>
            )}
          </label>
          <button type="submit" className={styles.sortButton}>
            Pesquisar
          </button>
        </form>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <div className={styles.filterBlock}>
              <h2>Categoria</h2>
              <ul className={styles.filterList}>
                {filterOptions.map((option) => {
                  const isActive = option === 'Todos' ? !selectedCategory : categories?.find((category) => category.name === option)?.slug === selectedCategory;

                  return (
                    <li key={option}>
                      <button
                        type="button"
                        className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
                        onClick={() =>
                          option === 'Todos'
                            ? setSelectedCategory(null)
                            : setSelectedCategory(categories?.find((category) => category.name === option)?.slug ?? null)
                        }
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              className={styles.applyButton}
              onClick={() => setSelectedCategory(null)}
            >
              Limpar filtros
            </button>
          </aside>

          <section className={styles.results}>
            <div className={styles.resultsHeader}>
              <span>{visibleProducts?.length ?? 0} resultados encontrados</span>
            </div>

            {categoriesLoading ? (
              <p className={styles.empty}>Carregando categorias...</p>
            ) : categoriesError ? (
              <p className={styles.empty}>Não foi possível carregar as categorias.</p>
            ) : productsLoading ? (
              <p className={styles.empty}>Carregando produtos...</p>
            ) : productsError ? (
              <p className={styles.empty}>Não foi possível carregar os produtos.</p>
            ) : !visibleProducts || visibleProducts.length === 0 ? (
              <p className={styles.empty}>Nenhum produto encontrado.</p>
            ) : (
              <div className={styles.grid}>
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
