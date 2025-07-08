'use client';
import { useMemo, useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';
import { getYear, getMonth, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TasksCompletedChart() {
  const { tasks, getVisibleUsers } = useAppContext();
  
  // Dynamically get available years from tasks and ensure current year is present
  const availableYears = useMemo(() => {
    const yearsFromTasks = tasks
        .filter(t => t.status === 'Completed' && t.dueDate)
        .map(task => {
            try {
                return getYear(parseISO(task.dueDate))
            } catch {
                return null;
            }
        })
        .filter(year => year !== null) as number[];
    
    const uniqueYears = [...new Set(yearsFromTasks)];
    const currentYear = new Date().getFullYear();
    if (!uniqueYears.includes(currentYear)) {
        uniqueYears.push(currentYear);
    }
    
    return uniqueYears.sort((a, b) => b - a);
  }, [tasks]);
  
  const [selectedYear, setSelectedYear] = useState<string>(() => availableYears[0]?.toString() || new Date().getFullYear().toString());

  // This effect ensures that if the available years change (e.g. new data),
  // we don't have a selected year that no longer exists.
  useEffect(() => {
      if (availableYears.length > 0 && !availableYears.map(String).includes(selectedYear)) {
          setSelectedYear(String(availableYears[0]));
      }
  }, [availableYears, selectedYear]);

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const chartData = useMemo(() => {
    const relevantTasks = tasks.filter(t => {
        if (!t.dueDate || t.status !== 'Completed' || !visibleUserIds.includes(t.assigneeId)) {
            return false;
        }
        try {
            return getYear(parseISO(t.dueDate)).toString() === selectedYear;
        } catch {
            return false;
        }
    });

    const monthlyData: { [key: number]: number } = {};

    relevantTasks.forEach(task => {
        try {
          const month = getMonth(parseISO(task.dueDate));
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        } catch (error) {
          console.error("Invalid date format for task:", task.id, task.dueDate);
        }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthNames.map((name, index) => ({
      name,
      completed: monthlyData[index] || 0,
    }));
  }, [tasks, visibleUserIds, selectedYear]);

  return (
    <div className="h-[350px] flex flex-col">
        <div className="flex justify-end mb-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex-1">
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
    </div>
  );
}
