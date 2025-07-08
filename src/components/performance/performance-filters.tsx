'use client';
import type { User } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface PerformanceFiltersProps {
    users: User[];
    selectedUserIds: string[];
    onUserChange: (ids: string[]) => void;
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
    onApply: () => void;
    onClear: () => void;
}

export default function PerformanceFilters({ 
    users, 
    selectedUserIds, 
    onUserChange, 
    dateRange, 
    onDateChange,
    onApply,
    onClear
}: PerformanceFiltersProps) {

    const userOptions = users.map(user => ({
        value: user.id,
        label: user.name,
    }));

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <MultiSelect
                        options={userOptions}
                        selected={selectedUserIds}
                        onChange={onUserChange}
                        className="w-full md:w-[300px]"
                        placeholder="Select employees to compare..."
                    />
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={onDateChange}
                    />
                    <div className="flex gap-2 ml-auto">
                        <Button onClick={onApply}>Apply</Button>
                        <Button variant="ghost" onClick={onClear}>
                            <X className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
