'use client';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function VehicleTable() {
    const { vehicles } = useAppContext();
    
    const isDatePast = (date: string) => isPast(new Date(date));

    if (vehicles.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No vehicles found.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Vehicle No.</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>VAP Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehicles.map(vehicle => (
                    <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                        <TableCell>{vehicle.driverName}</TableCell>
                        <TableCell className={cn(isDatePast(vehicle.vapValidity) && 'text-destructive font-bold')}>
                            {format(new Date(vehicle.vapValidity), 'dd-MM-yyyy')}
                        </TableCell>
                        <TableCell><Badge variant={vehicle.status.toLowerCase() !== 'operational' ? 'destructive' : 'secondary'}>{vehicle.status}</Badge></TableCell>
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
                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
