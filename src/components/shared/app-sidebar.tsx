'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CheckSquare, LogOut, Briefcase } from 'lucide-react';

export function AppSidebar() {
  const { user, logout } = useAppContext();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Tasks' },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border h-full">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
                <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">TaskMaster Pro</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
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
        <Separator className="my-4" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
