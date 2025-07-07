'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/lib/types';
import { Label } from '../ui/label';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required') as z.ZodType<Role>,
  supervisorId: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface AddEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddEmployeeDialog({ isOpen, setIsOpen }: AddEmployeeDialogProps) {
  const { users, roles, addUser } = useAppContext();
  const { toast } = useToast();
  
  const supervisors = users.filter(u => ['Admin', 'Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE', 'Store in Charge', 'Assistant Store Incharge'].includes(u.role));

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Team Member',
      supervisorId: '',
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    addUser({
      ...data,
      supervisorId: (data.supervisorId === 'unassigned' || !data.supervisorId) ? undefined : data.supervisorId,
    });
    toast({
      title: 'Employee Added',
      description: `${data.name} has been added to the system.`,
    });
    setIsOpen(false);
    form.reset();
  };
  
  const handleOpenChange = (open: boolean) => {
      if (!open) {
          form.reset();
      }
      setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Fill in the details to add a new member to the team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} placeholder="John Doe" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} placeholder="john.doe@example.com" />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          
          <div>
            <Label>Role</Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger><SelectValue placeholder="Assign a supervisor" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="unassigned">None</SelectItem>
                      {supervisors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
