'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { ManagementRequest } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

interface EditManagementRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: ManagementRequest;
}

type RequestStatus = ManagementRequest['status'];

const statusVariant: { [key in RequestStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'default',
    'Approved': 'secondary',
    'Rejected': 'destructive',
    'In Progress': 'outline',
}

const statusOptions: RequestStatus[] = ['Pending', 'In Progress', 'Approved', 'Rejected'];

export default function EditManagementRequestDialog({ isOpen, setIsOpen, request }: EditManagementRequestDialogProps) {
  const { user, users, updateManagementRequest, addManagementRequestComment, markManagementRequestAsViewed } = useAppContext();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  
  const requester = useMemo(() => users.find(u => u.id === request.requesterId), [users, request.requesterId]);
  const recipient = useMemo(() => users.find(u => u.id === request.recipientId), [users, request.recipientId]);
  
  const isRecipient = user?.id === request.recipientId;
  const isRequester = user?.id === request.requesterId;
  
  useEffect(() => {
    if (isOpen && user) {
        markManagementRequestAsViewed(request.id);
    }
  }, [isOpen, user, request.id, markManagementRequestAsViewed]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addManagementRequestComment(request.id, newComment);
    setNewComment('');
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (!isRecipient) return;
    if (!newComment.trim()) {
        toast({ variant: 'destructive', title: 'Comment Required', description: 'Please add a comment explaining the status change.' });
        return;
    }
    updateManagementRequest({ ...request, status: newStatus });
    addManagementRequestComment(request.id, `Status changed to ${newStatus}: ${newComment}`);
    setNewComment('');
    toast({ title: 'Request Updated', description: `Status changed to ${newStatus}.` });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>{request.subject}</DialogTitle>
              <DialogDescription>
                From: {requester?.name} &rarr; To: {recipient?.name} on {format(new Date(request.date), 'dd-MM-yyyy')}
              </DialogDescription>
            </div>
            <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 pr-4 border-r">
            <h3 className="font-semibold">Request Details</h3>
            <p className="text-sm p-4 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap">{request.details}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Comments & Activity</h3>
            <ScrollArea className="flex-1 h-64 pr-4 border-b">
              <div className="space-y-4">
                {(request.comments || []).map((comment, index) => {
                  const commentUser = users.find(u => u.id === comment.userId);
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                      <div className="bg-muted p-3 rounded-lg w-full">
                        <div className="flex justify-between items-center"><p className="font-semibold text-sm">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                        <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
            <div className="relative">
              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="pr-12"/>
              <Button type="button" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleAddComment} disabled={!newComment.trim()}><Send className="h-4 w-4" /></Button>
            </div>
            {isRecipient && (
              <div className="space-y-2">
                <Label>Change Status</Label>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                        <Button key={status} size="sm" variant={request.status === status ? 'secondary' : 'outline'} onClick={() => handleStatusChange(status)} disabled={request.status === status}>
                            {status}
                        </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
