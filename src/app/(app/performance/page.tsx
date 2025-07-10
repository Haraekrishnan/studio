'use client';
import { useState, useMemo, useCallback } from 'react';
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
    const { user, users, tasks, getVisibleUsers } = useAppContext();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [activeFilters, setActiveFilters] = useState({
        userIds: [] as string[],
        dates: undefined as DateRange | undefined,
    });

    const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

    const canCompareEmployees = useMemo(() => {
        if (!user) return false;
        return user.role === 'Admin' || user.role === 'Manager';
    }, [user]);

    const performanceData = useMemo(() => {
        const usersToDisplay = activeFilters.userIds.length > 0 && canCompareEmployees
            ? visibleUsers.filter(u => activeFilters.userIds.includes(u.id))
            : visibleUsers;

        const tasksToConsider = activeFilters.dates?.from
            ? tasks.filter(t => t.dueDate && isWithinInterval(new Date(t.dueDate), { start: activeFilters.dates!.from!, end: activeFilters.dates.to || activeFilters.dates.from! }))
            : tasks;

        return usersToDisplay.map(u => {
            const userTasks = tasksToConsider.filter(task => task.assigneeId === u.id);
            
            const completed = userTasks.filter(t => t.status === 'Completed').length;
            const inProgress = userTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending Approval').length;
            const todo = userTasks.filter(t => t.status === 'To Do').length;
            const overdue = userTasks.filter(t => t.status === 'Overdue').length;

            return { 
                name: u.name, 
                ...u,
                completed,
                inProgress,
                todo,
                overdue,
                total: userTasks.length
            };
        });
    }, [visibleUsers, tasks, activeFilters, canCompareEmployees]);

    const handleApplyFilters = useCallback(() => {
        setActiveFilters({ userIds: selectedUserIds, dates: dateRange });
    }, [selectedUserIds, dateRange]);

    const handleClearFilters = useCallback(() => {
        setSelectedUserIds([]);
        setDateRange(undefined);
        setActiveFilters({ userIds: [], dates: undefined });
    }, []);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
                <p className="text-muted-foreground">Review individual and team performance metrics.</p>
            </div>
            
            <PerformanceFilters 
                users={visibleUsers}
                selectedUserIds={selectedUserIds}
                onUserChange={setSelectedUserIds}
                dateRange={dateRange}
                onDateChange={setDateRange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                canCompareEmployees={canCompareEmployees}
            />

            <Card>
                <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
                   <div>
                     <CardTitle>Task Status Distribution</CardTitle>
                     <CardDescription>A column chart showing workload and status for selected employees.</CardDescription>
                   </div>
                   <PerformanceReportDownloads data={performanceData} />
                </CardHeader>
                <CardContent>
                    <EmployeePerformanceChart data={performanceData} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Employee Statistics</CardTitle>
                    <CardDescription>Review individual statistics and manually assign planning scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployeeStatsTable data={performanceData} />
                </CardContent>
            </Card>
        </div>
    );
}
