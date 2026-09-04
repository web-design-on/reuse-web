'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
}

from 'react';

interface User {
    firstName: string;
    userName?: string;
    image?: string;
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (userData: User)=> Promise<void>;
    signOut: ()=> void;
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
    children
}

: {
    children: ReactNode

}) {
    const [user,
    setUser]=useState<User | null>(null);
    const [loading,
    setLoading]=useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('@reuse_user');
        const timer = window.setTimeout(() => {
            if (stored) {
                try {
                    setUser(JSON.parse(stored) as User);
                } catch {
                    localStorage.removeItem('@reuse_user');
                }
            }
            setLoading(false);
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const signIn=async (userData: User)=> {
        localStorage.setItem('@reuse_user', JSON.stringify(userData));
        setUser(userData);
        window.dispatchEvent(new Event('reuse-session-changed'));
    }

    ;

    const signOut=()=> {
        localStorage.removeItem('@reuse_user');
        setUser(null);
        window.dispatchEvent(new Event('reuse-session-changed'));
    }

    ;

    return (<AuthContext.Provider value= {
                {
                user, loading, signIn, signOut
            }
        }

        > {
            children
        }

        </AuthContext.Provider>);
}

export function useAuth() {
    const context=useContext(AuthContext);
    if ( !context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
}