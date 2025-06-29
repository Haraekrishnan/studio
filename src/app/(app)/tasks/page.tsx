'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanBoard from '@/components/tasks/kanban-board';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import TaskFilters, { type TaskFilters as FiltersType } from '@/components/tasks/task-filters';
import { Button } from '@/components/ui/button';
import { Bell, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskCard from '@/components/tasks/task-card';

export default function TasksPage() {
  const { user, tasks, users } = useAppContext();
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor' || user?.role === 'HSE';

  const [filters, setFilters] = useState<FiltersType>({
    status: 'all',
    priority: 'all',
    dateRange: undefined,
    showMyTasksOnly: false,
  });

  const [isPendingApprovalDialogOpen, setIsPendingApprovalDialogOpen] = useState(false);
  const [isMyRequestsDialogOpen, setIsMyRequestsDialogOpen] = useState(false);

  const tasksAwaitingMyApproval = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
        if (task.status !== 'Pending Approval') return false;

        const assignee = users.find(u => u.id === task.assigneeId);
        if (!assignee) return false;

        const isCreator = task.creatorId === user.id;
        const isSupervisor = assignee.supervisorId === user.id;

        // An approver cannot be the person who the task is assigned to.
        if (task.assigneeId === user.id) {
            return false;
        }

        return isCreator || isSupervisor;
    });
  }, [tasks, user, users]);
  
  const mySubmittedTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
        return task.status === 'Pending Approval' && task.assigneeId === user.id;
    });
  }, [tasks, user]);


  const filteredTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
      // Don't show pending tasks on the main board, they are handled in dialogs.
      if (task.status === 'Pending Approval') {
        return false;
      }
      
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
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
          </div>
          <div className="flex items-center gap-2">
              {mySubmittedTasks.length > 0 && (
                <Button variant="outline" onClick={() => setIsMyRequestsDialogOpen(true)}>
                    <History className="mr-2 h-4 w-4" />
                    My Requests
                    <span className="ml-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
                        {mySubmittedTasks.length}
                    </span>
                </Button>
              )}
              {tasksAwaitingMyApproval.length > 0 && (
                <Button variant="outline" onClick={() => setIsPendingApprovalDialogOpen(true)}>
                    <Bell className="mr-2 h-4 w-4" />
                    Pending Approvals
                    <span className="ml-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
                        {tasksAwaitingMyApproval.length}
                    </span>
                </Button>
              )}
              {canManageTasks && <CreateTaskDialog />}
          </div>
        </div>
        <div className='mb-4'>
          <TaskFilters onApplyFilters={setFilters} initialFilters={filters}/>
        </div>
        <KanbanBoard tasks={filteredTasks} />
      </div>
      
      <Dialog open={isPendingApprovalDialogOpen} onOpenChange={setIsPendingApprovalDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Tasks Awaiting Your Approval</DialogTitle>
                <DialogDescription>
                    Review these tasks and approve or return them to the assignee.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
                <div className="p-4 space-y-4">
                    {tasksAwaitingMyApproval.length > 0 ? tasksAwaitingMyApproval.map(task => (
                        <TaskCard key={task.id} task={task} />
                    )) : <p className="text-muted-foreground text-center">No tasks are awaiting your approval.</p>}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMyRequestsDialogOpen} onOpenChange={setIsMyRequestsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>My Pending Requests</DialogTitle>
                <DialogDescription>
                    These tasks are awaiting approval. You can view comments from the approver here.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
                <div className="p-4 space-y-4">
                    {mySubmittedTasks.length > 0 ? mySubmittedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    )) : <p className="text-muted-foreground text-center">You have no tasks awaiting approval.</p>}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
