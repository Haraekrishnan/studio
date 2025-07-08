'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Folder, File, ChevronRight, Download, AlertTriangle } from "lucide-react";
import { fileContents } from '@/lib/file-contents';
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";

interface FileItemProps {
  name: string;
  path: string;
  level?: number;
}

const FileItem = ({ name, path, level = 0 }: FileItemProps) => {
  const content = fileContents[path] || '';

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2 pr-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="text-sm flex-grow truncate" title={name}>{name}</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleDownload}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};


interface FolderItemProps {
  name: string;
  children: React.ReactNode;
  level?: number;
}

const FolderItem = ({ name, children, level = 0 }: FolderItemProps) => (
  <Collapsible>
    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left [&[data-state=open]>svg:last-child]:rotate-90 pr-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
      <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
      <span className="text-sm font-medium">{name}</span>
      <ChevronRight className="h-4 w-4 ml-auto transition-transform flex-shrink-0" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="flex flex-col gap-2 pt-2">
        {children}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default function FileExplorerPage() {
  const { user } = useAppContext();

  if (user?.role !== 'Admin') {
    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader className="text-center items-center">
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You must be an administrator to view the file explorer.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Explorer</h1>
        <p className="text-muted-foreground">A visual representation of the project's file structure. Click the download icon to save a file.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>Click on folders to expand them.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 font-mono">
            <FileItem name=".env" path=".env" />
            <FileItem name="README.md" path="README.md" />
            <FileItem name="apphosting.yaml" path="apphosting.yaml" />
            <FileItem name="components.json" path="components.json" />
            <FileItem name="next.config.ts" path="next.config.ts" />
            <FileItem name="package.json" path="package.json" />
            <FileItem name="tailwind.config.ts" path="tailwind.config.ts" />
            <FileItem name="tsconfig.json" path="tsconfig.json" />
            
            <FolderItem name="src">
              <FolderItem name="app" level={1}>
                 <FolderItem name="(app)" level={2}>
                    <FileItem name="layout.tsx" path="src/app/(app)/layout.tsx" level={3} />
                    <FolderItem name="account" level={3}><FileItem name="page.tsx" path="src/app/(app)/account/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="achievements" level={3}><FileItem name="page.tsx" path="src/app/(app)/achievements/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="activity-tracker" level={3}><FileItem name="page.tsx" path="src/app/(app)/activity-tracker/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="dashboard" level={3}><FileItem name="page.tsx" path="src/app/(app)/dashboard/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="file-explorer" level={3}><FileItem name="page.tsx" path="src/app/(app)/file-explorer/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="performance" level={3}><FileItem name="page.tsx" path="src/app/(app)/performance/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="planner" level={3}><FileItem name="page.tsx" path="src/app/(app)/planner/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="reports" level={3}><FileItem name="page.tsx" path="src/app/(app)/reports/page.tsx" level={4} /></FolderItem>
                    <FolderItem name="tasks" level={3}><FileItem name="page.tsx" path="src/app/(app)/tasks/page.tsx" level={4} /></FolderItem>
                </FolderItem>
                 <FolderItem name="(auth)" level={2}>
                    <FolderItem name="login" level={3}><FileItem name="page.tsx" path="src/app/(auth)/login/page.tsx" level={4} /></FolderItem>
                </FolderItem>
                <FileItem name="globals.css" path="src/app/globals.css" level={2} />
                <FileItem name="layout.tsx" path="src/app/layout.tsx" level={2} />
                <FileItem name="page.tsx" path="src/app/page.tsx" level={2} />
              </FolderItem>
              
              <FolderItem name="components" level={1}>
                <FolderItem name="account" level={2}>
                    <FileItem name="add-employee-dialog.tsx" path="src/components/account/add-employee-dialog.tsx" level={3} />
                    <FileItem name="add-role-dialog.tsx" path="src/components/account/add-role-dialog.tsx" level={3} />
                    <FileItem name="edit-employee-dialog.tsx" path="src/components/account/edit-employee-dialog.tsx" level={3} />
                    <FileItem name="edit-role-dialog.tsx" path="src/components/account/edit-role-dialog.tsx" level={3} />
                    <FileItem name="role-management-table.tsx" path="src/components/account/role-management-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="achievements" level={2}>
                    <FileItem name="achievements-table.tsx" path="src/components/achievements/achievements-table.tsx" level={3} />
                    <FileItem name="add-achievement-dialog.tsx" path="src/components/achievements/add-achievement-dialog.tsx" level={3} />
                </FolderItem>
                <FolderItem name="activity-tracker" level={2}>
                    <FileItem name="activity-log-table.tsx" path="src/components/activity-tracker/activity-log-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="auth" level={2}>
                    <FileItem name="login-form.tsx" path="src/components/auth/login-form.tsx" level={3} />
                </FolderItem>
                <FolderItem name="dashboard" level={2}>
                    <FileItem name="employee-performance-chart.tsx" path="src/components/dashboard/employee-performance-chart.tsx" level={3} />
                    <FileItem name="employee-performance-pie-chart.tsx" path="src/components/dashboard/employee-performance-pie-chart.tsx" level={3} />
                    <FileItem name="stat-card.tsx" path="src/components/dashboard/stat-card.tsx" level={3} />
                    <FileItem name="tasks-completed-chart.tsx" path="src/components/dashboard/tasks-completed-chart.tsx" level={3} />
                </FolderItem>
                <FolderItem name="performance" level={2}>
                    <FileItem name="employee-stats-table.tsx" path="src/components/performance/employee-stats-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="planner" level={2}>
                    <FileItem name="create-event-dialog.tsx" path="src/components/planner/create-event-dialog.tsx" level={3} />
                    <FileItem name="planner-calendar.tsx" path="src/components/planner/planner-calendar.tsx" level={3} />
                </FolderItem>
                <FolderItem name="reports" level={2}>
                    <FileItem name="report-downloads.tsx" path="src/components/reports/report-downloads.tsx" level={3} />
                    <FileItem name="report-filters.tsx" path="src/components/reports/report-filters.tsx" level={3} />
                    <FileItem name="report-results-table.tsx" path="src/components/reports/report-results-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="shared" level={2}>
                    <FileItem name="app-sidebar.tsx" path="src/components/shared/app-sidebar.tsx" level={3} />
                    <FileItem name="header.tsx" path="src/components/shared/header.tsx" level={3} />
                </FolderItem>
                <FolderItem name="tasks" level={2}>
                    <FileItem name="create-task-dialog.tsx" path="src/components/tasks/create-task-dialog.tsx" level={3} />
                    <FileItem name="edit-task-dialog.tsx" path="src/components/tasks/edit-task-dialog.tsx" level={3} />
                    <FileItem name="kanban-board.tsx" path="src/components/tasks/kanban-board.tsx" level={3} />
                    <FileItem name="kanban-column.tsx" path="src/components/tasks/kanban-column.tsx" level={3} />
                    <FileItem name="task-card.tsx" path="src/components/tasks/task-card.tsx" level={3} />
                    <FileItem name="task-filters.tsx" path="src/components/tasks/task-filters.tsx" level={3} />
                </FolderItem>
                 <FolderItem name="ui" level={2}>
                    <FileItem name="accordion.tsx" path="src/components/ui/accordion.tsx" level={3}/>
                    <FileItem name="alert-dialog.tsx" path="src/components/ui/alert-dialog.tsx" level={3}/>
                    <FileItem name="alert.tsx" path="src/components/ui/alert.tsx" level={3}/>
                    <FileItem name="avatar.tsx" path="src/components/ui/avatar.tsx" level={3}/>
                    <FileItem name="badge.tsx" path="src/components/ui/badge.tsx" level={3}/>
                    <FileItem name="button.tsx" path="src/components/ui/button.tsx" level={3}/>
                    <FileItem name="calendar.tsx" path="src/components/ui/calendar.tsx" level={3}/>
                    <FileItem name="card.tsx" path="src/components/ui/card.tsx" level={3}/>
                    <FileItem name="carousel.tsx" path="src/components/ui/carousel.tsx" level={3}/>
                    <FileItem name="chart.tsx" path="src/components/ui/chart.tsx" level={3}/>
                    <FileItem name="checkbox.tsx" path="src/components/ui/checkbox.tsx" level={3}/>
                    <FileItem name="collapsible.tsx" path="src/components/ui/collapsible.tsx" level={3}/>
                    <FileItem name="command.tsx" path="src/components/ui/command.tsx" level={3}/>
                    <FileItem name="dialog.tsx" path="src/components/ui/dialog.tsx" level={3}/>
                    <FileItem name="dropdown-menu.tsx" path="src/components/ui/dropdown-menu.tsx" level={3}/>
                    <FileItem name="form.tsx" path="src/components/ui/form.tsx" level={3}/>
                    <FileItem name="input.tsx" path="src/components/ui/input.tsx" level={3}/>
                    <FileItem name="label.tsx" path="src/components/ui/label.tsx" level={3}/>
                    <FileItem name="menubar.tsx" path="src/components/ui/menubar.tsx" level={3}/>
                    <FileItem name="popover.tsx" path="src/components/ui/popover.tsx" level={3}/>
                    <FileItem name="progress.tsx" path="src/components/ui/progress.tsx" level={3}/>
                    <FileItem name="radio-group.tsx" path="src/components/ui/radio-group.tsx" level={3}/>
                    <FileItem name="scroll-area.tsx" path="src/components/ui/scroll-area.tsx" level={3}/>
                    <FileItem name="select.tsx" path="src/components/ui/select.tsx" level={3}/>
                    <FileItem name="separator.tsx" path="src/components/ui/separator.tsx" level={3}/>
                    <FileItem name="sheet.tsx" path="src/components/ui/sheet.tsx" level={3}/>
                    <FileItem name="sidebar.tsx" path="src/components/ui/sidebar.tsx" level={3}/>
                    <FileItem name="skeleton.tsx" path="src/components/ui/skeleton.tsx" level={3}/>
                    <FileItem name="slider.tsx" path="src/components/ui/slider.tsx" level={3}/>
                    <FileItem name="switch.tsx" path="src/components/ui/switch.tsx" level={3}/>
                    <FileItem name="table.tsx" path="src/components/ui/table.tsx" level={3}/>
                    <FileItem name="tabs.tsx" path="src/components/ui/tabs.tsx" level={3}/>
                    <FileItem name="textarea.tsx" path="src/components/ui/textarea.tsx" level={3}/>
                    <FileItem name="toast.tsx" path="src/components/ui/toast.tsx" level={3}/>
                    <FileItem name="toaster.tsx" path="src/components/ui/toaster.tsx" level={3}/>
                    <FileItem name="tooltip.tsx" path="src/components/ui/tooltip.tsx" level={3}/>
                </FolderItem>
              </FolderItem>
              <FolderItem name="context" level={1}>
                <FileItem name="app-context.tsx" path="src/context/app-context.tsx" level={2} />
              </FolderItem>
               <FolderItem name="hooks" level={1}>
                <FileItem name="use-mobile.tsx" path="src/hooks/use-mobile.tsx" level={2} />
                <FileItem name="use-toast.ts" path="src/hooks/use-toast.ts" level={2} />
              </FolderItem>
               <FolderItem name="lib" level={1}>
                <FileItem name="file-contents.ts" path="src/lib/file-contents.ts" level={2} />
                <FileItem name="mock-data.ts" path="src/lib/mock-data.ts" level={2} />
                <FileItem name="types.ts" path="src/lib/types.ts" level={2} />
                <FileItem name="utils.ts" path="src/lib/utils.ts" level={2} />
              </FolderItem>
            </FolderItem>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
