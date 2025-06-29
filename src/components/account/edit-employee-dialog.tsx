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

const roles: Role[] = ['Admin', 'Manager', 'Supervisor', 'Junior Supervisor', 'Team Member'];

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['Admin', 'Manager', 'Supervisor', 'Junior Supervisor', 'Team Member']),
  supervisorId: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

export default function EditEmployeeDialog({ isOpen, setIsOpen, user: userToEdit }: EditEmployeeDialogProps) {
  const { user: currentUser, users, updateUser } = useAppContext();
  const { toast } = useToast();
  
  const supervisors = users.filter(u => ['Admin', 'Manager', 'Supervisor', 'Junior Supervisor'].includes(u.role));
  const canEditRoles = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (userToEdit && isOpen) {
      form.reset({
        name: userToEdit.name,
        role: userToEdit.role,
        supervisorId: userToEdit.supervisorId || 'unassigned',
      });
    }
  }, [userToEdit, isOpen, form]);

  const onSubmit = (data: EmployeeFormValues) => {
    updateUser({
      ...userToEdit,
      ...data,
      supervisorId: (data.supervisorId === 'unassigned' || !data.supervisorId) ? undefined : data.supervisorId,
    });
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
          <Input {...form.register('name')} placeholder="Full Name" />
          {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={!canEditRoles}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
