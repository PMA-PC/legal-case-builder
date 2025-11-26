import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from './services/supabaseService';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email || 'User'
                });
            }
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email || 'User'
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const authValue = useMemo(() => ({ user, setUser, showLogin, setShowLogin, loading }), [user, showLogin, loading]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};
