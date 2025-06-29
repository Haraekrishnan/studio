'use client';
import { useAppContext } from '@/context/app-context';
import KanbanBoard from '@/components/tasks/kanban-board';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';

export default function TasksPage() {
  const { user } = useAppContext();
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
        </div>
        {canManageTasks && <CreateTaskDialog />}
      </div>
      <KanbanBoard />
    </div>
  );
}
