'use client';
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

interface EmployeeStatsTableProps {
  data: any[];
}

export default function EmployeeStatsTable({ data }: EmployeeStatsTableProps) {
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
        {data.map(user => (
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
            <TableCell className="text-center">{user.todo}</TableCell>
            <TableCell className="text-center">{user.inProgress}</TableCell>
            <TableCell className="text-center">{user.pending}</TableCell>
            <TableCell className="text-center font-medium">{user.completed}</TableCell>
            <TableCell className="text-center">
              {user.overdue > 0 ? (
                <Badge variant="destructive">{user.overdue}</Badge>
              ) : (
                0
              )}
            </TableCell>
            <TableCell className="text-center font-semibold">{user.total}</TableCell>
          </TableRow>
        ))}
         {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No data available for the selected filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
