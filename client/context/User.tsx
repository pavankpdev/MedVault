import React, {createContext, useState, useEffect, useContext} from 'react';
import { supabase } from '../Provider/supabase';
import { Session } from '@supabase/supabase-js';

type IUser = {
    id: string;
    name: string;
    email: string;
    wallet: string;
}
type ContextProps = {
    isAuthenticated: null | boolean;
    session: Session | null;
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
};
const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
    children: React.ReactNode;
}

const useAuth = () => useContext(AuthContext)
const AuthProvider = (props: Props) => {
    // user null = loading
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        supabase.auth.getSession()
            .then(async ({data}) => {
                setSession(data.session);
                setIsAuthenticated(data.session ? true : false);
                const {data: row} = await supabase.from("users").select("*").eq("id", data.session?.user.id).single()
                setUser({
                    email: row.email,
                    id: row.id,
                    name: row.name,
                    wallet: row.wallet
                })
            })


        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
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
                user,
                setUser
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };