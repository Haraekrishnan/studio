'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import type { UTMachine } from '@/lib/types';
import AddUTMachineLogDialog from './AddUTMachineLogDialog';

interface UTMachineLogManagerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  machine: UTMachine;
}

export default function UTMachineLogManagerDialog({ isOpen, setIsOpen, machine }: UTMachineLogManagerDialogProps) {
  const { user, roles, users } = useAppContext();
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);

  const canManageLogs = useMemo(() => {
    if (!user) return false;
    const userRole = roles.find(r => r.name === user.role);
    return userRole?.permissions.includes('manage_ut_machine_logs');
  }, [user, roles]);
  
  const machineLogs = machine.usageLog || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Usage Log: {machine.machineName}</DialogTitle>
            <DialogDescription>A complete history of usage for this machine.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
                {canManageLogs && (
                    <Button size="sm" onClick={() => setIsAddLogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Log
                    </Button>
                )}
            </div>
            <ScrollArea className="h-96">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Job Details</TableHead>
                            <TableHead>Used By</TableHead>
                            <TableHead>Logged By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {machineLogs.length > 0 ? machineLogs.map(log => {
                            const logger = users.find(u => u.id === log.loggedBy);
                            return (
                                <TableRow key={log.id}>
                                    <TableCell>{format(new Date(log.date), 'dd-MM-yyyy')}</TableCell>
                                    <TableCell>{log.jobDetails}</TableCell>
                                    <TableCell>{log.usedBy}</TableCell>
                                    <TableCell>{logger?.name || 'N/A'}</TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">No usage logs recorded.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isAddLogOpen && (
        <AddUTMachineLogDialog isOpen={isAddLogOpen} setIsOpen={setIsAddLogOpen} machine={machine} />
      )}
    </>
  );
}
