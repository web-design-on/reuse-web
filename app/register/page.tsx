'use client';

import { useState } from 'react';
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
        <main className={styles.page}>
            <section className={styles.panel}>
                <aside className={styles.brandColumn}>
                    <div className={styles.brandHeader}>
                        <span className={styles.brandMark}>R</span>
                        <span className={styles.brandText}>ReUse</span>
                    </div>

                    <div className={styles.contentBlock}>
                        <span className={styles.eyebrow}>Compre melhor</span>
                        <h1>Encontre peças que fazem sentido para você.</h1>
                        <p>
                            Uma plataforma para descobrir itens de qualidade, valor real e histórias que continuam valendo a pena.
                        </p>
                    </div>

                    <div className={styles.visual} aria-hidden="true">
                        <div className={styles.visualCardLarge} />
                        <div className={styles.visualCardSmall} />
                        <div className={styles.visualBadge}>+1,2 mil usuários</div>
                    </div>

                    <ul className={styles.featureList}>
                        <li>Itens verificados</li>
                        <li>Ofertas mais inteligentes</li>
                        <li>Conexão com compradores reais</li>
                    </ul>
                </aside>

                <div className={styles.formColumn}>
                    <div className={styles.headerSection}>
                        <span className={styles.eyebrow}>Cadastro</span>
                        <h2 className={styles.title}>Crie sua conta</h2>
                        <p className={styles.subtitle}>Vamos começar sua jornada ReUse.</p>
                    </div>

                    <div className={styles.form}>
                        <label className={styles.field}>
                            <span>Nome completo</span>
                            <input
                                className={styles.input}
                                placeholder="Seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoCapitalize="words"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Usuário</span>
                            <input
                                className={styles.input}
                                placeholder="@seuusuario"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                autoCapitalize="none"
                                autoCorrect="off"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Senha</span>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Confirmar senha</span>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Repita sua senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                        </label>

                        <button className={styles.btnEntrar} onClick={handleCadastrar} disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>

                        <button className={styles.btnCancelar} onClick={handleCancelar}>
                            Já tenho conta
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}