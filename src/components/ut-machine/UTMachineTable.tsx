'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function UTMachineTable() {
    const { utMachines, projects } = useAppContext();

    const machinesWithProject = useMemo(() => {
        return utMachines.map(machine => ({
            ...machine,
            projectName: projects.find(p => p.id === machine.projectId)?.name || 'N/A'
        }));
    }, [utMachines, projects]);
    
    const isDatePast = (date: string) => isPast(new Date(date));

    if (machinesWithProject.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No UT machines found.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Serial No.</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Calibration Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {machinesWithProject.map(machine => (
                    <TableRow key={machine.id}>
                        <TableCell className="font-medium">{machine.machineName}</TableCell>
                        <TableCell>{machine.serialNumber}</TableCell>
                        <TableCell>{machine.projectName}</TableCell>
                        <TableCell className={cn(isDatePast(machine.calibrationDueDate) && 'text-destructive font-bold')}>
                            {format(new Date(machine.calibrationDueDate), 'dd-MM-yyyy')}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{machine.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Log Usage</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
