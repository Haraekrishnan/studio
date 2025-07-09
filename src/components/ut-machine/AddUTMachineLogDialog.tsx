'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import type { UTMachine } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const logSchema = z.object({
  cableNumber: z.string().min(1, 'Cable number is required'),
  probeNumber: z.string().min(1, 'Probe number is required'),
  areaOfWorking: z.string().min(1, 'Area of working is required'),
  usedBy: z.string().min(1, 'Used by is required'),
  jobDetails: z.string().min(1, 'Job details are required'),
  status: z.enum(['Active', 'IDLE', 'Others']),
  reason: z.string().optional(),
}).refine(data => {
    if (data.status === 'IDLE' || data.status === 'Others') {
        return !!data.reason && data.reason.trim().length > 0;
    }
    return true;
}, {
    message: 'Reason is required for IDLE or Others status.',
    path: ['reason'],
});

type LogFormValues = z.infer<typeof logSchema>;

interface AddUTMachineLogDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  machine: UTMachine;
}

export default function AddUTMachineLogDialog({ isOpen, setIsOpen, machine }: AddUTMachineLogDialogProps) {
  const { addUTMachineLog } = useAppContext();
  const { toast } = useToast();

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { status: 'Active', reason: '' },
  });
  
  const status = form.watch('status');

  const onSubmit = (data: LogFormValues) => {
    addUTMachineLog(machine.id, data);
    toast({ title: 'Log Added', description: `Usage log for ${machine.machineName} has been updated.` });
    setIsOpen(false);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset({ status: 'Active', reason: '' });
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Usage Log for {machine.machineName}</DialogTitle>
          <DialogDescription>SN: {machine.serialNumber}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="h-[60vh] p-1">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Cable No.</Label><Input {...form.register('cableNumber')} />{form.formState.errors.cableNumber && <p className="text-xs text-destructive">{form.formState.errors.cableNumber.message}</p>}</div>
                <div><Label>Probe No.</Label><Input {...form.register('probeNumber')} />{form.formState.errors.probeNumber && <p className="text-xs text-destructive">{form.formState.errors.probeNumber.message}</p>}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Area of Working</Label><Input {...form.register('areaOfWorking')} />{form.formState.errors.areaOfWorking && <p className="text-xs text-destructive">{form.formState.errors.areaOfWorking.message}</p>}</div>
                <div><Label>Used By</Label><Input {...form.register('usedBy')} />{form.formState.errors.usedBy && <p className="text-xs text-destructive">{form.formState.errors.usedBy.message}</p>}</div>
              </div>
              <div><Label>Job Details</Label><Textarea {...form.register('jobDetails')} />{form.formState.errors.jobDetails && <p className="text-xs text-destructive">{form.formState.errors.jobDetails.message}</p>}</div>
              <div>
                <Label>Status</Label>
                <Controller control={form.control} name="status" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="IDLE">IDLE</SelectItem><SelectItem value="Others">Others</SelectItem></SelectContent></Select>)}/>
                {form.formState.errors.status && <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>}
              </div>
               {(status === 'IDLE' || status === 'Others') && (
                <div>
                  <Label>Reason</Label>
                  <Textarea {...form.register('reason')} placeholder="Please provide a reason for IDLE/Others status" />
                  {form.formState.errors.reason && <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>}
                </div>
              )}
              <div><Label>Remarks</Label><Textarea {...form.register('remarks')} /></div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
