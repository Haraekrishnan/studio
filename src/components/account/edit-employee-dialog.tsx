'use client';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Role, User } from '@/lib/types';
import { Label } from '../ui/label';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, "Role is required") as z.ZodType<Role>,
  supervisorId: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

export default function EditEmployeeDialog({ isOpen, setIsOpen, user: userToEdit }: EditEmployeeDialogProps) {
  const { user: currentUser, users, roles, updateUser } = useAppContext();
  const { toast } = useToast();
  
  const supervisors = users.filter(u => ['Admin', 'Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE'].includes(u.role));
  const canEditRoles = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const canEditEmail = currentUser?.role === 'Admin';
  const canChangePassword = currentUser?.role === 'Admin';

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (userToEdit && isOpen) {
      form.reset({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        supervisorId: userToEdit.supervisorId || 'unassigned',
        password: '',
      });
    }
  }, [userToEdit, isOpen, form]);

  const onSubmit = (data: EmployeeFormValues) => {
    const finalUserData: User = { ...userToEdit };

    finalUserData.name = data.name;
    finalUserData.email = data.email;
    finalUserData.role = data.role;
    finalUserData.supervisorId = (data.supervisorId === 'unassigned' || !data.supervisorId) ? undefined : data.supervisorId;

    if (data.password) {
        finalUserData.password = data.password;
    }

    updateUser(finalUserData);
    toast({
      title: 'Employee Updated',
      description: `${data.name}'s details have been updated.`,
    });
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update the details for {userToEdit.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} placeholder="Full Name" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} disabled={!canEditEmail} />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          {canChangePassword && (
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" {...form.register('password')} placeholder="Leave blank to keep current" />
              {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
            </div>
          )}

          <div>
            <Label>Role</Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!canEditRoles}>
                  <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Supervisor</Label>
            <Controller
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || 'unassigned'} disabled={!canEditRoles}>
                  <SelectTrigger><SelectValue placeholder="Assign a supervisor" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="unassigned">None</SelectItem>
                      {supervisors.filter(s => s.id !== userToEdit.id).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
