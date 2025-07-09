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
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import type { MobileSim } from '@/lib/types';

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

interface EditMobileSimDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: MobileSim;
}

export default function EditMobileSimDialog({ isOpen, setIsOpen, item }: EditMobileSimDialogProps) {
  const { projects, users, updateMobileSim } = useAppContext();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(itemSchema),
  });
  
  useEffect(() => {
    if (item && isOpen) {
      form.reset({
        ...item,
        allotmentDate: new Date(item.allotmentDate),
      });
    }
  }, [item, isOpen, form]);

  const onSubmit = (data: FormValues) => {
    updateMobileSim({
      ...item,
      ...data,
      allotmentDate: data.allotmentDate.toISOString(),
    });
    toast({ title: 'Item Updated', description: `${data.type} has been updated.` });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Mobile/SIM</DialogTitle>
          <DialogDescription>Update details for {item.number}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Type</Label><Controller control={form.control} name="type" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Mobile">Mobile</SelectItem><SelectItem value="SIM">SIM</SelectItem></SelectContent></Select>)}/></div>
            <div><Label>Provider</Label><Input {...form.register('provider')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Number / ID</Label><Input {...form.register('number')}/></div>
            <div><Label>Status</Label><Controller control={form.control} name="status" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Returned">Returned</SelectItem></SelectContent></Select>)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Allotted To</Label><Controller control={form.control} name="allottedToUserId" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select user..."/></SelectTrigger><SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>)}/></div>
            <div><Label>Project / Location</Label><Controller control={form.control} name="projectId" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select project..."/></SelectTrigger><SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>)}/></div>
          </div>
          <div><Label>Allotment Date</Label><Controller control={form.control} name="allotmentDate" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'dd-MM-yyyy') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)}/></div>
          <div><Label>Remarks</Label><Textarea {...form.register('remarks')} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
