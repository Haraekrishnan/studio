'use client';
import { useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import EmployeePerformanceChart from '@/components/performance/performance-chart';
import EmployeeStatsTable from '@/components/performance/employee-stats-table';
import { useAppContext } from '@/context/app-context';
import type { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';
import PerformanceFilters from '@/components/performance/performance-filters';
import PerformanceReportDownloads from '@/components/performance/performance-report-downloads';

export default function PerformancePage() {
    const { users, tasks, getVisibleUsers } = useAppContext();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

    const performanceData = useMemo(() => {
        const usersToDisplay = selectedUserIds.length > 0 
            ? visibleUsers.filter(u => selectedUserIds.includes(u.id))
            : visibleUsers;

        const tasksToConsider = dateRange?.from
            ? tasks.filter(t => t.dueDate && isWithinInterval(new Date(t.dueDate), { start: dateRange.from!, end: dateRange.to || dateRange.from! }))
            : tasks;

        return usersToDisplay.map(user => {
            const userTasks = tasksToConsider.filter(task => task.assigneeId === user.id);
            const completed = userTasks.filter(t => t.status === 'Completed').length;
            const inProgress = userTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending Approval').length;
            const todo = userTasks.filter(t => t.status === 'To Do').length;
            const overdue = userTasks.filter(t => t.status === 'Overdue').length;

            return { 
                name: user.name, 
                ...user,
                completed,
                inProgress,
                todo,
                overdue,
                total: userTasks.length
            };
        });
    }, [visibleUsers, tasks, selectedUserIds, dateRange]);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
                <p className="text-muted-foreground">Review individual and team performance metrics.</p>
            </div>
            
            <Card>
                <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
                   <div>
                     <CardTitle>Filters</CardTitle>
                     <CardDescription>Select users and a date range to analyze performance.</CardDescription>
                   </div>
                   <PerformanceReportDownloads data={performanceData} />
                </CardHeader>
                <CardContent>
                    <PerformanceFilters 
                        users={visibleUsers}
                        selectedUserIds={selectedUserIds}
                        onUserChange={setSelectedUserIds}
                        dateRange={dateRange}
                        onDateChange={setDateRange}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Task Status Distribution</CardTitle>
                    <CardDescription>A column chart showing workload and status for selected employees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployeePerformanceChart data={performanceData} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmployeeStatsTable data={performanceData} />
                </CardContent>
            </Card>
        </div>
    );
}
