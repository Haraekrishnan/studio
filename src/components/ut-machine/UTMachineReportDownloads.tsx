'use client';
import { useAppContext } from '@/context/app-context';
import type { UTMachine, UTMachineUsageLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface UTMachineReportDownloadsProps {
  machine: UTMachine;
  dateRange: DateRange | undefined;
}

export default function UTMachineReportDownloads({ machine, dateRange }: UTMachineReportDownloadsProps) {
  const { users } = useAppContext();

  const handleDownloadExcel = () => {
    let logsToExport = machine.usageLog || [];

    if (dateRange?.from) {
        logsToExport = logsToExport.filter(log => {
            const logDate = new Date(log.date);
            const fromDate = dateRange.from!;
            const toDate = dateRange.to || fromDate;
            return logDate >= fromDate && logDate <= toDate;
        });
    }

    if (logsToExport.length === 0) {
        alert("No usage logs available for the selected criteria.");
        return;
    }

    const dataToExport = logsToExport.map(log => {
      const logger = users.find(u => u.id === log.loggedBy);
      return {
        'Date': format(new Date(log.date), 'dd-MM-yyyy'),
        'Cable Number': log.cableNumber,
        'Probe Number': log.probeNumber,
        'Area of Working': log.areaOfWorking,
        'Used By': log.usedBy,
        'Job Details': log.jobDetails,
        'Remarks': log.remarks,
        'Logged By': logger?.name || 'N/A'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UT Machine Usage Log');
    
    const fileName = `UT_Log_${machine.serialNumber}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Button variant="outline" onClick={handleDownloadExcel} disabled={(machine.usageLog || []).length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        Export Log
    </Button>
  );
}
