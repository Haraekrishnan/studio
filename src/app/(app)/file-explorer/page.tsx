
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Folder, File, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const fileContents: Record<string, string> = {
  ".env": ``,
  "README.md": `# Aries Marine - Task Management System

This is a comprehensive task management application built with Next.js and Firebase Studio. It's designed to help teams organize, track, and manage their work efficiently.

## Key Features

- **Dashboard:** Get a quick overview of team activity, including task statistics and completion charts.
- **Task Management:** A Kanban-style board for managing tasks through different stages (To Do, In Progress, Completed).
- **Planner:** Schedule and organize team events with a monthly calendar view.
- **Performance Tracking:** Analyze individual and team performance with detailed charts and statistics.
- **User Management:** Admins can add, edit, and manage user accounts and roles.
- **Reporting:** Generate and download task reports in Excel or PDF format.
- **AI-Powered Suggestions:** Leverage Genkit to get AI suggestions for task priority and optimal assignees.

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Run the Development Server:**
    \`\`\`bash
    npm run dev
    \`\`\`

The application will be available at \`http://localhost:9002\`.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with ShadCN UI components
- **AI:** Google Genkit
- **State Management:** React Context API
- **Forms:** React Hook Form with Zod for validation
`,
  "apphosting.yaml": `# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
`,
  "components.json": `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`,
  "next.config.ts": `import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
`,
  "package.json": `{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@genkit-ai/googleai": "^1.13.0",
    "@genkit-ai/next": "^1.13.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.13.0",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.13.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
`,
  "tailwind.config.ts": `import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
  "src/ai/dev.ts": `import { config } from 'dotenv';
config();

import '@/ai/flows/ai-task-suggestions.ts';
import '@/ai/flows/suggest-task-priority.ts';
`,
  "src/ai/genkit.ts": `import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
`,
  "src/ai/flows/ai-task-suggestions.ts": `'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered task suggestions,
 * including actions and assignee recommendations, to enhance task management efficiency.
 *
 * - aiTaskSuggestions - A function that triggers the AI task suggestion flow.
 * - AiTaskSuggestionsInput - The input type for the aiTaskSuggestions function.
 * - AiTaskSuggestionsOutput - The return type for the aiTaskSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskSuggestionsInputSchema = z.object({
  taskDescription: z.string().describe('Detailed description of the task.'),
  currentAssigneeRole: z.string().describe('Role of the current task assignee.'),
  availableAssignees: z.array(z.object({
    name: z.string(),
    role: z.string(),
  })).describe('List of available assignees with their roles.'),
  taskStatus: z.string().describe('The current status of the task (e.g., To Do, In Progress).'),
  taskDeadline: z.string().describe('The deadline for the task.'),
});
export type AiTaskSuggestionsInput = z.infer<typeof AiTaskSuggestionsInputSchema>;

const AiTaskSuggestionsOutputSchema = z.object({
  suggestedActions: z.array(z.string()).describe('AI-suggested actions to move the task forward.'),
  optimalAssignee: z.string().describe('AI-recommended assignee based on role and task requirements.'),
  reasoning: z.string().describe('Explanation of why the suggested actions and assignee are optimal.'),
});
export type AiTaskSuggestionsOutput = z.infer<typeof AiTaskSuggestionsOutputSchema>;

export async function aiTaskSuggestions(input: AiTaskSuggestionsInput): Promise<AiTaskSuggestionsOutput> {
  return aiTaskSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskSuggestionsPrompt',
  input: {schema: AiTaskSuggestionsInputSchema},
  output: {schema: AiTaskSuggestionsOutputSchema},
  prompt: \`You are an AI assistant designed to provide suggestions for task management.

Given the following task description, current assignee role, list of available assignees with their roles, task status, and task deadline, suggest actions to move the task forward and recommend an optimal assignee.

Task Description: {{{taskDescription}}}
Current Assignee Role: {{{currentAssigneeRole}}}
Available Assignees: {{#each availableAssignees}}{{{name}}} ({{{role}}}) {{/each}}
Task Status: {{{taskStatus}}}
Task Deadline: {{{taskDeadline}}}

Consider the task requirements, assignee roles and availability, and task status when generating suggestions. Explain your reasoning for the suggested actions and assignee.

Output the suggested actions, optimal assignee, and your reasoning in the format specified by the schema.
\`,
});

const aiTaskSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiTaskSuggestionsFlow',
    inputSchema: AiTaskSuggestionsInputSchema,
    outputSchema: AiTaskSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/suggest-task-priority.ts": `'use server';

/**
 * @fileOverview An AI agent for suggesting task priorities based on deadlines, importance, and user roles.
 *
 * - suggestTaskPriority - A function that suggests task priorities.
 * - SuggestTaskPriorityInput - The input type for the suggestTaskPriority function.
 * - SuggestTaskPriorityOutput - The return type for the suggestTaskPriority function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskPriorityInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  deadline: z.string().describe('The deadline for the task (YYYY-MM-DD).'),
  importance: z.enum(['High', 'Medium', 'Low']).describe('The importance level of the task.'),
  userRole: z.string().describe('The role of the user assigned to the task.'),
  availableUsers: z
    .array(z.string())
    .describe('List of available users and their roles. Example: ["User A (Manager)", "User B (Team Member)"]'),
});
export type SuggestTaskPriorityInput = z.infer<typeof SuggestTaskPriorityInputSchema>;

const SuggestTaskPriorityOutputSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']).describe('The suggested priority for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested priority.'),
});
export type SuggestTaskPriorityOutput = z.infer<typeof SuggestTaskPriorityOutputSchema>;

export async function suggestTaskPriority(input: SuggestTaskPriorityInput): Promise<SuggestTaskPriorityOutput> {
  return suggestTaskPriorityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskPriorityPrompt',
  input: {schema: SuggestTaskPriorityInputSchema},
  output: {schema: SuggestTaskPriorityOutputSchema},
  prompt: \`You are an expert at task management and prioritization.
Analyze the task details provided below to suggest a priority level (High, Medium, or Low).

Task Description: {{{taskDescription}}}
Current Importance: {{{importance}}}
Deadline: {{{deadline}}}
User Role of creator/assigner: {{{userRole}}}
List of available users:
{{#each availableUsers}}
- {{{this}}}
{{/each}}

Consider the deadline, the stated importance, and the roles of users involved. A closer deadline usually means a higher priority. A task assigned by a manager might be more important. Your primary goal is to provide a sensible priority.
Explain your reasoning for the suggested priority.
\`,
});

const suggestTaskPriorityFlow = ai.defineFlow(
  {
    name: 'suggestTaskPriorityFlow',
    inputSchema: SuggestTaskPriorityInputSchema,
    outputSchema: SuggestTaskPriorityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/app/globals.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
}

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.75rem;
    --chart-1: 221 83% 53%;
    --chart-2: 168 85% 44%;
    --chart-3: 38 96% 56%;
    --chart-4: 345 85% 60%;
    --chart-5: 265 85% 65%;
    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 222.2 84% 4.9%;
    --sidebar-accent: 210 40% 96.1%;
    --sidebar-accent-foreground: 222.2 47.4% 11.2%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 221 83% 53%;
    --chart-2: 168 85% 44%;
    --chart-3: 38 96% 56%;
    --chart-4: 345 85% 60%;
    --chart-5: 265 85% 65%;
    --sidebar-background: 222.2 84% 4.9%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-accent: 217.2 32.6% 17.5%;
    --sidebar-accent-foreground: 210 40% 98%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`,
  "src/app/layout.tsx": `'use client';
import { AppContextProvider, useAppContext } from '@/context/app-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { useEffect } from 'react';

function AppTitleUpdater() {
  const { appName } = useAppContext();
  useEffect(() => {
    document.title = appName;
  }, [appName]);
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Title is set dynamically by AppTitleUpdater */}
        <meta name="description" content="A collaborative task management application." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <AppContextProvider>
          <AppTitleUpdater />
          {children}
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
`,
  "src/app/page.tsx": `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p>Redirecting...</p>
    </div>
  );
}
`,
  "src/context/app-context.tsx": `'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES } from '@/lib/mock-data';
