'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AnnouncementsPage() {
    const { user, users, roles, announcements, approveAnnouncement, rejectAnnouncement } = useAppContext();
    const { toast } = useToast();

    const canApprove = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('approve_announcements');
    }, [user, roles]);

    const pendingAnnouncements = useMemo(() => {
        if (!canApprove) return [];
        return announcements.filter(a => a.status === 'pending');
    }, [announcements, canApprove]);
    
    const handleApprove = (id: string) => {
        approveAnnouncement(id);
        toast({ title: "Announcement Approved" });
    };

    const handleReject = (id: string) => {
        rejectAnnouncement(id);
        toast({ variant: 'destructive', title: "Announcement Rejected" });
    };

    if (!canApprove) {
        return (
             <Card className="w-full max-w-md mx-auto mt-20">
                <CardHeader className="text-center items-center">
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You do not have permission to manage announcements.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcement Approvals</h1>
                    <p className="text-muted-foreground">Review and approve announcements submitted by your team.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Announcements</CardTitle>
                    <CardDescription>
                        {pendingAnnouncements.length > 0 
                            ? "Review the following announcements and approve or reject them."
                            : "There are no announcements awaiting your approval."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     {pendingAnnouncements.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Submitted By</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {pendingAnnouncements.map(announcement => {
                                const creator = users.find(u => u.id === announcement.creatorId);
                                return (
                                    <TableRow key={announcement.id}>
                                        <TableCell>
                                             <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={creator?.avatar}/><AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback></Avatar>
                                                {creator?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{announcement.title}</TableCell>
                                        <TableCell><p className="max-w-xs truncate">{announcement.content}</p></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size="sm" onClick={() => handleApprove(announcement.id)}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(announcement.id)}>Reject</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                     ) : null}
                </CardContent>
            </Card>
        </div>
    );
}
