'use client';

import { useAppContext } from '@/context/app-context';
import type { ActivityLog } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export default function ActivityLogTable({ logs }: ActivityLogTableProps) {
  const { users } = useAppContext();

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return 'Active';
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (logs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No activity logs to display.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Login Time</TableHead>
          <TableHead>Logout Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Activities</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          const logUser = users.find(u => u.id === log.userId);
          return (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={logUser?.avatar} alt={logUser?.name} />
                    <AvatarFallback>{logUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{logUser?.name}</p>
                    <p className="text-sm text-muted-foreground">{logUser?.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(log.loginTime), 'dd-MM-yyyy')}</TableCell>
              <TableCell>{format(new Date(log.loginTime), 'p')}</TableCell>
              <TableCell>{log.logoutTime ? format(new Date(log.logoutTime), 'p') : <Badge variant="secondary">Active</Badge>}</TableCell>
              <TableCell>{formatDuration(log.duration)}</TableCell>
              <TableCell>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {log.actions.length} action(s) <ChevronDown className="h-4 w-4 ml-2"/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="list-none space-y-2 mt-2 pl-2">
                      {log.actions.map((action, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                           <ChevronsRight className="h-3 w-3 mt-0.5 shrink-0"/> <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
