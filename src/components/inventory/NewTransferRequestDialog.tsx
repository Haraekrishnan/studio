'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { InventoryItem } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewTransferRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function NewTransferRequestDialog({ isOpen, setIsOpen }: NewTransferRequestDialogProps) {
  const { user, projects, inventoryItems, requestInventoryTransfer } = useAppContext();
  const { toast } = useToast();

  const [fromProjectId, setFromProjectId] = useState(user?.projectId || '');
  const [toProjectId, setToProjectId] = useState('');
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [comment, setComment] = useState('');

  const availableItems = useMemo(() => {
    return inventoryItems.filter(item => item.projectId === fromProjectId && item.status !== 'Damaged');
  }, [inventoryItems, fromProjectId]);

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItems(prev => 
      prev.some(i => i.id === item.id) 
      ? prev.filter(i => i.id !== item.id) 
      : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0 || !fromProjectId || !toProjectId || !comment) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select items, projects, and add a comment.' });
        return;
    }
    requestInventoryTransfer(selectedItems, fromProjectId, toProjectId, comment);
    toast({ title: 'Transfer Request Submitted' });
    setIsOpen(false);
    // Reset state
    setFromProjectId(user?.projectId || '');
    setToProjectId('');
    setSelectedItems([]);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item Transfer Request</DialogTitle>
          <DialogDescription>Request to move items from one project to another.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>From Project</Label>
                    <Select value={fromProjectId} onValueChange={setFromProjectId} disabled={!!user?.projectId}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>To Project</Label>
                    <Select value={toProjectId} onValueChange={setToProjectId}>
                        <SelectTrigger><SelectValue placeholder="Select destination..."/></SelectTrigger>
                        <SelectContent>{projects.filter(p => p.id !== fromProjectId).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label>Select Items</Label>
                <ScrollArea className="h-48 rounded-md border p-4">
                    <div className="space-y-2">
                        {availableItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`item-${item.id}`} 
                                    checked={selectedItems.some(i => i.id === item.id)}
                                    onCheckedChange={() => handleItemSelect(item)}
                                />
                                <Label htmlFor={`item-${item.id}`} className="font-normal">{item.name} (SN: {item.serialNumber})</Label>
                            </div>
                        ))}
                        {availableItems.length === 0 && <p className="text-sm text-muted-foreground text-center">No items available in selected project.</p>}
                    </div>
                </ScrollArea>
            </div>
            <div>
                <Label>Reason / Comment</Label>
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment explaining the transfer..." />
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
