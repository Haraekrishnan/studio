'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { USERS } from '@/lib/mock-data';

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
    setIsAuthLoading(true);
    const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      const { password: _password, ...userToStore } = foundUser;
      sessionStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      router.push('/dashboard');
      setIsAuthLoading(false);
      return true;
    } else {
      console.log('Login failed: Invalid email or password.');
      setIsAuthLoading(false);
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
