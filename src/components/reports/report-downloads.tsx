'use client';
import type { Task } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface ReportDownloadsProps {
  tasks: Task[];
}

export default function ReportDownloads({ tasks }: ReportDownloadsProps) {
  const { users } = useAppContext();

  const handleDownloadExcel = () => {
    const dataToExport = tasks.map(task => ({
      'Task Title': task.title,
      'Assignee': users.find(u => u.id === task.assigneeId)?.name || 'N/A',
      'Status': task.status,
      'Priority': task.priority,
      'Due Date': format(new Date(task.dueDate), 'yyyy-MM-dd'),
      'Description': task.description,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks Report');
    XLSX.writeFile(workbook, 'TaskMaster_Report.xlsx');
  };

  const handleDownloadPdf = async () => {
    const jsPDF = (await import('jspdf')).default;
    // Import for side-effects to attach `autoTable` to the jsPDF prototype
    await import('jspdf-autotable');

    const doc = new jsPDF();
    
    doc.text('TaskMaster Pro - Report', 14, 16);
    
    // This requires a type assertion because TypeScript doesn't know about the dynamically added method
    (doc as any).autoTable({
      head: [['Task Title', 'Assignee', 'Status', 'Priority', 'Due Date']],
      body: tasks.map(task => [
        task.title,
        users.find(u => u.id === task.assigneeId)?.name || 'N/A',
        task.status,
        task.priority,
        format(new Date(task.dueDate), 'yyyy-MM-dd'),
      ]),
      startY: 20,
    });
    
    doc.save('TaskMaster_Report.pdf');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownloadExcel} disabled={tasks.length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" onClick={handleDownloadPdf} disabled={tasks.length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
