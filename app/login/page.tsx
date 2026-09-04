'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
            <img src="/images/bubble04.png" className={styles.bubble04} alt="" />
            <img src="/images/bubble02.png" className={styles.bubble02} alt="" />
            <img src="/images/bubble01.png" className={styles.bubble01} alt="" />
            <img src="/images/bubble03.png" className={styles.bubble03} alt="" />

            <div className={styles.content}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Login</h1>
                    <p className={styles.subtitle}>
                        Que bom te ver de novo! <span className={styles.heart}>♥</span>
                    </p>
                </div>

                <div className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Usuário"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoCapitalize="none"
                        autoCorrect="off"
                    />

                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <button className={styles.btnEntrar} onClick={handleEntrar} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <Link href="/register" className={styles.btnCancelar}>
                        Não tem conta? Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}