import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Get the redirect URL for OAuth
const getRedirectUrl = () => {
  if (Platform.OS === 'web') {
    return window.location.origin;
  }
  return makeRedirectUri({
    scheme: 'splitwise',
    path: 'auth/callback',
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setState(s => ({ ...s, session, user: session?.user ?? null }));
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setState(s => ({ ...s, isLoading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setState(s => ({ ...s, session, user: session.user }));
          await loadProfile(session.user.id);
        } else {
          setState(s => ({ ...s, isLoading: false }));
        }
      } else if (event === 'SIGNED_OUT') {
        setState(s => ({ 
          ...s, 
          session: null,
          user: null,
          profile: null, 
          isLoading: false 
        }));
      } else {
        setState(s => ({ 
          ...s, 
          session, 
          user: session?.user ?? null,
          isLoading: false 
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setState(s => ({ ...s, isLoading: false }));
        return;
      }
      
      setState(s => ({ ...s, profile: data, isLoading: false }));
    } catch (error) {
      console.error('Error loading profile:', error);
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      console.log(email, password, fullName)
      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Load the profile after it's created by the database trigger
      const { data: profile, error: loadError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (loadError) {
        throw new Error('Failed to load profile after creation');
      }

      // Update state with the new user and profile
      setState(s => ({
        ...s,
        user: authData.user,
        profile,
        isLoading: false,
      }));
    } catch (error) {
      setState(s => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setState(s => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl(),
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No URL returned');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        getRedirectUrl()
      );

      if (result.type === 'success') {
        const { url } = result;
        await supabase.auth.setSession({
          access_token: url.split('access_token=')[1].split('&')[0],
          refresh_token: url.split('refresh_token=')[1].split('&')[0],
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getRedirectUrl(),
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No URL returned');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        getRedirectUrl()
      );

      if (result.type === 'success') {
        const { url } = result;
        await supabase.auth.setSession({
          access_token: url.split('access_token=')[1].split('&')[0],
          refresh_token: url.split('refresh_token=')[1].split('&')[0],
        });
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setState(s => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user?.id)
        .select()
        .single();

      if (error) throw error;
      setState(s => ({ ...s, profile: data }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}