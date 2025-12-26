import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface UserCapabilities {
    user_id: string;
    can_sell: boolean;
    can_publish: boolean;
    can_receive_payments: boolean;
}

interface AuthContextType {
    isLogged: boolean;
    user: User | null;
    profile: any | null;
    capabilities: UserCapabilities | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [capabilities, setCapabilities] = useState<UserCapabilities | null>(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                setIsLogged(true);

                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setProfile(profileData);

                // Fetch capabilities
                const { data: capabilitiesData } = await supabase
                    .from('user_capabilities')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                setCapabilities(capabilitiesData);

            } else {
                setUser(null);
                setProfile(null);
                setCapabilities(null);
                setIsLogged(false);
            }
        } catch (error) {
            console.log("Error getting user", error);
            setUser(null);
            setProfile(null);
            setCapabilities(null);
            setIsLogged(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password: pass
            });
            if (error) throw error;
            await getCurrentUser();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, pass: string, username: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password: pass,
                options: {
                    data: {
                        display_name: username, // Stored in auth metadata too
                    }
                }
            });
            if (error) throw error;

            if (data.user) {
                // Triggers handle profile and capabilities creation now
                // We just wait a brief moment or simply log in, expecting the triggers to fire efficiently
                await login(email, pass);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setCapabilities(null);
            setIsLogged(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsLogged(true);
            } else {
                setUser(null);
                setIsLogged(false);
                setProfile(null);
                setCapabilities(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLogged,
                user,
                profile,
                capabilities,
                loading,
                login,
                register,
                logout,
                getCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default GlobalProvider;
