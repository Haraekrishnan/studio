'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function ManpowerSummaryTable() {
    const { projects, manpowerLogs } = useAppContext();

    const todaySummary = useMemo(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todayLogs = manpowerLogs.filter(log => log.date === todayStr);

        let totalIn = 0;
        let totalOut = 0;
        
        const summary = projects.map(project => {
            const log = todayLogs.find(l => l.projectId === project.id);
            totalIn += log?.countIn || 0;
            totalOut += log?.countOut || 0;
            return {
                projectId: project.id,
                projectName: project.name,
                countIn: log?.countIn || 0,
                countOut: log?.countOut || 0,
            };
        });
        
        return { summary, totalIn, totalOut };
    }, [projects, manpowerLogs]);

    if (todaySummary.totalIn === 0 && todaySummary.totalOut === 0) {
        return <p className="text-muted-foreground text-center py-8">No manpower logged for today.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Project / Location</TableHead>
                    <TableHead className="text-center">Manpower In</TableHead>
                    <TableHead className="text-center">Manpower Out</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {todaySummary.summary.map(row => (
                    <TableRow key={row.projectId}>
                        <TableCell className="font-medium">{row.projectName}</TableCell>
                        <TableCell className="text-center">{row.countIn}</TableCell>
                        <TableCell className="text-center">{row.countOut}</TableCell>
                    </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">{todaySummary.totalIn}</TableCell>
                    <TableCell className="text-center">{todaySummary.totalOut}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
