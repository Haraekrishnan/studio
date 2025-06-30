/**
 * This file contains the string content of all project files.
 * It is used by the FileExplorer component to make files downloadable.
 */
export const fileContents: Record<string, string> = {
  ".env": `GOOGLE_API_KEY="YOUR_API_KEY_HERE"
`,
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
  "src/app/(app)/layout.tsx": `'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { AppSidebar } from '@/components/shared/app-sidebar';
import Header from '@/components/shared/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
        </div>
      </main>
    </div>
  );
}
`,
  "src/app/(app)/account/page.tsx": `'use client';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMemo, useState, useEffect } from 'react';
import type { User as UserType } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Layers, ShieldPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEmployeeDialog from '@/components/account/add-employee-dialog';
import EditEmployeeDialog from '@/components/account/edit-employee-dialog';
import AddRoleDialog from '@/components/account/add-role-dialog';
import RoleManagementTable from '@/components/account/role-management-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AccountPage() {
  const { user, users, updateUser, deleteUser, updateProfile, getVisibleUsers, appName, appLogo, updateBranding } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // State for branding form
  const [newAppName, setNewAppName] = useState(appName);
  const [newAppLogo, setNewAppLogo] = useState<string | null>(appLogo);

  useEffect(() => {
    setNewAppName(appName);
    setNewAppLogo(appLogo);
  }, [appName, appLogo]);
  
  useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);
    }
  }, [user]);

  const visibleUsers = useMemo(() => {
    if (!user) return [];
    // The current user should not appear in the management list
    return getVisibleUsers().filter(u => u.id !== user.id);
  }, [user, getVisibleUsers]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }
  
  const canManageUsers = user.role === 'Admin' || user.role === 'Manager';
  const canManageRoles = user.role === 'Admin';
  const canManageBranding = user.role === 'Admin';

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, avatar);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAppLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandingSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(newAppName, newAppLogo);
    toast({
      title: 'Branding Updated',
      description: 'The application name and logo have been updated.',
    });
  };

  const handleEditClick = (userToEdit: UserType) => {
    setSelectedUser(userToEdit);
    setIsEditEmployeeDialogOpen(true);
  };
  
  const handleDelete = (userId: string) => {
    deleteUser(userId);
    toast({
        variant: 'destructive',
        title: 'User Deleted',
        description: 'The user has been removed from the system.',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">View and manage your personal profile.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar} alt={user.name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleProfileSave}>
            <Card>
                <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Edit your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="avatar-upload">Change Profile Picture</Label>
                    <Input id="avatar-upload" type="file" onChange={handleFileChange} accept="image/*" />
                </div>
                </CardContent>
                <CardFooter>
                <Button type="submit">Save Changes</Button>
                </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      
      {canManageBranding && (
        <Card>
          <form onSubmit={handleBrandingSave}>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the application's logo and title. Changes will apply across the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input id="appName" value={newAppName} onChange={e => setNewAppName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Application Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-md">
                    <AvatarImage src={newAppLogo || undefined} alt="App Logo" />
                    <AvatarFallback className="rounded-md bg-muted">
                      <Layers className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <Input id="logo-upload" type="file" onChange={handleLogoFileChange} accept="image/*" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-2">
              <Button type="submit">Save Branding</Button>
              {newAppLogo && (
                <Button variant="outline" type="button" onClick={() => setNewAppLogo(null)}>
                  Remove Logo
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      )}

      {canManageRoles && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Define custom roles and assign granular permissions.</CardDescription>
              </div>
              <Button onClick={() => setIsAddRoleDialogOpen(true)}>
                <ShieldPlus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <RoleManagementTable />
            </CardContent>
          </Card>
      )}

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Employee Management</CardTitle>
                  <CardDescription>View, add, edit, or remove employees.</CardDescription>
              </div>
              {canManageUsers && (
                <Button onClick={() => setIsAddEmployeeDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
              )}
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Supervisor</TableHead>
                          {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {visibleUsers.map(report => {
                          const supervisor = users.find(u => u.id === report.supervisorId);
                          return (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={report.avatar} alt={report.name} />
                                            <AvatarFallback>{report.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                            <p>{report.name}</p>
                                            <p className="text-xs text-muted-foreground">{report.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{report.role}</TableCell>
                                <TableCell>{supervisor?.name || 'N/A'}</TableCell>
                                {canManageUsers && (
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => handleEditClick(report)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the user account and unassign all their tasks.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(report.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                )}
                            </TableRow>
                          );
                      })}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

      <AddEmployeeDialog isOpen={isAddEmployeeDialogOpen} setIsOpen={setIsAddEmployeeDialogOpen} />
      {selectedUser && (
        <EditEmployeeDialog isOpen={isEditEmployeeDialogOpen} setIsOpen={setIsEditEmployeeDialogOpen} user={selectedUser} />
      )}
      <AddRoleDialog isOpen={isAddRoleDialogOpen} setIsOpen={setIsAddRoleDialogOpen} />
    </div>
  );
}
`,
  "src/app/(app)/achievements/page.tsx": `'use client';

import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AchievementsTable from '@/components/achievements/achievements-table';
import AddAchievementDialog from '@/components/achievements/add-achievement-dialog';
import type { User, Task, Achievement } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AchievementsPage() {
  const { user, users, tasks, achievements, approveAchievement, rejectAchievement } = useAppContext();
  const { toast } = useToast();

  const [achievementToApprove, setAchievementToApprove] = useState<Achievement | null>(null);
  const [newPoints, setNewPoints] = useState(0);
  const [rankingFilter, setRankingFilter] = useState('all-time');

  const canAddManualAchievement = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor' || user?.role === 'HSE';
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager';

  const performanceData = useMemo(() => {
    const now = new Date();
    let dateRange: { start: Date; end: Date } | null = null;

    if (rankingFilter === 'this-month') {
      dateRange = { start: startOfMonth(now), end: endOfMonth(now) };
    } else if (rankingFilter === 'last-month') {
      const lastMonth = subMonths(now, 1);
      dateRange = { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    } else if (rankingFilter === 'this-year') {
      dateRange = { start: startOfYear(now), end: endOfYear(now) };
    }
    
    const tasksInPeriod = dateRange
      ? tasks.filter(t => isWithinInterval(new Date(t.dueDate), { start: dateRange!.start, end: dateRange!.end }))
      : tasks;
      
    const achievementsInPeriod = dateRange
      ? achievements.filter(a => isWithinInterval(new Date(a.date), { start: dateRange!.start, end: dateRange!.end }))
      : achievements;

    return users
      .map(u => {
        const userTasks = tasksInPeriod.filter(t => t.assigneeId === u.id);
        const completedCount = userTasks.filter(t => t.status === 'Completed').length;
        const overdueCount = userTasks.filter(t => t.status === 'Overdue').length;
        const performanceScore = (completedCount * 10) - (overdueCount * 5);
        
        const manualAchievements = achievementsInPeriod.filter(a => a.userId === u.id && a.type === 'manual' && a.status === 'approved');
        const manualPoints = manualAchievements.reduce((sum, a) => sum + a.points, 0);

        return {
          user: u,
          score: performanceScore + manualPoints,
          completed: completedCount,
          overdue: overdueCount,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [users, tasks, achievements, rankingFilter]);

  const manualAchievements = useMemo(() => {
    return achievements.filter(ach => ach.type === 'manual' && ach.status === 'approved');
  }, [achievements]);

  const pendingAchievements = useMemo(() => {
    if (!canApprove) return [];
    return achievements.filter(ach => ach.status === 'pending');
  }, [achievements, canApprove]);

  const handleApproveClick = (achievement: Achievement) => {
    setAchievementToApprove(achievement);
    setNewPoints(achievement.points);
  };

  const handleConfirmApproval = () => {
    if (achievementToApprove) {
      approveAchievement(achievementToApprove.id, newPoints);
      toast({ title: 'Achievement Approved', description: 'The award has been approved and points are added.' });
      setAchievementToApprove(null);
    }
  };

  const handleReject = (achievementId: string) => {
    rejectAchievement(achievementId);
    toast({ variant: 'destructive', title: 'Achievement Rejected', description: 'The award has been removed.' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements & Rankings</h1>
          <p className="text-muted-foreground">Recognize top performers and award achievements.</p>
        </div>
        {canAddManualAchievement && <AddAchievementDialog />}
      </div>
      
      {canApprove && pendingAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Achievement Approvals</CardTitle>
            <CardDescription>Review and approve manual awards submitted by supervisors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Award</TableHead>
                  <TableHead>Awarded By</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAchievements.map((item) => {
                  const user = users.find(u => u.id === item.userId);
                  const awardedBy = users.find(u => u.id === item.awardedById);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{awardedBy?.name}</TableCell>
                      <TableCell className="text-right">{item.points}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" onClick={() => handleApproveClick(item)}>Approve</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Achievement</AlertDialogTitle>
                              <AlertDialogDescription>
                                You are approving the achievement "{achievementToApprove?.title}" for {users.find(u=>u.id === achievementToApprove?.userId)?.name}. You can adjust the points if needed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <Label htmlFor="points">Points</Label>
                              <Input id="points" type="number" value={newPoints} onChange={(e) => setNewPoints(Number(e.target.value))} />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setAchievementToApprove(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleConfirmApproval}>Confirm Approval</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Performance Index Ranking</CardTitle>
              <CardDescription>Employees ranked by their overall performance score.</CardDescription>
            </div>
            <Select value={rankingFilter} onValueChange={setRankingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <AchievementsTable data={performanceData} type="performance" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manual Awards & Recognitions</CardTitle>
          <CardDescription>Special achievements awarded by management.</CardDescription>
        </CardHeader>
        <CardContent>
          <AchievementsTable data={manualAchievements} type="manual" />
        </CardContent>
      </Card>
    </div>
  );
}
`,
  "src/app/(app)/activity-tracker/page.tsx": `'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import ActivityLogTable from '@/components/activity-tracker/activity-log-table';

export default function ActivityTrackerPage() {
    const { user, getVisibleUsers, activityLogs } = useAppContext();

    const visibleUserIds = useMemo(() => {
        return getVisibleUsers().map(u => u.id);
    }, [getVisibleUsers]);

    const visibleLogs = useMemo(() => {
        if (!user) return [];
        // For Team Members and Junior Supervisors, they can only see their own logs.
        if (user.role === 'Team Member' || user.role === 'Junior Supervisor') {
            return activityLogs.filter(log => log.userId === user.id);
        }
        // Others can see logs of anyone in their visible user list.
        return activityLogs.filter(log => visibleUserIds.includes(log.userId));
    }, [activityLogs, user, visibleUserIds]);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
                <p className="text-muted-foreground">Review user login sessions and activities.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Session Logs</CardTitle>
                    <CardDescription>A detailed log of user sessions and the actions they performed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ActivityLogTable logs={visibleLogs} />
                </CardContent>
            </Card>
        </div>
    );
}
`,
  "src/app/(app)/dashboard/page.tsx": `'use client';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import StatCard from '@/components/dashboard/stat-card';
import TasksCompletedChart from '@/components/dashboard/tasks-completed-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, CheckCircle } from 'lucide-react';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import { useMemo } from 'react';
import EmployeePerformancePieChart from '@/components/dashboard/employee-performance-pie-chart';

export default function DashboardPage() {
  const { tasks, user, getVisibleUsers } = useAppContext();

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const relevantTasks = useMemo(() => {
    if (!user) return [];
    const visibleUserIds = visibleUsers.map(u => u.id);
    return tasks.filter(task => visibleUserIds.includes(task.assigneeId));
  }, [tasks, user, visibleUsers]);

  const completedTasks = useMemo(() => relevantTasks.filter(task => task.status === 'Completed').length, [relevantTasks]);
  const openTasks = useMemo(() => relevantTasks.length - completedTasks, [relevantTasks, completedTasks]);
  const tasksPerPerson = useMemo(() => visibleUsers.length > 0 ? (relevantTasks.length / visibleUsers.length).toFixed(1) : "0", [relevantTasks, visibleUsers]);
  
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's a summary of your team's activity.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/reports">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Link>
            </Button>
            {canManageTasks && <CreateTaskDialog />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Completed Tasks" 
          value={completedTasks.toString()} 
          icon={CheckCircle} 
          description="Total tasks marked as done"
        />
        <StatCard 
          title="Open Tasks" 
          value={openTasks.toString()}
          icon={FileText} 
          description="Tasks currently in-progress or to-do"
        />
        <StatCard 
          title="Avg. Tasks per Person" 
          value={tasksPerPerson} 
          icon={Users} 
          description="Average tasks across your team"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Tasks Completed per Month</CardTitle>
            </CardHeader>
            <CardContent>
                <TasksCompletedChart />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Team Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <EmployeePerformancePieChart />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,
  "src/app/(app)/performance/page.tsx": `'use client';
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
`,
  "src/app/(app)/planner/page.tsx": `'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import CreateEventDialog from '@/components/planner/create-event-dialog';
import PlannerCalendar from '@/components/planner/planner-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PlannerPage() {
    const { user, getVisibleUsers } = useAppContext();
    const [selectedUserId, setSelectedUserId] = useState<string>(user!.id);
    
    const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers, user]);
    const canViewOthers = visibleUsers.length > 1;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monthly Planner</h1>
                    <p className="text-muted-foreground">Organize your team's schedule and events.</p>
                </div>
                <div className="flex items-center gap-4">
                    {canViewOthers && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="user-select" className="text-sm font-medium">Viewing:</Label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger className="w-[200px]" id="user-select">
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visibleUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <CreateEventDialog />
                </div>
            </div>
            
            <PlannerCalendar selectedUserId={selectedUserId} />
        </div>
    );
}
`,
  "src/app/(app)/reports/page.tsx": `'use client';
