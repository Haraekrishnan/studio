'use client';
import TaskCard from './task-card';
import type { Task, TaskStatus } from '@/lib/types';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export default function KanbanColumn({ status, tasks = [] }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const statusColors = {
    'To Do': 'border-blue-500',
    'In Progress': 'border-yellow-500',
    'Pending Approval': 'border-orange-500',
    'Completed': 'border-green-500',
    'Overdue': 'border-red-500',
  };

  return (
    <div 
        ref={setNodeRef}
        className={cn(
            'flex flex-col h-full bg-card rounded-lg border-t-4 shadow-sm transition-colors', 
            statusColors[status],
            isOver ? 'bg-primary/10' : 'bg-muted/30'
        )}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
            {status}
            <span className="ml-2 text-sm font-normal bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5">
                {tasks.length}
            </span>
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No tasks here.
                </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
