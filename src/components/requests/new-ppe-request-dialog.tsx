'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { PlusCircle, ExternalLink, CalendarIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const requestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Justification is required'),
  department: z.string().min(1, 'Department is required'),
  items: z.string().min(1, 'Please list required items'),
  expectedDate: z.date({ required_error: 'Expected date is required' }),
  priority: z.enum(['High', 'Medium', 'Low']),
  remarks: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function NewPpeRequestDialog() {
  const { user, createPpeRequestTask } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
      department: '',
      items: '',
      priority: 'Medium',
      remarks: '',
    },
  });

  const handleGoogleFormRedirect = (data: RequestFormValues) => {
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeH2T0V1NnZrIs_3e2j6g9n8qI8lP3bV1jV7lB0iX8uOqM_qQ/viewform";
    const params = new URLSearchParams();
    
    // Field IDs from your Google Form
    const nameEntry = "entry.1759454944";
    const titleEntry = "entry.1018919637";
    const descriptionEntry = "entry.1517458215";
    const departmentEntry = "entry.188711421";
    const itemsEntry = "entry.1092873173";
    const dateYearEntry = "entry.2066847244_year";
    const dateMonthEntry = "entry.2066847244_month";
    const dateDayEntry = "entry.2066847244_day";
    const priorityEntry = "entry.102796122";
    const remarksEntry = "entry.1165345686";

    // Pre-fill parameters
    if (user) params.append(nameEntry, user.name);
    params.append(titleEntry, data.title);
    params.append(descriptionEntry, data.description);
    params.append(departmentEntry, data.department);
    params.append(itemsEntry, data.items);
    if (data.expectedDate) {
      params.append(dateYearEntry, format(data.expectedDate, 'yyyy'));
      params.append(dateMonthEntry, format(data.expectedDate, 'MM'));
      params.append(dateDayEntry, format(data.expectedDate, 'dd'));
    }
    params.append(priorityEntry, data.priority);
    if (data.remarks) params.append(remarksEntry, data.remarks);
    
    const prefilledUrl = `${googleFormUrl}?${params.toString()}`;
    window.open(prefilledUrl, '_blank');
  };

  const onSubmit = (data: RequestFormValues) => {
    if (!user) return;

    createPpeRequestTask(data);
    handleGoogleFormRedirect(data);
    
    toast({
      title: 'Request Submitted',
      description: `Your request "${data.title}" has been submitted for approval.`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New PPE Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New PPE Request</DialogTitle>
          <DialogDescription>
            This will create an internal request and open a pre-filled Google Form to finalize.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="h-96 w-full p-1">
            <div className="space-y-4 pr-4">
              <div>
                <Label htmlFor="title">Purpose of Request</Label>
                <Input id="title" {...form.register('title')} placeholder="e.g., Request for new safety helmets" />
                {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...form.register('department')} placeholder="Your department name" />
                {form.formState.errors.department && <p className="text-xs text-destructive">{form.formState.errors.department.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Detailed Justification</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Provide details about the request" />
                {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
              </div>
              <div>
                <Label htmlFor="items">Items Required (Please specify item and quantity)</Label>
                <Textarea id="items" {...form.register('items')} placeholder="e.g., Safety Helmet - 5 pcs, Gloves - 10 pairs" />
                {form.formState.errors.items && <p className="text-xs text-destructive">{form.formState.errors.items.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Date of Delivery</Label>
                    <Controller
                        control={form.control} name="expectedDate"
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
                     {form.formState.errors.expectedDate && <p className="text-xs text-destructive">{form.formState.errors.expectedDate.message}</p>}
                  </div>
                   <div>
                    <Label>Priority</Label>
                    <Controller control={form.control} name="priority"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    </div>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" {...form.register('remarks')} placeholder="Any additional remarks" />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">
              Submit & Open Form
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
