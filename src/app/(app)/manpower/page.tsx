'use client';
import { useState, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import ManpowerSummaryTable from '@/components/manpower/ManpowerSummaryTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ManpowerLogDialog from '@/components/manpower/ManpowerLogDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import ManpowerReportDownloads from '@/components/manpower/ManpowerReportDownloads';

export default function ManpowerPage() {
    const { user, roles, manpowerLogs } = useAppContext();
    const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
    const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>();

    const canManageManpower = useMemo(() => {
        if (!user) return false;
        const userRole = roles.find(r => r.name === user.role);
        return userRole?.permissions.includes('manage_manpower');
    }, [user, roles]);

    const canLogForProject = user?.role === 'Supervisor' || user?.role === 'Junior Supervisor' || canManageManpower;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manpower Details</h1>
                    <p className="text-muted-foreground">Track daily manpower logs and generate reports.</p>
                </div>
                {canLogForProject && (
                    <Button onClick={() => setIsLogDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Manpower
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Today's Manpower Summary</CardTitle>
                    <CardDescription>An overview of manpower counts for today across all projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManpowerSummaryTable />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Generate Manpower Report</CardTitle>
                    <CardDescription>Select a date range to generate a downloadable Excel report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full md:w-[300px] justify-start text-left font-normal',
                              !reportDateRange && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reportDateRange?.from ? (
                              reportDateRange.to ? (
                                <>
                                  {format(reportDateRange.from, 'LLL dd, y')} - {format(reportDateRange.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(reportDateRange.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={reportDateRange?.from}
                            selected={reportDateRange}
                            onSelect={setReportDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <ManpowerReportDownloads dateRange={reportDateRange} />
                </CardContent>
            </Card>

            <ManpowerLogDialog isOpen={isLogDialogOpen} setIsOpen={setIsLogDialogOpen} />
        </div>
    );
}
