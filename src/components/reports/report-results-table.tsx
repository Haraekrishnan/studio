'use client';
import type { Task } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { format } from 'date-fns';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';

interface ReportResultsTableProps {
  tasks: Task[];
}

export default function ReportResultsTable({ tasks }: ReportResultsTableProps) {
    const { users } = useAppContext();

    const priorityVariant = {
        'Low': 'secondary',
        'Medium': 'default',
        'High': 'destructive',
    } as const;

  if (tasks.length === 0) {
    return (
      <Card className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">No tasks match the current filters.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => {
            const assignee = users.find(u => u.id === task.assigneeId);
            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{assignee?.name || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={task.status === 'Completed' ? 'outline' : 'default'}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
