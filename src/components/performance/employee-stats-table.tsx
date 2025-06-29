'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function EmployeeStatsTable() {
  const { tasks, getVisibleUsers } = useAppContext();
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const performanceData = useMemo(() => {
    return visibleUsers.map(user => {
      const userTasks = tasks.filter(task => task.assigneeId === user.id);
      const completed = userTasks.filter(t => t.status === 'Completed').length;
      const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
      const todo = userTasks.filter(t => t.status === 'To Do').length;
      const pending = userTasks.filter(t => t.status === 'Pending Approval').length;
      const overdue = userTasks.filter(t => t.status === 'Overdue').length;

      return {
        ...user,
        stats: {
          completed,
          inProgress,
          todo,
          pending,
          overdue,
          total: userTasks.length,
        },
      };
    }).sort((a, b) => b.stats.completed - a.stats.completed);
  }, [visibleUsers, tasks]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead className="text-center">To Do</TableHead>
          <TableHead className="text-center">In Progress</TableHead>
          <TableHead className="text-center">Pending</TableHead>
          <TableHead className="text-center">Completed</TableHead>
          <TableHead className="text-center">Overdue</TableHead>
          <TableHead className="text-center">Total Assigned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performanceData.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.role}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">{user.stats.todo}</TableCell>
            <TableCell className="text-center">{user.stats.inProgress}</TableCell>
            <TableCell className="text-center">{user.stats.pending}</TableCell>
            <TableCell className="text-center font-medium">{user.stats.completed}</TableCell>
            <TableCell className="text-center">
              {user.stats.overdue > 0 ? (
                <Badge variant="destructive">{user.stats.overdue}</Badge>
              ) : (
                0
              )}
            </TableCell>
            <TableCell className="text-center font-semibold">{user.stats.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
