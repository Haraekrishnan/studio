'use client';
import { useState, useMemo } from 'react';
import type { Task } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { useAppContext } from '@/context/app-context';
import ReportFilters from '@/components/reports/report-filters';
import ReportResultsTable from '@/components/reports/report-results-table';
import { Card, CardContent } from '@/components/ui/card';

export interface Filters {
  assigneeId: string;
  status: string;
  dateRange: DateRange | undefined;
}

export default function ReportsPage() {
  const { tasks } = useAppContext();
  const [filters, setFilters] = useState<Filters>({
    assigneeId: 'all',
    status: 'all',
    dateRange: undefined,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const { assigneeId, status, dateRange } = filters;
      
      const assigneeMatch = assigneeId === 'all' || task.assigneeId === assigneeId;
      const statusMatch = status === 'all' || task.status === status;
      
      let dateMatch = true;
      if (dateRange?.from && dateRange?.to) {
        const taskDate = new Date(task.dueDate);
        dateMatch = taskDate >= dateRange.from && taskDate <= dateRange.to;
      } else if (dateRange?.from) {
        const taskDate = new Date(task.dueDate);
        dateMatch = taskDate >= dateRange.from;
      }

      return assigneeMatch && statusMatch && dateMatch;
    });
  }, [tasks, filters]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
        <p className="text-muted-foreground">Filter tasks to generate a custom report.</p>
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
