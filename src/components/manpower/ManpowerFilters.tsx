'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { ManpowerProfile, Trade } from '@/lib/types';
import { DateRangePicker } from '../ui/date-range-picker';
import { TRADES } from '@/lib/mock-data';

export interface ManpowerFilterValues {
  status: 'all' | ManpowerProfile['status'];
  trade: 'all' | Trade;
  returnDateRange: DateRange | undefined;
}

interface ManpowerFiltersProps {
  onApplyFilters: (filters: ManpowerFilterValues) => void;
}

const statusOptions: ManpowerProfile['status'][] = ['Working', 'On Leave', 'Resigned', 'Terminated'];

export default function ManpowerFilters({ onApplyFilters }: ManpowerFiltersProps) {
    const [status, setStatus] = useState<ManpowerFilterValues['status']>('all');
    const [trade, setTrade] = useState<ManpowerFilterValues['trade']>('all');
    const [returnDateRange, setReturnDateRange] = useState<DateRange | undefined>();

    const handleApply = () => {
        onApplyFilters({ status, trade, returnDateRange });
    };

    const handleClear = () => {
        setStatus('all');
        setTrade('all');
        setReturnDateRange(undefined);
        onApplyFilters({ status: 'all', trade: 'all', returnDateRange: undefined });
    };

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Select value={status} onValueChange={(v) => setStatus(v as ManpowerFilterValues['status'])}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={trade} onValueChange={(v) => setTrade(v as ManpowerFilterValues['trade'])}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by trade..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Trades</SelectItem>
                    {TRADES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
            
            <DateRangePicker date={returnDateRange} onDateChange={setReturnDateRange} />

            <div className="flex gap-2 ml-auto">
                <Button onClick={handleApply}>Apply</Button>
                <Button variant="ghost" onClick={handleClear}><X className="mr-2 h-4 w-4" /> Clear</Button>
            </div>
        </div>
    );
}
