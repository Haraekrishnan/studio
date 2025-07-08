'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Send, AlertTriangle, FileText, BadgeInfo, ChevronsUpDown } from 'lucide-react';
import InventoryTable from '@/components/inventory/InventoryTable';
import AddItemDialog from '@/components/inventory/AddItemDialog';
import ImportItemsDialog from '@/components/inventory/ImportItemsDialog';
import NewTransferRequestDialog from '@/components/inventory/NewTransferRequestDialog';
import ViewTransferRequestDialog from '@/components/inventory/ViewTransferRequestDialog';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import type { InventoryItem, InventoryTransferRequest, CertificateRequest } from '@/lib/types';
import { isAfter, isBefore, addDays } from 'date-fns';
import ViewCertificateRequestDialog from '@/components/inventory/ViewCertificateRequestDialog';
import InventorySummary from '@/components/inventory/InventorySummary';

export default function StoreInventoryPage() {
    const { user, users, roles, inventoryItems, projects, utMachines, inventoryTransferRequests, certificateRequests } = useAppContext();
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [viewingTransfer, setViewingTransfer] = useState<InventoryTransferRequest | null>(null);
    const [viewingCertRequest, setViewingCertRequest] = useState<CertificateRequest | null>(null);
    const [view, setView] = useState<'list' | 'summary'>('list');

    const [filters, setFilters] = useState({
        name: 'all',
        status: 'all',
        projectId: 'all',
        search: ''
    });

    const canManageInventory = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_inventory') ?? false;
    }, [user, roles]);

    const filteredItems = useMemo(() => {
        return inventoryItems.filter(item => {
            const { name, status, projectId, search } = filters;
            if (name !== 'all' && item.name !== name) return false;
            if (search && !item.serialNumber.toLowerCase().includes(search.toLowerCase())) return false;
            
            const now = new Date();
            if (status === 'Inspection Expired' && isAfter(now, new Date(item.inspectionDueDate))) {
                 // keep
            } else if (status === 'TP Expired' && isAfter(now, new Date(item.tpInspectionDueDate))) {
                // keep
            } else if (status !== 'all' && status !== 'Inspection Expired' && status !== 'TP Expired' && item.status !== status) {
                 return false;
            } else if (status === 'all' || item.status === status) {
                // keep
            } else {
                return false;
            }
            
            if (projectId !== 'all' && item.projectId !== projectId) return false;

            // If user is not manager/admin/store, only show items from their project
            if (!canManageInventory && user?.projectId && item.projectId !== user.projectId) return false;
            return true;
        });
    }, [inventoryItems, filters, user, canManageInventory]);

    const pendingTransfers = useMemo(() => inventoryTransferRequests.filter(req => req.status === 'Pending'), [inventoryTransferRequests]);
    const pendingCertRequests = useMemo(() => certificateRequests.filter(req => req.status === 'Pending'), [certificateRequests]);

    const inventoryNotifications = useMemo(() => {
        const now = new Date();
        const thirtyDaysFromNow = addDays(now, 30);
        const notifications: { message: string, item: InventoryItem }[] = [];

        inventoryItems.forEach(item => {
            const inspectionDueDate = new Date(item.inspectionDueDate);
            const tpInspectionDueDate = new Date(item.tpInspectionDueDate);

            if (item.status === 'Expired') {
                notifications.push({ message: `Item expired on ${new Date(item.inspectionDueDate).toLocaleDateString()}`, item });
            } else if (isBefore(inspectionDueDate, now)) {
                notifications.push({ message: `Inspection expired on ${inspectionDueDate.toLocaleDateString()}`, item });
            } else if (isBefore(inspectionDueDate, thirtyDaysFromNow)) {
                notifications.push({ message: `Inspection due on ${inspectionDueDate.toLocaleDateString()}`, item });
            }
            
            if (isBefore(tpInspectionDueDate, now)) {
                 notifications.push({ message: `TP Inspection expired on ${tpInspectionDueDate.toLocaleDateString()}`, item });
            } else if (isBefore(tpInspectionDueDate, thirtyDaysFromNow)) {
                notifications.push({ message: `TP Inspection due on ${tpInspectionDueDate.toLocaleDateString()}`, item });
            }
        });

        return notifications;
    }, [inventoryItems]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Store Inventory</h1>
                    <p className="text-muted-foreground">Manage and track all equipment and items.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setView(v => v === 'list' ? 'summary' : 'list')} variant="outline"><ChevronsUpDown className="mr-2 h-4 w-4" />{view === 'list' ? 'View Summary' : 'View List'}</Button>
                    {canManageInventory && (
                        <>
                            <Button onClick={() => setIsImportOpen(true)} variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button>
                            <Button onClick={() => setIsAddItemOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
                        </>
                    )}
                    <Button onClick={() => setIsTransferOpen(true)}><Send className="mr-2 h-4 w-4" /> New Transfer</Button>
                </div>
            </div>

            {canManageInventory && inventoryNotifications.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Action Required</CardTitle>
                        <CardDescription>The following items require attention for upcoming or past due dates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {inventoryNotifications.map((n, i) => (
                                <div key={i} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                                    <span className="font-semibold">{n.item.name} (SN: {n.item.serialNumber})</span>: {n.message}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {canManageInventory && pendingTransfers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Inventory Transfers</CardTitle>
                        <CardDescription>Review and action these inventory transfer requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pendingTransfers.map(req => {
                            const requester = users.find(u => u.id === req.requesterId);
                            const fromProject = projects.find(p => p.id === req.fromProjectId);
                            const toProject = projects.find(p => p.id === req.toProjectId);
                            return (
                                <div key={req.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div><p><span className="font-semibold">{requester?.name}</span> requests to transfer <span className="font-semibold">{req.items.length} items</span></p><p className="text-sm text-muted-foreground">From: {fromProject?.name} &rarr; To: {toProject?.name}</p></div>
                                    <Button size="sm" onClick={() => setViewingTransfer(req)}>Review Transfer</Button>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}
            
            {canManageInventory && pendingCertRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Certificate Requests</CardTitle>
                        <CardDescription>Review and action these certificate requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {pendingCertRequests.map(req => {
                            const requester = users.find(u => u.id === req.requesterId);
                            const item = inventoryItems.find(i => i.id === req.itemId);
                            const machine = utMachines.find(m => m.id === req.utMachineId);
                            const subject = item ? `${item.name} (SN: ${item.serialNumber})` : (machine ? `${machine.machineName} (SN: ${machine.serialNumber})` : 'Unknown');

                            return (
                                <div key={req.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div><p><span className="font-semibold">{requester?.name}</span> requests a <span className="font-semibold">{req.requestType}</span></p><p className="text-sm text-muted-foreground">For: {subject}</p></div>
                                    <Button size="sm" onClick={() => setViewingCertRequest(req)}>Review Request</Button>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                   {view === 'list' && <InventoryFilters onApplyFilters={setFilters} />}
                   {view === 'summary' && <CardTitle>Inventory Summary</CardTitle>}
                </CardHeader>
                <CardContent>
                    {view === 'list' ? <InventoryTable items={filteredItems} /> : <InventorySummary items={inventoryItems} />}
                </CardContent>
            </Card>

            <AddItemDialog isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} />
            <ImportItemsDialog isOpen={isImportOpen} setIsOpen={setIsImportOpen} />
            <NewTransferRequestDialog isOpen={isTransferOpen} setIsOpen={setIsTransferOpen} />
            {viewingTransfer && ( <ViewTransferRequestDialog request={viewingTransfer} isOpen={!!viewingTransfer} setIsOpen={() => setViewingTransfer(null)} /> )}
            {viewingCertRequest && ( <ViewCertificateRequestDialog request={viewingCertRequest} isOpen={!!viewingCertRequest} setIsOpen={() => setViewingCertRequest(null)} /> )}
        </div>
    );
}
