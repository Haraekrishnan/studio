'use client';
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { Send, Trash2, Forward, AlertTriangle } from 'lucide-react';
import type { InternalRequest, InternalRequestCategory, InternalRequestStatus, Comment, Role } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const requestSchema = z.object({
  category: z.enum(['Site Items', 'RA Equipments', 'Stationery', 'Other']),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  location: z.string().min(1, 'Location is required'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface EditInternalRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: InternalRequest;
}

const statusVariant: { [key in InternalRequestStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending': 'default',
    'Approved': 'secondary',
    'On Hold': 'outline',
    'Allotted': 'secondary',
    'Rejected': 'destructive',
}

const statusOptions: InternalRequestStatus[] = ['Pending', 'Approved', 'On Hold', 'Allotted', 'Rejected'];
const categoryOptions: InternalRequestCategory[] = ['Site Items', 'RA Equipments', 'Stationery', 'Other'];

export default function EditInternalRequestDialog({ isOpen, setIsOpen, request }: EditInternalRequestDialogProps) {
  const { user, users, updateInternalRequest, addInternalRequestComment, deleteInternalRequest, markRequestAsViewed, forwardInternalRequest, escalateInternalRequest } = useAppContext();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [forwardComment, setForwardComment] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);

  const requester = useMemo(() => users.find(u => u.id === request.requesterId), [users, request.requesterId]);
  
  const isStorePersonnel = useMemo(() => user?.role === 'Store in Charge' || user?.role === 'Assistant Store Incharge', [user]);
  const isAdminOrManager = useMemo(() => user?.role === 'Admin' || user?.role === 'Manager', [user]);
  const isAdmin = useMemo(() => user?.role === 'Admin', [user]);
  const isRequester = useMemo(() => user?.id === request.requesterId, [user, request.requesterId]);
  
  const isFinalStatus = useMemo(() => ['Allotted', 'Rejected'].includes(request.status), [request.status]);
  const isForwarded = useMemo(() => !!request.forwardedTo, [request.forwardedTo]);

  const canEditFields = useMemo(() => {
    if (isAdmin) return true;
    if (isFinalStatus) return false;
    if (isForwarded) return isAdminOrManager;
    return isStorePersonnel;
  }, [isAdmin, isFinalStatus, isForwarded, isAdminOrManager, isStorePersonnel]);
  
  const canChangeStatus = canEditFields;
  const canForward = useMemo(() => isStorePersonnel && !isForwarded && !isFinalStatus, [isStorePersonnel, isForwarded, isFinalStatus]);
  const canEscalate = useMemo(() => isRequester && !isForwarded && request.status === 'Pending' && differenceInDays(new Date(), new Date(request.date)) > 3, [isRequester, isForwarded, request]);
  const canDelete = isAdmin;

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  useEffect(() => {
    if (request && isOpen) {
      form.reset({
        category: request.category,
        description: request.description,
        quantity: request.quantity,
        unit: request.unit,
        location: request.location,
      });
      if(user?.id === request.requesterId) {
        markRequestAsViewed(request.id);
      }
    }
  }, [request, isOpen, form, user, markRequestAsViewed]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addInternalRequestComment(request.id, newComment);
    setNewComment('');
  };

  const handleStatusChange = (newStatus: InternalRequestStatus) => {
    if (!canChangeStatus) return;
    if (!newComment.trim()) {
        toast({ variant: 'destructive', title: 'Comment Required', description: 'Please add a comment explaining the status change.' });
        return;
    }
    updateInternalRequest({ ...request, status: newStatus });
    addInternalRequestComment(request.id, `Status changed to ${newStatus}: ${newComment}`);
    setNewComment('');
    toast({ title: 'Request Updated', description: `Status changed to ${newStatus}.` });
  };
  
  const handleForwardRequest = () => {
    if (!forwardComment.trim()) {
        toast({ variant: 'destructive', title: 'Comment Required', description: 'Please provide a reason for forwarding.' });
        return;
    }
    forwardInternalRequest(request.id, 'Manager', forwardComment);
    toast({ title: 'Request Forwarded', description: 'The request has been sent to management.' });
    setIsForwarding(false);
    setForwardComment('');
    setIsOpen(false);
  };
  
  const handleEscalateRequest = () => {
    if (!escalationReason.trim()) {
        toast({ variant: 'destructive', title: 'Reason Required', description: 'Please provide a reason for escalation.' });
        return;
    }
    escalateInternalRequest(request.id, escalationReason);
    toast({ title: 'Request Escalated', description: 'The request has been escalated to management.' });
    setIsEscalating(false);
    setEscalationReason('');
    setIsOpen(false);
  };
  
  const handleDelete = () => {
    deleteInternalRequest(request.id);
    toast({ variant: 'destructive', title: 'Request Deleted', description: 'The request has been permanently deleted.' });
    setIsOpen(false);
  }

  const onSubmit = (data: RequestFormValues) => {
    if (!canEditFields) return;
    updateInternalRequest({ ...request, ...data });
    toast({ title: 'Request Updated', description: `The request details have been updated.` });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Requested by {requester?.name} on {format(new Date(request.date), 'dd-MM-yyyy')}
              </DialogDescription>
            </div>
            <div className='flex flex-col items-end gap-1'>
                <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
                {isForwarded && <Badge variant="outline" className="capitalize">Forwarded</Badge>}
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 pr-4 border-r">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Controller
                  control={form.control} name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!canEditFields}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea {...form.register('description')} rows={5} disabled={!canEditFields}/>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                  <div>
                      <Label>Quantity</Label>
                      <Input type="number" {...form.register('quantity')} disabled={!canEditFields}/>
                  </div>
                  <div>
                      <Label>Unit</Label>
                      <Input {...form.register('unit')} disabled={!canEditFields}/>
                  </div>
                  <div>
                      <Label>Project / Site</Label>
                      <Input {...form.register('location')} disabled={!canEditFields}/>
                  </div>
              </div>

              {canEditFields && <Button type="submit" className="w-full">Save Changes</Button>}
            </form>
            <div className="space-y-2 mt-4">
                {canForward && (
                    <Button type="button" variant="outline" className="w-full" onClick={() => setIsForwarding(true)}>
                        <Forward className="mr-2 h-4 w-4" /> Forward to Management
                    </Button>
                )}
                {canEscalate && (
                    <Button type="button" variant="destructive" className="w-full" onClick={() => setIsEscalating(true)}>
                        <AlertTriangle className="mr-2 h-4 w-4" /> Escalate Request
                    </Button>
                )}
                {canDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Request
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                )}
            </div>
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
            {canChangeStatus && (
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
      <AlertDialog open={isForwarding} onOpenChange={setIsForwarding}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Forward Request to Management?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. You will no longer be able to edit or change the status of this request. Please provide a reason for forwarding.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea 
                placeholder="Reason for forwarding..."
                value={forwardComment}
                onChange={(e) => setForwardComment(e.target.value)}
            />
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleForwardRequest}>Forward</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
     <AlertDialog open={isEscalating} onOpenChange={setIsEscalating}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Escalate Request to Management?</AlertDialogTitle>
                <AlertDialogDescription>
                    This request has been pending for more than 3 days. You can escalate it to management for review. Please provide a reason.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea 
                placeholder="Reason for escalation..."
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
            />
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEscalateRequest}>Escalate</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </Dialog>
  );
}
