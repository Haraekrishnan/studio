'use client';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import type { Role, User as UserType } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEmployeeDialog from '@/components/account/add-employee-dialog';
import EditEmployeeDialog from '@/components/account/edit-employee-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AccountPage() {
  const { user, users, updateUser, deleteUser, updateProfile } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const directReports = useMemo(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Manager' && user.role !== 'Supervisor')) {
      return [];
    }
    return users.filter(u => u.supervisorId === user.id);
  }, [user, users]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }
  
  const canManageUsers = user.role === 'Admin' || user.role === 'Manager';

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, avatar);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (userToEdit: UserType) => {
    setSelectedUser(userToEdit);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (userId: string) => {
    deleteUser(userId);
    toast({
        variant: 'destructive',
        title: 'User Deleted',
        description: 'The user has been removed from the system.',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
        <p className="text-muted-foreground">View and manage your profile and team details.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar} alt={user.name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleProfileSave}>
            <Card>
                <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Edit your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={`${user.name.toLowerCase().replace(' ', '.')}@taskmaster.pro`} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="avatar-upload">Change Profile Picture</Label>
                    <Input id="avatar-upload" type="file" onChange={handleFileChange} accept="image/*" />
                </div>
                </CardContent>
                <CardFooter>
                <Button type="submit">Save Changes</Button>
                </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      {canManageUsers && (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Add, edit, or remove employees you manage.</CardDescription>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
            </CardHeader>
        </Card>
      )}
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
                            <TableHead className="text-right">Actions</TableHead>
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
                                <TableCell className="text-right">
                                     <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleEditClick(report)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                         <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the user account and unassign all their tasks.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(report.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
      <AddEmployeeDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
      {selectedUser && (
        <EditEmployeeDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} user={selectedUser} />
      )}
    </div>
  );
}
