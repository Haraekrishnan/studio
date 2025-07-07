'use client';
import type { InventoryItem } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface InventoryReportDownloadsProps {
  items: InventoryItem[];
  isSummary?: boolean;
  summaryData?: any[];
}

export default function InventoryReportDownloads({ items, isSummary = false, summaryData = [] }: InventoryReportDownloadsProps) {
  const { projects } = useAppContext();

  const handleDownloadExcel = () => {
    let dataToExport;
    let worksheet;

    if (isSummary) {
      dataToExport = summaryData.map(row => {
        const newRow: {[key: string]: any} = { 'Item Name': row.name };
        projects.forEach(p => {
          newRow[p.name] = row[p.id] || 0;
        });
        newRow['Total'] = row.total;
        return newRow;
      });
      worksheet = XLSX.utils.json_to_sheet(dataToExport);
    } else {
      dataToExport = items.map(item => ({
        'Item Name': item.name,
        'Serial Number': item.serialNumber,
        'Aries ID': item.ariesId || 'N/A',
        'Chest Croll No': item.chestCrollNo || 'N/A',
        'Status': item.status,
        'Location': item.location,
        'Inspection Date': format(new Date(item.inspectionDate), 'dd-MM-yyyy'),
        'Inspection Due Date': format(new Date(item.inspectionDueDate), 'dd-MM-yyyy'),
        'TP Inspection Due Date': format(new Date(item.tpInspectionDueDate), 'dd-MM-yyyy'),
      }));
       worksheet = XLSX.utils.json_to_sheet(dataToExport);
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
    XLSX.writeFile(workbook, 'Inventory_Report.xlsx');
  };

  const handleDownloadPdf = async () => {
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Inventory Report', 14, 16);

    if (isSummary) {
      const head = [['Item Name', ...projects.map(p => p.name), 'Total']];
      const body = summaryData.map(row => {
          const rowData = [row.name];
          projects.forEach(p => {
            rowData.push(row[p.id] || 0);
          });
          rowData.push(row.total);
          return rowData;
      });
       (doc as any).autoTable({ head, body, startY: 20 });
    } else {
      (doc as any).autoTable({
        head: [['Item Name', 'Serial No.', 'Status', 'Location', 'Insp. Due', 'TP Insp. Due']],
        body: items.map(item => [
          item.name,
          item.serialNumber,
          item.status,
          item.location,
          format(new Date(item.inspectionDueDate), 'dd-MM-yyyy'),
          format(new Date(item.tpInspectionDueDate), 'dd-MM-yyyy'),
        ]),
        startY: 20,
      });
    }

    doc.save('Inventory_Report.pdf');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownloadExcel} disabled={(isSummary ? summaryData.length : items.length) === 0}><FileDown className="mr-2 h-4 w-4" /> Excel</Button>
      <Button variant="outline" onClick={handleDownloadPdf} disabled={(isSummary ? summaryData.length : items.length) === 0}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
    </div>
  );
}
