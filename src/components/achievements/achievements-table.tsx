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
import { Trophy, Award, Medal, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { User, Achievement } from '@/lib/types';
import { format } from 'date-fns';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import EditAchievementDialog from './edit-achievement-dialog';


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
  const { user, users, deleteManualAchievement } = useAppContext();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

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

  const handleDelete = (achievementId: string) => {
    deleteManualAchievement(achievementId);
    toast({
        variant: 'destructive',
        title: 'Achievement Deleted',
        description: 'The manual achievement has been removed.',
    });
  };

  const handleEditClick = (achievement: Achievement) => {
      setSelectedAchievement(achievement);
      setIsEditDialogOpen(true);
  };

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Achievement</TableHead>
          <TableHead>Awarded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as Achievement[]).map((item) => {
            const achievementUser = users.find(u => u.id === item.userId);
            const awardedBy = users.find(u => u.id === item.awardedById);
            const canManage = user?.role === 'Admin' || user?.role === 'Manager' || user?.id === item.awardedById;

            return (
                <TableRow key={item.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={achievementUser?.avatar} alt={achievementUser?.name} />
                            <AvatarFallback>{achievementUser?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{achievementUser?.name}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </TableCell>
                <TableCell>{awardedBy?.name || 'System'}</TableCell>
                <TableCell>{format(new Date(item.date), 'dd-MM-yyyy')}</TableCell>
                <TableCell className="text-right font-semibold">{item.points}</TableCell>
                <TableCell className="text-right">
                    {canManage && (
                         <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => handleEditClick(item)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the "{item.title}" achievement.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
    {selectedAchievement && (
        <EditAchievementDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            achievement={selectedAchievement}
        />
    )}
    </>
  );
}
