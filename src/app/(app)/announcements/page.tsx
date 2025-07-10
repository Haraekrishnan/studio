'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
    const { users, approvedAnnouncements } = useAppContext();

    const sortedAnnouncements = useMemo(() => {
        return approvedAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [approvedAnnouncements]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground">Stay updated with the latest company news and notices.</p>
                </div>
            </div>

            {sortedAnnouncements.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-6 pr-4">
                        {sortedAnnouncements.map(announcement => {
                            const creator = users.find(u => u.id === announcement.creatorId);
                            const approver = users.find(u => u.id === announcement.approverId);
                            return (
                                <Card key={announcement.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl flex items-center gap-2">
                                                    <Megaphone className="text-primary"/>
                                                    {announcement.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    Posted {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })} on {format(new Date(announcement.date), 'PPP')}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>By:</span>
                                                <Avatar className="h-6 w-6"><AvatarImage src={creator?.avatar} /><AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback></Avatar>
                                                <span>{creator?.name}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap">{announcement.content}</p>
                                    </CardContent>
                                     {approver && (
                                        <CardContent className="pt-4 text-xs text-muted-foreground">
                                            <Badge variant="secondary">Approved by {approver.name}</Badge>
                                        </CardContent>
                                     )}
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            ) : (
                <Card className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">No announcements at the moment.</p>
                </Card>
            )}
        </div>
    );
}
