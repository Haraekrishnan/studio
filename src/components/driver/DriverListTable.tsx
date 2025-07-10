
'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import type { Driver } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import AddDriverDialog from './AddDriverDialog';

export default function DriverListTable() {
    const { user, roles, drivers, deleteDriver } = useAppContext();
    const { toast } = useToast();
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_vehicles');
    }, [user, roles]);
    
    const isDatePast = (date: string | undefined) => date && isPast(new Date(date));

    const handleDelete = (driverId: string) => {
        deleteDriver(driverId);
        toast({ variant: 'destructive', title: 'Driver Deleted' });
    };
    
    const handleEdit = (driver: Driver) => {
        setSelectedDriver(driver);
    };

    if (drivers.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No drivers found.</p>;
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Driver Name</TableHead>
                        <TableHead>License No.</TableHead>
                        <TableHead>EP Expiry</TableHead>
                        <TableHead>Medical Expiry</TableHead>
                        <TableHead>Safety Expiry</TableHead>
                        {canManage && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drivers.map(driver => (
                        <TableRow key={driver.id}>
                            <TableCell className="font-medium">{driver.name}</TableCell>
                            <TableCell>{driver.licenseNumber}</TableCell>
                            <TableCell className={cn(isDatePast(driver.epExpiry) && 'text-destructive font-bold')}>
                                {driver.epExpiry ? format(new Date(driver.epExpiry), 'dd-MM-yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell className={cn(isDatePast(driver.medicalExpiry) && 'text-destructive font-bold')}>
                                {driver.medicalExpiry ? format(new Date(driver.medicalExpiry), 'dd-MM-yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell className={cn(isDatePast(driver.safetyExpiry) && 'text-destructive font-bold')}>
                                {driver.safetyExpiry ? format(new Date(driver.safetyExpiry), 'dd-MM-yyyy') : 'N/A'}
                            </TableCell>
                            {canManage && (
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleEdit(driver)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <AlertDialogTrigger asChild><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem></AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the driver record.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(driver.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {selectedDriver && (
                <AddDriverDialog 
                    isOpen={!!selectedDriver} 
                    setIsOpen={() => setSelectedDriver(null)} 
                    driver={selectedDriver}
                />
            )}
        </>
    );
}
