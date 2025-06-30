'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import type { Filters } from '@/app/(app)/reports/page';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Priority, TaskStatus } from '@/lib/types';

interface ReportFiltersProps {
  onApplyFilters: (filters: Filters) => void;
  initialFilters: Filters;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed', 'Overdue', 'Pending Approval'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export default function ReportFilters({ onApplyFilters, initialFilters }: ReportFiltersProps) {
  const { getVisibleUsers } = useAppContext();
  const visibleUsers = getVisibleUsers();
  const [assigneeId, setAssigneeId] = useState(initialFilters.assigneeId);
  const [status, setStatus] = useState(initialFilters.status);
  const [priority, setPriority] = useState(initialFilters.priority);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);

  const handleApply = () => {
    onApplyFilters({ assigneeId, status, priority, dateRange });
  };

  const handleClear = () => {
    setAssigneeId('all');
    setStatus('all');
    setPriority('all');
    setDateRange(undefined);
    onApplyFilters({
      assigneeId: 'all',
      status: 'all',
      priority: 'all',
      dateRange: undefined,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <Select value={assigneeId} onValueChange={setAssigneeId}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by employee..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {visibleUsers.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by priority..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {priorities.map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full md:w-[300px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2 ml-auto">
        <Button onClick={handleApply}>Apply Filters</Button>
        <Button variant="ghost" onClick={handleClear}>
          <X className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
