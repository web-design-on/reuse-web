'use client';

import { FaTrash } from 'react-icons/fa';
import { useCart } from '@/hooks/use-Cart';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        <h1 className={styles.title}>Meu Carrinho</h1>

        {items.length === 0 ? (
          <p className={styles.empty}>O seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => {
                const image = item.images?.[0] ?? item.thumbnail;
                return (
                  <li key={item.id} className={styles.item}>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={item.title} className={styles.itemImage} />
                    ) : (
                      <div className={styles.itemImagePlaceholder} aria-hidden="true" />
                    )}
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.title}</span>
                      <span className={styles.itemPrice}>R$ {item.price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.itemRemove}
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remover item do carrinho"
                    >
                      <FaTrash />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={styles.total}>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
