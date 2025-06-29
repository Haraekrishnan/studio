'use client';
import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function EmployeePerformancePieChart() {
  const { tasks, getVisibleUsers } = useAppContext();
  const [selectedUserId, setSelectedUserId] = useState('all');

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  
  const chartData = useMemo(() => {
    const tasksToConsider = selectedUserId === 'all'
      ? tasks.filter(t => visibleUsers.some(u => u.id === t.assigneeId))
      : tasks.filter(task => task.assigneeId === selectedUserId);

    const statuses = {
      'To Do': tasksToConsider.filter(t => t.status === 'To Do').length,
      'In Progress': tasksToConsider.filter(t => t.status === 'In Progress').length,
      'Completed': tasksToConsider.filter(t => t.status === 'Completed').length,
    };
    
    return [
      { name: 'To Do', value: statuses['To Do'] },
      { name: 'In Progress', value: statuses['In Progress'] },
      { name: 'Completed', value: statuses['Completed'] },
    ].filter(d => d.value > 0);
  }, [tasks, selectedUserId, visibleUsers]);

  const selectedUserName = useMemo(() => {
    if (selectedUserId === 'all') return 'All Team Members';
    return visibleUsers.find(u => u.id === selectedUserId)?.name || '';
  }, [selectedUserId, visibleUsers]);

  return (
    <div className="h-[350px] flex flex-col">
      <div className="px-4 pb-2">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            {visibleUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">Showing task distribution for {selectedUserName}.</p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
                cursor={{fill: 'hsl(var(--muted))'}}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {chartData.length === 0 && (
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))">
                    No tasks to display.
                </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
