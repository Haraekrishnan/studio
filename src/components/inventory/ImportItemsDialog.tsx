'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FileWarning, Upload } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

interface ImportItemsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ImportItemsDialog({ isOpen, setIsOpen }: ImportItemsDialogProps) {
    const { addMultipleInventoryItems } = useAppContext();
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'No file selected', description: 'Please select an Excel file to import.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);
                
                addMultipleInventoryItems(json);

                toast({ title: 'Import Successful', description: `${json.length} items have been imported.` });
                setIsOpen(false);
            } catch (error) {
                console.error("Import error:", error);
                toast({ variant: 'destructive', title: 'Import Failed', description: 'The file format is invalid. Please check the console for details.' });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Import Items from Excel</DialogTitle>
            <DialogDescription>Upload an Excel file to add multiple items to the inventory at once.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <Alert>
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>File Format Instructions</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside text-xs">
                            <li>The first row must be the header row.</li>
                            <li>Required columns: `name`, `serialNumber`, `status`, `projectId`, `inspectionDate`, `inspectionDueDate`, `tpInspectionDueDate`.</li>
                            <li>Optional columns: `chestCrollNo`, `ariesId`.</li>
                            <li>Dates must be in a valid format (e.g., YYYY-MM-DD).</li>
                        </ul>
                    </AlertDescription>
                </Alert>
                <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleImport} disabled={!file}><Upload className="mr-2 h-4 w-4"/> Import</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
