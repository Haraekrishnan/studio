'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import NewIncidentReportDialog from '@/components/incident-reporting/NewIncidentReportDialog';
import IncidentListTable from '@/components/incident-reporting/IncidentListTable';

export default function IncidentReportingPage() {
    const { user, roles, incidents } = useAppContext();
    const [isNewReportOpen, setIsNewReportOpen] = useState(false);
    
    const canViewAllIncidents = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('view_all_incidents');
    }, [user, roles]);
    
    const visibleIncidents = useMemo(() => {
        if (!user) return [];
        if (canViewAllIncidents) {
            return incidents;
        }
        return incidents.filter(i => {
            const isReporter = i.reporterId === user.id;
            const isLoopedIn = (i.loopedInUserIds || []).includes(user.id);
            const isPublished = i.isPublished;
            return isReporter || isLoopedIn || isPublished;
        });
    }, [user, incidents, canViewAllIncidents]);

    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incident Reporting</h1>
                    <p className="text-muted-foreground">Report new incidents and track your submissions.</p>
                </div>
                <Button onClick={() => setIsNewReportOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Report New Incident
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Incident Log</CardTitle>
                    <CardDescription>A list of all incidents you have access to.</CardDescription>
                </CardHeader>
                <CardContent>
                    <IncidentListTable incidents={visibleIncidents} />
                </CardContent>
            </Card>
            <NewIncidentReportDialog isOpen={isNewReportOpen} setIsOpen={setIsNewReportOpen} />
        </div>
    );
}
