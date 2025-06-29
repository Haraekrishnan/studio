'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Briefcase, TrendingUp, FileText, User, LogOut, Layers, CalendarDays } from 'lucide-react';

export function AppSidebar() {
  const { user, logout } = useAppContext();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks' },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/account', icon: User, label: 'Account' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-border h-full">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
                <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Task Management System</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                className="w-full justify-start hover:bg-sidebar-accent/80 data-[state=active]:bg-sidebar-accent"
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
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Log Out" className="hover:bg-sidebar-accent/80">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
