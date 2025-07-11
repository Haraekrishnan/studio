'use client';
import { LoginForm } from '@/components/auth/login-form';
import { Layers } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { appName, appLogo, user, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
      if (!isLoading && user) {
          router.replace('/dashboard');
      }
  }, [user, isLoading, router]);

  const nameParts = appName.split(' - ');
  const title = nameParts[0];
  const subtitle = nameParts.length > 1 ? nameParts.slice(1).join(' - ') : null;

  if (isLoading || (!isLoading && user)) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <p>Loading...</p>
          </div>
      );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-blue-100 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-primary p-3 rounded-lg mb-4 shadow-lg flex items-center justify-center">
                {appLogo ? (
                  <img src={appLogo} alt={appName} className="h-8 w-8 object-contain" />
                ) : (
                  <Layers className="h-8 w-8 text-primary-foreground" />
                )}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
            </div>
            <p className="text-muted-foreground mt-2 text-center">Welcome back! Please enter your credentials to log in.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
