'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Flag, Bot } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import AiToolsDialog from './ai-tools-dialog';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { users, user } = useAppContext();
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
  
  const canUseAiTools = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <Card 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        className="shadow-md hover:shadow-lg transition-shadow bg-background/80 touch-none"
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-base font-semibold leading-tight pr-4">{task.title}</CardTitle>
            <button {...listeners} className="cursor-grab active:cursor-grabbing">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                    <path d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" fill="currentColor"/>
                    <path d="M12 14C13.1046 14 14 14.8954 14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
      </CardHeader>
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
  );
}
