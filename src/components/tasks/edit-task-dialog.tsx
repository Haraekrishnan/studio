'use client';
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarIcon, Send } from 'lucide-react';
import type { Task, Priority, TaskStatus, Role } from '@/lib/types';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['To Do', 'In Progress', 'Completed']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Task;
}

const roleHierarchy: Role[] = ['Team Member', 'Junior Supervisor', 'Supervisor', 'Manager', 'Admin'];

export default function EditTaskDialog({ isOpen, setIsOpen, task }: EditTaskDialogProps) {
  const { user, users, updateTask, getVisibleUsers } = useAppContext();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task && isOpen) {
      form.reset({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        status: task.status,
      });
    }
  }, [task, form, isOpen]);

  const allVisibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const assignableUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return allVisibleUsers;
    }
    
    const userRoleIndex = roleHierarchy.indexOf(user.role);

    return allVisibleUsers.filter(assignee => {
      const assigneeRoleIndex = roleHierarchy.indexOf(assignee.role);
      // Allow assigning to self or to roles lower in the hierarchy
      return assignee.id === user.id || assigneeRoleIndex < userRoleIndex;
    });
  }, [user, allVisibleUsers]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    const comment = {
      userId: user.id,
      text: newComment.trim(),
      date: new Date().toISOString(),
    };
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), comment],
    };
    updateTask(updatedTask);
    setNewComment('');
  };

  const onSubmit = (data: TaskFormValues) => {
    updateTask({
      ...task,
      ...data,
      dueDate: data.dueDate.toISOString(),
    });
    toast({
      title: 'Task Updated',
      description: `"${data.title}" has been successfully updated.`,
    });
    setIsOpen(false);
  };
  
  const canReassign = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor' || user?.role === 'Junior Supervisor';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4 overflow-y-auto">
            {/* Left side: Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...form.register('title')} placeholder="Task title" />
              {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea {...form.register('description')} placeholder="Task description" rows={5}/>
              {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div>
              <Label>Assignee</Label>
              <Controller
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!canReassign}>
                      <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                      <SelectContent>
                      {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  )}
              />
              {form.formState.errors.assigneeId && <p className="text-xs text-destructive">{form.formState.errors.assigneeId.message}</p>}
            </div>
            
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Due Date</Label>
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
              </div>

              <div>
                <Label>Priority</Label>
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
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Set status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                  </Select>
                  )}
              />
              {form.formState.errors.status && <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>}
            </div>
            
            <Button type="submit" className="w-full">Save Changes</Button>
            </form>

            {/* Right side: Comments */}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Comments & Activity</h3>
                <Separator />
                <ScrollArea className="flex-1 h-64 pr-4">
                    <div className="space-y-4">
                        {(task.comments || []).map((comment, index) => {
                            const commentUser = users.find(u => u.id === comment.userId);
                            return (
                                <div key={index} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={commentUser?.avatar} />
                                        <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted p-3 rounded-lg w-full">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-sm">{commentUser?.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p>
                                        </div>
                                        <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                        {(task.comments || []).length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-4">No comments yet.</p>
                        )}
                    </div>
                </ScrollArea>
                 <div className="relative">
                    <Textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="pr-12"
                    />
                    <Button 
                        type="button" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
