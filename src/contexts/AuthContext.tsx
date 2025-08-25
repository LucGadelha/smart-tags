import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithPin: (username: string, pin: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // Set listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Fetch user profile when session changes
      if (newSession?.user) {
        setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }
      
      if (event === "SIGNED_OUT") {
        setLoading(false);
        setUserProfile(null);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signInWithPin = async (username: string, pin: string) => {
    try {
      const { data, error } = await supabase
        .rpc('authenticate_cook', {
          username_input: username,
          pin_input: pin
        });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return { error: { message: 'Usuário ou PIN incorretos' } };
      }

      // Create a mock session for PIN-based auth
      const mockUser = {
        id: data[0].user_id,
        email: `${username}@pin.local`,
        user_metadata: { username, role: data[0].role }
      };

      setUser(mockUser as any);
      setUserProfile({
        id: data[0].user_id,
        username,
        role: data[0].role,
        organizacao_id: data[0].organization_id
      });
      
      // Store PIN session in localStorage for persistence
      localStorage.setItem('pin_session', JSON.stringify({
        user: mockUser,
        profile: {
          id: data[0].user_id,
          username,
          role: data[0].role,
          organizacao_id: data[0].organization_id
        }
      }));

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    // Clear PIN session if exists
    localStorage.removeItem('pin_session');
    
    const { error } = await supabase.auth.signOut();
    setUserProfile(null);
    return { error };
  };

  // Check for PIN session on mount
  useEffect(() => {
    const pinSession = localStorage.getItem('pin_session');
    if (pinSession && !user) {
      try {
        const { user: sessionUser, profile } = JSON.parse(pinSession);
        setUser(sessionUser);
        setUserProfile(profile);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('pin_session');
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, loading, userProfile, signIn, signInWithPin, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
