'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanColumn from './kanban-column';
import type { Task, TaskStatus } from '@/lib/types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

const columns: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];

export default function KanbanBoard() {
  const { user, tasks, updateTaskStatus } = useAppContext();
  
  const filteredTasks = useMemo(() => {
    if (user?.role === 'Team Member') {
      return tasks.filter(task => task.assigneeId === user.id);
    }
    return tasks;
  }, [tasks, user]);
  
  const tasksByStatus = useMemo(() => {
    return {
      'To Do': filteredTasks.filter(task => task.status === 'To Do'),
      'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
      'Completed': filteredTasks.filter(task => task.status === 'Completed'),
    };
  }, [filteredTasks]);

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
