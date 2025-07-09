'use client';
import { useAppContext } from '@/context/app-context';
import type { UTMachine, UTMachineUsageLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval, differenceInDays } from 'date-fns';

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

    // Prepare detailed logs sheet
    const detailedLogsData = logsToExport.map(log => {
      const logger = users.find(u => u.id === log.loggedBy);
      return {
        'Date': format(new Date(log.date), 'dd-MM-yyyy'),
        'Status': log.status,
        'Cable Number': log.cableNumber,
        'Probe Number': log.probeNumber,
        'Area of Working': log.areaOfWorking,
        'Used By': log.usedBy,
        'Job Details': log.jobDetails,
        'Reason (if Idle/Other)': log.reason || 'N/A',
        'Remarks': log.remarks,
        'Logged By': logger?.name || 'N/A'
      };
    });
    const detailedWorksheet = XLSX.utils.json_to_sheet(detailedLogsData);
    
    // Prepare summary sheet
    let summaryData = [];
    if (dateRange?.from && dateRange?.to) {
        const totalDaysInRange = differenceInDays(dateRange.to, dateRange.from) + 1;
        const loggedDates = new Set(logsToExport.map(log => format(new Date(log.date), 'yyyy-MM-dd')));
        
        let activeDays = 0;
        let idleDays = 0;

        const uniqueDayLogs = new Map<string, UTMachineUsageLog>();
        logsToExport.forEach(log => {
            const day = format(new Date(log.date), 'yyyy-MM-dd');
            if (!uniqueDayLogs.has(day)) {
                uniqueDayLogs.set(day, log);
            }
        });
        
        uniqueDayLogs.forEach(log => {
            if(log.status === 'Active') activeDays++;
            else idleDays++;
        });

        const offDays = totalDaysInRange - loggedDates.size;

        summaryData.push({ Statistic: 'Start Date', Value: format(dateRange.from, 'dd-MM-yyyy') });
        summaryData.push({ Statistic: 'End Date', Value: format(dateRange.to, 'dd-MM-yyyy') });
        summaryData.push({ Statistic: 'Total Days in Period', Value: totalDaysInRange });
        summaryData.push({ Statistic: 'Total Logged Days', Value: loggedDates.size });
        summaryData.push({ Statistic: 'Active Days', Value: activeDays });
        summaryData.push({ Statistic: 'Idle/Other Days', Value: idleDays });
        summaryData.push({ Statistic: 'Off Days (No Log)', Value: offDays });
    }
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, detailedWorksheet, 'Detailed Usage Log');
    if (summaryData.length > 0) {
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Usage Summary');
    }
    
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
