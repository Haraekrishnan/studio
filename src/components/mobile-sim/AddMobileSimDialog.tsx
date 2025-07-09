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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';

const itemSchema = z.object({
  type: z.enum(['Mobile', 'SIM']),
  provider: z.string().min(1, 'Provider is required'),
  number: z.string().min(1, 'Number/ID is required'),
  allottedToUserId: z.string().min(1, 'User is required'),
  allotmentDate: z.date({ required_error: 'Allotment date is required' }),
  projectId: z.string().min(1, 'Project location is required'),
  status: z.enum(['Active', 'Inactive', 'Returned']),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof itemSchema>;

interface AddMobileSimDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddMobileSimDialog({ isOpen, setIsOpen }: AddMobileSimDialogProps) {
  const { projects, users, addMobileSim } = useAppContext();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { type: 'Mobile', status: 'Active' },
  });

  const onSubmit = (data: FormValues) => {
    addMobileSim({
      ...data,
      allotmentDate: data.allotmentDate.toISOString(),
    });
    toast({ title: 'Item Added', description: `${data.type} has been added.` });
    setIsOpen(false);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset({ type: 'Mobile', status: 'Active' });
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Mobile/SIM</DialogTitle>
          <DialogDescription>Fill in the details for the new item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Type</Label><Controller control={form.control} name="type" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Mobile">Mobile</SelectItem><SelectItem value="SIM">SIM</SelectItem></SelectContent></Select>)}/></div>
            <div><Label>Provider</Label><Input {...form.register('provider')} placeholder="e.g., Etisalat, Apple"/>{form.formState.errors.provider && <p className="text-xs text-destructive">{form.formState.errors.provider.message}</p>}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Number / ID</Label><Input {...form.register('number')} placeholder="Phone number or Serial no."/>{form.formState.errors.number && <p className="text-xs text-destructive">{form.formState.errors.number.message}</p>}</div>
            <div><Label>Status</Label><Controller control={form.control} name="status" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Returned">Returned</SelectItem></SelectContent></Select>)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Allotted To</Label><Controller control={form.control} name="allottedToUserId" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select user..."/></SelectTrigger><SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>)}/>{form.formState.errors.allottedToUserId && <p className="text-xs text-destructive">{form.formState.errors.allottedToUserId.message}</p>}</div>
            <div><Label>Project / Location</Label><Controller control={form.control} name="projectId" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select project..."/></SelectTrigger><SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>)}/>{form.formState.errors.projectId && <p className="text-xs text-destructive">{form.formState.errors.projectId.message}</p>}</div>
          </div>
          <div><Label>Allotment Date</Label><Controller control={form.control} name="allotmentDate" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'dd-MM-yyyy') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)}/>{form.formState.errors.allotmentDate && <p className="text-xs text-destructive">{form.formState.errors.allotmentDate.message}</p>}</div>
          <div><Label>Remarks</Label><Textarea {...form.register('remarks')} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