import { useState, useMemo } from 'react';
import type { Task, Priority } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { useAppContext } from '@/context/app-context';
import ReportFilters from '@/components/reports/report-filters';
import ReportResultsTable from '@/components/reports/report-results-table';
import ReportDownloads from '@/components/reports/report-downloads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Filters {
  assigneeId: string;
  status: string;
  priority: string;
  dateRange: DateRange | undefined;
}

export default function ReportsPage() {
  const { tasks, getVisibleUsers } = useAppContext();
  const [filters, setFilters] = useState<Filters>({
    assigneeId: 'all',
    status: 'all',
    priority: 'all',
    dateRange: undefined,
  });

  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // First, ensure the task assignee is visible to the current user
      if (!visibleUserIds.includes(task.assigneeId)) {
        return false;
      }

      const { assigneeId, status, priority, dateRange } = filters;
      
      const assigneeMatch = assigneeId === 'all' || task.assigneeId === assigneeId;
      const statusMatch = status === 'all' || task.status === status;
      const priorityMatch = priority === 'all' || task.priority === priority;
      
      let dateMatch = true;
      if (dateRange?.from) {
        const taskDate = new Date(task.dueDate);
        const fromDate = dateRange.from;
        // if \`to\` is not set, use \`from\` and check for the whole day
        const toDate = dateRange.to || new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 23, 59, 59);
        dateMatch = taskDate >= fromDate && taskDate <= toDate;
      }

      return assigneeMatch && statusMatch && priorityMatch && dateMatch;
    });
  }, [tasks, filters, visibleUserIds]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
            <p className="text-muted-foreground">Filter tasks to generate a custom report.</p>
        </div>
        <ReportDownloads tasks={filteredTasks} />
      </div>

      <Card>
        <CardContent className="p-4">
          <ReportFilters onApplyFilters={setFilters} initialFilters={filters} />
        </CardContent>
      </Card>
      
      <ReportResultsTable tasks={filteredTasks} />
    </div>
  );
}
`,
  "src/app/(app)/tasks/page.tsx": `'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanBoard from '@/components/tasks/kanban-board';
import CreateTaskDialog from '@/components/tasks/create-task-dialog';
import TaskFilters, { type TaskFilters as FiltersType } from '@/components/tasks/task-filters';
import { Button } from '@/components/ui/button';
import { Bell, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskCard from '@/components/tasks/task-card';

export default function TasksPage() {
  const { user, tasks, users } = useAppContext();
  const canManageTasks = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor' || user?.role === 'HSE';

  const [filters, setFilters] = useState<FiltersType>({
    status: 'all',
    priority: 'all',
    dateRange: undefined,
    showMyTasksOnly: false,
  });

  const [isPendingApprovalDialogOpen, setIsPendingApprovalDialogOpen] = useState(false);
  const [isMyRequestsDialogOpen, setIsMyRequestsDialogOpen] = useState(false);

  const tasksAwaitingMyApproval = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
        if (task.status !== 'Pending Approval') return false;

        const assignee = users.find(u => u.id === task.assigneeId);
        if (!assignee) return false;

        const isCreator = task.creatorId === user.id;
        const isSupervisor = assignee.supervisorId === user.id;

        // An approver cannot be the person who the task is assigned to.
        if (task.assigneeId === user.id) {
            return false;
        }

        return isCreator || isSupervisor;
    });
  }, [tasks, user, users]);
  
  const mySubmittedTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
        return task.status === 'Pending Approval' && task.assigneeId === user.id;
    });
  }, [tasks, user]);


  const filteredTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => {
      // Don't show pending tasks on the main board, they are handled in dialogs.
      if (task.status === 'Pending Approval') {
        return false;
      }
      
      const { status, priority, dateRange, showMyTasksOnly } = filters;

      if (showMyTasksOnly && task.assigneeId !== user.id) {
        return false;
      }
      
      const statusMatch = status === 'all' || task.status === status;
      const priorityMatch = priority === 'all' || task.priority === priority;
      
      let dateMatch = true;
      if (dateRange?.from) {
        const taskDate = new Date(task.dueDate);
        const fromDate = dateRange.from;
        const toDate = dateRange.to || new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 23, 59, 59);
        dateMatch = taskDate >= fromDate && taskDate <= toDate;
      }

      return statusMatch && priorityMatch && dateMatch;
    });
  }, [tasks, filters, user]);


  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
          </div>
          <div className="flex items-center gap-2">
              {mySubmittedTasks.length > 0 && (
                <Button variant="outline" onClick={() => setIsMyRequestsDialogOpen(true)}>
                    <History className="mr-2 h-4 w-4" />
                    My Requests
                    <span className="ml-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
                        {mySubmittedTasks.length}
                    </span>
                </Button>
              )}
              {tasksAwaitingMyApproval.length > 0 && (
                <Button variant="outline" onClick={() => setIsPendingApprovalDialogOpen(true)}>
                    <Bell className="mr-2 h-4 w-4" />
                    Pending Approvals
                    <span className="ml-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
                        {tasksAwaitingMyApproval.length}
                    </span>
                </Button>
              )}
              {canManageTasks && <CreateTaskDialog />}
          </div>
        </div>
        <div className='mb-4'>
          <TaskFilters onApplyFilters={setFilters} initialFilters={filters}/>
        </div>
        <KanbanBoard tasks={filteredTasks} />
      </div>
      
      <Dialog open={isPendingApprovalDialogOpen} onOpenChange={setIsPendingApprovalDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Tasks Awaiting Your Approval</DialogTitle>
                <DialogDescription>
                    Review these tasks and approve or return them to the assignee.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
                <div className="p-4 space-y-4">
                    {tasksAwaitingMyApproval.length > 0 ? tasksAwaitingMyApproval.map(task => (
                        <TaskCard key={task.id} task={task} />
                    )) : <p className="text-muted-foreground text-center">No tasks are awaiting your approval.</p>}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMyRequestsDialogOpen} onOpenChange={setIsMyRequestsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>My Pending Requests</DialogTitle>
                <DialogDescription>
                    These tasks are awaiting approval. You can view comments from the approver here.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1">
                <div className="p-4 space-y-4">
                    {mySubmittedTasks.length > 0 ? mySubmittedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    )) : <p className="text-muted-foreground text-center">You have no tasks awaiting approval.</p>}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
