'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { USERS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

async function seedUsers() {
  const response = await fetch('/api/seed', {
    method: 'POST',
  });
  return response.json();
}

export default function SeedAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await seedUsers();
      setResult(res);
      if (res.success) {
        toast({
          title: 'Users Seeded Successfully',
          description: `${res.successCount} users created or updated.`,
        });
      } else {
        throw new Error(res.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Seeding Users',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed Firebase Authentication</CardTitle>
          <CardDescription>
            Click the button to create user accounts in Firebase Authentication based on the initial mock data. This is a one-time setup step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSeed} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create {USERS.length} User Accounts
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md text-sm">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
