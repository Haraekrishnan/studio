'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Megaphone, AlertTriangle } from 'lucide-react';

export default function AnnouncementsPage() {
    const { user, roles, announcements, approveAnnouncement, rejectAnnouncement } = useAppContext();

    const canApprove = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('approve_announcements');
    }, [user, roles]);

    const pendingAnnouncements = useMemo(() => {
        if (!canApprove) return [];
        return announcements.filter(a => a.status === 'pending');
    }, [announcements, canApprove]);

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
                        <div className="space-y-4">
                            {pendingAnnouncements.map(announcement => {
                                const creator = announcements.find(u => u.id === announcement.creatorId);
                                return (
                                    <div key={announcement.id} className="border p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{announcement.title}</h3>
                                                <p className="text-sm text-muted-foreground">Submitted by {creator?.name} on {format(new Date(announcement.date), 'PPP')}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => approveAnnouncement(announcement.id)}>Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => rejectAnnouncement(announcement.id)}>Reject</Button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm bg-muted p-2 rounded-md">{announcement.content}</p>
                                    </div>
                                )
                            })}
                        </div>
                     ) : null}
                </CardContent>
            </Card>
        </div>
    );
}
