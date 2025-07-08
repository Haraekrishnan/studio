'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const logSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  countIn: z.coerce.number().min(0, 'Count In must be non-negative'),
  personInName: z.string().optional(),
  countOut: z.coerce.number().min(0, 'Count Out must be non-negative'),
  personOutName: z.string().optional(),
  reason: z.string().min(1, 'Reason is required'),
});

type LogFormValues = z.infer<typeof logSchema>;

interface ManpowerLogDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ManpowerLogDialog({ isOpen, setIsOpen }: ManpowerLogDialogProps) {
  const { user, projects, addManpowerLog } = useAppContext();
  const { toast } = useToast();

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      projectId: user?.projectId || '',
      countIn: 0,
      personInName: '',
      countOut: 0,
      personOutName: '',
      reason: '',
    },
  });
  
  const isSupervisor = user?.role === 'Supervisor' || user?.role === 'Junior Supervisor';

  const onSubmit = (data: LogFormValues) => {
    addManpowerLog(data);
    toast({ title: 'Manpower Logged', description: `Today's manpower count has been updated.` });
    setIsOpen(false);
    form.reset();
  };
  
  const handleOpenChange = (open: boolean) => {
      if (!open) form.reset();
      setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Daily Manpower</DialogTitle>
          <DialogDescription>Update the manpower count for today.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Project / Location</Label>
            <Controller
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isSupervisor && !!user?.projectId}>
                  <SelectTrigger><SelectValue placeholder="Select location..."/></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.projectId && <p className="text-xs text-destructive">{form.formState.errors.projectId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countIn">Manpower In</Label>
              <Input id="countIn" type="number" {...form.register('countIn')} />
              {form.formState.errors.countIn && <p className="text-xs text-destructive">{form.formState.errors.countIn.message}</p>}
            </div>
            <div>
              <Label htmlFor="personInName">Person In Name(s)</Label>
              <Input id="personInName" {...form.register('personInName')} placeholder="e.g., John, Jane" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countOut">Manpower Out</Label>
              <Input id="countOut" type="number" {...form.register('countOut')} />
              {form.formState.errors.countOut && <p className="text-xs text-destructive">{form.formState.errors.countOut.message}</p>}
            </div>
             <div>
              <Label htmlFor="personOutName">Person Out Name(s)</Label>
              <Input id="personOutName" {...form.register('personOutName')} placeholder="e.g., Peter" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea id="reason" {...form.register('reason')} placeholder="e.g., Full attendance, 1 sick leave"/>
            {form.formState.errors.reason && <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Log Count</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
