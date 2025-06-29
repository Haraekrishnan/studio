'use client';

import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AchievementsTable from '@/components/achievements/achievements-table';
import AddAchievementDialog from '@/components/achievements/add-achievement-dialog';
import type { User, Task, Achievement } from '@/lib/types';

export default function AchievementsPage() {
  const { user, users, tasks, achievements, getVisibleUsers } = useAppContext();

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const canAddManualAchievement = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor';

  const performanceData = useMemo(() => {
    return visibleUsers
      .filter(u => u.role !== 'Admin' && u.role !== 'Manager') // Filter out top-level roles from ranking
      .map(u => {
        const userTasks = tasks.filter(t => t.assigneeId === u.id);
        const completedCount = userTasks.filter(t => t.status === 'Completed').length;
        const overdueCount = userTasks.filter(t => t.status === 'Overdue').length;
        const performanceScore = (completedCount * 10) - (overdueCount * 5);
        
        const manualAchievements = achievements.filter(a => a.userId === u.id && a.type === 'manual');
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
    return achievements.filter(ach => ach.type === 'manual' && visibleUserIds.includes(ach.userId));
  }, [achievements, visibleUserIds]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements & Rankings</h1>
          <p className="text-muted-foreground">Recognize top performers and award achievements.</p>
        </div>
        {canAddManualAchievement && <AddAchievementDialog />}
      </div>
      
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
