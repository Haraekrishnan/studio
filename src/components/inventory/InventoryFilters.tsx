'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { InventoryItemStatus } from '@/lib/types';

interface InventoryFiltersProps {
  onApplyFilters: (filters: { name: string, status: string, projectId: string, search: string }) => void;
}

const statusOptions: {value: InventoryItemStatus | 'Inspection Expired' | 'TP Expired', label: string}[] = [
    { value: 'In Use', label: 'In Use' },
    { value: 'In Store', label: 'In Store' },
    { value: 'Damaged', label: 'Damaged' },
    { value: 'Expired', label: 'Expired (Item)' },
    { value: 'Inspection Expired', label: 'Inspection Expired' },
    { value: 'TP Expired', label: 'TP Expired' },
];

export default function InventoryFilters({ onApplyFilters }: InventoryFiltersProps) {
    const { projects, inventoryItems } = useAppContext();
    const [name, setName] = useState('all');
    const [status, setStatus] = useState('all');
    const [projectId, setProjectId] = useState('all');
    const [search, setSearch] = useState('');

    const itemNames = Array.from(new Set(inventoryItems.map(item => item.name)));

    const handleApply = () => {
        onApplyFilters({ name, status, projectId, search });
    };

    const handleClear = () => {
        setName('all');
        setStatus('all');
        setProjectId('all');
        setSearch('');
        onApplyFilters({ name: 'all', status: 'all', projectId: 'all', search: '' });
    };

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Input 
                placeholder="Search by serial no..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full md:w-auto"
            />
            <Select value={name} onValueChange={setName}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by item..." /></SelectTrigger><SelectContent><SelectItem value="all">All Items</SelectItem>{itemNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by status..." /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
            <Select value={projectId} onValueChange={setProjectId}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by project..." /></SelectTrigger><SelectContent><SelectItem value="all">All Projects</SelectItem>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>

            <div className="flex gap-2 ml-auto">
                <Button onClick={handleApply}>Apply</Button>
                <Button variant="ghost" onClick={handleClear}><X className="mr-2 h-4 w-4" /> Clear</Button>
            </div>
        </div>
    );
}
