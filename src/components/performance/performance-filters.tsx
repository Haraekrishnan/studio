'use client';
import type { User } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { TransferList } from '@/components/ui/transfer-list';
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
            <CardContent className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <TransferList
                        options={userOptions}
                        selected={selectedUserIds}
                        onChange={onUserChange}
                        availableTitle="Available Employees"
                        selectedTitle="Selected for Comparison"
                    />
                     <div className="flex flex-col gap-4 justify-center">
                        <DateRangePicker
                            date={dateRange}
                            onDateChange={onDateChange}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button onClick={onApply}>Apply Filters</Button>
                            <Button variant="ghost" onClick={onClear}>
                                <X className="mr-2 h-4 w-4" /> Clear All
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
