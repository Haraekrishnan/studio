'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ChevronDown, Send } from 'lucide-react';
import { Separator } from '../ui/separator';

interface PlannerCalendarProps {
    selectedUserId: string;
}

export default function PlannerCalendar({ selectedUserId }: PlannerCalendarProps) {
  const { users, getExpandedPlannerEvents, addPlannerEventComment, dailyPlannerComments, addDailyPlannerComment } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventComment, setEventComment] = useState('');
  const [dailyComment, setDailyComment] = useState('');
  const [activeCollapsible, setActiveCollapsible] = useState<string | null>(null);

  const expandedEvents = useMemo(() => getExpandedPlannerEvents(currentMonth, selectedUserId), [getExpandedPlannerEvents, currentMonth, selectedUserId]);

  const eventDays = useMemo(() => {
    return expandedEvents.map(event => event.eventDate);
  }, [expandedEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return expandedEvents.filter(event => isSameDay(event.eventDate, selectedDate));
  }, [expandedEvents, selectedDate]);
  
  const handleAddEventComment = (eventId: string) => {
    if (!eventComment.trim()) return;
    addPlannerEventComment(eventId, eventComment);
    setEventComment('');
  };

  const selectedDayComments = useMemo(() => {
    if (!selectedDate) return [];
    const dayKey = format(selectedDate, 'yyyy-MM-dd');
    const dailyEntry = dailyPlannerComments.find(dpc => dpc.day === dayKey && dpc.plannerUserId === selectedUserId);
    return dailyEntry?.comments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  }, [dailyPlannerComments, selectedDate, selectedUserId]);

  const handleAddDailyComment = () => {
    if (!dailyComment.trim() || !selectedDate) return;
    addDailyPlannerComment(selectedUserId, selectedDate, dailyComment);
    setDailyComment('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardContent className="p-0 sm:p-2">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={{ event: eventDays }}
                modifiersStyles={{
                  event: {
                    color: 'hsl(var(--accent-foreground))',
                    backgroundColor: 'hsl(var(--accent))',
                  },
                }}
                className="w-full"
            />
        </CardContent>
      </Card>
      
      <div className="lg:col-span-1">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    Daily Notepad
                </CardTitle>
                <CardDescription>
                    {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : 'Select a date'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((event, index) => {
                                const creator = users.find(u => u.id === event.creatorId);
                                const eventUser = users.find(u => u.id === event.userId);
                                return (
                                    <Collapsible key={`${event.id}-${index}`} open={activeCollapsible === event.id} onOpenChange={(isOpen) => setActiveCollapsible(isOpen ? event.id : null)}>
                                        <Card className="bg-muted/50">
                                            <CollapsibleTrigger className='w-full text-left'>
                                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base">{event.title}</CardTitle>
                                                        <CardDescription>
                                                            <Badge variant="secondary" className="capitalize">{event.frequency}</Badge>
                                                        </CardDescription>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                </CardHeader>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                                    
                                                    <div className="mt-4 pt-4 border-t">
                                                        <h4 className='text-sm font-semibold mb-2'>Event Comments</h4>
                                                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                                            {(event.comments || []).length > 0 ? (event.comments || []).map((comment, idx) => {
                                                                const commentUser = users.find(u => u.id === comment.userId);
                                                                return (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <Avatar className="h-7 w-7"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                                                        <div className="bg-background p-2 rounded-md w-full text-sm">
                                                                            <div className="flex justify-between items-baseline"><p className="font-semibold text-xs">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                                                                            <p className="text-foreground/80 mt-1">{comment.text}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }) : <p className="text-xs text-muted-foreground">No comments on this event.</p>}
                                                        </div>
                                                        <div className="relative mt-3">
                                                            <Textarea value={eventComment} onChange={(e) => setEventComment(e.target.value)} placeholder="Add a comment..." className="pr-12 text-sm"/>
                                                            <Button type="button" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleAddEventComment(event.id)} disabled={!eventComment.trim()}><Send className="h-4 w-4" /></Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <p>For:</p>
                                                        <Avatar className="h-6 w-6"><AvatarImage src={eventUser?.avatar} /><AvatarFallback>{eventUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <span>{eventUser?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <p>By:</p>
                                                        <Avatar className="h-6 w-6"><AvatarImage src={creator?.avatar} /><AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <span>{creator?.name}</span>
                                                    </div>
                                                </CardFooter>
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )
                            })
                        ) : (
                            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">No events scheduled.</p>
                            </div>
                        )}
                    </div>
                    
                    <Separator className="my-4"/>

                    <div>
                        <h3 className="text-sm font-semibold mb-2">Daily Comments</h3>
                        <div className="space-y-3 mb-2">
                            {selectedDayComments.length > 0 ? selectedDayComments.map((comment, idx) => {
                                const commentUser = users.find(u => u.id === comment.userId);
                                return (
                                    <div key={idx} className="flex items-start gap-2">
                                        <Avatar className="h-7 w-7"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div className="bg-muted p-2 rounded-md w-full text-sm">
                                            <div className="flex justify-between items-baseline"><p className="font-semibold text-xs">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                                            <p className="text-foreground/80 mt-1">{comment.text}</p>
                                        </div>
                                    </div>
                                )
                            }) : <p className="text-xs text-muted-foreground">No comments for this day.</p>}
                        </div>
                        <div className="relative">
                            <Textarea value={dailyComment} onChange={(e) => setDailyComment(e.target.value)} placeholder="Add a comment for the day..." className="pr-12 text-sm"/>
                            <Button type="button" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleAddDailyComment} disabled={!dailyComment.trim()}><Send className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
