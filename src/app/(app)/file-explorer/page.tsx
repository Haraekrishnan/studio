'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Folder, File, ChevronRight } from "lucide-react";

interface FileItemProps {
  name: string;
  icon?: React.ReactNode;
  level?: number;
}

const FileItem = ({ name, icon = <File className="h-4 w-4 text-muted-foreground" />, level = 0 }: FileItemProps) => (
  <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
    {icon}
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
    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left [&[data-state=open]>svg:last-child]:rotate-90" style={{ paddingLeft: `${level * 1.5}rem` }}>
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
          <CardDescription>Click on folders to expand them and see the files inside.</CardDescription>
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
                <FileItem name="globals.css" level={2} />
                <FileItem name="layout.tsx" level={2} />
                <FileItem name="page.tsx" level={2} />
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
              </FolderItem>
              
              <FolderItem name="components" level={1}>
                <FileItem name="many component files..." level={2} />
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
