'use client';
import { useState, useMemo } from 'react';
import type { Task, Priority } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { useAppContext } from '@/context/app-context';
import ReportFilters from '@/components/reports/report-filters';
import ReportResultsTable from '@/components/reports/report-results-table';
import ReportDownloads from '@/components/reports/report-downloads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Filters {
  assigneeId: string;
  status: string;
  priority: string;
  dateRange: DateRange | undefined;
}

export default function ReportsPage() {
  const { tasks, getVisibleUsers } = useAppContext();
  const [filters, setFilters] = useState<Filters>({
    assigneeId: 'all',
    status: 'all',
    priority: 'all',
    dateRange: undefined,
  });

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // First, ensure the task assignee is visible to the current user
      if (!visibleUserIds.includes(task.assigneeId)) {
        return false;
      }

      const { assigneeId, status, priority, dateRange } = filters;
      
      const assigneeMatch = assigneeId === 'all' || task.assigneeId === assigneeId;
      const statusMatch = status === 'all' || task.status === status;
      const priorityMatch = priority === 'all' || task.priority === priority;
      
      let dateMatch = true;
      if (dateRange?.from) {
        const taskDate = new Date(task.dueDate);
        const fromDate = dateRange.from;
        // if `to` is not set, use `from` and check for the whole day
        const toDate = dateRange.to || new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 23, 59, 59);
        dateMatch = taskDate >= fromDate && taskDate <= toDate;
      }

      return assigneeMatch && statusMatch && priorityMatch && dateMatch;
    });
  }, [tasks, filters, visibleUserIds]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
            <p className="text-muted-foreground">Filter tasks to generate a custom report.</p>
        </div>
        <ReportDownloads tasks={filteredTasks} />
      </div>

      <Card>
        <CardContent className="p-4">
          <ReportFilters onApplyFilters={setFilters} initialFilters={filters} />
        </CardContent>
      </Card>
      
      <ReportResultsTable tasks={filteredTasks} />
    </div>
  );
}
