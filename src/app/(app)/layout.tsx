
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { useAuth } from '@/hooks/use-auth';
import { AppSidebar } from '@/components/shared/app-sidebar';
import Header from '@/components/shared/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const { isDataLoading } = useAppContext();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
        </div>
      </main>
    </div>
  );
}