`,
  "src/app/(auth)/login/page.tsx": `'use client';
import { LoginForm } from '@/components/auth/login-form';
import { Layers } from 'lucide-react';
import { useAppContext } from '@/context/app-context';

export default function LoginPage() {
  const { appName, appLogo } = useAppContext();

  const nameParts = appName.split(' - ');
  const title = nameParts[0];
  const subtitle = nameParts.length > 1 ? nameParts.slice(1).join(' - ') : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-blue-100 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-primary p-3 rounded-lg mb-4 shadow-lg flex items-center justify-center">
                {appLogo ? (
                  <img src={appLogo} alt={appName} className="h-8 w-8 object-contain" />
                ) : (
                  <Layers className="h-8 w-8 text-primary-foreground" />
                )}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
            </div>
            <p className="text-muted-foreground mt-2 text-center">Welcome back! Please enter your credentials to log in.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
`,
  "src/components/account/add-employee-dialog.tsx": `'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/lib/types';
import { Label } from '../ui/label';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required') as z.ZodType<Role>,
  supervisorId: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface AddEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddEmployeeDialog({ isOpen, setIsOpen }: AddEmployeeDialogProps) {
  const { users, roles, addUser } = useAppContext();
  const { toast } = useToast();
  
  const supervisors = users.filter(u => ['Admin', 'Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE'].includes(u.role));

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Team Member',
      supervisorId: '',
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    addUser({
      ...data,
      supervisorId: (data.supervisorId === 'unassigned' || !data.supervisorId) ? undefined : data.supervisorId,
    });
    toast({
      title: 'Employee Added',
      description: \`\${data.name} has been added to the system.\`,
    });
    setIsOpen(false);
    form.reset();
  };
  
  const handleOpenChange = (open: boolean) => {
      if (!open) {
          form.reset();
      }
      setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Fill in the details to add a new member to the team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} placeholder="John Doe" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} placeholder="john.doe@example.com" />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          
          <div>
            <Label>Role</Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Supervisor</Label>
            <Controller
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger><SelectValue placeholder="Assign a supervisor" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="unassigned">None</SelectItem>
                      {supervisors.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/account/add-role-dialog.tsx": `'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { ALL_PERMISSIONS, type Permission } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string()).optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface AddRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const formatPermissionName = (permission: string) => {
  return permission.replace(/_/g, ' ').replace(/\\b\\w/g, char => char.toUpperCase());
};

export default function AddRoleDialog({ isOpen, setIsOpen }: AddRoleDialogProps) {
  const { addRole } = useAppContext();
  const { toast } = useToast();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    addRole({
      name: data.name,
      permissions: (data.permissions as Permission[]) || [],
    });
    toast({
      title: 'Role Added',
      description: \`The role "\${data.name}" has been added to the system.\`,
    });
    setIsOpen(false);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>Create a new role and assign permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" {...form.register('name')} placeholder="e.g., Quality Inspector" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label>Permissions</Label>
            <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-2">
                {ALL_PERMISSIONS.map(permission => (
                    <Controller
                        key={permission}
                        name="permissions"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={permission}
                                    checked={field.value?.includes(permission)}
                                    onCheckedChange={checked => {
                                        const value = field.value || [];
                                        return checked
                                        ? field.onChange([...value, permission])
                                        : field.onChange(value.filter(v => v !== permission));
                                    }}
                                />
                                <Label htmlFor={permission} className="font-normal">{formatPermissionName(permission)}</Label>
                            </div>
                        )}
                    />
                ))}
                </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/account/edit-employee-dialog.tsx": `'use client';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Role, User } from '@/lib/types';
import { Label } from '../ui/label';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, "Role is required") as z.ZodType<Role>,
  supervisorId: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

export default function EditEmployeeDialog({ isOpen, setIsOpen, user: userToEdit }: EditEmployeeDialogProps) {
  const { user: currentUser, users, roles, updateUser } = useAppContext();
  const { toast } = useToast();
  
  const supervisors = users.filter(u => ['Admin', 'Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE'].includes(u.role));
  const canEditRoles = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const canEditEmail = currentUser?.role === 'Admin';
  const canChangePassword = currentUser?.role === 'Admin';

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (userToEdit && isOpen) {
      form.reset({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        supervisorId: userToEdit.supervisorId || 'unassigned',
        password: '',
      });
    }
  }, [userToEdit, isOpen, form]);

  const onSubmit = (data: EmployeeFormValues) => {
    const finalUserData: User = { ...userToEdit };

    finalUserData.name = data.name;
    finalUserData.email = data.email;
    finalUserData.role = data.role;
    finalUserData.supervisorId = (data.supervisorId === 'unassigned' || !data.supervisorId) ? undefined : data.supervisorId;

    if (data.password) {
        finalUserData.password = data.password;
    }

    updateUser(finalUserData);
    toast({
      title: 'Employee Updated',
      description: \`\${data.name}'s details have been updated.\`,
    });
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update the details for {userToEdit.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} placeholder="Full Name" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} disabled={!canEditEmail} />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          {canChangePassword && (
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" {...form.register('password')} placeholder="Leave blank to keep current" />
              {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
            </div>
          )}

          <div>
            <Label>Role</Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!canEditRoles}>
                  <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Supervisor</Label>
            <Controller
              control={form.control}
              name="supervisorId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || 'unassigned'} disabled={!canEditRoles}>
                  <SelectTrigger><SelectValue placeholder="Assign a supervisor" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="unassigned">None</SelectItem>
                      {supervisors.filter(s => s.id !== userToEdit.id).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/account/edit-role-dialog.tsx": `'use client';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { ALL_PERMISSIONS, type Permission, type RoleDefinition } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string()).optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface EditRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: RoleDefinition;
}

const formatPermissionName = (permission: string) => {
  return permission.replace(/_/g, ' ').replace(/\\b\\w/g, char => char.toUpperCase());
};

export default function EditRoleDialog({ isOpen, setIsOpen, role }: EditRoleDialogProps) {
  const { updateRole } = useAppContext();
  const { toast } = useToast();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (role && isOpen) {
      form.reset({
        name: role.name,
        permissions: role.permissions,
      });
    }
  }, [role, isOpen, form]);

  const onSubmit = (data: RoleFormValues) => {
    updateRole({
        ...role,
        name: data.name,
        permissions: (data.permissions as Permission[]) || [],
    });
    toast({
      title: 'Role Updated',
      description: \`The role "\${data.name}" has been updated.\`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
          <DialogDescription>Modify the role's name and permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" {...form.register('name')} placeholder="e.g., Quality Inspector" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <Label>Permissions</Label>
            <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-2">
                {ALL_PERMISSIONS.map(permission => (
                    <Controller
                        key={permission}
                        name="permissions"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id={\`edit-\${permission}\`}
                                    checked={field.value?.includes(permission)}
                                    onCheckedChange={checked => {
                                        const value = field.value || [];
                                        return checked
                                        ? field.onChange([...value, permission])
                                        : field.onChange(value.filter(v => v !== permission));
                                    }}
                                />
                                <Label htmlFor={\`edit-\${permission}\`} className="font-normal">{formatPermissionName(permission)}</Label>
                            </div>
                        )}
                    />
                ))}
                </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/account/role-management-table.tsx": `'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import EditRoleDialog from './edit-role-dialog';
import type { RoleDefinition } from '@/lib/types';

export default function RoleManagementTable() {
    const { roles, deleteRole } = useAppContext();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

    const handleEditClick = (role: RoleDefinition) => {
        setSelectedRole(role);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (roleId: string) => {
        deleteRole(roleId);
        toast({
            variant: 'destructive',
            title: 'Role Deleted',
            description: 'The role has been removed from the system.',
        });
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map(role => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map(permission => (
                                        <Badge key={permission} variant="secondary">
                                            {permission.replace(/_/g, ' ')}
                                        </Badge>
                                    ))}
                                    {role.permissions.length === 0 && <span className="text-xs text-muted-foreground">No permissions</span>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {role.isEditable ? (
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleEditClick(role)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the role "{role.name}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(role.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <span className="text-xs text-muted-foreground">System Role</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedRole && (
                <EditRoleDialog
                    isOpen={isEditDialogOpen}
                    setIsOpen={setIsEditDialogOpen}
                    role={selectedRole}
                />
            )}
        </>
    );
}
`,
  "src/components/achievements/achievements-table.tsx": `'use client';
import { useAppContext } from '@/context/app-context';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Award, Medal } from 'lucide-react';
import type { User, Achievement } from '@/lib/types';
import { format } from 'date-fns';

interface PerformanceData {
  user: User;
  score: number;
  completed: number;
  overdue: number;
}

interface AchievementsTableProps {
  data: any[];
  type: 'performance' | 'manual';
}

export default function AchievementsTable({ data, type }: AchievementsTableProps) {
  const { users } = useAppContext();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-yellow-700" />;
    return <span className="w-5 text-center">{index + 1}</span>;
  };

  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data to display.</p>;
  }

  if (type === 'performance') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead className="text-center">Completed Tasks</TableHead>
            <TableHead className="text-center">Overdue Tasks</TableHead>
            <TableHead className="text-right">Performance Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data as PerformanceData[]).map((item, index) => (
            <TableRow key={item.user.id}>
              <TableCell className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-sm text-muted-foreground">{item.user.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.completed}</TableCell>
              <TableCell className="text-center">{item.overdue}</TableCell>
              <TableCell className="text-right font-semibold">{item.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Achievement</TableHead>
          <TableHead>Awarded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as Achievement[]).map((item) => {
            const user = users.find(u => u.id === item.userId);
            const awardedBy = users.find(u => u.id === item.awardedById);
            return (
                <TableRow key={item.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user?.name}</p>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </TableCell>
                <TableCell>{awardedBy?.name || 'System'}</TableCell>
                <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right font-semibold">{item.points}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
`,
  "src/components/achievements/add-achievement-dialog.tsx": `'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

const achievementSchema = z.object({
  userId: z.string().min(1, 'Please select an employee'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  points: z.coerce.number().min(1, 'Points must be at least 1'),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export default function AddAchievementDialog() {
  const { users, addManualAchievement } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      userId: '',
      title: '',
      description: '',
      points: 10,
    },
  });

  const onSubmit = (data: AchievementFormValues) => {
    addManualAchievement(data);
    toast({
      title: 'Achievement Awarded',
      description: \`You have awarded an achievement to \${users.find(u => u.id === data.userId)?.name}.\`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Award
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Achievement</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label>Employee</Label>
            <Controller
              control={form.control}
              name="userId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.userId && <p className="text-xs text-destructive">{form.formState.errors.userId.message}</p>}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} placeholder="e.g., Employee of the Month" />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description / Reason</Label>
            <Textarea id="description" {...form.register('description')} placeholder="Reason for the award" />
            {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="points">Points</Label>
            <Input id="points" type="number" {...form.register('points')} />
            {form.formState.errors.points && <p className="text-xs text-destructive">{form.formState.errors.points.message}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Award Achievement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/activity-tracker/activity-log-table.tsx": `'use client';

import { useAppContext } from '@/context/app-context';
import type { ActivityLog } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export default function ActivityLogTable({ logs }: ActivityLogTableProps) {
  const { users } = useAppContext();

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return 'Active';
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return \`\${minutes}m\`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return \`\${hours}h \${mins}m\`;
  };

  if (logs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No activity logs to display.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Login Time</TableHead>
          <TableHead>Logout Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Activities</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          const logUser = users.find(u => u.id === log.userId);
          return (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={logUser?.avatar} alt={logUser?.name} />
                    <AvatarFallback>{logUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{logUser?.name}</p>
                    <p className="text-sm text-muted-foreground">{logUser?.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(log.loginTime), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{format(new Date(log.loginTime), 'p')}</TableCell>
              <TableCell>{log.logoutTime ? format(new Date(log.logoutTime), 'p') : <Badge variant="secondary">Active</Badge>}</TableCell>
              <TableCell>{formatDuration(log.duration)}</TableCell>
              <TableCell>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {log.actions.length} action(s) <ChevronDown className="h-4 w-4 ml-2"/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="list-none space-y-2 mt-2 pl-2">
                      {log.actions.map((action, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                           <ChevronsRight className="h-3 w-3 mt-0.5 shrink-0"/> <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
`,
  "src/components/auth/login-form.tsx": `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = (data: LoginFormValues) => {
    setIsLoading(true);
    const success = login(data.email, data.password);
    
    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleLogin)}>
      <Card className="bg-card shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" {...form.register('email')} />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...form.register('password')} />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
`,
  "src/components/dashboard/employee-performance-chart.tsx": `'use client';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useAppContext } from '@/context/app-context';
import type { Task } from '@/lib/types';

export default function EmployeePerformanceChart() {
  const { tasks, getVisibleUsers } = useAppContext();
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const chartData = useMemo(() => {
    return visibleUsers.map(user => {
      const userTasks = tasks.filter(task => task.assigneeId === user.id);
      const completed = userTasks.filter(t => t.status === 'Completed').length;
      const inProgress = userTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending Approval').length;
      const todo = userTasks.filter(t => t.status === 'To Do').length;
      const overdue = userTasks.filter(t => t.status === 'Overdue').length;

      return { 
        name: user.name, 
        completed,
        inProgress,
        todo,
        overdue,
        total: userTasks.length
      };
    });
  }, [tasks, visibleUsers]);

  return (
    <div className="h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 30, right: 20, left: -10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{fill: 'hsl(var(--muted))'}}
            contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
          />
          <Legend verticalAlign="top" wrapperStyle={{fontSize: "14px", paddingBottom: "10px"}}/>
          <Bar dataKey="todo" fill="hsl(var(--chart-1))" name="To Do" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="hsl(var(--chart-2))" name="In Progress" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" fill="hsl(var(--chart-3))" name="Completed" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overdue" fill="hsl(var(--destructive))" name="Overdue" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
`,
  "src/components/dashboard/employee-performance-pie-chart.tsx": `'use client';
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
                <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
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
`,
  "src/components/dashboard/stat-card.tsx": `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}

export default function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
`,
  "src/components/dashboard/tasks-completed-chart.tsx": `'use client';
import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAppContext } from '@/context/app-context';
import { getMonth, parseISO } from 'date-fns';

export default function TasksCompletedChart() {
  const { tasks, user, getVisibleUsers } = useAppContext();
  
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);
  const visibleUserIds = useMemo(() => visibleUsers.map(u => u.id), [visibleUsers]);

  const chartData = useMemo(() => {
    const relevantTasks = tasks.filter(t => visibleUserIds.includes(t.assigneeId) && t.status === 'Completed');

    const monthlyData: { [key: number]: number } = {};

    relevantTasks.forEach(task => {
      // Ensure dueDate is a valid date string before parsing
      if (task.dueDate) {
        try {
          const month = getMonth(parseISO(task.dueDate));
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        } catch (error) {
          console.error("Invalid date format for task:", task.id, task.dueDate);
        }
      }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthNames.map((name, index) => ({
      name,
      completed: monthlyData[index] || 0,
    }));
  }, [tasks, visibleUserIds]);

  return (
    <div className="h-[300px]">
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
  );
}
`,
  "src/components/performance/employee-stats-table.tsx": `'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function EmployeeStatsTable() {
  const { tasks, getVisibleUsers } = useAppContext();
  const visibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const performanceData = useMemo(() => {
    return visibleUsers.map(user => {
      const userTasks = tasks.filter(task => task.assigneeId === user.id);
      const completed = userTasks.filter(t => t.status === 'Completed').length;
      const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
      const todo = userTasks.filter(t => t.status === 'To Do').length;
      const pending = userTasks.filter(t => t.status === 'Pending Approval').length;
      const overdue = userTasks.filter(t => t.status === 'Overdue').length;

      return {
        ...user,
        stats: {
          completed,
          inProgress,
          todo,
          pending,
          overdue,
          total: userTasks.length,
        },
      };
    }).sort((a, b) => b.stats.completed - a.stats.completed);
  }, [visibleUsers, tasks]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead className="text-center">To Do</TableHead>
          <TableHead className="text-center">In Progress</TableHead>
          <TableHead className="text-center">Pending</TableHead>
          <TableHead className="text-center">Completed</TableHead>
          <TableHead className="text-center">Overdue</TableHead>
          <TableHead className="text-center">Total Assigned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performanceData.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.role}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">{user.stats.todo}</TableCell>
            <TableCell className="text-center">{user.stats.inProgress}</TableCell>
            <TableCell className="text-center">{user.stats.pending}</TableCell>
            <TableCell className="text-center font-medium">{user.stats.completed}</TableCell>
            <TableCell className="text-center">
              {user.stats.overdue > 0 ? (
                <Badge variant="destructive">{user.stats.overdue}</Badge>
              ) : (
                0
              )}
            </TableCell>
            <TableCell className="text-center font-semibold">{user.stats.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
`,
  "src/components/planner/create-event-dialog.tsx": `'use client';
import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import type { Frequency } from '@/lib/types';
import { Label } from '../ui/label';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  date: z.date({ required_error: 'Date is required' }),
  frequency: z.enum(['once', 'daily', 'weekly', 'weekends', 'monthly', 'daily-except-sundays']),
  userId: z.string().min(1, 'Please select an employee for this event'),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventDialog() {
  const { user, addPlannerEvent, getVisibleUsers } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const assignableUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      frequency: 'once',
      userId: user?.id,
    },
  });

  const onSubmit = (data: EventFormValues) => {
    addPlannerEvent({
      ...data,
      date: data.date.toISOString(),
      creatorId: user!.id,
    });
    toast({
      title: 'Event Created',
      description: \`"\${data.title}" has been added to the planner.\`,
    });
    setIsOpen(false);
    form.reset();
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        title: '',
        description: '',
        frequency: 'once',
        userId: user?.id,
      });
    }
    setIsOpen(open);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label>Event For</Label>
            <Controller
              control={form.control}
              name="userId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger>
                  <SelectContent>
                    {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.userId && <p className="text-xs text-destructive">{form.formState.errors.userId.message}</p>}
          </div>

          <div>
            <Label>Title</Label>
            <Input {...form.register('title')} placeholder="Event title" />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea {...form.register('description')} placeholder="Event description (optional)" />
          </div>

          <div>
            <Label>Date</Label>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.date && <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>}
          </div>

          <div>
            <Label>Frequency</Label>
            <Controller
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Set frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="daily-except-sundays">Daily (Except Sundays)</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/planner/planner-calendar.tsx": `'use client';
import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ChevronDown, Send } from 'lucide-react';
import { Separator } from '../ui/separator';

interface PlannerCalendarProps {
    selectedUserId: string;
}

export default function PlannerCalendar({ selectedUserId }: PlannerCalendarProps) {
  const { users, getExpandedPlannerEvents, addPlannerEventComment, dailyPlannerComments, addDailyPlannerComment } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventComment, setEventComment] = useState('');
  const [dailyComment, setDailyComment] = useState('');
  const [activeCollapsible, setActiveCollapsible] = useState<string | null>(null);

  const expandedEvents = useMemo(() => getExpandedPlannerEvents(currentMonth, selectedUserId), [getExpandedPlannerEvents, currentMonth, selectedUserId]);

  const eventDays = useMemo(() => {
    return expandedEvents.map(event => event.eventDate);
  }, [expandedEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return expandedEvents.filter(event => isSameDay(event.eventDate, selectedDate));
  }, [expandedEvents, selectedDate]);
  
  const handleAddEventComment = (eventId: string) => {
    if (!eventComment.trim()) return;
    addPlannerEventComment(eventId, eventComment);
    setEventComment('');
  };

  const selectedDayComments = useMemo(() => {
    if (!selectedDate) return [];
    const dayKey = format(selectedDate, 'yyyy-MM-dd');
    const dailyEntry = dailyPlannerComments.find(dpc => dpc.day === dayKey && dpc.plannerUserId === selectedUserId);
    return dailyEntry?.comments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  }, [dailyPlannerComments, selectedDate, selectedUserId]);

  const handleAddDailyComment = () => {
    if (!dailyComment.trim() || !selectedDate) return;
    addDailyPlannerComment(selectedUserId, selectedDate, dailyComment);
    setDailyComment('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardContent className="p-0 sm:p-2">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={{ event: eventDays }}
                modifiersStyles={{
                  event: {
                    color: 'hsl(var(--accent-foreground))',
                    backgroundColor: 'hsl(var(--accent))',
                  },
                }}
                className="w-full"
            />
        </CardContent>
      </Card>
      
      <div className="lg:col-span-1">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    Daily Notepad
                </CardTitle>
                <CardDescription>
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((event, index) => {
                                const creator = users.find(u => u.id === event.creatorId);
                                const eventUser = users.find(u => u.id === event.userId);
                                return (
                                    <Collapsible key={\`\${event.id}-\${index}\`} open={activeCollapsible === event.id} onOpenChange={(isOpen) => setActiveCollapsible(isOpen ? event.id : null)}>
                                        <Card className="bg-muted/50">
                                            <CollapsibleTrigger className='w-full text-left'>
                                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-base">{event.title}</CardTitle>
                                                        <CardDescription>
                                                            <Badge variant="secondary" className="capitalize">{event.frequency.replace(/-/g, ' ')}</Badge>
                                                        </CardDescription>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                </CardHeader>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                                    
                                                    <div className="mt-4 pt-4 border-t">
                                                        <h4 className='text-sm font-semibold mb-2'>Event Comments</h4>
                                                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                                            {(event.comments || []).length > 0 ? (event.comments || []).map((comment, idx) => {
                                                                const commentUser = users.find(u => u.id === comment.userId);
                                                                return (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <Avatar className="h-7 w-7"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                                                        <div className="bg-background p-2 rounded-md w-full text-sm">
                                                                            <div className="flex justify-between items-baseline"><p className="font-semibold text-xs">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                                                                            <p className="text-foreground/80 mt-1">{comment.text}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }) : <p className="text-xs text-muted-foreground">No comments on this event.</p>}
                                                        </div>
                                                        <div className="relative mt-3">
                                                            <Textarea value={eventComment} onChange={(e) => setEventComment(e.target.value)} placeholder="Add a comment..." className="pr-12 text-sm"/>
                                                            <Button type="button" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleAddEventComment(event.id)} disabled={!eventComment.trim()}><Send className="h-4 w-4" /></Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <p>For:</p>
                                                        <Avatar className="h-6 w-6"><AvatarImage src={eventUser?.avatar} /><AvatarFallback>{eventUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <span>{eventUser?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <p>By:</p>
                                                        <Avatar className="h-6 w-6"><AvatarImage src={creator?.avatar} /><AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <span>{creator?.name}</span>
                                                    </div>
                                                </CardFooter>
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )
                            })
                        ) : (
                            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">No events scheduled.</p>
                            </div>
                        )}
                    </div>
                    
                    <Separator className="my-4"/>

                    <div>
                        <h3 className="text-sm font-semibold mb-2">Daily Comments</h3>
                        <div className="space-y-3 mb-2">
                            {selectedDayComments.length > 0 ? selectedDayComments.map((comment, idx) => {
                                const commentUser = users.find(u => u.id === comment.userId);
                                return (
                                    <div key={idx} className="flex items-start gap-2">
                                        <Avatar className="h-7 w-7"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div className="bg-muted p-2 rounded-md w-full text-sm">
                                            <div className="flex justify-between items-baseline"><p className="font-semibold text-xs">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                                            <p className="text-foreground/80 mt-1">{comment.text}</p>
                                        </div>
                                    </div>
                                )
                            }) : <p className="text-xs text-muted-foreground">No comments for this day.</p>}
                        </div>
                        <div className="relative">
                            <Textarea value={dailyComment} onChange={(e) => setDailyComment(e.target.value)} placeholder="Add a comment for the day..." className="pr-12 text-sm"/>
                            <Button type="button" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleAddDailyComment} disabled={!dailyComment.trim()}><Send className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,
  "src/components/reports/report-downloads.tsx": `'use client';
import type { Task } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface ReportDownloadsProps {
  tasks: Task[];
}

export default function ReportDownloads({ tasks }: ReportDownloadsProps) {
  const { users } = useAppContext();

  const handleDownloadExcel = () => {
    const dataToExport = tasks.map(task => ({
      'Task Title': task.title,
      'Assignee': users.find(u => u.id === task.assigneeId)?.name || 'N/A',
      'Status': task.status,
      'Priority': task.priority,
      'Due Date': format(new Date(task.dueDate), 'yyyy-MM-dd'),
      'Description': task.description,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks Report');
    XLSX.writeFile(workbook, 'TaskMaster_Report.xlsx');
  };

  const handleDownloadPdf = async () => {
    const jsPDF = (await import('jspdf')).default;
    // Import for side-effects to attach \`autoTable\` to the jsPDF prototype
    await import('jspdf-autotable');

    const doc = new jsPDF();
    
    doc.text('TaskMaster Pro - Report', 14, 16);
    
    // This requires a type assertion because TypeScript doesn't know about the dynamically added method
    (doc as any).autoTable({
      head: [['Task Title', 'Assignee', 'Status', 'Priority', 'Due Date']],
      body: tasks.map(task => [
        task.title,
        users.find(u => u.id === task.assigneeId)?.name || 'N/A',
        task.status,
        task.priority,
        format(new Date(task.dueDate), 'yyyy-MM-dd'),
      ]),
      startY: 20,
    });
    
    doc.save('TaskMaster_Report.pdf');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownloadExcel} disabled={tasks.length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" onClick={handleDownloadPdf} disabled={tasks.length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
`,
  "src/components/reports/report-filters.tsx": `'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import type { Filters } from '@/app/(app)/reports/page';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Priority, TaskStatus } from '@/lib/types';

interface ReportFiltersProps {
  onApplyFilters: (filters: Filters) => void;
  initialFilters: Filters;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed', 'Overdue', 'Pending Approval'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export default function ReportFilters({ onApplyFilters, initialFilters }: ReportFiltersProps) {
  const { getVisibleUsers } = useAppContext();
  const visibleUsers = getVisibleUsers();
  const [assigneeId, setAssigneeId] = useState(initialFilters.assigneeId);
  const [status, setStatus] = useState(initialFilters.status);
  const [priority, setPriority] = useState(initialFilters.priority);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);

  const handleApply = () => {
    onApplyFilters({ assigneeId, status, priority, dateRange });
  };

  const handleClear = () => {
    setAssigneeId('all');
    setStatus('all');
    setPriority('all');
    setDateRange(undefined);
    onApplyFilters({
      assigneeId: 'all',
      status: 'all',
      priority: 'all',
      dateRange: undefined,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <Select value={assigneeId} onValueChange={setAssigneeId}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by employee..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          {visibleUsers.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by priority..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {priorities.map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full md:w-[300px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
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
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2 ml-auto">
        <Button onClick={handleApply}>Apply Filters</Button>
        <Button variant="ghost" onClick={handleClear}>
          <X className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
`,
  "src/components/reports/report-results-table.tsx": `'use client';
import type { Task } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { format } from 'date-fns';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';

interface ReportResultsTableProps {
  tasks: Task[];
}

export default function ReportResultsTable({ tasks }: ReportResultsTableProps) {
    const { users } = useAppContext();

    const priorityVariant = {
        'Low': 'secondary',
        'Medium': 'default',
        'High': 'destructive',
    } as const;

  if (tasks.length === 0) {
    return (
      <Card className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">No tasks match the current filters.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => {
            const assignee = users.find(u => u.id === task.assigneeId);
            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{assignee?.name || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={task.status === 'Completed' ? 'outline' : 'default'}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
`,
  "src/components/shared/app-sidebar.tsx": `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Briefcase, TrendingUp, FileText, Users, LogOut, Layers, CalendarDays, Award, Clock, FileCode } from 'lucide-react';

export function AppSidebar() {
  const { user, logout, appName, appLogo } = useAppContext();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks' },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/achievements', icon: Award, label: 'Achievements' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/account', icon: Users, label: 'Employees' },
    { href: '/activity-tracker', icon: Clock, label: 'Activity Tracker' },
  ];
  
  if (user?.role === 'Admin') {
    navItems.push({ href: '/file-explorer', icon: FileCode, label: 'File Explorer' });
  }

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-border h-full">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
                {appLogo ? (
                  <img src={appLogo} alt={appName} className="h-6 w-6 object-contain" />
                ) : (
                  <Layers className="h-6 w-6 text-primary-foreground" />
                )}
            </div>
            <h1 className="text-xl font-bold">{appName}</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base py-6 text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <Separator className="my-4 bg-sidebar-foreground/20" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Log Out" className="text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
`,
  "src/components/shared/header.tsx": `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LayoutDashboard, Briefcase, Layers, LogOut, TrendingUp, FileText, User, CalendarDays, Users, Award, Clock, FileCode } from 'lucide-react';

export default function Header() {
  const { user, logout, appName, appLogo } = useAppContext();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/tasks')) return 'Manage Tasks';
    if (pathname.startsWith('/planner')) return 'Planner';
    if (pathname.startsWith('/performance')) return 'Performance';
    if (pathname.startsWith('/achievements')) return 'Achievements';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/account')) return 'Employees';
    if (pathname.startsWith('/activity-tracker')) return 'Activity Tracker';
    if (pathname.startsWith('/file-explorer')) return 'File Explorer';
    return 'Task Management System';
  };
  
  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks' },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/achievements', icon: Award, label: 'Achievements' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/account', icon: Users, label: 'Employees' },
    { href: '/activity-tracker', icon: Clock, label: 'Activity Tracker' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ href: '/file-explorer', icon: FileCode, label: 'File Explorer' });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-sidebar text-sidebar-foreground px-4 md:px-8">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden bg-transparent text-sidebar-foreground border-sidebar-foreground/50 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground border-r-0">
            <div className="p-4 border-b border-sidebar-foreground/20">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
                        {appLogo ? (
                          <img src={appLogo} alt={appName} className="h-6 w-6 object-contain" />
                        ) : (
                          <Layers className="h-6 w-6 text-primary-foreground" />
                        )}
                    </div>
                    <h1 className="text-xl font-bold">{appName}</h1>
                </Link>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                {navItems.map(item => (
                    <li key={item.href}>
                        <SheetClose asChild>
                            <Button
                                asChild
                                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
                            >
                                <Link href={item.href} className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                                </Link>
                            </Button>
                        </SheetClose>
                    </li>
                ))}
                </ul>
            </nav>
            <div className="p-4 mt-auto border-t border-sidebar-foreground/20">
                <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                </div>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" onClick={logout} title="Log Out" className="hover:bg-sidebar-accent/80">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </SheetClose>
                </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold text-sidebar-foreground hidden md:block">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="hidden md:block">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
`,
  "src/components/tasks/ai-tools-dialog.tsx": `'use client';
import { useState } from 'react';
import type { Task, User } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { aiTaskSuggestions } from '@/ai/flows/ai-task-suggestions';
import type { AiTaskSuggestionsOutput } from '@/ai/flows/ai-task-suggestions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bot, Lightbulb, UserCheck, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface AiToolsDialogProps {
  task: Task;
  assignee: User | undefined;
}

export default function AiToolsDialog({ task, assignee }: AiToolsDialogProps) {
  const { users } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiTaskSuggestionsOutput | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await aiTaskSuggestions({
        taskDescription: \`\${task.title}: \${task.description}\`,
        currentAssigneeRole: assignee?.role || 'N/A',
        availableAssignees: users.map(u => ({ name: u.name, role: u.role })),
        taskStatus: task.status,
        taskDeadline: task.dueDate,
      });
      setSuggestion(result);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not get suggestions at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bot className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Task Assistant</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Get AI-powered suggestions for this task to improve efficiency.
          </p>
          {!suggestion && (
            <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Get Suggestions'}
            </Button>
          )}
          {suggestion && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="font-semibold flex items-center mb-2"><UserCheck className="mr-2 h-4 w-4 text-primary" />Optimal Assignee</h3>
                <Badge>{suggestion.optimalAssignee}</Badge>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-4 w-4 text-primary" />Suggested Actions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {suggestion.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
              <Separator />
               <div>
                <h3 className="font-semibold mb-2">Reasoning</h3>
                <p className="text-sm text-muted-foreground italic">"{suggestion.reasoning}"</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {suggestion && (
            <Button onClick={handleGetSuggestions} disabled={isLoading} variant="secondary">
                 {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Re-analyzing...' : 'Regenerate'}
            </Button>
          )}
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/tasks/create-task-dialog.tsx": `'use client';
import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { suggestTaskPriority } from '@/ai/flows/suggest-task-priority';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PlusCircle, CalendarIcon, Bot } from 'lucide-react';
import type { Priority, Role } from '@/lib/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  priority: z.enum(['Low', 'Medium', 'High']),
  requiresAttachmentForCompletion: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const roleHierarchy: Record<Role, number> = {
  'Team Member': 0,
  'Junior Supervisor': 1,
  'Junior HSE': 1,
  'Supervisor': 2,
  'HSE': 2,
  'Manager': 3,
  'Admin': 4,
};

export default function CreateTaskDialog() {
  const { user, users, addTask, getVisibleUsers } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      priority: 'Medium',
      requiresAttachmentForCompletion: false,
    },
  });
  
  const allVisibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const assignableUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return allVisibleUsers;
    }
    
    const userRoleLevel = roleHierarchy[user.role];

    return allVisibleUsers.filter(assignee => {
      const assigneeRoleLevel = roleHierarchy[assignee.role];
      // Allow assigning to self or to roles lower in the hierarchy
      return assignee.id === user.id || assigneeRoleLevel < userRoleLevel;
    });
  }, [user, allVisibleUsers]);

  const onSubmit = (data: TaskFormValues) => {
    addTask({
      ...data,
      dueDate: data.dueDate.toISOString(),
      creatorId: user!.id,
    });
    const assignee = users.find(u => u.id === data.assigneeId);
    toast({
      title: 'Task Created',
      description: \`"\${data.title}" assigned to \${assignee?.name}.\`,
    });
    setIsOpen(false);
    form.reset();
  };
  
  const handleSuggestPriority = async () => {
    const { title, description, dueDate } = form.getValues();
    if (!title || !description || !dueDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in title, description, and due date to suggest priority.',
      });
      return;
    }
    
    setIsSuggesting(true);
    try {
      const result = await suggestTaskPriority({
        taskDescription: \`\${title}: \${description}\`,
        deadline: format(dueDate, 'yyyy-MM-dd'),
        importance: form.getValues('priority'),
        userRole: user!.role,
        availableUsers: users.map(u => \`\${u.name} (\${u.role})\`),
      });
      
      form.setValue('priority', result.priority as Priority, { shouldValidate: true });
      toast({
        title: 'AI Suggestion',
        description: \`Priority set to "\${result.priority}" based on AI analysis.\`,
      });
    } catch (error) {
      console.error('AI priority suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not get a priority suggestion at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Fill in the details below to create and assign a new task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Input {...form.register('title')} placeholder="Task title" />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          
          <Textarea {...form.register('description')} placeholder="Task description" />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          
          <Controller
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                <SelectContent>
                  {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.assigneeId && <p className="text-xs text-destructive">{form.formState.errors.assigneeId.message}</p>}
          
          <Controller
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
              </Popover>
            )}
          />
          {form.formState.errors.dueDate && <p className="text-xs text-destructive">{form.formState.errors.dueDate.message}</p>}

          <div className="flex gap-2 items-center">
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button type="button" variant="outline" onClick={handleSuggestPriority} disabled={isSuggesting}>
                <Bot className="mr-2 h-4 w-4" />
                {isSuggesting ? 'Suggesting...' : 'Suggest'}
            </Button>
          </div>
          {form.formState.errors.priority && <p className="text-xs text-destructive">{form.formState.errors.priority.message}</p>}
          
          <div className="space-y-3 pt-2">
            <Controller
              control={form.control}
              name="requiresAttachmentForCompletion"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                    <Switch id="requires-attachment" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="requires-attachment">Require file attachment for completion</Label>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/tasks/edit-task-dialog.tsx": `'use client';
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarIcon, Send, ThumbsUp, ThumbsDown, Paperclip, Upload, X, BellRing } from 'lucide-react';
import type { Task, Priority, TaskStatus, Role, Comment, ApprovalState } from '@/lib/types';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  priority: z.enum(['Low', 'Medium', 'High']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Task;
}

const roleHierarchy: Record<Role, number> = {
  'Team Member': 0,
  'Junior Supervisor': 1,
  'Junior HSE': 1,
  'Supervisor': 2,
  'HSE': 2,
  'Manager': 3,
  'Admin': 4,
};

export default function EditTaskDialog({ isOpen, setIsOpen, task }: EditTaskDialogProps) {
  const { user, users, updateTask, getVisibleUsers, requestTaskStatusChange, approveTaskStatusChange, returnTaskStatusChange, addComment } = useAppContext();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const creator = useMemo(() => users.find(u => u.id === task.creatorId), [users, task.creatorId]);
  const assignee = useMemo(() => users.find(u => u.id === task.assigneeId), [users, task.assigneeId]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task && isOpen) {
      form.reset({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
      });
      setAttachment(null); // Reset attachment on open
    }
  }, [task, form, isOpen]);

  const allVisibleUsers = useMemo(() => getVisibleUsers(), [getVisibleUsers]);

  const assignableUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return allVisibleUsers;
    }
    const userRoleLevel = roleHierarchy[user.role];
    return allVisibleUsers.filter(assignee => {
      const assigneeRoleLevel = roleHierarchy[assignee.role];
      return assignee.id === user.id || assigneeRoleLevel < userRoleLevel;
    });
  }, [user, allVisibleUsers]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addComment(task.id, newComment);
    setNewComment('');
  };
  
  const handleRequestStatusChange = (newStatus: TaskStatus) => {
    if (!newComment.trim()) {
      toast({ variant: 'destructive', title: 'Comment required', description: 'Please add a comment before changing the status.' });
      return;
    }

    if (newStatus === 'Completed' && task.requiresAttachmentForCompletion && !attachment && !task.attachment) {
      toast({ variant: 'destructive', title: 'Attachment required', description: 'This task requires a file attachment for completion.' });
      return;
    }

    let fileData: Task['attachment'] | undefined = undefined;
    if (attachment) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileData = {
                name: attachment.name,
                url: e.target?.result as string,
            };
            requestTaskStatusChange(task.id, newStatus, newComment, fileData);
            setNewComment('');
            setIsOpen(false);
        };
        reader.readAsDataURL(attachment);
    } else {
        requestTaskStatusChange(task.id, newStatus, newComment);
        setNewComment('');
        setIsOpen(false);
    }
    toast({ title: 'Status Change Requested', description: 'Your request has been sent for approval.' });
  };
  
  const handleApprovalAction = (action: 'approve' | 'return') => {
    if (!newComment.trim()) {
        toast({ variant: 'destructive', title: 'Comment required', description: 'Please provide a comment for your decision.' });
        return;
    }
    if (action === 'approve') {
        approveTaskStatusChange(task.id, newComment);
        toast({ title: 'Status Approved', description: 'The task status has been updated.' });
    } else {
        returnTaskStatusChange(task.id, newComment);
        toast({ title: 'Status Change Returned', description: 'The task has been returned to the assignee.' });
    }
    setNewComment('');
    setIsOpen(false);
  };

  const onSubmit = (data: TaskFormValues) => {
    updateTask({
      ...task,
      ...data,
      dueDate: data.dueDate.toISOString(),
    });
    toast({ title: 'Task Updated', description: \`"\${data.title}" has been successfully updated.\` });
  };
  
  const canReassign = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor' || user?.role === 'HSE';
  const isApprover = user?.id === task.creatorId || user?.id === assignee?.supervisorId;
  const isAssignee = user?.id === task.assigneeId;

  const renderActionButtons = () => {
    if (task.status === 'Pending Approval') {
        if (isApprover) {
            return (
                <div className='flex gap-2'>
                    <Button onClick={() => handleApprovalAction('approve')} className="w-full bg-green-600 hover:bg-green-700"><ThumbsUp className="mr-2 h-4 w-4" /> Approve</Button>
                    <Button onClick={() => handleApprovalAction('return')} className="w-full" variant="destructive"><ThumbsDown className="mr-2 h-4 w-4" /> Return</Button>
                </div>
            )
        }
        return <p className='text-sm text-center text-muted-foreground p-2 bg-muted rounded-md'>Awaiting approval from {creator?.name}</p>
    }
    if (isAssignee) {
        if (task.status === 'To Do') {
            return <Button onClick={() => handleRequestStatusChange('In Progress')} className="w-full">Start Progress</Button>
        }
        if (task.status === 'In Progress') {
            return <Button onClick={() => handleRequestStatusChange('Completed')} className="w-full">Request Completion</Button>
        }
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <DialogTitle>Edit Task: {task.title}</DialogTitle>
          <DialogDescription>
            Assigned by <span className='font-semibold'>{creator?.name}</span> to <span className='font-semibold'>{assignee?.name}</span>. 
            Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}.
          </DialogDescription>
          {task.status === 'Pending Approval' && task.previousStatus && task.pendingStatus && (
            <Alert variant="default" className="mt-2">
                <BellRing className="h-4 w-4" />
                <AlertTitle>Approval Request</AlertTitle>
                <AlertDescription>
                    {assignee?.name} requests to change status from <Badge variant="secondary">{task.previousStatus}</Badge> to <Badge variant="secondary">{task.pendingStatus}</Badge>. Please review the comments.
                </AlertDescription>
            </Alert>
          )}
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4 overflow-y-auto max-h-[70vh]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-4 border-r">
              <div>
                <Label>Title</Label>
                <Input {...form.register('title')} placeholder="Task title" />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea {...form.register('description')} placeholder="Task description" rows={5}/>
              </div>

              <div>
                <Label>Assignee</Label>
                <Controller
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={!canReassign}>
                          <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                          <SelectContent>
                          {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                    )}
                />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Due Date</Label>
                  <Controller control={form.control} name="dueDate"
                      render={({ field }) => (
                      <Popover>
                          <PopoverTrigger asChild>
                          <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                      </Popover>
                      )}
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <Controller control={form.control} name="priority"
                      render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                      </Select>
                      )}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>

            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Comments & Activity</h3>
                <ScrollArea className="flex-1 h-64 pr-4 border-b">
                    <div className="space-y-4">
                        {(task.comments || []).map((comment, index) => {
                            const commentUser = users.find(u => u.id === comment.userId);
                            const isApprovalComment = index === 0 && task.status === 'Pending Approval';
                            return (
                                <div key={index} className={cn("flex items-start gap-3", isApprovalComment && "p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20")}>
                                    <Avatar className="h-8 w-8"><AvatarImage src={commentUser?.avatar} /><AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback></Avatar>
                                    <div className="bg-muted p-3 rounded-lg w-full">
                                        <div className="flex justify-between items-center"><p className="font-semibold text-sm">{commentUser?.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.date), { addSuffix: true })}</p></div>
                                        <p className="text-sm text-foreground/80 mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                        {(task.comments || []).length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No comments yet.</p>}
                    </div>
                </ScrollArea>
                {task.requiresAttachmentForCompletion && isAssignee && task.status === 'In Progress' && (
                  <div>
                    <Label>Attachment for Completion</Label>
                    {!attachment && !task.attachment &&
                      <div className="relative mt-1">
                        <Button asChild variant="outline" size="sm"><Label htmlFor="file-upload"><Upload className="mr-2"/>Upload File</Label></Button>
                        <Input id="file-upload" type="file" onChange={handleFileChange} className="hidden"/>
                      </div>
                    }
                    {(attachment || task.attachment) && (
                      <div className="mt-1 flex items-center justify-between p-2 rounded-md border text-sm">
                          <div className="flex items-center gap-2"><Paperclip className="h-4 w-4"/><span>{attachment?.name || task.attachment?.name}</span></div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachment(null)}><X className="h-4 w-4"/></Button>
                      </div>
                    )}
                  </div>
                )}
                 <div className="relative">
                    <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment... (required for status changes)" className="pr-12"/>
                    <Button type="button" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleAddComment} disabled={!newComment.trim()}><Send className="h-4 w-4" /></Button>
                </div>
                {renderActionButtons()}
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
`,
  "src/components/tasks/kanban-board.tsx": `'use client';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import KanbanColumn from './kanban-column';
import type { Task, TaskStatus } from '@/lib/types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

const columns: TaskStatus[] = ['To Do', 'In Progress', 'Completed', 'Overdue'];

interface KanbanBoardProps {
    tasks: Task[];
}

export default function KanbanBoard({ tasks: filteredTasks }: KanbanBoardProps) {
  const { requestTaskStatusChange, getVisibleUsers, addComment, user } = useAppContext();
  
  const visibleUserIds = useMemo(() => {
    return getVisibleUsers().map(u => u.id);
  }, [getVisibleUsers]);
  
  const tasksToShow = useMemo(() => {
    return filteredTasks.filter(task => visibleUserIds.includes(task.assigneeId));
  }, [filteredTasks, visibleUserIds]);
  
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Pending Approval': [],
      'Completed': [],
      'Overdue': [],
    };
    
    tasksToShow.forEach(task => {
        if(grouped[task.status]) {
            grouped[task.status].push(task);
        }
    });
    return grouped;
  }, [tasksToShow]);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const task = tasksToShow.find(t => t.id === active.id);

    if (over && task && user?.id === task.assigneeId) {
      const newStatus = over.id as TaskStatus;
      const oldStatus = task.status;

      if (newStatus !== oldStatus) {
        if (newStatus === 'In Progress' && oldStatus === 'To Do') {
            const comment = "Task moved to In Progress.";
            requestTaskStatusChange(task.id, 'In Progress', comment);
        } else if (newStatus === 'Completed' && oldStatus === 'In Progress') {
            const comment = "Requesting completion for this task.";
            requestTaskStatusChange(task.id, 'Completed', comment);
        }
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {columns.map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
            ))}
        </div>
    </DndContext>
  );
}
`,
  "src/components/tasks/kanban-column.tsx": `'use client';
import TaskCard from './task-card';
import type { Task, TaskStatus } from '@/lib/types';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export default function KanbanColumn({ status, tasks = [] }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const statusColors = {
    'To Do': 'border-blue-500',
    'In Progress': 'border-yellow-500',
    'Pending Approval': 'border-orange-500',
    'Completed': 'border-green-500',
    'Overdue': 'border-red-500',
  };

  return (
    <div 
        ref={setNodeRef}
        className={cn(
            'flex flex-col h-full bg-card rounded-lg border-t-4 shadow-sm transition-colors', 
            statusColors[status],
            isOver ? 'bg-primary/10' : 'bg-muted/30'
        )}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
            {status}
            <span className="ml-2 text-sm font-normal bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5">
                {tasks.length}
            </span>
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    No tasks here.
                </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
`,
  "src/components/tasks/task-card.tsx": `'use client';
import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Flag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import AiToolsDialog from './ai-tools-dialog';
import EditTaskDialog from './edit-task-dialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { users, user, deleteTask } = useAppContext();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const assignee = useMemo(() => users.find(u => u.id === task.assigneeId), [users, task.assigneeId]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    disabled: user?.id !== task.assigneeId, // Only assignee can drag
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  
  const priorityVariant = {
    'Low': 'secondary',
    'Medium': 'default',
    'High': 'destructive',
  } as const;

  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'Completed';
  
  const canEditTask = user?.role === 'Admin' || user?.role === 'Manager' || user?.id === task.creatorId || user?.id === task.assigneeId;
  const canDeleteTask = user?.role === 'Admin' || user?.id === task.creatorId;
  const canUseAiTools = user?.role === 'Admin' || user?.role === 'Manager';

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      variant: 'destructive',
      title: 'Task Deleted',
      description: \`"\${task.title}" has been removed.\`,
    });
  };

  return (
    <>
      <Card 
          ref={setNodeRef} 
          style={style}
          className="shadow-md hover:shadow-lg transition-shadow bg-background/80 touch-none"
      >
        <div className="p-4 flex items-start justify-between">
            <div {...attributes} {...listeners} className={cn("flex-grow", user?.id === task.assigneeId ? "cursor-grab active:cursor-grabbing" : "cursor-default")}>
                <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                       <MoreVertical className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {canEditTask && (
                      <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit / View Details
                      </DropdownMenuItem>
                    )}
                    {canDeleteTask && (
                      <DropdownMenuItem onSelect={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          <p className="line-clamp-2">{task.description}</p>
          <div className="flex items-center gap-2 mt-4">
              <Calendar className={cn("h-4 w-4", isOverdue && "text-destructive")} />
              <span className={cn(isOverdue && "text-destructive font-semibold")}>{format(new Date(task.dueDate), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
              <Flag className="h-4 w-4" />
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={assignee?.avatar} />
                <AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="text-xs font-medium">{assignee?.name}</p>
                  <p className="text-xs text-muted-foreground">{assignee?.role}</p>
              </div>
          </div>
          {canUseAiTools && <AiToolsDialog task={task} assignee={assignee} />}
        </CardFooter>
      </Card>
      {canEditTask && (
        <EditTaskDialog 
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          task={task}
        />
      )}
    </>
  );
}
`,
  "src/components/tasks/task-filters.tsx": `'use client';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { Priority, TaskStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export interface TaskFilters {
  status: string;
  priority: string;
  dateRange: DateRange | undefined;
  showMyTasksOnly: boolean;
}

interface TaskFiltersProps {
  onApplyFilters: (filters: TaskFilters) => void;
  initialFilters: TaskFilters;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export default function TaskFilters({ onApplyFilters, initialFilters }: TaskFiltersProps) {
  const [status, setStatus] = useState(initialFilters.status);
  const [priority, setPriority] = useState(initialFilters.priority);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(initialFilters.showMyTasksOnly);

  const handleApply = () => {
    onApplyFilters({ status, priority, dateRange, showMyTasksOnly });
  };

  const handleClear = () => {
    setStatus('all');
    setPriority('all');
    setDateRange(undefined);
    setShowMyTasksOnly(false);
    onApplyFilters({
      status: 'all',
      priority: 'all',
      dateRange: undefined,
      showMyTasksOnly: false,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status..." />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            
            <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority..." />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                    'w-full md:w-auto justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                        </>
                    ) : (
                        format(dateRange.from, 'LLL dd, y')
                    )
                    ) : (
                    <span>Filter by due date...</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>

            <div className="flex items-center space-x-2">
                <Switch id="my-tasks-only" checked={showMyTasksOnly} onCheckedChange={setShowMyTasksOnly} />
                <Label htmlFor="my-tasks-only">My Tasks Only</Label>
            </div>

            <div className="flex gap-2 ml-auto">
                <Button onClick={handleApply}>Apply</Button>
                <Button variant="ghost" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
`,
  "src/components/ui/accordion.tsx": `"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`,
  "src/components/ui/alert-dialog.tsx": `"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
`,
  "src/components/ui/alert.tsx": `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
`,
  "src/components/ui/avatar.tsx": `"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
`,
  "src/components/ui/badge.tsx": `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`,
  "src/components/ui/button.tsx": `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
  "src/components/ui/calendar.tsx": `"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DayPickerDefaultProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
`,
  "src/components/ui/card.tsx": `import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,
  "src/components/ui/carousel.tsx": `"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
`,
  "src/components/ui/chart.tsx": `"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = \`chart-\${id || uniqueId.replace(/:/g, "")}\`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => \`
\${prefix} [data-chart=\${id}] {
\${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? \`  --color-\${key}: \${color};\` : null
  })
  .join("\\n")}
}
\`
          )
          .join("\\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = \`\${labelKey || item.dataKey || item.name || "value"}\`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = \`\${nameKey || item.name || item.dataKey || "value"}\`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = \`\${nameKey || item.dataKey || "value"}\`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
`,
  "src/components/ui/checkbox.tsx": `"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
`,
  "src/components/ui/collapsible.tsx": `"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
`,
  "src/components/ui/dialog.tsx": `"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
`,
  "src/components/ui/dropdown-menu.tsx": `"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
`,
  "src/components/ui/form.tsx": `"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: \`\${id}-form-item\`,
    formDescriptionId: \`\${id}-form-item-description\`,
    formMessageId: \`\${id}-form-item-message\`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? \`\${formDescriptionId}\`
          : \`\${formDescriptionId} \${formMessageId}\`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
`,
  "src/components/ui/input.tsx": `import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`,
  "src/components/ui/label.tsx": `"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
`,
  "src/components/ui/menubar.tsx": `"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
`,
  "src/components/ui/popover.tsx": `"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
`,
  "src/components/ui/progress.tsx": `"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
`,
  "src/components/ui/radio-group.tsx": `"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
`,
  "src/components/ui/scroll-area.tsx": `"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
`,
  "src/components/ui/select.tsx": `"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
`,
  "src/components/ui/separator.tsx": `"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
`,
  "src/components/ui/sheet.tsx": `"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
`,
  "src/components/ui/sidebar.tsx": `"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = \`\${SIDEBAR_COOKIE_NAME}=\${openState}; path=/; max-age=\${SIDEBAR_COOKIE_MAX_AGE}\`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return \`\${Math.floor(Math.random() * 40) + 50}%\`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
`,
  "src/components/ui/skeleton.tsx": `import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
`,
  "src/components/ui/slider.tsx": `"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
`,
  "src/components/ui/switch.tsx": `"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
`,
  "src/components/ui/table.tsx": `import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
`,
  "src/components/ui/tabs.tsx": `"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
`,
  "src/components/ui/textarea.tsx": `import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
`,
  "src/components/ui/toast.tsx": `"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
`,
  "src/components/ui/toaster.tsx": `"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
`,
  "src/components/ui/tooltip.tsx": `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
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
          case 'daily-except-sundays':
            if (day >= eventStartDate && day.getDay() !== 0) shouldAdd = true;
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
  "src/hooks/use-mobile.tsx": `import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
`,
  "src/hooks/use-toast.ts": `"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
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

export type Frequency = 'once' | 'daily' | 'weekly' | 'weekends' | 'monthly' | 'daily-except-sundays';

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
  "src/lib/utils.ts": `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
}
