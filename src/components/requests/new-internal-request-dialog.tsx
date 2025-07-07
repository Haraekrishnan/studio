'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import type { InternalRequestCategory } from '@/lib/types';

const requestSchema = z.object({
  category: z.enum(['Site Items', 'RA Equipments', 'Stationery', 'Other']),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  location: z.string().min(1, 'Project location/site is required'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface NewInternalRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const categoryOptions: InternalRequestCategory[] = ['Site Items', 'RA Equipments', 'Stationery', 'Other'];

export default function NewInternalRequestDialog({ isOpen, setIsOpen }: NewInternalRequestDialogProps) {
  const { addInternalRequest } = useAppContext();
  const { toast } = useToast();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      description: '',
      quantity: 1,
      location: '',
    },
  });

  const onSubmit = (data: RequestFormValues) => {
    addInternalRequest(data);
    toast({
      title: 'Request Submitted',
      description: 'Your request has been sent to the store for approval.',
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
          <DialogTitle>New Internal Store Request</DialogTitle>
          <DialogDescription>Fill in the details below. Your request will be sent for approval.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div>
                <Label>Category</Label>
                <Controller
                control={form.control} name="category"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                        {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select>
                )}
                />
                {form.formState.errors.category && <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>}
            </div>

            <div>
                <Label htmlFor="description">Item Details / Description</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Provide a detailed description of the item(s) you need." />
                {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" {...form.register('quantity')} />
                    {form.formState.errors.quantity && <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="location">Project / Site Location</Label>
                    <Input id="location" {...form.register('location')} placeholder="e.g., Sharjah Site" />
                    {form.formState.errors.location && <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>}
                </div>
            </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Place Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
