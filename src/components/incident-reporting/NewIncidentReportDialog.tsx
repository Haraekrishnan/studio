'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const reportSchema = z.object({
  projectId: z.string().min(1, 'Project/Location is required'),
  unitArea: z.string().min(1, 'Unit/Area is required'),
  incidentDetails: z.string().min(1, 'Incident details are required'),
  incidentTime: z.date({ required_error: "Time of incident is required" }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface NewIncidentReportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function NewIncidentReportDialog({ isOpen, setIsOpen }: NewIncidentReportDialogProps) {
  const { user, projects, addIncidentReport } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { 
      incidentTime: new Date(),
      projectId: user?.projectId || '',
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    addIncidentReport({
        ...data,
        incidentTime: data.incidentTime.toISOString(),
    });
    toast({
      title: 'Incident Reported',
      description: 'Your report has been submitted to your supervisor and HSE.',
    });
    setIsOpen(false);
    form.reset();
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset({ incidentTime: new Date(), projectId: user?.projectId || '' });
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report a New Incident</DialogTitle>
          <DialogDescription>Your report will be sent to your supervisor and HSE for review.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project / Location</Label>
                   <Controller
                    control={form.control} name="projectId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select location..."/></SelectTrigger>
                          <SelectContent>
                              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.projectId && <p className="text-xs text-destructive">{form.formState.errors.projectId.message}</p>}
                </div>
                <div>
                  <Label htmlFor="unitArea">Unit / Area of Incident</Label>
                  <Input id="unitArea" {...form.register('unitArea')} placeholder="e.g., Workshop B" />
                  {form.formState.errors.unitArea && <p className="text-xs text-destructive">{form.formState.errors.unitArea.message}</p>}
                </div>
            </div>

             <div>
                <Label>Date & Time of Incident</Label>
                <Controller
                    control={form.control} name="incidentTime"
                    render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP p') : <span>Pick a date and time</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                    </Popover>
                    )}
                />
                 {form.formState.errors.incidentTime && <p className="text-xs text-destructive">{form.formState.errors.incidentTime.message}</p>}
              </div>

            <div>
                <Label htmlFor="incidentDetails">Incident Details</Label>
                <Textarea id="incidentDetails" {...form.register('incidentDetails')} placeholder="Describe what happened in detail..." rows={6} />
                {form.formState.errors.incidentDetails && <p className="text-xs text-destructive">{form.formState.errors.incidentDetails.message}</p>}
            </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
