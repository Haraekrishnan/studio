'use client';
import { useMemo } from 'react';
import type { ManpowerProfile, ManpowerDocument } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MANDATORY_DOCS, RA_TRADES } from '@/lib/mock-data';

interface ManpowerListTableProps {
    profiles: ManpowerProfile[];
    onEdit: (profile: ManpowerProfile) => void;
}

const statusVariant: { [key in ManpowerProfile['status']]: "secondary" | "destructive" | "default" | "outline" } = {
    'Working': 'secondary',
    'On Leave': 'default',
    'Resigned': 'destructive',
    'Terminated': 'destructive',
}

export default function ManpowerListTable({ profiles, onEdit }: ManpowerListTableProps) {

    const getDocumentProgress = (profile: ManpowerProfile) => {
        const requiredDocs = [...MANDATORY_DOCS];
        if (RA_TRADES.includes(profile.trade)) {
            requiredDocs.push('IRATA Certificate');
        }

        const collectedCount = requiredDocs.filter(docName => {
            const doc = profile.documents.find(d => d.name === docName);
            return doc && doc.status !== 'Pending';
        }).length;
        
        return (collectedCount / requiredDocs.length) * 100;
    };
    
     const getProgressTooltip = (profile: ManpowerProfile) => {
        const requiredDocs = [...MANDATORY_DOCS];
        if (RA_TRADES.includes(profile.trade)) {
            requiredDocs.push('IRATA Certificate');
        }

        const collected: string[] = [];
        const pending: string[] = [];

        requiredDocs.forEach(docName => {
            const doc = profile.documents.find(d => d.name === docName);
            if(doc && doc.status !== 'Pending') {
                collected.push(docName);
            } else {
                pending.push(docName);
            }
        });

        return (
            <div>
                {collected.length > 0 && <p><strong>Collected:</strong> {collected.join(', ')}</p>}
                {pending.length > 0 && <p className="mt-2"><strong>Pending:</strong> {pending.join(', ')}</p>}
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
                        <TableHead>Status</TableHead>
                        <TableHead>Documentation Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.map(profile => (
                        <TableRow key={profile.id}>
                            <TableCell className="font-medium">{profile.name}</TableCell>
                            <TableCell>{profile.trade}</TableCell>
                            <TableCell><Badge variant={statusVariant[profile.status]}>{profile.status}</Badge></TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                            <Progress value={getDocumentProgress(profile)} className="w-48" />
                                            <span className="text-xs text-muted-foreground">{getDocumentProgress(profile).toFixed(0)}%</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
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
