'use client';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import StatCard from '@/components/dashboard/stat-card';
import TasksCompletedChart from '@/components/dashboard/tasks-completed-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, CheckCircle } from 'lucide-react';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import { useMemo } from 'react';
import EmployeePerformanceChart from '@/components/dashboard/employee-performance-chart';

export default function DashboardPage() {
  const { tasks, user, getVisibleUsers } = useAppContext();

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const relevantTasks = useMemo(() => {
    if (!user) return [];
    const visibleUserIds = visibleUsers.map(u => u.id);
    return tasks.filter(task => visibleUserIds.includes(task.assigneeId));
  }, [tasks, user, visibleUsers]);

  const completedTasks = useMemo(() => relevantTasks.filter(task => task.status === 'Completed').length, [relevantTasks]);
  const openTasks = useMemo(() => relevantTasks.length - completedTasks, [relevantTasks, completedTasks]);
  const tasksPerPerson = useMemo(() => visibleUsers.length > 0 ? (relevantTasks.length / visibleUsers.length).toFixed(1) : "0", [relevantTasks, visibleUsers]);
  
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor';

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
          title="Completed Tasks" 
          value={completedTasks.toString()} 
          icon={CheckCircle} 
          description="Total tasks marked as done"
        />
        <StatCard 
          title="Open Tasks" 
          value={openTasks.toString()}
          icon={FileText} 
          description="Tasks currently in-progress or to-do"
        />
        <StatCard 
          title="Avg. Tasks per Person" 
          value={tasksPerPerson} 
          icon={Users} 
          description="Average tasks across your team"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Tasks Completed per Month</CardTitle>
            </CardHeader>
            <CardContent>
                <TasksCompletedChart />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <EmployeePerformanceChart />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
