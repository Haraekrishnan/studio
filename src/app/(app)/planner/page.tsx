'use client';
import CreateEventDialog from '@/components/planner/create-event-dialog';
import PlannerCalendar from '@/components/planner/planner-calendar';

export default function PlannerPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monthly Planner</h1>
                    <p className="text-muted-foreground">Organize your team's schedule and events.</p>
                </div>
                <CreateEventDialog />
            </div>
            
            <PlannerCalendar />
        </div>
    );
}
