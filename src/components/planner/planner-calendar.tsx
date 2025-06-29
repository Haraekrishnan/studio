'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay } from 'date-fns';

export default function PlannerCalendar() {
  const { users, getExpandedPlannerEvents } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const expandedEvents = useMemo(() => getExpandedPlannerEvents(currentMonth), [getExpandedPlannerEvents, currentMonth]);

  const eventDays = useMemo(() => {
    return expandedEvents.map(event => event.eventDate);
  }, [expandedEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return expandedEvents.filter(event => isSameDay(event.eventDate, selectedDate));
  }, [expandedEvents, selectedDate]);

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
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
                <ScrollArea className="h-full pr-4">
                    {selectedDayEvents.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDayEvents.map((event, index) => {
                                const creator = users.find(u => u.id === event.creatorId);
                                return (
                                    <Card key={`${event.id}-${index}`} className="bg-muted/50">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">{event.title}</CardTitle>
                                            <CardDescription>
                                                <Badge variant="secondary" className="capitalize">{event.frequency}</Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={creator?.avatar} />
                                                    <AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{creator?.name}</span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No events for this day.</p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
