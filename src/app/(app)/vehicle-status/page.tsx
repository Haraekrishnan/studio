'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import VehicleTable from '@/components/vehicle/VehicleTable';
import AddVehicleDialog from '@/components/vehicle/AddVehicleDialog';
import type { Vehicle } from '@/lib/types';
import EditVehicleDialog from '@/components/vehicle/EditVehicleDialog';
import { addDays, isBefore, format } from 'date-fns';

export default function VehicleStatusPage() {
    const { user, roles, vehicles } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_vehicles');
    }, [user, roles]);

    const expiringVehicles = useMemo(() => {
        const thirtyDaysFromNow = addDays(new Date(), 30);
        return vehicles.filter(v => 
            isBefore(new Date(v.vapValidity), thirtyDaysFromNow) ||
            isBefore(new Date(v.sdpValidity), thirtyDaysFromNow) ||
            isBefore(new Date(v.epValidity), thirtyDaysFromNow)
        );
    }, [vehicles]);

    const handleEdit = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsEditDialogOpen(true);
    };
    
    const handleAdd = () => {
        setSelectedVehicle(null);
        setIsAddDialogOpen(true);
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vehicle Status</h1>
                    <p className="text-muted-foreground">Manage and track vehicle details and driver information.</p>
                </div>
                {canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Vehicle
                    </Button>
                )}
            </div>

            {expiringVehicles.length > 0 && canManage && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Expiring Documents</CardTitle>
                        <CardDescription>The following vehicles have documents expiring within the next 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {expiringVehicles.map((v, i) => (
                                <div key={i} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                                    <span className="font-semibold">{v.vehicleNumber} ({v.driverName})</span>: 
                                    {isBefore(new Date(v.vapValidity), thirtyDaysFromNow) && ` VAP expires ${format(new Date(v.vapValidity), 'dd-MM-yyyy')}. `}
                                    {isBefore(new Date(v.sdpValidity), thirtyDaysFromNow) && ` SDP expires ${format(new Date(v.sdpValidity), 'dd-MM-yyyy')}. `}
                                    {isBefore(new Date(v.epValidity), thirtyDaysFromNow) && ` EP expires ${format(new Date(v.epValidity), 'dd-MM-yyyy')}. `}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <CardDescription>A list of all vehicles in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VehicleTable onEdit={handleEdit} />
                </CardContent>
            </Card>

            <AddVehicleDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
            {selectedVehicle && (
                <EditVehicleDialog 
                    isOpen={isEditDialogOpen} 
                    setIsOpen={setIsEditDialogOpen} 
                    vehicle={selectedVehicle}
                />
            )}
        </div>
    );
}
