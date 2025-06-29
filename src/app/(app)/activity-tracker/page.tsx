'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import ActivityLogTable from '@/components/activity-tracker/activity-log-table';

export default function ActivityTrackerPage() {
    const { user, getVisibleUsers, activityLogs } = useAppContext();

    const visibleUserIds = useMemo(() => {
        return getVisibleUsers().map(u => u.id);
    }, [getVisibleUsers]);

    const visibleLogs = useMemo(() => {
        if (!user) return [];
        // For Team Members and Junior Supervisors, they can only see their own logs.
        if (user.role === 'Team Member' || user.role === 'Junior Supervisor') {
            return activityLogs.filter(log => log.userId === user.id);
        }
        // Others can see logs of anyone in their visible user list.
        return activityLogs.filter(log => visibleUserIds.includes(log.userId));
    }, [activityLogs, user, visibleUserIds]);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
                <p className="text-muted-foreground">Review user login sessions and activities.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Session Logs</CardTitle>
                    <CardDescription>A detailed log of user sessions and the actions they performed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ActivityLogTable logs={visibleLogs} />
                </CardContent>
            </Card>
        </div>
    );
}
