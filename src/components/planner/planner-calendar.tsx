'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isSameDay } from 'date-fns';

export default function PlannerCalendar() {
  const { plannerEvents, users } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const eventDays = useMemo(() => {
    return plannerEvents.map(event => new Date(event.date));
  }, [plannerEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return plannerEvents.filter(event => isSameDay(new Date(event.date), selectedDate));
  }, [plannerEvents, selectedDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardContent className="p-2">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
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
      
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xl font-semibold">
          Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '...'}
        </h2>
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDayEvents.map(event => {
                const creator = users.find(u => u.id === event.creatorId);
                return (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
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
                                <span>Created by {creator?.name}</span>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
          </div>
        ) : (
          <Card className="flex items-center justify-center h-48 border-dashed">
            <p className="text-muted-foreground">No events for this day.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
