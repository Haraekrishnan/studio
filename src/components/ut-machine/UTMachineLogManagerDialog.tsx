'use client';
import { useState, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import type { UTMachine } from '@/lib/types';
import AddUTMachineLogDialog from './AddUTMachineLogDialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import UTMachineReportDownloads from './UTMachineReportDownloads';
import { Badge } from '../ui/badge';


interface UTMachineLogManagerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  machine: UTMachine;
}

export default function UTMachineLogManagerDialog({ isOpen, setIsOpen, machine: initialMachine }: UTMachineLogManagerDialogProps) {
  const { user, roles, users, utMachines } = useAppContext();
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>();

  const machine = useMemo(() => utMachines.find(m => m.id === initialMachine.id) || initialMachine, [utMachines, initialMachine]);

  const canManageLogs = useMemo(() => {
    if (!user) return false;
    const userRole = roles.find(r => r.name === user.role);
    return userRole?.permissions.includes('manage_ut_machine_logs');
  }, [user, roles]);
  
  const machineLogs = useMemo(() => {
    return (machine.usageLog || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [machine.usageLog]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Usage Log: {machine.machineName}</DialogTitle>
            <DialogDescription>A complete history of usage for this machine.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className='flex items-center gap-2'>
                    <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn('w-full md:w-[250px] justify-start text-left font-normal', !reportDateRange && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reportDateRange?.from ? (
                              reportDateRange.to ? (
                                <>
                                  {format(reportDateRange.from, 'LLL dd, y')} - {format(reportDateRange.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(reportDateRange.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Filter dates for export...</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="range" selected={reportDateRange} onSelect={setReportDateRange} />
                        </PopoverContent>
                    </Popover>
                    <UTMachineReportDownloads machine={machine} dateRange={reportDateRange} />
                </div>
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
                            <TableHead>Status</TableHead>
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
                                    <TableCell><Badge variant={log.status === 'Active' ? 'secondary' : 'outline'}>{log.status}</Badge></TableCell>
                                    <TableCell>{logger?.name || 'N/A'}</TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">No usage logs recorded.</TableCell>
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
