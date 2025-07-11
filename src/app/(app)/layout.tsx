
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { AppSidebar } from '@/components/shared/app-sidebar';
import Header from '@/components/shared/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAppContext(); // Use the context's loading state
  const router = useRouter();

  useEffect(() => {
    // Only redirect if loading is finished and there's no user
    if (!isLoading && user === null) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // While loading, or if there's no user yet, don't render anything to avoid flashes of content or incorrect redirects.
  if (isLoading || !user) {
    return null;
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
