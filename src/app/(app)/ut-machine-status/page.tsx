'use client';
import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import UTMachineTable from '@/components/ut-machine/UTMachineTable';
import AddUTMachineDialog from '@/components/ut-machine/AddUTMachineDialog';
import type { UTMachine } from '@/lib/types';
import EditUTMachineDialog from '@/components/ut-machine/EditUTMachineDialog';
import { addDays, isBefore, format, formatDistanceToNow } from 'date-fns';
import UTMachineLogManagerDialog from '@/components/ut-machine/UTMachineLogManagerDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UTMachineStatusPage() {
    const { user, roles, utMachines, users, myFulfilledUTRequests, markUTRequestsAsViewed, acknowledgeFulfilledUTRequest } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLogManagerOpen, setIsLogManagerOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<UTMachine | null>(null);

    useEffect(() => {
        if (user) {
            markUTRequestsAsViewed();
        }
    }, [user, markUTRequestsAsViewed]);

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

            {myFulfilledUTRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Fulfilled Certificate Requests</CardTitle>
                        <CardDescription>Your recent certificate requests have been fulfilled. Please acknowledge them to clear them from this list.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {myFulfilledUTRequests.map(req => {
                            const machine = utMachines.find(m => m.id === req.utMachineId);
                            const lastComment = req.comments?.[0];
                            const fulfiller = users.find(u => u.id === lastComment?.userId);
                            return (
                                <div key={req.id} className="p-3 border rounded-lg bg-muted/50 flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold">{req.requestType} for {machine?.machineName} (SN: {machine?.serialNumber})</p>
                                        <div className="flex items-start gap-2 mt-2">
                                            <Avatar className="h-7 w-7"><AvatarImage src={fulfiller?.avatar} /><AvatarFallback>{fulfiller?.name.charAt(0)}</AvatarFallback></Avatar>
                                            <div className="bg-background p-2 rounded-md w-full text-sm">
                                                <div className="flex justify-between items-baseline"><p className="font-semibold text-xs">{fulfiller?.name}</p><p className="text-xs text-muted-foreground">{lastComment ? formatDistanceToNow(new Date(lastComment.date), { addSuffix: true }) : ''}</p></div>
                                                <p className="text-foreground/80 mt-1">{lastComment?.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => acknowledgeFulfilledUTRequest(req.id)} className="ml-4 shrink-0">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Acknowledge
                                    </Button>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}

            {canManage && expiringMachines.length > 0 && (
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
