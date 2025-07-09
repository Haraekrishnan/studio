'use client';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const requestSchema = z.object({
  recipientId: z.string().min(1, 'Please select a recipient'),
  subject: z.string().min(1, 'Subject is required'),
  details: z.string().min(1, 'Details are required'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface NewManagementRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function NewManagementRequestDialog({ isOpen, setIsOpen }: NewManagementRequestDialogProps) {
  const { user, users, addManagementRequest } = useAppContext();
  const { toast } = useToast();

  const supervisorsAndManagers = useMemo(() => {
    return users.filter(u => ['Admin', 'Manager', 'Supervisor', 'HSE', 'Store in Charge'].includes(u.role) && u.id !== user?.id);
  }, [users, user]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { subject: '', details: '' },
  });

  const onSubmit = (data: RequestFormValues) => {
    addManagementRequest(data);
    toast({
      title: 'Request Submitted',
      description: 'Your request has been sent.',
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Management Request</DialogTitle>
          <DialogDescription>Send a direct request to a supervisor or manager.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div>
                <Label>Recipient</Label>
                <Controller
                    control={form.control} name="recipientId"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select a recipient" /></SelectTrigger>
                            <SelectContent>
                                {supervisorsAndManagers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.recipientId && <p className="text-xs text-destructive">{form.formState.errors.recipientId.message}</p>}
            </div>

            <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...form.register('subject')} placeholder="e.g., Leave Request, Question about Project X" />
                {form.formState.errors.subject && <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>}
            </div>
            
            <div>
                <Label htmlFor="details">Details</Label>
                <Textarea id="details" {...form.register('details')} placeholder="Provide all necessary details for your request." />
                {form.formState.errors.details && <p className="text-xs text-destructive">{form.formState.errors.details.message}</p>}
            </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Send Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
