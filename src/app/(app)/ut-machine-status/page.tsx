'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import UTMachineTable from '@/components/ut-machine/UTMachineTable';
import AddUTMachineDialog from '@/components/ut-machine/AddUTMachineDialog';
import type { UTMachine } from '@/lib/types';
import EditUTMachineDialog from '@/components/ut-machine/EditUTMachineDialog';

export default function UTMachineStatusPage() {
    const { user, roles } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<UTMachine | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_ut_machines');
    }, [user, roles]);

    const handleEdit = (machine: UTMachine) => {
        setSelectedMachine(machine);
        setIsEditDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedMachine(null);
        setIsAddDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">UT Machine Status</h1>
                    <p className="text-muted-foreground">Manage and track UT machine details and usage.</p>
                </div>
                {canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Machine
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Machine List</CardTitle>
                    <CardDescription>A comprehensive list of all UT machines.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UTMachineTable onEdit={handleEdit} />
                </CardContent>
            </Card>

            <AddUTMachineDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
            {selectedMachine && (
                <EditUTMachineDialog 
                    isOpen={isEditDialogOpen} 
                    setIsOpen={setIsEditDialogOpen} 
                    machine={selectedMachine}
                />
            )}
        </div>
    );
}
