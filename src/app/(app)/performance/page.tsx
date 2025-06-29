'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import EmployeePerformanceChart from '@/components/dashboard/employee-performance-chart';
import EmployeeStatsTable from '@/components/performance/employee-stats-table';

export default function PerformancePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
                <p className="text-muted-foreground">Review individual and team performance metrics.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task Status Distribution by Employee</CardTitle>
                    <CardDescription>A column chart showing the current workload and status for each employee.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmployeePerformanceChart />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmployeeStatsTable />
                </CardContent>
            </Card>
        </div>
    );
}
