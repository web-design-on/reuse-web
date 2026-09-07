'use client';

import { useState, type UIEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaHeart, FaInfoCircle, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useProduct } from '@/hooks/use-Product';
import { useFavorites } from '@/hooks/use-Favorites';
import { useCart } from '@/hooks/use-Cart';
import { useAuth } from '@/contexts/AuthContext';
import { PRODUCT_CATEGORY_LABELS, PRODUCT_SELLERS } from '@/lib/types';
import styles from './details.module.css';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCartItem } = useCart();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);

  if (isLoading) {
    return (
      <main className={styles.shell}>
        <p className={styles.status}>Carregando produto...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={styles.shell}>
        <p className={styles.status}>Não foi possível carregar este produto.</p>
        <button type="button" className={styles.backLink} onClick={() => router.back()}>
          <FaArrowLeft /> Voltar
        </button>
      </main>
    );
  }

  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);
  const seller = PRODUCT_SELLERS[product.id % PRODUCT_SELLERS.length];
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category] ?? product.category.replace(/-/g, ' ');
  const dimensionText = product.dimensions
    ? `${Math.round(product.dimensions.width)} x ${Math.round(product.dimensions.height)} x ${Math.round(product.dimensions.depth)}`
    : 'Dimensões indisponíveis';

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  const currentProduct = product;

  function handleToggleFavorite() {
    if (!user) {
      router.push('/login');
      return;
    }
    toggleFavorite(currentProduct);
  }

  function handleToggleCart() {
    if (!user) {
      router.push('/login');
      return;
    }
    toggleCartItem(currentProduct);
  }

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <button type="button" onClick={() => router.back()}>Catálogo</button>
          <span>/</span>
          <span>{categoryLabel}</span>
          <strong>{product.title}</strong>
        </div>

        <div className={styles.detailGrid}>
          <section className={styles.gallery}>
            <div className={styles.imageFrame}>
              <div className={styles.carouselTrack} onScroll={handleScroll}>
                {images.map((img, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={index} src={img} alt={`${product.title} ${index + 1}`} className={styles.carouselImage} />
                ))}
              </div>
              <button
                type="button"
                className={`${styles.imageFavorite} ${favorite ? styles.imageFavoriteActive : ''}`}
                onClick={handleToggleFavorite}
                aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                aria-pressed={favorite}
              >
                {favorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={index} src={img} alt="" className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ''}`} />
                ))}
              </div>
            )}
          </section>

          <section className={styles.content}>
            <div className={styles.categoryRow}>
              <span>{categoryLabel}</span>
              {product.availabilityStatus && <strong>{product.availabilityStatus}</strong>}
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
              {product.stock !== undefined && <span className={styles.stock}>{product.stock} em estoque</span>}
            </div>

            <div className={styles.infoCard}>
              <h2 className={styles.sectionTitle}>Descrição</h2>
              <p className={styles.description}>{product.description}</p>
              {(product.tags ?? []).filter(Boolean).length > 0 && (
                <div className={styles.tags}>
                  {(product.tags ?? []).filter(Boolean).map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
              )}
            </div>

            <div className={styles.infoCard}>
              <div className={styles.cardHeading}>
                <h2 className={styles.sectionTitle}>Vendedor</h2>
                <button type="button" className={styles.infoBtn} onClick={() => setSpecsOpen(true)} aria-label="Ver especificações">
                  <FaInfoCircle />
                </button>
              </div>
              <div className={styles.sellerRow}>
                <img src={seller.avatar} alt={seller.name} className={styles.sellerAvatar} />
                <div>
                  <strong>{seller.name}</strong>
                  <span><FaStar /> {product.rating ?? 'N/A'} · {product.brand ?? 'Marca não informada'}</span>
                </div>
              </div>
            </div>

            <div className={styles.specsPreview}>
              <div><span>Marca</span><strong>{product.brand ?? 'Não informada'}</strong></div>
              <div><span>Disponibilidade</span><strong>{product.availabilityStatus ?? 'Não informada'}</strong></div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={`${styles.cartBtn} ${inCart ? styles.cartBtnActive : ''}`} onClick={handleToggleCart}>
                <FaShoppingCart /> {inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
              </button>
              <button type="button" className={styles.favBtn} onClick={handleToggleFavorite}>
                {favorite ? <FaHeart /> : <FaRegHeart />} {favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              </button>
            </div>
          </section>
        </div>
      </div>

      {specsOpen && (
        <div className={styles.overlay} onClick={() => setSpecsOpen(false)}>
          <div className={styles.sheet} onClick={(event) => event.stopPropagation()}>
            <h2 className={styles.sectionTitle}>Especificações</h2>
            <div className={styles.specsGrid}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Marca</span>
                <span className={styles.specValue}>{product.brand ?? 'Não informada'}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Dimensões</span>
                <span className={styles.specValue}>{dimensionText}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Frete</span>
                <span className={styles.specValue}>{product.shippingInformation ?? 'Pronta entrega'}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Garantia</span>
                <span className={styles.specValue}>{product.warrantyInformation ?? 'Sem garantia'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
