'use client';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '@/context/app-context';
import type { Task } from '@/lib/types';

export default function EmployeePerformanceChart() {
  const { tasks, getVisibleUsers } = useAppContext();
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const chartData = useMemo(() => {
    return visibleUsers.map(user => {
      const userTasks = tasks.filter(task => task.assigneeId === user.id);
      const completed = userTasks.filter(t => t.status === 'Completed').length;
      const inProgress = userTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending Approval').length;
      const todo = userTasks.filter(t => t.status === 'To Do').length;
      const overdue = userTasks.filter(t => t.status === 'Overdue').length;

      return { 
        name: user.name, 
        completed,
        inProgress,
        todo,
        overdue,
        total: userTasks.length
      };
    });
  }, [tasks, visibleUsers]);

  return (
    <div className="h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{fill: 'hsl(var(--muted))'}}
            contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Bar dataKey="todo" fill="hsl(var(--chart-1))" name="To Do" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="hsl(var(--chart-2))" name="In Progress" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="hsl(var(--chart-3))" name="Completed" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overdue" fill="hsl(var(--destructive))" name="Overdue" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
