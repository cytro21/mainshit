import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
    isLogged: boolean;
    user: User | null;
    profile: any | null;
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
            } else {
                setUser(null);
                setProfile(null);
                setIsLogged(false);
            }
        } catch (error) {
            console.log("Error getting user", error);
            setUser(null);
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
                // Create profile manually (if triggers aren't set up yet)
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            display_name: username,
                            avatar_url: `https://ui-avatars.com/api/?name=${username}`
                        }
                    ]);

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                    // Don't throw here, user is created, just profile might be missing (can retry or use triggers)
                }

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
            setIsLogged(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();

        // Listen for auth changes (like token refresh or sign out from other tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsLogged(true);
            } else {
                setUser(null);
                setIsLogged(false);
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
