'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { Priority, TaskStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export interface TaskFilters {
  status: string;
  priority: string;
  dateRange: DateRange | undefined;
  showMyTasksOnly: boolean;
}

interface TaskFiltersProps {
  onApplyFilters: (filters: TaskFilters) => void;
  initialFilters: TaskFilters;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export default function TaskFilters({ onApplyFilters, initialFilters }: TaskFiltersProps) {
  const [status, setStatus] = useState(initialFilters.status);
  const [priority, setPriority] = useState(initialFilters.priority);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(initialFilters.showMyTasksOnly);

  const handleApply = () => {
    onApplyFilters({ status, priority, dateRange, showMyTasksOnly });
  };

  const handleClear = () => {
    setStatus('all');
    setPriority('all');
    setDateRange(undefined);
    setShowMyTasksOnly(false);
    onApplyFilters({
      status: 'all',
      priority: 'all',
      dateRange: undefined,
      showMyTasksOnly: false,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
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
                    'w-full md:w-auto justify-start text-left font-normal',
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
                    <span>Filter by due date...</span>
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

            <div className="flex items-center space-x-2">
                <Switch id="my-tasks-only" checked={showMyTasksOnly} onCheckedChange={setShowMyTasksOnly} />
                <Label htmlFor="my-tasks-only">My Tasks Only</Label>
            </div>

            <div className="flex gap-2 ml-auto">
                <Button onClick={handleApply}>Apply</Button>
                <Button variant="ghost" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
