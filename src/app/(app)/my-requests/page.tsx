'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, GanttChartSquare, PlusCircle } from 'lucide-react';
import NewInternalRequestDialog from '@/components/requests/new-internal-request-dialog';
import InternalRequestTable from '@/components/requests/internal-request-table';

export default function MyRequestsPage() {
    const { user, internalRequests } = useAppContext();
    const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);

    const isApprover = useMemo(() => {
        if (!user) return false;
        return ['Admin', 'Manager', 'Store in Charge', 'Assistant Store Incharge'].includes(user.role);
    }, [user]);

    const visibleRequests = useMemo(() => {
        if (!user) return [];
        if (isApprover) {
            return internalRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return internalRequests.filter(req => req.requesterId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [internalRequests, user, isApprover]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
                    <p className="text-muted-foreground">
                        Track your submitted internal requests or create a new PPE request.
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Internal Store Requests</CardTitle>
                        <CardDescription>
                            {isApprover ? "Review and manage all internal store requests." : "Track your submitted requests."}
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsNewRequestDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </CardHeader>
                <CardContent>
                    <InternalRequestTable requests={visibleRequests} />
                </CardContent>
            </Card>

            <NewInternalRequestDialog isOpen={isNewRequestDialogOpen} setIsOpen={setIsNewRequestDialogOpen} />
        </div>
    );
}
