'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import type { Vehicle } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface VehicleTableProps {
    onEdit: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ onEdit }: VehicleTableProps) {
    const { user, roles, vehicles, deleteVehicle, users, projects } = useAppContext();
    const { toast } = useToast();

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_vehicles');
    }, [user, roles]);
    
    const isDatePast = (date: string) => isPast(new Date(date));

    const handleDelete = (vehicleId: string) => {
        deleteVehicle(vehicleId);
        toast({ variant: 'destructive', title: 'Vehicle Deleted' });
    };

    if (vehicles.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No vehicles found.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Vehicle No.</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>VAP Validity</TableHead>
                    <TableHead>Status</TableHead>
                    {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehicles.map(vehicle => {
                    const supervisor = users.find(u => u.id === vehicle.supervisorId);
                    const project = projects.find(p => p.id === vehicle.projectId);
                    const isOverCapacity = vehicle.currentManpower && vehicle.currentManpower > vehicle.seatingCapacity;
                    return (
                        <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                            <TableCell>{vehicle.driverName}</TableCell>
                            <TableCell className={cn(isOverCapacity && 'text-destructive font-bold')}>
                                {vehicle.currentManpower || 0}/{vehicle.seatingCapacity}
                            </TableCell>
                            <TableCell>{supervisor?.name || 'N/A'}</TableCell>
                            <TableCell>{project?.name || 'N/A'}</TableCell>
                            <TableCell className={cn(isDatePast(vehicle.vapValidity) && 'text-destructive font-bold')}>
                                {format(new Date(vehicle.vapValidity), 'dd-MM-yyyy')}
                            </TableCell>
                            <TableCell><Badge variant={vehicle.status.toLowerCase() !== 'operational' ? 'destructive' : 'secondary'}>{vehicle.status}</Badge></TableCell>
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
                                                <DropdownMenuItem onSelect={() => onEdit(vehicle)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <AlertDialogTrigger asChild><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem></AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action will permanently delete the vehicle record.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(vehicle.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
