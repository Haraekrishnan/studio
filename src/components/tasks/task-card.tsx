'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Flag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import AiToolsDialog from './ai-tools-dialog';
import EditTaskDialog from './edit-task-dialog';
import { Button } from '../ui/button';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { users, user, deleteTask } = useAppContext();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const assignee = useMemo(() => users.find(u => u.id === task.assigneeId), [users, task.assigneeId]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  
  const priorityVariant = {
    'Low': 'secondary',
    'Medium': 'default',
    'High': 'destructive',
  } as const;
  
  const canManageTask = user?.role === 'Admin' || user?.role === 'Manager' || user?.id === task.creatorId;
  const canUseAiTools = user?.role === 'Admin' || user?.role === 'Manager';

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      variant: 'destructive',
      title: 'Task Deleted',
      description: `"${task.title}" has been removed.`,
    });
  };

  return (
    <>
      <Card 
          ref={setNodeRef} 
          style={style}
          className="shadow-md hover:shadow-lg transition-shadow bg-background/80 touch-none"
      >
        <div className="p-4 flex items-start justify-between">
            <div {...attributes} {...listeners} className="flex-grow cursor-grab active:cursor-grabbing">
                <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
            </div>
            {canManageTask && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                           <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit / Reassign
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          <p className="line-clamp-2">{task.description}</p>
          <div className="flex items-center gap-2 mt-4">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
              <Flag className="h-4 w-4" />
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={assignee?.avatar} />
                <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="text-xs font-medium">{assignee?.name}</p>
                  <p className="text-xs text-muted-foreground">{assignee?.role}</p>
              </div>
          </div>
          {canUseAiTools && <AiToolsDialog task={task} assignee={assignee} />}
        </CardFooter>
      </Card>
      {canManageTask && (
        <EditTaskDialog 
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          task={task}
        />
      )}
    </>
  );
}
