'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import ManpowerListTable from '@/components/manpower/ManpowerListTable';
import ManpowerProfileDialog from '@/components/manpower/ManpowerProfileDialog';
import type { ManpowerProfile } from '@/lib/types';
import ManpowerSummary from '@/components/manpower/ManpowerSummary';
import ManpowerFilters, { type ManpowerFilterValues } from '@/components/manpower/ManpowerFilters';
import { isWithinInterval } from 'date-fns';
import ManpowerReportDownloads from '@/components/manpower/ManpowerReportDownloads';

export default function ManpowerListPage() {
    const { user, roles, manpowerProfiles } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<ManpowerProfile | null>(null);
    const [filters, setFilters] = useState<ManpowerFilterValues>({
        status: 'all',
        trade: 'all',
        returnDateRange: undefined,
    });

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_manpower_list');
    }, [user, roles]);
    
    const filteredProfiles = useMemo(() => {
        return manpowerProfiles.filter(profile => {
            const { status, trade, returnDateRange } = filters;
            if (status !== 'all' && profile.status !== status) return false;
            if (trade !== 'all' && profile.trade !== trade) return false;

            if (returnDateRange?.from) {
                const returnDate = profile.rejoinedDate ? new Date(profile.rejoinedDate) : (profile.leaveEndDate ? new Date(profile.leaveEndDate) : null);
                if (!returnDate) return false;

                const from = returnDateRange.from;
                const to = returnDateRange.to || from;
                if (!isWithinInterval(returnDate, { start: from, end: to })) {
                    return false;
                }
            }
            return true;
        });
    }, [manpowerProfiles, filters]);


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
                <div className="flex items-center gap-2">
                    <ManpowerReportDownloads profiles={filteredProfiles} />
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Manpower
                    </Button>
                </div>
            </div>

            <ManpowerSummary />
            
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Filter the list of manpower profiles below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManpowerFilters onApplyFilters={setFilters} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Manpower</CardTitle>
                    <CardDescription>A list of all manpower profiles in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManpowerListTable profiles={filteredProfiles} onEdit={handleEdit} />
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
