'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, GanttChartSquare } from 'lucide-react';

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
                    <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
                    <p className="text-muted-foreground">
                        Track your submitted requests or create a new PPE request.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="https://docs.google.com/forms/d/1gT2AtCHMgCLgLNaYErxKMKju2Z0OCax1UjM40P_EWrQ/viewform" target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            PPE Request Form
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="https://docs.google.com/spreadsheets/d/15p72GMqmomDqE1vuHbE7JwoULRynOZCf7S2WPq9KYUY/edit?gid=589863394#gid=589863394" target="_blank">
                             <GanttChartSquare className="mr-2 h-4 w-4" />
                            View Request Status
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Internal Requests Submitted for Approval ({mySubmittedTasks.length})</CardTitle>
                    <CardDescription>
                        These are your internal requests that are currently awaiting approval.
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
                        <p className="text-muted-foreground text-center py-8">You have no pending internal requests.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
