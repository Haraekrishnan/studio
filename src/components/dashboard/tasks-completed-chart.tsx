'use client';
import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';
import { format, getMonth, parseISO } from 'date-fns';

export default function TasksCompletedChart() {
  const { tasks, user } = useAppContext();

  const chartData = useMemo(() => {
    const relevantTasks = user?.role === 'Team Member'
        ? tasks.filter(t => t.assigneeId === user.id && t.status === 'Completed')
        : tasks.filter(t => t.status === 'Completed');

    const monthlyData: { [key: number]: number } = {};

    relevantTasks.forEach(task => {
      const month = getMonth(parseISO(task.dueDate));
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthNames.map((name, index) => ({
      name,
      completed: monthlyData[index] || 0,
    }));
  }, [tasks, user]);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} name="Tasks Completed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
