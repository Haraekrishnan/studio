'use client';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';

export default function EmployeePerformanceChart() {
  const { tasks, users } = useAppContext();

  const chartData = useMemo(() => {
    return users.map(user => {
      const completedTasks = tasks.filter(
        task => task.assigneeId === user.id && task.status === 'Completed'
      ).length;
      return { name: user.name, completed: completedTasks };
    });
  }, [tasks, users]);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tasks Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
