'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanColumn from './kanban-column';
import type { Task, TaskStatus } from '@/lib/types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

const columns: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];

interface KanbanBoardProps {
    tasks: Task[];
}

export default function KanbanBoard({ tasks: filteredTasks }: KanbanBoardProps) {
  const { updateTaskStatus, getVisibleUsers } = useAppContext();
  
  const visibleUserIds = useMemo(() => {
    return getVisibleUsers().map(u => u.id);
  }, [getVisibleUsers]);
  
  const tasksToShow = useMemo(() => {
    // Further filter by visibility on top of props filter
    return filteredTasks.filter(task => visibleUserIds.includes(task.assigneeId));
  }, [filteredTasks, visibleUserIds]);
  
  const tasksByStatus = useMemo(() => {
    return {
      'To Do': tasksToShow.filter(task => task.status === 'To Do'),
      'In Progress': tasksToShow.filter(task => task.status === 'In Progress'),
      'Completed': tasksToShow.filter(task => task.status === 'Completed'),
    };
  }, [tasksToShow]);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (over) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      updateTaskStatus(taskId, newStatus);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {columns.map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
            ))}
        </div>
    </DndContext>
  );
}
