import { LoginForm } from '@/components/auth/login-form';
import { CheckSquare } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-primary p-3 rounded-lg mb-4">
                <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">TaskMaster Pro</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Please select your profile to log in.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
