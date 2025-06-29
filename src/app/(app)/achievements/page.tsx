'use client';

import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AchievementsTable from '@/components/achievements/achievements-table';
import AddAchievementDialog from '@/components/achievements/add-achievement-dialog';
import type { User, Task, Achievement } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AchievementsPage() {
  const { user, users, tasks, achievements, getVisibleUsers, approveAchievement, rejectAchievement } = useAppContext();
  const { toast } = useToast();

  const [achievementToApprove, setAchievementToApprove] = useState<Achievement | null>(null);
  const [newPoints, setNewPoints] = useState(0);

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const canAddManualAchievement = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor';
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager';

  const performanceData = useMemo(() => {
    return visibleUsers
      .filter(u => u.role !== 'Admin' && u.role !== 'Manager') // Filter out top-level roles from ranking
      .map(u => {
        const userTasks = tasks.filter(t => t.assigneeId === u.id);
        const completedCount = userTasks.filter(t => t.status === 'Completed').length;
        const overdueCount = userTasks.filter(t => t.status === 'Overdue').length;
        const performanceScore = (completedCount * 10) - (overdueCount * 5);
        
        const manualAchievements = achievements.filter(a => a.userId === u.id && a.type === 'manual' && a.status === 'approved');
        const manualPoints = manualAchievements.reduce((sum, a) => sum + a.points, 0);

        return {
          user: u,
          score: performanceScore + manualPoints,
          completed: completedCount,
          overdue: overdueCount,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [visibleUsers, tasks, achievements]);

  const manualAchievements = useMemo(() => {
    return achievements.filter(ach => ach.type === 'manual' && ach.status === 'approved' && visibleUserIds.includes(ach.userId));
  }, [achievements, visibleUserIds]);

  const pendingAchievements = useMemo(() => {
    if (!canApprove) return [];
    return achievements.filter(ach => ach.status === 'pending');
  }, [achievements, canApprove]);

  const handleApproveClick = (achievement: Achievement) => {
    setAchievementToApprove(achievement);
    setNewPoints(achievement.points);
  };

  const handleConfirmApproval = () => {
    if (achievementToApprove) {
      approveAchievement(achievementToApprove.id, newPoints);
      toast({ title: 'Achievement Approved', description: 'The award has been approved and points are added.' });
      setAchievementToApprove(null);
    }
  };

  const handleReject = (achievementId: string) => {
    rejectAchievement(achievementId);
    toast({ variant: 'destructive', title: 'Achievement Rejected', description: 'The award has been removed.' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements & Rankings</h1>
          <p className="text-muted-foreground">Recognize top performers and award achievements.</p>
        </div>
        {canAddManualAchievement && <AddAchievementDialog />}
      </div>
      
      {canApprove && pendingAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Achievement Approvals</CardTitle>
            <CardDescription>Review and approve manual awards submitted by supervisors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Award</TableHead>
                  <TableHead>Awarded By</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAchievements.map((item) => {
                  const user = users.find(u => u.id === item.userId);
                  const awardedBy = users.find(u => u.id === item.awardedById);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{awardedBy?.name}</TableCell>
                      <TableCell className="text-right">{item.points}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" onClick={() => handleApproveClick(item)}>Approve</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Achievement</AlertDialogTitle>
                              <AlertDialogDescription>
                                You are approving the achievement "{achievementToApprove?.title}" for {users.find(u=>u.id === achievementToApprove?.userId)?.name}. You can adjust the points if needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <Label htmlFor="points">Points</Label>
                              <Input id="points" type="number" value={newPoints} onChange={(e) => setNewPoints(Number(e.target.value))} />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setAchievementToApprove(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleConfirmApproval}>Confirm Approval</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Performance Index Ranking</CardTitle>
          <CardDescription>Employees ranked by their overall performance score.</CardDescription>
        </CardHeader>
        <CardContent>
          <AchievementsTable data={performanceData} type="performance" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manual Awards & Recognitions</CardTitle>
          <CardDescription>Special achievements awarded by management.</CardDescription>
        </CardHeader>
        <CardContent>
          <AchievementsTable data={manualAchievements} type="manual" />
        </CardContent>
      </Card>
    </div>
  );
}
