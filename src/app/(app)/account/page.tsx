'use client';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import type { Role } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AccountPage() {
  const { user, users } = useAppContext();

  const directReports = useMemo(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Manager' && user.role !== 'Supervisor')) {
      return [];
    }
    return users.filter(u => u.supervisorId === user.id);
  }, [user, users]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }
  
  const canEditRole = user.role === 'Admin';
  const roles: Role[] = ['Admin', 'Manager', 'Supervisor', 'Team Member'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
        <p className="text-muted-foreground">View and manage your profile details.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <p className="text-sm text-muted-foreground">
                Edit your personal information.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={`${user.name.toLowerCase().replace(' ', '.')}@taskmaster.pro`} disabled />
              </div>
               <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={user.role} disabled={!canEditRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!canEditRole && <p className="text-xs text-muted-foreground pt-1">Contact an admin to change your role.</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      {directReports.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Direct Reports</CardTitle>
                <CardDescription>Employees you directly supervise.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {directReports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={report.avatar} alt={report.name} />
                                            <AvatarFallback>{report.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-medium">{report.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{report.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
