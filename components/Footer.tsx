'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname === '/messages' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.newsletterCopy}>
          <span className={styles.eyebrow}>Faça parte da ReUse</span>
          <h2>Receba novidades que valem a pena.</h2>
          <p>Cadastre seu e-mail e ganhe <strong>R$ 10 OFF</strong> na primeira compra.</p>
        </div>

        {subscribed ? (
          <div className={styles.success}>
            <strong>Inscrição confirmada.</strong>
            <span>Seu cupom de R$ 10 OFF está reservado.</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.srOnly} htmlFor="newsletter-email">Seu melhor e-mail</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
            />
            <button type="submit" aria-label="Inscrever-se na newsletter">
              <span>Quero meu cupom</span>
              <FaArrowRight aria-hidden="true" />
            </button>
          </form>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.brand}>
          <Image src="/brand/logo.png" alt="ReUse" width={106} height={42} />
        </div>
        <p>Compre. Venda. Repita.</p>
        <span className={styles.copyright}>© 2026 ReUse</span>
      </div>
    </footer>
  );
}
