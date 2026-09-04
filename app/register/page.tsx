'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser } from '@/lib/api';
import styles from './cadastro.module.css';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [userName, setUserName] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signIn } = useAuth();

    const handleCadastrar = async () => {
        if (!nome.trim() || !userName.trim() || !senha.trim() || !confirmarSenha.trim()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(nome, userName, senha);
            await signIn(data);
            router.replace('/profile');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Ops... Algo deu errado. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        router.replace('/login');
    };

    return (
        <div className={styles.container}>
            <Image src="/images/bubble04.png" className={styles.bubble04} alt="" width={310} height={310} />
            <Image src="/images/bubble02.png" className={styles.bubble02} alt="" width={310} height={310} />
            <Image src="/images/bubble01.png" className={styles.bubble01} alt="" width={340} height={340} />
            <Image src="/images/bubble03.png" className={styles.bubble03} alt="" width={110} height={110} />

            <div className={styles.content}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Cadastro</h1>
                    <p className={styles.subtitle}>
                        Vamos começar sua jornada! <span className={styles.heart}>♥</span>
                    </p>
                </div>

                <div className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        autoCapitalize="words"
                    />

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

                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />

                    <button className={styles.btnEntrar} onClick={handleCadastrar} disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    <button className={styles.btnCancelar} onClick={handleCancelar}>
                        Já tenho conta
                    </button>
                </div>
            </div>
        </div>
    );
}