'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemedButton from '@/components/ThemedButton';
import styles from './profile.module.css';

const storiesBase = [
    { id: '1', source: '/images/following1.png', isLive: true },
    { id: '2', source: '/images/following2.png', isLive: false },
    { id: '3', source: '/images/following3.png', isLive: false },
    { id: '4', source: '/images/following04.png', isLive: false },
];

const stories = [...storiesBase, ...storiesBase, ...storiesBase].map((item, index) => ({
    ...item,
    id: `${item.id}-${index}`,
}));

const recentlySeen = [
    { id: '1', image: '/images/seen1.png' },
    { id: '2', image: '/images/seen2.png' },
    { id: '3', image: '/images/seen3.png' },
    { id: '4', image: '/images/seen4.png' },
    { id: '5', image: '/images/seen5.png' },
];

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [activeOrder, setActiveOrder] = useState('pay');

    const storiesListRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (!ref.current) return;
        const amount = 220;
        ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (!user) {
        return null;
    }

    const logoutUserHandler = () => {
        signOut();
        router.replace('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <img
                        src={user?.image || '/images/user.jpg'}
                        className={styles.avatarHeader}
                        alt="Avatar"
                    />

                    <div className={styles.btnActivity}>
                        <span className={styles.btnActivityText}>Meu perfil</span>
                    </div>
                </div>

                <div className={styles.headerIcons}>
                    <button className={styles.iconBtn}>
                        <img src="/images/Vouchers.png" className={styles.iconImg} alt="Vouchers" />
                    </button>

                    <button className={styles.iconBtn} style={{ position: 'relative' }}>
                        <img src="/images/Top Menu.png" className={styles.iconImg} alt="Menu" />
                        <span className={styles.dotBadge} />
                    </button>

                    <button className={styles.iconBtn}>
                        <img src="/images/Settings.png" className={styles.iconImg} alt="Configurações" />
                    </button>
                </div>
            </div>

            <div className={styles.scrollArea}>
                <div className={styles.section}>
                    <h1 className={styles.greeting}>Olá, {user?.firstName}!</h1>
                </div>

                <div className={styles.announcementCard}>
                    <div className={styles.announcementText}>
                        <p className={styles.announcementTitle}>Notificação</p>
                        <p className={styles.announcementBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
                            Maecenas hendrerit luctus libero ac vulputate.
                        </p>
                    </div>
                    <button className={styles.announcementArrow}>
                        <span className={styles.arrowText}>→</span>
                    </button>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Visto recentemente</h2>
                    <div className={styles.horizontalList}>
                        {recentlySeen.map((item) => (
                            <div key={item.id} className={styles.recentAvatarContainer}>
                                <img src={item.image} className={styles.recentAvatar} alt="Produto visto recentemente" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Meus pedidos</h2>
                    <div className={styles.ordersRow}>
                        <button className={styles.orderBtn} onClick={() => setActiveOrder('pay')}>
                            A pagar
                        </button>

                        <div style={{ position: 'relative' }}>
                            <button className={styles.orderBtn} onClick={() => setActiveOrder('receive')}>
                                A receber
                            </button>
                            <span className={styles.orderDot} />
                        </div>

                        <button className={styles.orderBtn} onClick={() => setActiveOrder('review')}>
                            A avaliar
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Seguindo</h2>
                    <div className={styles.carouselWrapper}>
                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                            onClick={() => scroll(storiesListRef, 'left')}
                            aria-label="Ver anteriores"
                        >
                            ‹
                        </button>

                        <div className={styles.horizontalList} ref={storiesListRef}>
                            {stories.map((item) => (
                                <div key={item.id} className={styles.storyCard}>
                                    <img src={item.source} className={styles.storyThumb} alt="" />
                                    {item.isLive && <span className={styles.liveBadge}>Ao vivo</span>}
                                    {!item.isLive && <span className={styles.playBtn}>▶</span>}
                                </div>
                            ))}
                        </div>

                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                            onClick={() => scroll(storiesListRef, 'right')}
                            aria-label="Ver próximos"
                        >
                            ›
                        </button>
                    </div>

                    <ThemedButton title="Sair" onPress={logoutUserHandler} />
                </div>

                <div style={{ height: 30 }} />
            </div>
        </div>
    );
}