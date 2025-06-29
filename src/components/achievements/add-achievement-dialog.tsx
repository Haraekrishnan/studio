'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

const achievementSchema = z.object({
  userId: z.string().min(1, 'Please select an employee'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  points: z.coerce.number().min(1, 'Points must be at least 1'),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AddAchievementDialog() {
  const { users, addManualAchievement, getVisibleUsers } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const visibleUsers = getVisibleUsers();

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      userId: '',
      title: '',
      description: '',
      points: 10,
    },
  });

  const onSubmit = (data: AchievementFormValues) => {
    addManualAchievement(data);
    toast({
      title: 'Achievement Awarded',
      description: `You have awarded an achievement to ${users.find(u => u.id === data.userId)?.name}.`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Award
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Achievement</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label>Employee</Label>
            <Controller
              control={form.control}
              name="userId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger>
                  <SelectContent>
                    {visibleUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.userId && <p className="text-xs text-destructive">{form.formState.errors.userId.message}</p>}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} placeholder="e.g., Employee of the Month" />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description / Reason</Label>
            <Textarea id="description" {...form.register('description')} placeholder="Reason for the award" />
            {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="points">Points</Label>
            <Input id="points" type="number" {...form.register('points')} />
            {form.formState.errors.points && <p className="text-xs text-destructive">{form.formState.errors.points.message}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Award Achievement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
