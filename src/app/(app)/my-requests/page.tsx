'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/tasks/task-card';
import NewPpeRequestDialog from '@/components/requests/new-ppe-request-dialog';

export default function MyRequestsPage() {
    const { user, tasks } = useAppContext();

    const mySubmittedTasks = useMemo(() => {
        if (!user) return [];
        return tasks.filter(task => {
            return task.status === 'Pending Approval' && task.assigneeId === user.id;
        });
    }, [tasks, user]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My PPE Requests</h1>
                    <p className="text-muted-foreground">
                        Create new PPE requests or view the status of your existing ones.
                    </p>
                </div>
                <NewPpeRequestDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Submitted for Approval ({mySubmittedTasks.length})</CardTitle>
                    <CardDescription>
                        These are your requests that are currently awaiting approval.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mySubmittedTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mySubmittedTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You have no pending requests.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
