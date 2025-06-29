'use client';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import StatCard from '@/components/dashboard/stat-card';
import TasksCompletedChart from '@/components/dashboard/tasks-completed-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, CheckCircle, PlusCircle } from 'lucide-react';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { tasks, users, user } = useAppContext();

  const completedTasks = useMemo(() => tasks.filter(task => task.status === 'Completed').length, [tasks]);
  const tasksPerPerson = useMemo(() => users.length > 0 ? (tasks.length / users.length).toFixed(1) : "0", [tasks, users]);
  
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's a summary of your team's activity.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/reports">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Link>
            </Button>
            {canManageTasks && <CreateTaskDialog />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Tasks Completed" 
          value={completedTasks.toString()} 
          icon={CheckCircle} 
          description="Total tasks marked as done"
        />
        <StatCard 
          title="Avg. Tasks per Person" 
          value={tasksPerPerson} 
          icon={Users} 
          description="Average tasks across all users"
        />
        <StatCard 
          title="Open Tasks" 
          value={tasks.length - completedTasks}
          icon={FileText} 
          description="Tasks currently in-progress or to-do"
        />
      </div>

      <div>
        <Card>
            <CardHeader>
                <CardTitle>Tasks Completed per Month</CardTitle>
            </CardHeader>
            <CardContent>
                <TasksCompletedChart />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
