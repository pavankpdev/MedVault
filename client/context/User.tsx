import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../Provider/supabase';
import { Session } from '@supabase/supabase-js';
type ContextProps = {
    isAuthenticated: null | boolean;
    session: Session | null;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
    children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
    // user null = loading
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession()
            .then(({data}) => {
                setSession(data.session);
                setIsAuthenticated(data.session ? true : false);
            })


        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`Supabase auth event: ${event}`);
                setSession(session);
                setIsAuthenticated(session ? true : false);
            }
        );
        return () => {
            authListener!.subscription.unsubscribe();
        };
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                session,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };