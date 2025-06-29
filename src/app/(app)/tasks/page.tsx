'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanBoard from '@/components/tasks/kanban-board';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import TaskFilters, { type TaskFilters as FiltersType } from '@/components/tasks/task-filters';

export default function TasksPage() {
  const { user, tasks } = useAppContext();
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor';

  const [filters, setFilters] = useState<FiltersType>({
    status: 'all',
    priority: 'all',
    dateRange: undefined,
    showMyTasksOnly: false,
  });

  const filteredTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
      const { status, priority, dateRange, showMyTasksOnly } = filters;

      if (showMyTasksOnly && task.assigneeId !== user.id) {
        return false;
      }
      
      const statusMatch = status === 'all' || task.status === status;
      const priorityMatch = priority === 'all' || task.priority === priority;
      
      let dateMatch = true;
      if (dateRange?.from) {
        const taskDate = new Date(task.dueDate);
        const fromDate = dateRange.from;
        const toDate = dateRange.to || new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 23, 59, 59);
        dateMatch = taskDate >= fromDate && taskDate <= toDate;
      }

      return statusMatch && priorityMatch && dateMatch;
    });
  }, [tasks, filters, user]);


  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
        </div>
        <div className="flex items-center gap-2">
            {canManageTasks && <CreateTaskDialog />}
        </div>
      </div>
      <div className='mb-4'>
        <TaskFilters onApplyFilters={setFilters} initialFilters={filters}/>
      </div>
      <KanbanBoard tasks={filteredTasks} />
    </div>
  );
}
