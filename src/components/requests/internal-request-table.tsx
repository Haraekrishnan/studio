'use client';
import { useState } from 'react';
import type { InternalRequest, InternalRequestStatus } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, CircleAlert } from 'lucide-react';
import EditInternalRequestDialog from './edit-internal-request-dialog';
import { cn } from '@/lib/utils';

interface InternalRequestTableProps {
  requests: InternalRequest[];
}

const statusVariant: { [key in InternalRequestStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'default',
    'Approved': 'secondary',
    'On Hold': 'outline',
    'Allotted': 'secondary',
    'Rejected': 'destructive',
}

export default function InternalRequestTable({ requests }: InternalRequestTableProps) {
    const { user, users } = useAppContext();
    const [selectedRequest, setSelectedRequest] = useState<InternalRequest | null>(null);

    const handleViewClick = (request: InternalRequest) => {
        setSelectedRequest(request);
    };

    if (requests.length === 0) {
        return (
            <Card className="flex items-center justify-center h-48 border-dashed">
                <p className="text-muted-foreground">You have no internal requests.</p>
            </Card>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests.map(request => {
                    const requester = users.find(u => u.id === request.requesterId);
                    const isUnreadUpdate = user?.id === request.requesterId && !request.isViewedByRequester;
                    return (
                    <TableRow key={request.id} className={cn(isUnreadUpdate && 'bg-blue-50 dark:bg-blue-900/20')}>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={requester?.avatar} />
                                <AvatarFallback>{requester?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{requester?.name || 'Unknown'}</span>
                        </div>
                        </TableCell>
                        <TableCell>{request.category}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>{format(new Date(request.date), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>
                           <div className='flex items-center gap-2'>
                             <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                             {isUnreadUpdate && <CircleAlert className="h-4 w-4 text-primary" title="Status has been updated"/>}
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleViewClick(request)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            {selectedRequest && (
                <EditInternalRequestDialog 
                    isOpen={!!selectedRequest}
                    setIsOpen={(open) => !open && setSelectedRequest(null)}
                    request={selectedRequest}
                />
            )}
        </>
    );
}
