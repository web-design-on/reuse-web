'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaApple, FaGoogle, FaRecycle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateUser } from '@/lib/api';
import styles from './login.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleEntrar = async () => {
    if (!userName.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const data = await authenticateUser(userName, senha);
      await signIn(data);
      setUserName('');
      setSenha('');
      router.replace('/profile');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ops... Algo deu errado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandTag}><FaRecycle /> Compre. Venda. Repita.</div>
          <h1 className={styles.brandTitle}>Dê uma segunda <span>chance</span> às coisas.</h1>
          <p className={styles.brandText}>Junte-se a mais de 120 mil pessoas que já escolheram consumir de forma mais inteligente e sustentável.</p>
        </div>

        <div className={styles.stats}>
          <div><strong>120k+</strong><span>Usuários</span></div>
          <div><strong>840t</strong><span>CO₂ economizado</span></div>
          <div><strong>4.9★</strong><span>Avaliação média</span></div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formContent}>
          <div className={styles.headerSection}>
            <h2 className={styles.title}>Bem-vindo de volta!</h2>
            <p className={styles.subtitle}>Novo por aqui? <Link href="/register">Crie sua conta</Link></p>
          </div>

          <div className={styles.form}>
            <label className={styles.field}>
              <span>E-mail</span>
              <input className={styles.input} placeholder="Usuário" value={userName} onChange={(event) => setUserName(event.target.value)} autoCapitalize="none" autoCorrect="off" />
            </label>
            <label className={styles.field}>
              <div className={styles.passwordLabel}><span>Senha</span><button type="button">Esqueceu?</button></div>
              <input className={styles.input} type="password" placeholder="Senha" value={senha} onChange={(event) => setSenha(event.target.value)} />
            </label>
            <button className={styles.btnEntrar} onClick={handleEntrar} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className={styles.divider}><span>ou continue com</span></div>
          <div className={styles.socials}>
            <button type="button"><FaGoogle /> Google</button>
            <button type="button"><FaApple /> Apple</button>
          </div>
        </div>
      </section>
    </div>
  );
}
