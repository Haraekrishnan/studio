'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { InventoryTransferRequest } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { format } from 'date-fns';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface ViewTransferRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: InventoryTransferRequest;
}

export default function ViewTransferRequestDialog({ isOpen, setIsOpen, request }: ViewTransferRequestDialogProps) {
  const { users, projects, approveInventoryTransfer, rejectInventoryTransfer, addInventoryTransferComment } = useAppContext();
  const { toast } = useToast();
  const [comment, setComment] = useState('');

  const requester = users.find(u => u.id === request.requesterId);
  const fromProject = projects.find(p => p.id === request.fromProjectId);
  const toProject = projects.find(p => p.id === request.toProjectId);

  const handleApprove = () => {
    if (!comment) {
      toast({ variant: 'destructive', title: 'Comment required for approval.' });
      return;
    }
    approveInventoryTransfer(request.id, comment);
    toast({ title: 'Transfer Approved' });
    setIsOpen(false);
  };
  
  const handleReject = () => {
    if (!comment) {
      toast({ variant: 'destructive', title: 'Comment required for rejection.' });
      return;
    }
    rejectInventoryTransfer(request.id, comment);
    toast({ title: 'Transfer Rejected' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Transfer Request</DialogTitle>
          <DialogDescription>From: {fromProject?.name} &rarr; To: {toProject?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div>
                <Label>Requested Items ({request.items.length})</Label>
                 <ScrollArea className="h-32 rounded-md border p-2">
                    <ul className="list-disc list-inside">
                        {request.items.map(item => (
                            <li key={item.id}>{item.name} (SN: {item.serialNumber})</li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
            <div>
                <Label>Requester Comment</Label>
                <div className="p-2 border rounded-md text-sm bg-muted">
                    {request.comments[0]?.text || 'No comment provided.'}
                </div>
            </div>
             <div>
                <Label>Your Comment (Required)</Label>
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment for your decision..." />
            </div>
        </div>
        <DialogFooter className="justify-between">
          <Button variant="destructive" onClick={handleReject}><ThumbsDown className="mr-2 h-4 w-4"/> Reject</Button>
          <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700"><ThumbsUp className="mr-2 h-4 w-4"/> Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
