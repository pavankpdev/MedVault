import React, {createContext, useState, useEffect, useContext} from 'react';
import { supabase } from '../Provider/supabase';
import { Session } from '@supabase/supabase-js';
import {usePathname} from "expo-router";
import {useSecureStorage} from "../hooks/useSecureStorage";

export type IUser = {
    id: string;
    name: string;
    hospital: string;
}
type ContextProps = {
    isAuthenticated: null | boolean;
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<null | boolean>>;
};
const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
    children: React.ReactNode;
}

const useAuth = () => useContext(AuthContext)
const AuthProvider = (props: Props) => {
    // user null = loading
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
    const [user, setUser] = useState<IUser | null>(null)
    const {getItem} = useSecureStorage()

    const path = usePathname()

    useEffect(() => {
        getItem("user").then((user) => {
            const parsedUser = JSON.parse(user || "{}")
            setUser(parsedUser)
        })
    }, [path]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };