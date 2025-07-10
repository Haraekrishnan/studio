'use client';
import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Send, UserPlus, FileDown, Layers } from 'lucide-react';
import type { IncidentReport, IncidentStatus, Comment, Role } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import * as XLSX from 'xlsx';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusVariant: { [key in IncidentStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    'New': 'destructive',
    'Under Investigation': 'default',
    'Action Pending': 'outline',
    'Resolved': 'secondary',
    'Closed': 'secondary',
}

const statusOptions: IncidentStatus[] = ['New', 'Under Investigation', 'Action Pending', 'Resolved', 'Closed'];

interface EditIncidentReportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  incident: IncidentReport;
}

export default function EditIncidentReportDialog({ isOpen, setIsOpen, incident }: EditIncidentReportDialogProps) {
  const { user, users, projects, roles, updateIncident, addIncidentComment, publishIncident, addUsersToIncidentReport } = useAppContext();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const reporter = useMemo(() => users.find(u => u.id === incident.reporterId), [users, incident.reporterId]);
  
  const canChangeStatusAndPublish = useMemo(() => ['Admin', 'HSE', 'Manager'].includes(user?.role || ''), [user]);

  const project = useMemo(() => projects.find(p => p.id === incident.projectId), [projects, incident.projectId]);

  const participants = useMemo(() => {
    const pIds = new Set([incident.reporterId, ...(incident.reportedToUserIds || [])]);
    return users.filter(u => pIds.has(u.id));
  }, [users, incident]);
  
  const canAddUsers = useMemo(() => {
    if (!user) return false;
    const allowedRoles: Role[] = ['Admin', 'Manager', 'HSE', 'Supervisor'];
    return allowedRoles.includes(user.role);
  }, [user]);

  const availableUsersToAdd = useMemo(() => {
      const participantIds = new Set(participants.map(p => p.id));
      const allowedRoles: Role[] = ['Admin', 'Manager', 'HSE', 'Supervisor'];
      return users.filter(u => !participantIds.has(u.id) && allowedRoles.includes(u.role));
  }, [users, participants]);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addIncidentComment(incident.id, newComment);
    setNewComment('');
  };

  const handleStatusChange = (newStatus: IncidentStatus) => {
    if (!canChangeStatusAndPublish) return;
    const comment = `Status changed to: ${newStatus}`;
    updateIncident({ ...incident, status: newStatus });
    addIncidentComment(incident.id, comment);
    toast({ title: 'Incident Status Updated' });
  };
  
  const handleAddUsers = () => {
    if (selectedUsers.length === 0) {
        toast({variant: 'destructive', title: 'No users selected'});
        return;
    }
    addUsersToIncidentReport(incident.id, selectedUsers);
    const addedUserNames = users.filter(u => selectedUsers.includes(u.id)).map(u => u.name).join(', ');
    toast({ title: 'Users Added', description: `${addedUserNames} added to the incident.` });
    setSelectedUsers([]);
  };
  
  const handleGenerateReport = () => {
    const data = [
        { A: 'Incident ID', B: incident.id },
        { A: 'Status', B: incident.status },
        { A: 'Reported By', B: reporter?.name },
        { A: 'Project', B: project?.name },
        { A: 'Area', B: incident.unitArea },
        { A: 'Incident Time', B: format(new Date(incident.incidentTime), 'yyyy-MM-dd HH:mm') },
        { A: 'Reported At', B: format(new Date(incident.reportTime), 'yyyy-MM-dd HH:mm') },
        { A: 'Details', B: incident.incidentDetails },
        {},
        { A: '--- Comment History ---' },
        ...(incident.comments || []).map(c => {
            const commentUser = users.find(u => u.id === c.userId);
            return {
                A: `Comment by ${commentUser?.name} at ${format(new Date(c.date), 'yyyy-MM-dd HH:mm')}`,
                B: c.text
            }
        })
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(data, { header: ["A", "B"], skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incident Report");
    XLSX.writeFile(workbook, `Incident_Report_${incident.id}.xlsx`);
  };
  
  const handlePublish = () => {
    publishIncident(incident.id);
    toast({ title: "Incident Published", description: "This incident is now visible to all users."});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>Incident Report</DialogTitle>
              <DialogDescription>
                Reported by {reporter?.name} on {format(new Date(incident.reportTime), 'PPP p')}
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
                 <Badge variant={statusVariant[incident.status]} className="capitalize">{incident.status}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 pr-4 border-r">
            <h3 className="font-semibold">Incident Details</h3>
            <div className="text-sm space-y-2">
                <p><strong>Location:</strong> {project?.name} - {incident.unitArea}</p>
                <p><strong>Time of Incident:</strong> {format(new Date(incident.incidentTime), 'PPP p')}</p>
            </div>
            <p className="text-sm p-4 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap">{incident.incidentDetails}</p>
            {canChangeStatusAndPublish && (
                <div className="space-y-2">
                    <Label>Change Status</Label>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map(status => (
                            <Button key={status} size="sm" variant={incident.status === status ? 'secondary' : 'outline'} onClick={() => handleStatusChange(status)} disabled={incident.status === status}>
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <div className="space-y-2">
                <Label>Reported To</Label>
                <div className="flex flex-wrap gap-2 items-center">
                    {participants.map(p => (
                        <div key={p.id} className="flex items-center gap-1 text-sm bg-muted p-1 rounded-md">
                           <Avatar className="h-5 w-5"><AvatarImage src={p.avatar} /><AvatarFallback>{p.name.charAt(0)}</AvatarFallback></Avatar>
                           {p.name}
                        </div>
                    ))}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="sm" variant="outline" disabled={!canAddUsers || availableUsersToAdd.length === 0}>
                                <UserPlus className="mr-2 h-4 w-4"/>Add Users
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                           <Command>
                                <CommandInput placeholder="Search user..." />
                                <CommandList>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                    {availableUsersToAdd.map((u) => (
                                    <CommandItem
                                        key={u.id}
                                        onSelect={() => {
                                            setSelectedUsers(prev => 
                                                prev.includes(u.id) 
                                                ? prev.filter(id => id !== u.id)
                                                : [...prev, u.id]
                                            );
                                        }}
                                    >
                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedUsers.includes(u.id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {u.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                                 {selectedUsers.length > 0 && <Button size="sm" className="m-1 w-[calc(100%-8px)]" onClick={handleAddUsers}>Add {selectedUsers.length} Users</Button>}
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Comments & Activity</h3>
            <ScrollArea className="flex-1 h-64 pr-4 border-b">
              <div className="space-y-4">
                {(incident.comments || []).map((comment, index) => {
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
          </div>
        </div>
        <DialogFooter className="justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          <div className="flex gap-2">
            {canChangeStatusAndPublish && !incident.isPublished && (
              <Button variant="secondary" onClick={handlePublish}><Layers className="mr-2 h-4 w-4"/> Publish Incident</Button>
            )}
            {canChangeStatusAndPublish && <Button variant="secondary" onClick={handleGenerateReport}><FileDown className="mr-2 h-4 w-4" />Generate Report</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
