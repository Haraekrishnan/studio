'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import ManpowerListTable from '@/components/manpower/ManpowerListTable';
import ManpowerProfileDialog from '@/components/manpower/ManpowerProfileDialog';
import type { ManpowerProfile } from '@/lib/types';

export default function ManpowerListPage() {
    const { user, roles, manpowerProfiles } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<ManpowerProfile | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_manpower_list');
    }, [user, roles]);

    const handleEdit = (profile: ManpowerProfile) => {
        setSelectedProfile(profile);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedProfile(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProfile(null);
    };

    if (!canManage) {
        return (
            <Card className="w-full max-w-md mx-auto mt-20">
                <CardHeader className="text-center items-center">
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You do not have permission to manage the manpower list.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manpower List</h1>
                    <p className="text-muted-foreground">Manage manpower profiles and documentation.</p>
                </div>
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Manpower
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Manpower</CardTitle>
                    <CardDescription>A list of all manpower profiles in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManpowerListTable profiles={manpowerProfiles} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <ManpowerProfileDialog
                isOpen={isDialogOpen}
                setIsOpen={handleCloseDialog}
                profile={selectedProfile}
            />
        </div>
    );
}
