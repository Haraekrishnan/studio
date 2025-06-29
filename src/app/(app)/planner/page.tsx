'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import CreateEventDialog from '@/components/planner/create-event-dialog';
import PlannerCalendar from '@/components/planner/planner-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PlannerPage() {
    const { user, getVisibleUsers } = useAppContext();
    const [selectedUserId, setSelectedUserId] = useState<string>(user!.id);
    
    const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers, user]);
    const canViewOthers = visibleUsers.length > 1;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monthly Planner</h1>
                    <p className="text-muted-foreground">Organize your team's schedule and events.</p>
                </div>
                <div className="flex items-center gap-4">
                    {canViewOthers && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="user-select" className="text-sm font-medium">Viewing:</Label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="w-[200px]" id="user-select">
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visibleUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <CreateEventDialog />
                </div>
            </div>
            
            <PlannerCalendar selectedUserId={selectedUserId} />
        </div>
    );
}
