'use client';

import { useState, type UIEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaHeart, FaInfoCircle, FaRegHeart, FaStar } from 'react-icons/fa';
import { useProduct } from '@/hooks/use-Product';
import { useFavorites } from '@/hooks/use-Favorites';
import { useCart } from '@/hooks/use-Cart';
import styles from './details.module.css';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCartItem } = useCart();
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
  const dimensionText = product.dimensions
    ? `${Math.round(product.dimensions.width)} x ${Math.round(product.dimensions.height)} x ${Math.round(product.dimensions.depth)}`
    : 'Dimensões indisponíveis';

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return (
    <main className={styles.shell}>
      <button type="button" className={styles.backLink} onClick={() => router.back()}>
        <FaArrowLeft /> Voltar
      </button>

      <div className={styles.carousel}>
        <div className={styles.carouselTrack} onScroll={handleScroll}>
          {images.map((img, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={index} src={img} alt={`${product.title} ${index + 1}`} className={styles.carouselImage} />
          ))}
        </div>

        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, index) => (
              <span key={index} className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.ratingRow}>
              <FaStar size={14} color="#f1c40f" />
              <span>
                {product.rating ?? 'N/A'} • {product.brand ?? 'Marca não informada'}
              </span>
            </div>
          </div>
          <button type="button" className={styles.infoBtn} onClick={() => setSpecsOpen(true)} aria-label="Ver especificações">
            <FaInfoCircle size={20} />
          </button>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
          <span className={styles.stock}>({product.stock ?? 0} em estoque)</span>
        </div>

        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles.badgeAvailable}`}>
            {product.availabilityStatus ?? 'Estoque não informado'}
          </span>
          {(product.tags ?? []).filter(Boolean).map((tag) => (
            <span key={tag} className={styles.badge}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.divider} />

        <h2 className={styles.sectionTitle}>Descrição</h2>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.favBtn} ${favorite ? styles.favBtnActive : ''}`}
            onClick={() => toggleFavorite(product)}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
          >
            {favorite ? <FaHeart size={22} color="#ff4d4d" /> : <FaRegHeart size={22} />}
          </button>
          <button
            type="button"
            className={`${styles.cartBtn} ${inCart ? styles.cartBtnActive : ''}`}
            onClick={() => toggleCartItem(product)}
          >
            {inCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
          </button>
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