import { addMonths, eachDayOfInterval, endOfMonth, isMatch, isSameDay, isWeekend, startOfMonth, differenceInMinutes, format } from 'date-fns';

interface AppContextType {
  user: User | null;
  users: User[];
  roles: RoleDefinition[];
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  dailyPlannerComments: DailyPlannerComment[];
  achievements: Achievement[];
  activityLogs: ActivityLog[];
  appName: string;
  appLogo: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'completionDateIsMandatory'>) => void;
  deleteTask: (taskId: string) => void;
  addPlannerEvent: (event: Omit<PlannerEvent, 'id' | 'comments'>) => void;
  getExpandedPlannerEvents: (date: Date, userId: string) => (PlannerEvent & { eventDate: Date })[];
  getVisibleUsers: () => User[];
  addUser: (newUser: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  addRole: (role: Omit<RoleDefinition, 'id' | 'isEditable'>) => void;
  updateRole: (updatedRole: RoleDefinition) => void;
  deleteRole: (roleId: string) => void;
  updateProfile: (name: string, email: string, avatar: string) => void;
  requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => boolean;
  approveTaskStatusChange: (taskId: string, commentText: string) => void;
  returnTaskStatusChange: (taskId: string, commentText: string) => void;
  addComment: (taskId: string, commentText: string) => void;
  addManualAchievement: (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => void;
  approveAchievement: (achievementId: string, points: number) => void;
  rejectAchievement: (achievementId: string) => void;
  addPlannerEventComment: (eventId: string, commentText: string) => void;
  addDailyPlannerComment: (plannerUserId: string, date: Date, commentText: string) => void;
  updateBranding: (name: string, logo: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(PLANNER_EVENTS);
  const [dailyPlannerComments, setDailyPlannerComments] = useState<DailyPlannerComment[]>(DAILY_PLANNER_COMMENTS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [appName, setAppName] = useState('Aries Marine - Task Management System');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const storedAppName = localStorage.getItem('appName');
    const storedAppLogo = localStorage.getItem('appLogo');
    if (storedAppName) {
      setAppName(storedAppName);
    }
    if (storedAppLogo) {
      setAppLogo(storedAppLogo);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (
                    new Date(task.dueDate) < new Date() &&
                    task.status !== 'Completed' &&
                    task.status !== 'Overdue'
                ) {
                    return { ...task, status: 'Overdue' };
                }
                return task;
            })
        );
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const recordAction = useCallback((actionText: string) => {
    if (!currentLogId) return;

    setActivityLogs(prevLogs => {
      return prevLogs.map(log => {
        if (log.id === currentLogId) {
          return { ...log, actions: [...log.actions, actionText] };
        }
        return log;
      });
    });
  }, [currentLogId]);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      
      const newLog: ActivityLog = {
        id: \`log-\${Date.now()}\`,
        userId: foundUser.id,
        loginTime: new Date().toISOString(),
        logoutTime: null,
        duration: null,
        actions: ['User logged in.'],
      };
      setActivityLogs(prev => [newLog, ...prev]);
      setCurrentLogId(newLog.id);

      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentLogId) {
      const logoutTime = new Date();
      setActivityLogs(prevLogs => 
        prevLogs.map(log => {
          if (log.id === currentLogId) {
            const loginTime = new Date(log.loginTime);
            return {
              ...log,
              logoutTime: logoutTime.toISOString(),
              duration: differenceInMinutes(logoutTime, loginTime),
              actions: [...log.actions, 'User logged out.'],
            };
          }
          return log;
        })
      );
      setCurrentLogId(null);
    }
    setUser(null);
    router.push('/login');
  };

  const getSubordinates = useCallback((managerId: string): string[] => {
    let subordinates: string[] = [];
    const directReports = users.filter(u => u.supervisorId === managerId);
    for (const report of directReports) {
      subordinates.push(report.id);
      if (['Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE'].includes(report.role)) {
        subordinates = subordinates.concat(getSubordinates(report.id));
      }
    }
    return subordinates;
  }, [users]);
  
  const getVisibleUsers = useCallback((): User[] => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return users;
    }
    if (['Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE'].includes(user.role)) {
      const subordinateIds = getSubordinates(user.id);
      return users.filter(u => u.id === user.id || subordinateIds.includes(u.id));
    }
    return users.filter(u => u.id === user.id);
  }, [user, users, getSubordinates]);
  
  const addTask = (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState'>) => {
    const newTask: Task = {
        ...task,
        id: \`task-\${Date.now()}\`,
        comments: [],
        status: 'To Do',
        approvalState: 'none'
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    recordAction(\`Created task: "\${task.title}"\`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    recordAction(\`Updated task details for: "\${updatedTask.title}"\`);
  };

  const addComment = (taskId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    const task = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } : t
    ));
    recordAction(\`Commented on task: "\${task?.title}"\`);
  };
  
  const requestTaskStatusChange = (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user || !commentText) return false;

    if (newStatus === 'Completed' && task.requiresAttachmentForCompletion && !attachment && !task.attachment) {
      return false; // Prevents completion without attachment
    }

    addComment(taskId, \`Status change requested to "\${newStatus}": \${commentText}\`);
    const updatedTask = {
      ...task,
      previousStatus: task.status,
      pendingStatus: newStatus,
      approvalState: 'pending' as ApprovalState,
      status: 'Pending Approval' as TaskStatus,
      attachment: attachment || task.attachment,
    };
    updateTask(updatedTask);
    recordAction(\`Requested status change to "\${newStatus}" for task: "\${task.title}"\`);
    return true;
  };
  
  const approveTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.pendingStatus) return;

    addComment(taskId, \`Request Approved: \${commentText}\`);
    const updatedTask = {
      ...task,
      status: task.pendingStatus,
      pendingStatus: undefined,
      previousStatus: undefined,
      approvalState: 'approved' as ApprovalState,
    };
    updateTask(updatedTask);
    recordAction(\`Approved status change for task: "\${task.title}"\`);
  };
  
  const returnTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    addComment(taskId, \`Request Returned: \${commentText}\`);
    const updatedTask = {
      ...task,
      status: task.previousStatus || 'In Progress', // Revert to a sensible state
      pendingStatus: undefined,
      previousStatus: undefined,
      approvalState: 'returned' as ApprovalState,
    };
    updateTask(updatedTask);
    recordAction(\`Returned task "\${task.title}" to status "\${updatedTask.status}"\`);
  };

  const deleteTask = (taskId: string) => {
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    recordAction(\`Deleted task: "\${taskTitle}"\`);
  };

  const addPlannerEvent = (event: Omit<PlannerEvent, 'id' | 'comments'>) => {
    const newEvent: PlannerEvent = {
      ...event,
      id: \`event-\${Date.now()}\`,
      comments: [],
    };
    setPlannerEvents(prevEvents => [newEvent, ...prevEvents]);
    recordAction(\`Created planner event: "\${event.title}"\`);
  };
  
  const getExpandedPlannerEvents = useCallback((date: Date, userId: string) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });
    const expandedEvents: (PlannerEvent & { eventDate: Date })[] = [];

    const userEvents = plannerEvents.filter(event => event.userId === userId);

    userEvents.forEach(event => {
      const eventStartDate = new Date(event.date);
      daysInMonth.forEach(day => {
        let shouldAdd = false;
        switch (event.frequency) {
          case 'once':
            if (isSameDay(day, eventStartDate)) shouldAdd = true;
            break;
          case 'daily':
            if (day >= eventStartDate) shouldAdd = true;
            break;
          case 'weekly':
            if (day >= eventStartDate && day.getDay() === eventStartDate.getDay()) shouldAdd = true;
            break;
          case 'weekends':
            if (day >= eventStartDate && isWeekend(day)) shouldAdd = true;
            break;
          case 'monthly':
            if (day >= eventStartDate && day.getDate() === eventStartDate.getDate()) shouldAdd = true;
            break;
        }
        if (shouldAdd) {
          expandedEvents.push({ ...event, eventDate: day });
        }
      });
    });
    return expandedEvents;
  }, [plannerEvents]);

  const addPlannerEventComment = (eventId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setPlannerEvents(prevEvents => prevEvents.map(event => 
      event.id === eventId ? { ...event, comments: [...(event.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } : event
    ));
    const eventTitle = plannerEvents.find(e => e.id === eventId)?.title;
    recordAction(\`Commented on event: "\${eventTitle}"\`);
  };

  const addDailyPlannerComment = (plannerUserId: string, date: Date, commentText: string) => {
    if (!user) return;
    const dayKey = format(date, 'yyyy-MM-dd');

    const newComment: Comment = {
        userId: user.id,
        text: commentText,
        date: new Date().toISOString(),
    };

    setDailyPlannerComments(prev => {
        const existingEntry = prev.find(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
        if (existingEntry) {
            return prev.map(dpc => 
                dpc.id === existingEntry.id 
                ? { ...dpc, comments: [...dpc.comments, newComment] } 
                : dpc
            );
        } else {
            const newEntry: DailyPlannerComment = {
                id: \`dpc-\${Date.now()}\`,
                plannerUserId,
                day: dayKey,
                comments: [newComment],
            };
            return [...prev, newEntry];
        }
    });
    const plannerUser = users.find(u => u.id === plannerUserId);
    recordAction(\`Commented on \${plannerUser?.name}'s planner for \${dayKey}\`);
  };

  const addUser = (newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: \`user-\${Date.now()}\`,
      avatar: \`https://i.pravatar.cc/150?u=\${Date.now()}\`
    };
    setUsers(prev => [...prev, userToAdd]);
    recordAction(\`Added new user: \${newUser.name}\`);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
    recordAction(\`Updated user profile: \${updatedUser.name}\`);
  };
  
  const deleteUser = (userId: string) => {
    const userName = users.find(u => u.id === userId)?.name;
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also consider un-assigning tasks or re-assigning them
    setTasks(prev => prev.map(t => t.assigneeId === userId ? {...t, assigneeId: ''} : t));
    recordAction(\`Deleted user: \${userName}\`);
  };

  const addRole = (roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole: RoleDefinition = {
      ...roleData,
      id: \`role-\${Date.now()}\`,
      isEditable: true,
    };
    setRoles(prev => [...prev, newRole]);
    recordAction(\`Added new role: \${newRole.name}\`);
  };

  const updateRole = (updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    recordAction(\`Updated role: \${updatedRole.name}\`);
  };

  const deleteRole = (roleId: string) => {
    const roleName = roles.find(r => r.id === roleId)?.name;
    setRoles(prev => prev.filter(r => r.id !== roleId));
    recordAction(\`Deleted role: \${roleName}\`);
  };

  const updateProfile = (name: string, email: string, avatar: string) => {
    if (user) {
        const updatedUser = {...user, name, email, avatar};
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        recordAction(\`Updated own profile\`);
    }
  };

  const addManualAchievement = (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => {
    if (!user) return;
    const newAchievement: Achievement = {
      ...achievement,
      id: \`ach-\${Date.now()}\`,
      type: 'manual',
      date: new Date().toISOString(),
      awardedById: user.id,
      status: (user.role === 'Admin' || user.role === 'Manager') ? 'approved' : 'pending',
    };
    setAchievements(prev => [...prev, newAchievement]);
    const userName = users.find(u => u.id === achievement.userId)?.name;
    recordAction(\`Awarded manual achievement "\${achievement.title}" to \${userName}\`);
  };
  
  const approveAchievement = (achievementId: string, points: number) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === achievementId) {
        return { ...ach, status: 'approved', points };
      }
      return ach;
    }));
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    recordAction(\`Approved achievement: "\${achTitle}"\`);
  };

  const rejectAchievement = (achievementId: string) => {
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
    recordAction(\`Rejected achievement: "\${achTitle}"\`);
  };

  const updateBranding = (name: string, logo: string | null) => {
    setAppName(name);
    localStorage.setItem('appName', name);
    if (logo) {
      setAppLogo(logo);
      localStorage.setItem('appLogo', logo);
    } else {
      setAppLogo(null);
      localStorage.removeItem('appLogo');
    }
    recordAction(\`Updated app branding.\`);
  };

  const value = {
    user,
    users,
    roles,
    tasks,
    plannerEvents,
    dailyPlannerComments,
    achievements,
    activityLogs,
    appName,
    appLogo,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addPlannerEvent,
    getExpandedPlannerEvents,
    getVisibleUsers,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    updateProfile,
    requestTaskStatusChange,
    approveTaskStatusChange,
    returnTaskStatusChange,
    addComment,
    addManualAchievement,
    approveAchievement,
    rejectAchievement,
    addPlannerEventComment,
    addDailyPlannerComment,
    updateBranding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
`,
  "src/lib/types.ts": `export const ALL_PERMISSIONS = [
  'manage_branding',
  'manage_users',
  'manage_roles',
  'assign_supervisors',
  'create_tasks',
  'reassign_tasks',
  'delete_tasks',
  'use_ai_tools',
  'grant_manual_achievements',
  'approve_manual_achievements',
  'view_all_activity',
  'view_subordinates_activity',
  'view_all_users',
  'view_subordinates_users',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface RoleDefinition {
  id: string;
  name: string;
  permissions: Permission[];
  isEditable: boolean;
}

export type Role = 'Admin' | 'Manager' | 'Supervisor' | 'HSE' | 'Junior Supervisor' | 'Junior HSE' | 'Team Member';

export type TaskStatus = 'To Do' | 'In Progress' | 'Pending Approval' | 'Completed' | 'Overdue';

export type Priority = 'Low' | 'Medium' | 'High';

export type Frequency = 'once' | 'daily' | 'weekly' | 'weekends' | 'monthly';

export type ApprovalState = 'none' | 'pending' | 'approved' | 'returned';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password is optional on the type for security reasons
  role: Role;
  avatar: string; // URL to avatar image
  supervisorId?: string; // ID of this user's supervisor
}

export interface Comment {
    userId: string;
    text: string;
    date: string; // ISO string
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string; // ISO string date
  assigneeId: string;
  creatorId: string;
  comments?: Comment[];
  
  // New workflow fields
  requiresAttachmentForCompletion: boolean;
  
  // Approval flow
  previousStatus?: TaskStatus;
  pendingStatus?: TaskStatus; 
  approvalState: ApprovalState;
  
  // Attachment
  attachment?: {
    url: string;
    name: string;
    data?: string; // base64 data for new uploads
  };
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string, represents the start date for recurring events
  frequency: Frequency;
  creatorId: string;
  userId: string; // The user this event is for
  comments?: Comment[];
}

export interface DailyPlannerComment {
  id: string;
  // The user whose planner this comment belongs to
  plannerUserId: string; 
  // The specific day the comment is for, in 'yyyy-MM-dd' format
  day: string; 
  comments: Comment[];
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'performance' | 'manual';
  title: string;
  description: string;
  points: number;
  date: string; // ISO string
  awardedById?: string;
  status: 'pending' | 'approved';
}

export interface ActivityLog {
  id: string;
  userId: string;
  loginTime: string; // ISO
  logoutTime: string | null; // ISO or null if active
  duration: number | null; // in minutes
  actions: string[];
}
`,
  "src/lib/mock-data.ts": `import type { User, Task, PlannerEvent, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition } from './types';
import { sub } from 'date-fns';
import { ALL_PERMISSIONS } from './types';

export { ALL_PERMISSIONS };

export const ROLES: RoleDefinition[] = [
  {
    id: 'role-admin',
    name: 'Admin',
    permissions: [...ALL_PERMISSIONS],
    isEditable: false,
  },
  {
    id: 'role-manager',
    name: 'Manager',
    permissions: [
      'manage_users', 'assign_supervisors', 'create_tasks', 'reassign_tasks', 'delete_tasks', 
      'use_ai_tools', 'grant_manual_achievements', 'approve_manual_achievements', 
      'view_all_activity', 'view_all_users'
    ],
    isEditable: false,
  },
  {
    id: 'role-supervisor',
    name: 'Supervisor',
    permissions: [
      'create_tasks', 'reassign_tasks', 'grant_manual_achievements', 
      'view_subordinates_activity', 'view_subordinates_users'
    ],
    isEditable: false,
  },
  {
    id: 'role-hse',
    name: 'HSE',
    permissions: [
      'create_tasks', 'reassign_tasks', 'grant_manual_achievements', 
      'view_subordinates_activity', 'view_subordinates_users'
    ],
    isEditable: false,
  },
  {
    id: 'role-jr-supervisor',
    name: 'Junior Supervisor',
    permissions: ['view_subordinates_activity', 'view_subordinates_users'],
    isEditable: false,
  },
  {
    id: 'role-jr-hse',
    name: 'Junior HSE',
    permissions: ['view_subordinates_activity', 'view_subordinates_users'],
    isEditable: false,
  },
  {
    id: 'role-team-member',
    name: 'Team Member',
    permissions: [],
    isEditable: false,
  },
];

export const USERS: User[] = [
  { id: '1', name: 'Harikrishnan P S', email: 'satanin2013@gmail.com', password: 'password', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Manu M G', email: 'manu@ariesmarine.com', password: 'password', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=2', supervisorId: '1' },
  { id: '3', name: 'Mujeeb', email: 'mujeeb@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=3', supervisorId: '2' },
  { id: '4', name: 'Albin Raju', email: 'albin@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=4', supervisorId: '2' },
  { id: '5', name: 'Arjun P', email: 'arjun@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=5', supervisorId: '2' },
  { id: '6', name: 'Sreehari', email: 'sreehari@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=6', supervisorId: '2' },
  { id: '7', name: 'Vishnu H', email: 'vishnu.h@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=7', supervisorId: '2' },
  { id: '8', name: 'Akhil A', email: 'akhil.a@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=8', supervisorId: '2' },
  { id: '9', name: 'Dhaneesh Kumar', email: 'dhaneesh@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=9', supervisorId: '2' },
  { id: '10', name: 'Rakhil Raj', email: 'rakhil@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=10', supervisorId: '2' },
  { id: '11', name: 'Akhil Pillai', email: 'akhil.pillai@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=11', supervisorId: '3' },
  { id: '12', name: 'Athul Kumar', email: 'athul@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=12', supervisorId: '3' },
  { id: '13', name: 'Rinu Sam', email: 'rinu@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=13', supervisorId: '4' },
  { id: '14', name: 'Syam Kumar', email: 'syam@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=14', supervisorId: '4' },
  { id: '15', name: 'Vishnu S', email: 'vishnu.s@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=15', supervisorId: '5' },
  { id: '16', name: 'Vishnu J', email: 'vishnu.j@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=16', supervisorId: '5' },
  { id: '17', name: 'Amaldas M', email: 'amaldas@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=17', supervisorId: '6' },
  { id: '18', name: 'Sajin Soman', email: 'sajin@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=18', supervisorId: '6' },
  { id: '19', name: 'Aparna M R', email: 'aparna@ariesmarine.com', password: 'password', role: 'Team Member', avatar: 'https://i.pravatar.cc/150?u=19', supervisorId: '11' },
  { id: '20', name: 'John Safety', email: 'john.safety@ariesmarine.com', password: 'password', role: 'HSE', avatar: 'https://i.pravatar.cc/150?u=20', supervisorId: '2' },
  { id: '21', name: 'Peter Hazard', email: 'peter.hazard@ariesmarine.com', password: 'password', role: 'Junior HSE', avatar: 'https://i.pravatar.cc/150?u=21', supervisorId: '20' },
];

export const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Develop new homepage design',
    description: 'Create a modern and responsive design for the company homepage. Focus on user experience and brand consistency.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '19', // Aparna M R
    creatorId: '11', // Akhil Pillai
    comments: [
        { userId: '11', text: 'Let me know if you have any questions on the design brief.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    requiresAttachmentForCompletion: true,
    approvalState: 'none'
  },
  {
    id: 'task-2',
    title: 'Set up CI/CD pipeline',
    description: 'Implement a continuous integration and deployment pipeline for the main application using GitHub Actions.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '12', // Athul Kumar
    creatorId: '3', // Mujeeb
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-3',
    title: 'Quarterly performance review',
    description: 'Prepare and conduct quarterly performance reviews for all team members. Collect feedback and set goals.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2', // Manu M G
    creatorId: '1', // Harikrishnan P S
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-4',
    title: 'Fix login page bug',
    description: 'A critical bug is preventing some users from logging in. Needs immediate attention.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '15', // Vishnu S
    creatorId: '5', // Arjun P
    comments: [
        { userId: '5', text: 'This is a top priority, please escalate if you run into issues.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { userId: '15', text: 'On it. I think I have an idea of what the issue is.', date: new Date().toISOString() }
    ],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-5',
    title: 'Update brand style guide',
    description: 'Revise the brand style guide with new logos and color palettes. Distribute to all relevant teams.',
    status: 'Completed',
    priority: 'Low',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '19', // Aparna M R
    creatorId: '11', // Akhil Pillai
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'approved'
  },
  {
    id: 'task-6',
    title: 'Plan team offsite event',
    description: 'Organize a team-building offsite event for the end of the quarter. Handle logistics, budget, and activities.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2', // Manu M G
    creatorId: '1', // Harikrishnan P S
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-7',
    title: 'Migrate database to new server',
    description: 'Plan and execute the migration of the production database to a new, more powerful server.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '12', // Athul Kumar
    creatorId: '3', // Mujeeb
    comments: [],
    requiresAttachmentForCompletion: true,
    approvalState: 'none'
  },
  {
    id: 'task-8',
    title: 'User testing for new feature',
    description: 'Conduct user testing sessions for the upcoming feature release. Gather feedback and report findings.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '16', // Vishnu J
    creatorId: '5', // Arjun P
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'approved'
  },
];

export const PLANNER_EVENTS: PlannerEvent[] = [
    {
        id: 'event-1',
        title: 'Daily Standup',
        description: 'Sync up on project progress and blockers.',
        date: new Date().toISOString(),
        frequency: 'daily',
        creatorId: '11', // Akhil Pillai
        userId: '19', // Aparna M R
        comments: [],
    },
    {
        id: 'event-2',
        title: 'Product Sprint Demo',
        description: 'Showcase new features developed in the current sprint.',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        frequency: 'once',
        creatorId: '2', // Manu M G
        userId: '2', // Manu M G
        comments: [],
    },
    {
        id: 'event-3',
        title: 'Monthly All-Hands',
        description: 'Company-wide update meeting.',
        date: new Date(new Date().setDate(15)).toISOString(),
        frequency: 'monthly',
        creatorId: '1', // Harikrishnan P S
        userId: '1', // Harikrishnan P S
        comments: [],
    },
    {
        id: 'event-4',
        title: 'Team Retrospective',
        description: 'Discuss what went well and what could be improved.',
        date: new Date(new Date().setDate(25)).toISOString(),
        frequency: 'weekly',
        creatorId: '3', // Mujeeb
        userId: '12', // Athul Kumar
        comments: [],
    }
];

export const DAILY_PLANNER_COMMENTS: DailyPlannerComment[] = [];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', userId: '19', type: 'manual', title: 'Safety Star', description: 'Maintained a perfect safety record for Q2.', points: 50, date: new Date().toISOString(), awardedById: '11', status: 'approved' },
  { id: 'ach-2', userId: '12', type: 'manual', title: 'Innovation Award', description: 'Proposed a new workflow that saved 10 hours per week.', points: 100, date: new Date().toISOString(), awardedById: '2', status: 'approved' },
];

const now = new Date();
export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: '19',
    loginTime: sub(now, { days: 1, hours: 8 }).toISOString(),
    logoutTime: sub(now, { days: 1, hours: 3 }).toISOString(),
    duration: 300, // 5 hours
    actions: ['Updated task: "Develop new homepage design"', 'Commented on task: "Update brand style guide"'],
  },
  {
    id: 'log-2',
    userId: '12',
    loginTime: sub(now, { days: 1, hours: 7 }).toISOString(),
    logoutTime: sub(now, { days: 1, hours: 1 }).toISOString(),
    duration: 360, // 6 hours
    actions: ['Created task: "Set up CI/CD pipeline"', 'Completed task: "User testing for new feature"'],
  },
    {
    id: 'log-3',
    userId: '2',
    loginTime: sub(now, { days: 2, hours: 8 }).toISOString(),
    logoutTime: sub(now, { days: 2, hours: 0 }).toISOString(),
    duration: 480, // 8 hours
    actions: ['Conducted performance review prep', 'Planned team offsite event details'],
  },
];
`,
  "src/lib/utils.ts": `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
};

const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

interface FileItemProps {
  name: string;
  icon?: React.ReactNode;
  level?: number;
  content: string;
}

const FileItem = ({ name, icon = <File className="h-4 w-4 text-muted-foreground" />, level = 0, content }: FileItemProps) => (
  <div className="flex items-center gap-2 pr-2" style={{ paddingLeft: \`\${level * 1.5}rem\` }}>
    {icon}
    <span className="text-sm flex-grow truncate" title={name}>{name}</span>
    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleDownload(content, name)}>
      <Download className="h-4 w-4" />
    </Button>
  </div>
);

interface FolderItemProps {
  name: string;
  children: React.ReactNode;
  level?: number;
}

const FolderItem = ({ name, children, level = 0 }: FolderItemProps) => (
  <Collapsible>
    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left [&[data-state=open]>svg:last-child]:rotate-90 pr-2" style={{ paddingLeft: \`\${level * 1.5}rem\` }}>
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
  const allFiles = {
    'src/app/(app)/account/page.tsx': fileContents['src/app/(app)/account/page.tsx'],
    'src/app/(app)/achievements/page.tsx': fileContents['src/app/(app)/achievements/page.tsx'],
    'src/app/(app)/activity-tracker/page.tsx': fileContents['src/app/(app)/activity-tracker/page.tsx'],
    'src/app/(app)/dashboard/page.tsx': fileContents['src/app/(app)/dashboard/page.tsx'],
    'src/app/(app)/file-explorer/page.tsx': "This file's content is dynamically generated and cannot be downloaded here.",
    'src/app/(app)/layout.tsx': fileContents['src/app/(app)/layout.tsx'],
    'src/app/(app)/performance/page.tsx': fileContents['src/app/(app)/performance/page.tsx'],
    'src/app/(app)/planner/page.tsx': fileContents['src/app/(app)/planner/page.tsx'],
    'src/app/(app)/reports/page.tsx': fileContents['src/app/(app)/reports/page.tsx'],
    'src/app/(app)/tasks/page.tsx': fileContents['src/app/(app)/tasks/page.tsx'],
    'src/app/(auth)/login/page.tsx': fileContents['src/app/(auth)/login/page.tsx'],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Explorer</h1>
        <p className="text-muted-foreground">A visual representation of the project's file structure.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>Click on folders to expand them and click the download icon to save files.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 font-mono">
            <FileItem name=".env" content={fileContents['.env']} />
            <FileItem name="README.md" content={fileContents['README.md']} />
            <FileItem name="apphosting.yaml" content={fileContents['apphosting.yaml']} />
            <FileItem name="components.json" content={fileContents['components.json']} />
            <FileItem name="next.config.ts" content={fileContents['next.config.ts']} />
            <FileItem name="package.json" content={fileContents['package.json']} />
            <FileItem name="tailwind.config.ts" content={fileContents['tailwind.config.ts']} />
            <FileItem name="tsconfig.json" content={fileContents['tsconfig.json']} />
            
            <FolderItem name="src">
              <FolderItem name="ai" level={1}>
                <FileItem name="dev.ts" level={2} content={fileContents['src/ai/dev.ts']} />
                <FileItem name="genkit.ts" level={2} content={fileContents['src/ai/genkit.ts']} />
                <FolderItem name="flows" level={2}>
                  <FileItem name="ai-task-suggestions.ts" level={3} content={fileContents['src/ai/flows/ai-task-suggestions.ts']} />
                  <FileItem name="suggest-task-priority.ts" level={3} content={fileContents['src/ai/flows/suggest-task-priority.ts']} />
                </FolderItem>
              </FolderItem>

              <FolderItem name="app" level={1}>
                <FileItem name="globals.css" level={2} content={fileContents['src/app/globals.css']} />
                <FileItem name="layout.tsx" level={2} content={fileContents['src/app/layout.tsx']} />
                <FileItem name="page.tsx" level={2} content={fileContents['src/app/page.tsx']} />
                 <FolderItem name="(app)" level={2}>
                    <FileItem name="layout.tsx" level={3} content={allFiles['src/app/(app)/layout.tsx']} />
                    <FolderItem name="account" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/account/page.tsx']} /></FolderItem>
                    <FolderItem name="achievements" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/achievements/page.tsx']} /></FolderItem>
                    <FolderItem name="activity-tracker" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/activity-tracker/page.tsx']} /></FolderItem>
                    <FolderItem name="dashboard" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/dashboard/page.tsx']} /></FolderItem>
                    <FolderItem name="file-explorer" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/file-explorer/page.tsx']} /></FolderItem>
                    <FolderItem name="performance" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/performance/page.tsx']} /></FolderItem>
                    <FolderItem name="planner" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/planner/page.tsx']} /></FolderItem>
                    <FolderItem name="reports" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/reports/page.tsx']} /></FolderItem>
                    <FolderItem name="tasks" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(app)/tasks/page.tsx']} /></FolderItem>
                </FolderItem>
                 <FolderItem name="(auth)" level={2}>
                    <FolderItem name="login" level={3}><FileItem name="page.tsx" level={4} content={allFiles['src/app/(auth)/login/page.tsx']} /></FolderItem>
                </FolderItem>
              </FolderItem>
              
              <FolderItem name="components" level={1}>
                <div className="flex items-center gap-2 pl-4">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Many component files... (not listed for brevity)</span>
                </div>
              </FolderItem>
              <FolderItem name="context" level={1}>
                <FileItem name="app-context.tsx" level={2} content={fileContents['src/context/app-context.tsx']} />
              </FolderItem>
               <FolderItem name="hooks" level={1}>
                <FileItem name="use-mobile.tsx" level={2} content={fileContents['src/hooks/use-mobile.tsx']} />
                <FileItem name="use-toast.ts" level={2} content={fileContents['src/hooks/use-toast.ts']} />
              </FolderItem>
               <FolderItem name="lib" level={1}>
                <FileItem name="mock-data.ts" level={2} content={fileContents['src/lib/mock-data.ts']} />
                <FileItem name="types.ts" level={2} content={fileContents['src/lib/types.ts']} />
                <FileItem name="utils.ts" level={2} content={fileContents['src/lib/utils.ts']} />
              </FolderItem>
            </FolderItem>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
