
'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import type { Driver } from '@/lib/types';
import DriverListTable from '@/components/driver/DriverListTable';
import AddDriverDialog from '@/components/driver/AddDriverDialog';
import { addDays, isBefore, format } from 'date-fns';

export default function DriverListPage() {
    const { user, roles, drivers } = useAppContext();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_vehicles');
    }, [user, roles]);

    const expiringDrivers = useMemo(() => {
        if (!canManage) return [];
        const thirtyDaysFromNow = addDays(new Date(), 30);
        
        return drivers.map(d => {
            const expiringDocs: string[] = [];
            const checkDate = (dateStr: string | undefined, name: string) => {
                if (dateStr && isBefore(new Date(dateStr), thirtyDaysFromNow)) {
                    expiringDocs.push(`${name} on ${format(new Date(dateStr), 'dd-MM-yyyy')}`);
                }
            };
    
            checkDate(d.epExpiry, 'EP');
            checkDate(d.medicalExpiry, 'Medical');
            checkDate(d.safetyExpiry, 'Safety');
            checkDate(d.sdpExpiry, 'SDP');
            checkDate(d.woExpiry, 'WO');
            checkDate(d.labourContractExpiry, 'Labour Contract');
            checkDate(d.wcPolicyExpiry, 'WC Policy');
            
            return { driver: d, expiringDocs };
        }).filter(item => item.expiringDocs.length > 0);
    }, [drivers, canManage]);
    
    if (!canManage) {
        return (
            <Card className="w-full max-w-md mx-auto mt-20">
                <CardHeader className="text-center items-center">
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You do not have permission to manage the driver list.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver List</h1>
                    <p className="text-muted-foreground">Manage driver profiles and documentation.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Driver
                    </Button>
                </div>
            </div>

            {expiringDrivers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Expiring Documents</CardTitle>
                        <CardDescription>The following drivers have documents expiring within the next 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {expiringDrivers.map(item => (
                                <div key={item.driver.id} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                                    <span className="font-semibold">{item.driver.name}</span>: {item.expiringDocs.join(', ')}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Drivers</CardTitle>
                    <CardDescription>A list of all driver profiles in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DriverListTable />
                </CardContent>
            </Card>

            <AddDriverDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
            />
        </div>
    );
}
