'use client';
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
import { Trophy, Award, Medal } from 'lucide-react';
import type { User, Achievement } from '@/lib/types';
import { format } from 'date-fns';

interface PerformanceData {
  user: User;
  score: number;
  completed: number;
  overdue: number;
}

interface AchievementsTableProps {
  data: any[];
  type: 'performance' | 'manual';
}

export default function AchievementsTable({ data, type }: AchievementsTableProps) {
  const { users } = useAppContext();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-yellow-700" />;
    return <span className="w-5 text-center">{index + 1}</span>;
  };

  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data to display.</p>;
  }

  if (type === 'performance') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead className="text-center">Completed Tasks</TableHead>
            <TableHead className="text-center">Overdue Tasks</TableHead>
            <TableHead className="text-right">Performance Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data as PerformanceData[]).map((item, index) => (
            <TableRow key={item.user.id}>
              <TableCell className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-sm text-muted-foreground">{item.user.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.completed}</TableCell>
              <TableCell className="text-center">{item.overdue}</TableCell>
              <TableCell className="text-right font-semibold">{item.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Achievement</TableHead>
          <TableHead>Awarded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as Achievement[]).map((item) => {
            const user = users.find(u => u.id === item.userId);
            const awardedBy = users.find(u => u.id === item.awardedById);
            return (
                <TableRow key={item.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user?.name}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </TableCell>
                <TableCell>{awardedBy?.name || 'System'}</TableCell>
                <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right font-semibold">{item.points}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
