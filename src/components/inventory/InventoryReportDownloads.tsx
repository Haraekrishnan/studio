'use client';
import type { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface InventoryReportDownloadsProps {
  items: InventoryItem[];
}

export default function InventoryReportDownloads({ items }: InventoryReportDownloadsProps) {
  const handleDownloadExcel = () => {
    const dataToExport = items.map(item => ({
      'Item Name': item.name,
      'Serial Number': item.serialNumber,
      'Aries ID': item.ariesId || 'N/A',
      'Chest Croll No': item.chestCrollNo || 'N/A',
      'Status': item.status,
      'Location': item.location,
      'Inspection Date': format(new Date(item.inspectionDate), 'yyyy-MM-dd'),
      'Inspection Due Date': format(new Date(item.inspectionDueDate), 'yyyy-MM-dd'),
      'TP Inspection Due Date': format(new Date(item.tpInspectionDueDate), 'yyyy-MM-dd'),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
    XLSX.writeFile(workbook, 'Inventory_Report.xlsx');
  };

  const handleDownloadPdf = async () => {
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');

    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 16);
    (doc as any).autoTable({
      head: [['Item Name', 'Serial No.', 'Status', 'Location', 'Insp. Due']],
      body: items.map(item => [
        item.name,
        item.serialNumber,
        item.status,
        item.location,
        format(new Date(item.inspectionDueDate), 'yyyy-MM-dd'),
      ]),
      startY: 20,
    });
    doc.save('Inventory_Report.pdf');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownloadExcel} disabled={items.length === 0}><FileDown className="mr-2 h-4 w-4" /> Excel</Button>
      <Button variant="outline" onClick={handleDownloadPdf} disabled={items.length === 0}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
    </div>
  );
}
