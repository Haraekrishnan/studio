'use client';
import { useMemo } from 'react';
import type { ManpowerProfile } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ManpowerListTableProps {
    profiles: ManpowerProfile[];
    onEdit: (profile: ManpowerProfile) => void;
}

export default function ManpowerListTable({ profiles, onEdit }: ManpowerListTableProps) {
    const getDocumentProgress = (profile: ManpowerProfile) => {
        const totalDocs = profile.documents.length;
        if (totalDocs === 0) return 0;
        const collectedDocs = profile.documents.filter(d => d.status === 'Collected').length;
        return (collectedDocs / totalDocs) * 100;
    };
    
     const getProgressTooltip = (profile: ManpowerProfile) => {
        const collected = profile.documents.filter(d => d.status === 'Collected').map(d => d.name).join(', ');
        const pending = profile.documents.filter(d => d.status === 'Pending').map(d => d.name).join(', ');

        return (
            <div>
                {collected && <p><strong>Collected:</strong> {collected}</p>}
                {pending && <p><strong>Pending:</strong> {pending}</p>}
            </div>
        );
    };

    if (profiles.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No manpower profiles found.</p>;
    }

    return (
        <TooltipProvider>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Documentation Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.map(profile => (
                        <TableRow key={profile.id}>
                            <TableCell className="font-medium">{profile.name}</TableCell>
                            <TableCell>{profile.trade}</TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                            <Progress value={getDocumentProgress(profile)} className="w-48" />
                                            <span className="text-xs text-muted-foreground">{getDocumentProgress(profile).toFixed(0)}%</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {getProgressTooltip(profile)}
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(profile)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TooltipProvider>
    );
}
