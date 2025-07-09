'use client';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Plane } from 'lucide-react';
import StatCard from '../dashboard/stat-card';

export default function ManpowerSummary() {
  const { workingManpowerCount, onLeaveManpowerCount } = useAppContext();

  return (
    <div className="grid gap-6 md:grid-cols-3">
       <StatCard 
          title="Total Working" 
          value={workingManpowerCount} 
          icon={Users} 
          description="Current active manpower count"
        />
        <StatCard 
          title="On Leave" 
          value={onLeaveManpowerCount}
          icon={Plane} 
          description="Manpower currently on leave"
        />
        <StatCard 
          title="Total Strength" 
          value={workingManpowerCount + onLeaveManpowerCount} 
          icon={Briefcase} 
          description="Total manpower including on leave"
        />
    </div>
  );
}
