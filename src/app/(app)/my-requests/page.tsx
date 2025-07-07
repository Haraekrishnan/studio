'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Task } from '@/lib/types';

export default function MyRequestsPage() {
    const { user, users, tasks } = useAppContext();

    const mySubmittedTasks = useMemo(() => {
        if (!user) return [];
        return tasks.filter(task => {
            return task.status === 'Pending Approval' && task.assigneeId === user.id;
        });
    }, [tasks, user]);

    const handleCreatePpeRequest = (task: Task) => {
        // IMPORTANT: Replace this with the actual link to your Google Form
        const googleFormUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/viewform";
        
        // IMPORTANT: Replace these with the actual entry IDs from your Google Form.
        // You can find these by inspecting the form fields in your browser.
        const taskTitleEntryId = "entry.123456789"; // Placeholder for Task Title
        const taskDescriptionEntryId = "entry.987654321"; // Placeholder for Task Description
        const requesterNameEntryId = "entry.555555555"; // Placeholder for Requester Name

        const requester = users.find(u => u.id === task.assigneeId);

        const params = new URLSearchParams();
        params.append(taskTitleEntryId, task.title);
        params.append(taskDescriptionEntryId, task.description);
        if (requester) {
            params.append(requesterNameEntryId, requester.name);
        }
        
        const prefilledUrl = `${googleFormUrl}?${params.toString()}`;
        
        // Open the pre-filled form in a new tab
        window.open(prefilledUrl, '_blank');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Pending Requests</h1>
                <p className="text-muted-foreground">
                    These tasks are awaiting approval. You can create a PPE request from here.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Submitted for Approval ({mySubmittedTasks.length})</CardTitle>
                    <CardDescription>Tasks you have submitted. Click the button to create a linked PPE request in Google Forms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mySubmittedTasks.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mySubmittedTasks.map(task => (
                                <div key={task.id} className="flex flex-col gap-2">
                                    <TaskCard task={task} />
                                    <Button
                                        variant="outline"
                                        onClick={() => handleCreatePpeRequest(task)}
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Create PPE Request
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">You have no tasks awaiting approval.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
