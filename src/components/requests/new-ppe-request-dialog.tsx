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
  employeeName: z.string().min(1, 'Employee name is required'),
  firstJoiningDate: z.date({ required_error: 'First joining date is required' }),
  rejoiningDate: z.date().optional(),
  plant: z.string().min(1, 'Plant is required'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const plantOptions = ['SEZ', 'DTA', 'MTF', 'JPC', 'SOLAR'];

export default function NewPpeRequestDialog() {
  const { user, createPpeRequestTask } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      employeeName: user?.name || '',
      plant: '',
    },
  });

  const handleGoogleFormRedirect = (data: RequestFormValues) => {
    // IMPORTANT: Replace the placeholder link with your actual Google Form's "viewform" URL.
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScP_p3B4_zR6eKl8gJj7hY_vO-X9CgWbA0nFkLdIeRtOqM_qQ/viewform";
    
    // IMPORTANT: Replace these placeholder entry IDs with the actual ones from your Google Form.
    // To find them, pre-fill your form, get the pre-filled link, and look for the 'entry.xxxx' parameters.
    const entryIds = {
      firstJoiningDate_year: "entry.2066847244_year",
      firstJoiningDate_month: "entry.2066847244_month",
      firstJoiningDate_day: "entry.2066847244_day",
      rejoiningDate_year: "entry.1165345686_year",
      rejoiningDate_month: "entry.1165345686_month",
      rejoiningDate_day: "entry.1165345686_day",
      employeeName: "entry.1759454944",
      plant: "entry.102796122"
    };

    const params = new URLSearchParams();
    params.append(entryIds.employeeName, data.employeeName);
    params.append(entryIds.plant, data.plant);
    if (data.firstJoiningDate) {
      params.append(entryIds.firstJoiningDate_year, format(data.firstJoiningDate, 'yyyy'));
      params.append(entryIds.firstJoiningDate_month, format(data.firstJoiningDate, 'MM'));
      params.append(entryIds.firstJoiningDate_day, format(data.firstJoiningDate, 'dd'));
    }
    if (data.rejoiningDate) {
      params.append(entryIds.rejoiningDate_year, format(data.rejoiningDate, 'yyyy'));
      params.append(entryIds.rejoiningDate_month, format(data.rejoiningDate, 'MM'));
      params.append(entryIds.rejoiningDate_day, format(data.rejoiningDate, 'dd'));
    }
    
    const prefilledUrl = `${googleFormUrl}?${params.toString()}`;
    window.open(prefilledUrl, '_blank');
  };

  const onSubmit = (data: RequestFormValues) => {
    if (!user) return;

    createPpeRequestTask(data);
    handleGoogleFormRedirect(data);
    
    toast({
      title: 'Request Submitted',
      description: `Your PPE request for ${data.employeeName} has been submitted for approval.`,
    });
    setIsOpen(false);
    form.reset({
      employeeName: user?.name || '',
      plant: '',
    });
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
          <DialogTitle>PPE Request Form (Safety Shoes & Coverall)</DialogTitle>
          <DialogDescription>
            This will create an internal request and open a pre-filled Google Form to finalize.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="h-96 w-full p-1">
            <div className="space-y-4 pr-4">
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" {...form.register('employeeName')} placeholder="Enter employee name" />
                {form.formState.errors.employeeName && <p className="text-xs text-destructive">{form.formState.errors.employeeName.message}</p>}
              </div>

              <div>
                <Label>First Joining Date</Label>
                <Controller
                    control={form.control} name="firstJoiningDate"
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
                 {form.formState.errors.firstJoiningDate && <p className="text-xs text-destructive">{form.formState.errors.firstJoiningDate.message}</p>}
              </div>
              
              <div>
                <Label>Rejoining Date (optional)</Label>
                <Controller
                    control={form.control} name="rejoiningDate"
                    render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                    </Popover>
                    )}
                />
              </div>
              
              <div>
                <Label>Plant</Label>
                <Controller control={form.control} name="plant"
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a plant" /></SelectTrigger>
                        <SelectContent>
                            {plantOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    )}
                />
                {form.formState.errors.plant && <p className="text-xs text-destructive">{form.formState.errors.plant.message}</p>}
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
