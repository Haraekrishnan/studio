'use client';
import { useAppContext } from '@/context/app-context';
import type { UTMachine } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface RequestUTMachineCertificateDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  machine: UTMachine;
}

export default function RequestUTMachineCertificateDialog({ isOpen, setIsOpen, machine }: RequestUTMachineCertificateDialogProps) {
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: 'Request Sent', description: `Your request for the calibration certificate for ${machine.machineName} has been sent.` });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Calibration Certificate</DialogTitle>
          <DialogDescription>
            You are about to request a calibration certificate for {machine.machineName} (SN: {machine.serialNumber}).
            This will notify the relevant personnel.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
