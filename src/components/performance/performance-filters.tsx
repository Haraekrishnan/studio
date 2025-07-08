'use client';
import type { User } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface PerformanceFiltersProps {
    users: User[];
    selectedUserIds: string[];
    onUserChange: (ids: string[]) => void;
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
}

export default function PerformanceFilters({ users, selectedUserIds, onUserChange, dateRange, onDateChange }: PerformanceFiltersProps) {

    const userOptions = users.map(user => ({
        value: user.id,
        label: user.name,
    }));

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <MultiSelect
                options={userOptions}
                selected={selectedUserIds}
                onChange={onUserChange}
                className="md:w-[300px]"
                placeholder="Select employees to compare..."
            />
            <DateRangePicker
                date={dateRange}
                onDateChange={onDateChange}
            />
        </div>
    );
}
