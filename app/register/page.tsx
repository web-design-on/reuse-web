'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHandshake, FaLeaf, FaPiggyBank } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser } from '@/app/actions/auth';
import styles from './cadastro.module.css';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [userName, setUserName] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { signIn } = useAuth();

    const handleCadastrar = async () => {
        setError('');

        if (!nome.trim() || !userName.trim() || !senha.trim() || !confirmarSenha.trim()) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerUser(nome, userName, senha);
            if (!result.success) {
                setError(result.message);
                return;
            }
            await signIn(result.user);
            router.replace('/');
        } catch {
            setError('Ops... Algo deu errado. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        router.replace('/login');
    };

    return (
        <main className={styles.page}>
            <section className={styles.brandPanel}>
                <div className={styles.brandContent}>
                    <h1>Por que entrar<br />para o <span>ReUse?</span></h1>
                    <p>Comprar de segunda mão é o ato de consumo mais sustentável que existe. E aqui é fácil, seguro e divertido.</p>

                    <div className={styles.benefits}>
                        <div className={styles.benefit}><FaLeaf /><span><strong>Impacto real</strong><small>Cada compra economiza CO₂</small></span></div>
                        <div className={styles.benefit}><FaPiggyBank /><span><strong>Economize</strong><small>Itens até 70% mais baratos</small></span></div>
                        <div className={styles.benefit}><FaHandshake /><span><strong>Comunidade</strong><small>+120k pessoas conscientes</small></span></div>
                    </div>
                </div>
            </section>

            <section className={styles.formPanel}>
                <div className={styles.formContent}>
                    <div className={styles.headerSection}>
                        <h2 className={styles.title}>Crie sua conta</h2>
                        <p className={styles.subtitle}>Já tem uma conta? <button type="button" onClick={handleCancelar}>Faça login</button></p>
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

                        <div className={styles.passwordFields}>
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
                        </div>

                        <label className={styles.terms}>
                            <input type="checkbox" />
                            <span>Li e aceito os <a href="#termos">Termos de Uso</a> e a <a href="#privacidade">Política de Privacidade</a></span>
                        </label>

                        {error && <p className={styles.formError}>{error}</p>}

                        <button className={styles.btnEntrar} onClick={handleCadastrar} disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Criar conta grátis'}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}