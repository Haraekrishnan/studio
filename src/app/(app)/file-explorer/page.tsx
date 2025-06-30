'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Folder, File, ChevronRight } from "lucide-react";

interface FileItemProps {
  name: string;
  level?: number;
}

const FileItem = ({ name, level = 0 }: FileItemProps) => (
  <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
    <File className="h-4 w-4 text-muted-foreground" />
    <span className="text-sm">{name}</span>
  </div>
);

interface FolderItemProps {
  name: string;
  children: React.ReactNode;
  level?: number;
}

const FolderItem = ({ name, children, level = 0 }: FolderItemProps) => (
  <Collapsible>
    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left [&[data-state=open]>svg:last-child]:rotate-90 pr-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
      <Folder className="h-4 w-4 text-blue-500" />
      <span className="text-sm font-medium">{name}</span>
      <ChevronRight className="h-4 w-4 ml-auto transition-transform" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="flex flex-col gap-2 pt-2">
        {children}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export default function FileExplorerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Explorer</h1>
        <p className="text-muted-foreground">A visual representation of the project's file structure.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>Click on folders to expand them.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 font-mono">
            <FileItem name=".env" />
            <FileItem name="README.md" />
            <FileItem name="apphosting.yaml" />
            <FileItem name="components.json" />
            <FileItem name="next.config.ts" />
            <FileItem name="package.json" />
            <FileItem name="tailwind.config.ts" />
            <FileItem name="tsconfig.json" />
            
            <FolderItem name="src">
              <FolderItem name="ai" level={1}>
                <FileItem name="dev.ts" level={2} />
                <FileItem name="genkit.ts" level={2} />
                <FolderItem name="flows" level={2}>
                  <FileItem name="ai-task-suggestions.ts" level={3} />
                  <FileItem name="suggest-task-priority.ts" level={3} />
                </FolderItem>
              </FolderItem>

              <FolderItem name="app" level={1}>
                 <FolderItem name="(app)" level={2}>
                    <FileItem name="layout.tsx" level={3} />
                    <FolderItem name="account" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="achievements" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="activity-tracker" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="dashboard" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="file-explorer" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="performance" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="planner" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="reports" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                    <FolderItem name="tasks" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                </FolderItem>
                 <FolderItem name="(auth)" level={2}>
                    <FolderItem name="login" level={3}><FileItem name="page.tsx" level={4} /></FolderItem>
                </FolderItem>
                <FileItem name="globals.css" level={2} />
                <FileItem name="layout.tsx" level={2} />
                <FileItem name="page.tsx" level={2} />
              </FolderItem>
              
              <FolderItem name="components" level={1}>
                <FolderItem name="account" level={2}>
                    <FileItem name="add-employee-dialog.tsx" level={3} />
                    <FileItem name="add-role-dialog.tsx" level={3} />
                    <FileItem name="edit-employee-dialog.tsx" level={3} />
                    <FileItem name="edit-role-dialog.tsx" level={3} />
                    <FileItem name="role-management-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="achievements" level={2}>
                    <FileItem name="achievements-table.tsx" level={3} />
                    <FileItem name="add-achievement-dialog.tsx" level={3} />
                </FolderItem>
                <FolderItem name="activity-tracker" level={2}>
                    <FileItem name="activity-log-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="auth" level={2}>
                    <FileItem name="login-form.tsx" level={3} />
                </FolderItem>
                <FolderItem name="dashboard" level={2}>
                    <FileItem name="employee-performance-chart.tsx" level={3} />
                    <FileItem name="employee-performance-pie-chart.tsx" level={3} />
                    <FileItem name="stat-card.tsx" level={3} />
                    <FileItem name="tasks-completed-chart.tsx" level={3} />
                </FolderItem>
                <FolderItem name="performance" level={2}>
                    <FileItem name="employee-stats-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="planner" level={2}>
                    <FileItem name="create-event-dialog.tsx" level={3} />
                    <FileItem name="planner-calendar.tsx" level={3} />
                </FolderItem>
                <FolderItem name="reports" level={2}>
                    <FileItem name="report-downloads.tsx" level={3} />
                    <FileItem name="report-filters.tsx" level={3} />
                    <FileItem name="report-results-table.tsx" level={3} />
                </FolderItem>
                <FolderItem name="shared" level={2}>
                    <FileItem name="app-sidebar.tsx" level={3} />
                    <FileItem name="header.tsx" level={3} />
                </FolderItem>
                <FolderItem name="tasks" level={2}>
                    <FileItem name="ai-tools-dialog.tsx" level={3} />
                    <FileItem name="create-task-dialog.tsx" level={3} />
                    <FileItem name="edit-task-dialog.tsx" level={3} />
                    <FileItem name="kanban-board.tsx" level={3} />
                    <FileItem name="kanban-column.tsx" level={3} />
                    <FileItem name="task-card.tsx" level={3} />
                    <FileItem name="task-filters.tsx" level={3} />
                </FolderItem>
                 <FolderItem name="ui" level={2}>
                   <FileItem name="..." level={3} />
                </FolderItem>
              </FolderItem>
              <FolderItem name="context" level={1}>
                <FileItem name="app-context.tsx" level={2} />
              </FolderItem>
               <FolderItem name="hooks" level={1}>
                <FileItem name="use-mobile.tsx" level={2} />
                <FileItem name="use-toast.ts" level={2} />
              </FolderItem>
               <FolderItem name="lib" level={1}>
                <FileItem name="mock-data.ts" level={2} />
                <FileItem name="types.ts" level={2} />
                <FileItem name="utils.ts" level={2} />
              </FolderItem>
            </FolderItem>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
