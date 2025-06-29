'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { USERS } from '@/lib/mock-data';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LoginForm() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { login } = useAppContext();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      login(selectedUserId);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Card className="bg-card shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-2">
            <label htmlFor="user-select" className="text-sm font-medium text-foreground">
              Select Profile
            </label>
            <Select onValueChange={setSelectedUserId} value={selectedUserId || ''}>
              <SelectTrigger id="user-select" className="w-full">
                <SelectValue placeholder="Choose your profile..." />
              </SelectTrigger>
              <SelectContent>
                {USERS.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button type="submit" className="w-full" disabled={!selectedUserId}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
