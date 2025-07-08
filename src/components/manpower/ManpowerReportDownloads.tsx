'use client';
import type { ManpowerLog } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { DateRange } from 'react-day-picker';

interface ManpowerReportDownloadsProps {
  dateRange: DateRange | undefined;
}

export default function ManpowerReportDownloads({ dateRange }: ManpowerReportDownloadsProps) {
  const { projects, users, manpowerLogs } = useAppContext();

  const handleDownloadExcel = () => {
    if (!dateRange || !dateRange.from) {
        alert("Please select a date range first.");
        return;
    }
    
    const filteredLogs = manpowerLogs.filter(log => {
        const logDate = new Date(log.date);
        const fromDate = dateRange.from!;
        const toDate = dateRange.to || fromDate;
        return logDate >= fromDate && logDate <= toDate;
    });

    if (filteredLogs.length === 0) {
        alert("No data available for the selected date range.");
        return;
    }

    const dataToExport = filteredLogs.map(log => ({
      'Date': log.date,
      'Project': projects.find(p => p.id === log.projectId)?.name || 'N/A',
      'Manpower In': log.countIn,
      'Person In Name(s)': log.personInName || '',
      'Manpower Out': log.countOut,
      'Person Out Name(s)': log.personOutName || '',
      'Reason': log.reason,
      'Updated By': users.find(u => u.id === log.updatedBy)?.name || 'N/A'
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manpower Report');
    XLSX.writeFile(workbook, `Manpower_Report_${dateRange.from.toISOString().split('T')[0]}_to_${dateRange.to?.toISOString().split('T')[0] || dateRange.from.toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <Button variant="outline" onClick={handleDownloadExcel} disabled={!dateRange || !dateRange.from}>
        <FileDown className="mr-2 h-4 w-4" />
        Generate Excel
    </Button>
  );
}
