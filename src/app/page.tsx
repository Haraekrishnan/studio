'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';

export default function RootPage() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isAuthLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p>Loading...</p>
    </div>
  );
}
