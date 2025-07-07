'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import type { InventoryItem } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, ShieldQuestion } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import EditItemDialog from './EditItemDialog';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import InventoryReportDownloads from './InventoryReportDownloads';
import RequestCertificateDialog from './RequestCertificateDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface InventoryTableProps {
  items: InventoryItem[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
    const { user, roles, deleteInventoryItem } = useAppContext();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCertRequestOpen, setIsCertRequestOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const canManage = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_inventory') ?? false;
    }, [user, roles]);
    
    const groupedItems = useMemo(() => {
        return items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
            if (!acc[item.name]) {
                acc[item.name] = [];
            }
            acc[item.name].push(item);
            return acc;
        }, {});
    }, [items]);

    const handleEditClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsEditDialogOpen(true);
    };
    
    const handleRequestClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsCertRequestOpen(true);
    };

    const handleDelete = (itemId: string) => {
        deleteInventoryItem(itemId);
        toast({ variant: 'destructive', title: 'Item Deleted' });
    };
    
    const isDatePast = (date: string) => isPast(new Date(date));

    return (
        <>
            <div className="flex justify-end mb-4">
                <InventoryReportDownloads items={items}/>
            </div>
            <Accordion type="multiple" className="w-full space-y-2">
                {Object.entries(groupedItems).map(([itemName, itemList]) => (
                    <AccordionItem key={itemName} value={itemName} className="border rounded-lg bg-card">
                        <AccordionTrigger className="p-4 hover:no-underline">
                            <div className="flex items-center gap-4">
                                <h3 className="font-semibold text-lg">{itemName}</h3>
                                <Badge variant="secondary">Total: {itemList.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Serial No.</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Insp. Due</TableHead>
                                            <TableHead>TP Insp. Due</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itemList.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.serialNumber}</TableCell>
                                                <TableCell><Badge variant={item.status === 'Damaged' || item.status === 'Expired' ? 'destructive' : 'secondary'}>{item.status}</Badge></TableCell>
                                                <TableCell>{item.location}</TableCell>
                                                <TableCell className={cn(isDatePast(item.inspectionDueDate) && 'text-destructive font-bold')}>{format(new Date(item.inspectionDueDate), 'dd-MM-yyyy')}</TableCell>
                                                <TableCell className={cn(isDatePast(item.tpInspectionDueDate) && 'text-destructive font-bold')}>{format(new Date(item.tpInspectionDueDate), 'dd-MM-yyyy')}</TableCell>
                                                <TableCell className="text-right">
                                                        <AlertDialog>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {canManage && <DropdownMenuItem onSelect={() => handleEditClick(item)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>}
                                                                    <DropdownMenuItem onSelect={() => handleRequestClick(item)}><ShieldQuestion className="mr-2 h-4 w-4"/>Request Certificate</DropdownMenuItem>
                                                                    {canManage && <AlertDialogTrigger asChild><DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem></AlertDialogTrigger>}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the item. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            {selectedItem && canManage && <EditItemDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} item={selectedItem} />}
            {selectedItem && <RequestCertificateDialog isOpen={isCertRequestOpen} setIsOpen={setIsCertRequestOpen} item={selectedItem} />}
        </>
    );
}
