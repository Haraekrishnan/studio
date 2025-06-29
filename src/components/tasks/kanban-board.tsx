'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanColumn from './kanban-column';
import type { Task, TaskStatus } from '@/lib/types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

const columns: TaskStatus[] = ['To Do', 'In Progress', 'Pending Approval', 'Completed', 'Overdue'];

interface KanbanBoardProps {
    tasks: Task[];
}

export default function KanbanBoard({ tasks: filteredTasks }: KanbanBoardProps) {
  const { requestTaskStatusChange, getVisibleUsers, addComment, user } = useAppContext();
  
  const visibleUserIds = useMemo(() => {
    return getVisibleUsers().map(u => u.id);
  }, [getVisibleUsers]);
  
  const tasksToShow = useMemo(() => {
    return filteredTasks.filter(task => visibleUserIds.includes(task.assigneeId));
  }, [filteredTasks, visibleUserIds]);
  
  const tasksByStatus = useMemo(() => {
    const grouped = {
      'To Do': [],
      'In Progress': [],
      'Pending Approval': [],
      'Completed': [],
      'Overdue': [],
    } as Record<TaskStatus, Task[]>;
    
    tasksToShow.forEach(task => {
        if(grouped[task.status]) {
            grouped[task.status].push(task);
        }
    });
    return grouped;
  }, [tasksToShow]);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const task = tasksToShow.find(t => t.id === active.id);

    if (over && task && user?.id === task.assigneeId) {
      const newStatus = over.id as TaskStatus;
      const oldStatus = task.status;

      if (newStatus !== oldStatus) {
        if (newStatus === 'In Progress' && oldStatus === 'To Do') {
            const comment = "Task moved to In Progress.";
            requestTaskStatusChange(task.id, 'In Progress', comment);
        } else if (newStatus === 'Completed' && oldStatus === 'In Progress') {
            const comment = "Requesting completion for this task.";
            requestTaskStatusChange(task.id, 'Completed', comment);
        }
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
            {columns.map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
            ))}
        </div>
    </DndContext>
  );
}
