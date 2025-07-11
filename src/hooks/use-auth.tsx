'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = () => {
      setIsAuthLoading(true);
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from session storage", error);
        sessionStorage.removeItem('user');
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    
    try {
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`Login failed: No user found for email ${email}`);
        return false;
      }
      
      const foundUserDoc = querySnapshot.docs[0];
      const foundUser = { id: foundUserDoc.id, ...foundUserDoc.data() } as User;
      
      if (foundUser.password === password) {
          const { password: _password, ...userToStore } = foundUser;
          sessionStorage.setItem('user', JSON.stringify(userToStore));
          setUser(userToStore);
          router.push('/dashboard');
          return true;
      } else {
        console.log('Login failed: Password mismatch.');
        return false;
      }
    } catch(e) {
      console.error("Login error:", e);
      return false;
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const value = {
    user,
    isAuthLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
