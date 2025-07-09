'use client';
import { useState, useMemo } from 'react';
import type { ManagementRequest, ManagementRequestStatus } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, CircleAlert } from 'lucide-react';
import EditManagementRequestDialog from './EditManagementRequestDialog';
import { cn } from '@/lib/utils';

interface ManagementRequestTableProps {
  requests: ManagementRequest[];
}

const statusVariant: { [key in ManagementRequestStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'default',
    'Approved': 'secondary',
    'Rejected': 'destructive',
    'In Progress': 'outline'
}

export default function ManagementRequestTable({ requests }: ManagementRequestTableProps) {
    const { user, users } = useAppContext();
    const [selectedRequest, setSelectedRequest] = useState<ManagementRequest | null>(null);

    const handleViewClick = (request: ManagementRequest) => {
        setSelectedRequest(request);
    };

    if (requests.length === 0) {
        return (
            <Card className="flex items-center justify-center h-48 border-dashed">
                <p className="text-muted-foreground">You have no management requests.</p>
            </Card>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>From/To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests.map(request => {
                    const isRequester = user?.id === request.requesterId;
                    const otherParty = isRequester ? users.find(u => u.id === request.recipientId) : users.find(u => u.id === request.requesterId);
                    const direction = isRequester ? 'To' : 'From';
                    
                    const isUnread = isRequester ? !request.isViewedByRequester : (user?.id === request.recipientId ? !request.isViewedByRecipient : false);
                    
                    return (
                    <TableRow key={request.id} className={cn(isUnread && 'bg-blue-50 dark:bg-blue-900/20')}>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{direction}:</span>
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={otherParty?.avatar} />
                                <AvatarFallback>{otherParty?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{otherParty?.name || 'Unknown'}</span>
                        </div>
                        </TableCell>
                        <TableCell>{request.subject}</TableCell>
                        <TableCell>{format(new Date(request.date), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>
                           <div className='flex items-center gap-2'>
                             <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                             {isUnread && <CircleAlert className="h-4 w-4 text-primary" title="Status has been updated"/>}
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
                <EditManagementRequestDialog 
                    isOpen={!!selectedRequest}
                    setIsOpen={(open) => !open && setSelectedRequest(null)}
                    request={selectedRequest}
                />
            )}
        </>
    );
}
