'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
                    <CardTitle>Tasks Completed by Employee</CardTitle>
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
