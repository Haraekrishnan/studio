'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import UTMachineTable from '@/components/ut-machine/UTMachineTable';
import AddUTMachineDialog from '@/components/ut-machine/AddUTMachineDialog';
import type { UTMachine } from '@/lib/types';
import EditUTMachineDialog from '@/components/ut-machine/EditUTMachineDialog';
import { addDays, isBefore, format } from 'date-fns';
import UTMachineLogManagerDialog from '@/components/ut-machine/UTMachineLogManagerDialog';

export default function UTMachineStatusPage() {
    const { user, roles, utMachines } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLogManagerOpen, setIsLogManagerOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<UTMachine | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_ut_machines');
    }, [user, roles]);

    const expiringMachines = useMemo(() => {
        const thirtyDaysFromNow = addDays(new Date(), 30);
        return utMachines.filter(m => isBefore(new Date(m.calibrationDueDate), thirtyDaysFromNow));
    }, [utMachines]);

    const handleEdit = (machine: UTMachine) => {
        setSelectedMachine(machine);
        setIsEditDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedMachine(null);
        setIsAddDialogOpen(true);
    };

    const handleLogManager = (machine: UTMachine) => {
        setSelectedMachine(machine);
        setIsLogManagerOpen(true);
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

            {expiringMachines.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Expiring Calibrations</CardTitle>
                        <CardDescription>The following machines have calibrations expiring within 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {expiringMachines.map((m, i) => (
                                <div key={i} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                                    <span className="font-semibold">{m.machineName} (SN: {m.serialNumber})</span>: Calibration expires on {format(new Date(m.calibrationDueDate), 'dd-MM-yyyy')}.
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Machine List</CardTitle>
                    <CardDescription>A comprehensive list of all UT machines.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UTMachineTable onEdit={handleEdit} onLogManager={handleLogManager} />
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
            {selectedMachine && (
                <UTMachineLogManagerDialog
                    isOpen={isLogManagerOpen}
                    setIsOpen={setIsLogManagerOpen}
                    machine={selectedMachine}
                />
            )}
        </div>
    );
}
