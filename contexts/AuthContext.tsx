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
    image?: string;
    [key: string]: any;
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

    useEffect(()=> {
            const stored=localStorage.getItem('@reuse_user');
            if (stored) setUser(JSON.parse(stored));
            setLoading(false);
        }

        , []);

    const signIn=async (userData: User)=> {
        localStorage.setItem('@reuse_user', JSON.stringify(userData));
        setUser(userData);
    }

    ;

    const signOut=()=> {
        localStorage.removeItem('@reuse_user');
        setUser(null);
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