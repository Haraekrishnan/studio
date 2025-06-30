'use client';
import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import type { Priority, Role } from '@/lib/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  priority: z.enum(['Low', 'Medium', 'High']),
  requiresAttachmentForCompletion: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const roleHierarchy: Record<Role, number> = {
  'Team Member': 0,
  'Junior Supervisor': 1,
  'Junior HSE': 1,
  'Supervisor': 2,
  'HSE': 2,
  'Manager': 3,
  'Admin': 4,
};

export default function CreateTaskDialog() {
  const { user, users, addTask, getVisibleUsers } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      priority: 'Medium',
      requiresAttachmentForCompletion: false,
    },
  });
  
  const allVisibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const assignableUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return allVisibleUsers;
    }
    
    const userRoleLevel = roleHierarchy[user.role];

    return allVisibleUsers.filter(assignee => {
      const assigneeRoleLevel = roleHierarchy[assignee.role];
      // Allow assigning to self or to roles lower in the hierarchy
      return assignee.id === user.id || assigneeRoleLevel < userRoleLevel;
    });
  }, [user, allVisibleUsers]);

  const onSubmit = (data: TaskFormValues) => {
    addTask({
      ...data,
      dueDate: data.dueDate.toISOString(),
      creatorId: user!.id,
    });
    const assignee = users.find(u => u.id === data.assigneeId);
    toast({
      title: 'Task Created',
      description: `"${data.title}" assigned to ${assignee?.name}.`,
    });
    setIsOpen(false);
    form.reset();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Fill in the details below to create and assign a new task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Input {...form.register('title')} placeholder="Task title" />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          
          <Textarea {...form.register('description')} placeholder="Task description" />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          
          <Controller
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                <SelectContent>
                  {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.assigneeId && <p className="text-xs text-destructive">{form.formState.errors.assigneeId.message}</p>}
          
          <Controller
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
              </Popover>
            )}
          />
          {form.formState.errors.dueDate && <p className="text-xs text-destructive">{form.formState.errors.dueDate.message}</p>}

          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.priority && <p className="text-xs text-destructive">{form.formState.errors.priority.message}</p>}
          
          <div className="space-y-3 pt-2">
            <Controller
              control={form.control}
              name="requiresAttachmentForCompletion"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                    <Switch id="requires-attachment" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="requires-attachment">Require file attachment for completion</Label>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
