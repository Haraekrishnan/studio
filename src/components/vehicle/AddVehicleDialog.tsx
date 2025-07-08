'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { ScrollArea } from '../ui/scroll-area';

const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1),
  vehicleDetails: z.string().min(1),
  seatingCapacity: z.coerce.number().min(1),
  driverName: z.string().min(1),
  vapNumber: z.string().min(1),
  driverLicenseNumber: z.string().min(1),
  driverEpNumber: z.string().min(1),
  driverSdpNumber: z.string().min(1),
  vapValidity: z.date(),
  sdpValidity: z.date(),
  epValidity: z.date(),
  status: z.string().min(1),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface AddVehicleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddVehicleDialog({ isOpen, setIsOpen }: AddVehicleDialogProps) {
  const { addVehicle } = useAppContext();
  const { toast } = useToast();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: 'Operational' },
  });

  const onSubmit = (data: VehicleFormValues) => {
    addVehicle({
      ...data,
      vapValidity: data.vapValidity.toISOString(),
      sdpValidity: data.sdpValidity.toISOString(),
      epValidity: data.epValidity.toISOString(),
    });
    toast({ title: 'Vehicle Added' });
    setIsOpen(false);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset({ status: 'Operational' });
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
            <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Vehicle No.</Label><Input {...form.register('vehicleNumber')} />{form.formState.errors.vehicleNumber && <p className="text-xs text-destructive">{form.formState.errors.vehicleNumber.message}</p>}</div>
                    <div><Label>Seating Capacity</Label><Input type="number" {...form.register('seatingCapacity')} />{form.formState.errors.seatingCapacity && <p className="text-xs text-destructive">{form.formState.errors.seatingCapacity.message}</p>}</div>
                </div>
                <div><Label>Vehicle Details</Label><Input {...form.register('vehicleDetails')} />{form.formState.errors.vehicleDetails && <p className="text-xs text-destructive">{form.formState.errors.vehicleDetails.message}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Driver Name</Label><Input {...form.register('driverName')} />{form.formState.errors.driverName && <p className="text-xs text-destructive">{form.formState.errors.driverName.message}</p>}</div>
                    <div><Label>VAP Number</Label><Input {...form.register('vapNumber')} />{form.formState.errors.vapNumber && <p className="text-xs text-destructive">{form.formState.errors.vapNumber.message}</p>}</div>
                </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div><Label>Driver License No.</Label><Input {...form.register('driverLicenseNumber')} />{form.formState.errors.driverLicenseNumber && <p className="text-xs text-destructive">{form.formState.errors.driverLicenseNumber.message}</p>}</div>
                    <div><Label>Driver EP No.</Label><Input {...form.register('driverEpNumber')} />{form.formState.errors.driverEpNumber && <p className="text-xs text-destructive">{form.formState.errors.driverEpNumber.message}</p>}</div>
                    <div><Label>Driver SDP No.</Label><Input {...form.register('driverSdpNumber')} />{form.formState.errors.driverSdpNumber && <p className="text-xs text-destructive">{form.formState.errors.driverSdpNumber.message}</p>}</div>
                </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div><Label>VAP Validity</Label><Controller control={form.control} name="vapValidity" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'dd-MM-yyyy') : <span>Pick date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>)}/>{form.formState.errors.vapValidity && <p className="text-xs text-destructive">{form.formState.errors.vapValidity.message}</p>}</div>
                    <div><Label>SDP Validity</Label><Controller control={form.control} name="sdpValidity" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'dd-MM-yyyy') : <span>Pick date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>)}/>{form.formState.errors.sdpValidity && <p className="text-xs text-destructive">{form.formState.errors.sdpValidity.message}</p>}</div>
                    <div><Label>EP Validity</Label><Controller control={form.control} name="epValidity" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start', !field.value && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'dd-MM-yyyy') : <span>Pick date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>)}/>{form.formState.errors.epValidity && <p className="text-xs text-destructive">{form.formState.errors.epValidity.message}</p>}</div>
                </div>
                <div><Label>Status</Label><Input {...form.register('status')} />{form.formState.errors.status && <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>}</div>
            </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Add Vehicle</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
