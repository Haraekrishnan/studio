'use client';
import { useState, useMemo } from 'react';
import type { IncidentReport, IncidentStatus } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, CircleAlert } from 'lucide-react';
import EditIncidentReportDialog from './EditIncidentReportDialog';
import { cn } from '@/lib/utils';

interface IncidentListTableProps {
  incidents: IncidentReport[];
}

const statusVariant: { [key in IncidentStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'New': 'destructive',
    'Under Investigation': 'default',
    'Action Pending': 'outline',
    'Resolved': 'secondary',
    'Closed': 'secondary',
}

export default function IncidentListTable({ incidents }: IncidentListTableProps) {
    const { user, users } = useAppContext();
    const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
    
    const handleViewClick = (incident: IncidentReport) => {
        setSelectedIncident(incident);
    };

    if (incidents.length === 0) {
        return (
            <Card className="flex items-center justify-center h-48 border-dashed">
                <p className="text-muted-foreground">No incidents to display.</p>
            </Card>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Incident Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {incidents.map(incident => {
                    const reporter = users.find(u => u.id === incident.reporterId);
                    
                    return (
                        <TableRow key={incident.id} >
                            <TableCell>{reporter?.name}</TableCell>
                            <TableCell>{incident.projectLocation}</TableCell>
                            <TableCell>{format(new Date(incident.incidentTime), 'PPP p')}</TableCell>
                            <TableCell>
                               <div className='flex items-center gap-2'>
                                 <Badge variant={statusVariant[incident.status]}>{incident.status}</Badge>
                               </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleViewClick(incident)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            {selectedIncident && (
                <EditIncidentReportDialog 
                    isOpen={!!selectedIncident}
                    setIsOpen={(open) => !open && setSelectedIncident(null)}
                    incident={selectedIncident}
                />
            )}
        </>
    );
}
