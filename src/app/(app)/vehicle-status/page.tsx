'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import VehicleTable from '@/components/vehicle/VehicleTable';
import AddVehicleDialog from '@/components/vehicle/AddVehicleDialog';
import type { Vehicle } from '@/lib/types';
import EditVehicleDialog from '@/components/vehicle/EditVehicleDialog';

export default function VehicleStatusPage() {
    const { user, roles } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_vehicles');
    }, [user, roles]);

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
