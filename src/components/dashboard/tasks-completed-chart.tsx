'use client';
import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';
import { getMonth, parseISO } from 'date-fns';

export default function TasksCompletedChart() {
  const { tasks, user, getVisibleUsers } = useAppContext();
  
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const chartData = useMemo(() => {
    const relevantTasks = tasks.filter(t => visibleUserIds.includes(t.assigneeId) && t.status === 'Completed');

    const monthlyData: { [key: number]: number } = {};

    relevantTasks.forEach(task => {
      // Ensure dueDate is a valid date string before parsing
      if (task.dueDate) {
        try {
          const month = getMonth(parseISO(task.dueDate));
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        } catch (error) {
          console.error("Invalid date format for task:", task.id, task.dueDate);
        }
      }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthNames.map((name, index) => ({
      name,
      completed: monthlyData[index] || 0,
    }));
  }, [tasks, visibleUserIds]);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
          <Tooltip 
            cursor={{strokeDasharray: '3 3'}}
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
