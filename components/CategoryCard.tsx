'use client';

import { FaChevronRight } from 'react-icons/fa';
import type { Category } from '@/lib/types';
import styles from './CategoryCard.module.css';

export default function CategoryCard({ category, onSelect }: { category: Category; onSelect: (slug: string) => void }) {
    return (
        <button type="button" className={styles.card} onClick={() => onSelect(category.slug)}>
            {category.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.imageUrl} alt="" className={styles.image} />
            ) : null}
            <span className={styles.label}>{category.name}</span>
            <FaChevronRight className={styles.icon} aria-hidden="true" />
        </button>
    );
}
