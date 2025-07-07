'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Send, AlertTriangle } from 'lucide-react';
import InventoryTable from '@/components/inventory/InventoryTable';
import AddItemDialog from '@/components/inventory/AddItemDialog';
import ImportItemsDialog from '@/components/inventory/ImportItemsDialog';
import NewTransferRequestDialog from '@/components/inventory/NewTransferRequestDialog';
import ViewTransferRequestDialog from '@/components/inventory/ViewTransferRequestDialog';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import type { InventoryItem, InventoryTransferRequest } from '@/lib/types';

export default function StoreInventoryPage() {
    const { user, roles, inventoryItems, projects, inventoryTransferRequests, approveInventoryTransfer, rejectInventoryTransfer, addInventoryTransferComment } = useAppContext();
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [viewingTransfer, setViewingTransfer] = useState<InventoryTransferRequest | null>(null);

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
            if (filters.name !== 'all' && item.name !== filters.name) return false;
            if (filters.status !== 'all' && item.status !== filters.status) return false;
            if (filters.projectId !== 'all' && item.projectId !== filters.projectId) return false;
            if (filters.search && !item.serialNumber.toLowerCase().includes(filters.search.toLowerCase())) return false;
            // If user is not manager/admin/store, only show items from their project
            if (!canManageInventory && user?.projectId && item.projectId !== user.projectId) return false;
            return true;
        });
    }, [inventoryItems, filters, user, canManageInventory]);

    const pendingTransfers = useMemo(() => {
        return inventoryTransferRequests.filter(req => req.status === 'Pending');
    }, [inventoryTransferRequests]);

    const inventoryNotifications = useMemo(() => {
        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const notifications: { message: string, item: InventoryItem }[] = [];

        inventoryItems.forEach(item => {
            const inspectionDueDate = new Date(item.inspectionDueDate);
            const tpInspectionDueDate = new Date(item.tpInspectionDueDate);

            if (item.status === 'Expired') {
                notifications.push({ message: `Item expired on ${new Date(item.inspectionDueDate).toLocaleDateString()}`, item });
            } else if (inspectionDueDate <= endOfMonth) {
                notifications.push({ message: `Inspection due on ${inspectionDueDate.toLocaleDateString()}`, item });
            } else if (tpInspectionDueDate <= endOfMonth) {
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
                    {canManageInventory && (
                        <>
                            <Button onClick={() => setIsImportOpen(true)} variant="outline"><Upload className="mr-2 h-4 w-4" /> Import Items</Button>
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
                        <CardTitle>Pending Transfer Requests</CardTitle>
                        <CardDescription>Review and approve or reject these item transfer requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingTransfers.map(req => {
                                const requester = users.find(u => u.id === req.requesterId);
                                const fromProject = projects.find(p => p.id === req.fromProjectId);
                                const toProject = projects.find(p => p.id === req.toProjectId);
                                return (
                                    <div key={req.id} className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <p><span className="font-semibold">{requester?.name}</span> requests to transfer <span className="font-semibold">{req.items.length} items</span></p>
                                            <p className="text-sm text-muted-foreground">From: {fromProject?.name} &rarr; To: {toProject?.name}</p>
                                        </div>
                                        <Button size="sm" onClick={() => setViewingTransfer(req)}>Review</Button>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <InventoryFilters onApplyFilters={setFilters} />
                </CardHeader>
                <CardContent>
                    <InventoryTable items={filteredItems} />
                </CardContent>
            </Card>

            <AddItemDialog isOpen={isAddItemOpen} setIsOpen={setIsAddItemOpen} />
            <ImportItemsDialog isOpen={isImportOpen} setIsOpen={setIsImportOpen} />
            <NewTransferRequestDialog isOpen={isTransferOpen} setIsOpen={setIsTransferOpen} />
            {viewingTransfer && (
                <ViewTransferRequestDialog
                    request={viewingTransfer}
                    isOpen={!!viewingTransfer}
                    setIsOpen={() => setViewingTransfer(null)}
                />
            )}
        </div>
    );
}
