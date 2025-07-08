/**
 * This file contains the string content of all project files.
 * It is used by the FileExplorer component to make files downloadable.
 */
export const fileContents: Record<string, string> = {
  ".env": `GOOGLE_API_KEY="PASTE_YOUR_GOOGLE_AI_API_KEY_HERE"
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
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/utilities": "^3.2.2",
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
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
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
import { cn } from '@/lib/utils';

function AppTitleUpdater({ children }: { children: React.ReactNode }) {
  const { appName } = useAppContext();
  useEffect(() => {
    document.title = appName;
  }, [appName]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='h-full'>
      <head>
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
            <AppTitleUpdater>
              {children}
              <Toaster />
            </AppTitleUpdater>
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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Layers, ShieldPlus, FolderKanban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEmployeeDialog from '@/components/account/add-employee-dialog';
import EditEmployeeDialog from '@/components/account/edit-employee-dialog';
import AddRoleDialog from '@/components/account/add-role-dialog';
import RoleManagementTable from '@/components/account/role-management-table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ProjectManagementTable from '@/components/account/ProjectManagementTable';

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
  const canManageProjects = user.role === 'Admin';

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
            </CardFooter>
          </form>
        </Card>
      )}

      {canManageProjects && (
          <Card>
            <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Add, edit, or remove project locations.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagementTable />
            </CardContent>
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
`
}
