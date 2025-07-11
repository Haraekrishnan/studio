
'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { User as AppUser } from '@/lib/types';
import { USERS } from '@/lib/mock-data';

interface AuthContextType {
  user: AppUser | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<AppUser | null>('user', null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Since we're using local storage, we can determine the auth state much faster.
    setIsAuthLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsAuthLoading(true);
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthLoading(false);
      return true;
    }
    
    setIsAuthLoading(false);
    return false;
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    router.replace('/login');
  }, [setUser, router]);

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
