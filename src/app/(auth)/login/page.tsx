'use client';
import { LoginForm } from '@/components/auth/login-form';
import { Layers } from 'lucide-react';
import { useAppContext } from '@/context/app-context';

export default function LoginPage() {
  const { appName, appLogo } = useAppContext();

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
            <h1 className="text-3xl font-bold text-foreground text-center">{appName}</h1>
            <p className="text-muted-foreground mt-1 text-center">Welcome back! Please enter your credentials to log in.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
