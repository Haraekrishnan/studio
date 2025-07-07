'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Briefcase, TrendingUp, FileText, Users, LogOut, Layers, CalendarDays, Award, Clock, History, Archive, Bell } from 'lucide-react';
import { Badge } from '../ui/badge';

export function AppSidebar() {
  const { user, logout, appName, appLogo, pendingStoreRequestCount, myRequestUpdateCount, pendingCertificateRequestCount } = useAppContext();
  const pathname = usePathname();

  const isApprover = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Store in Charge' || user?.role === 'Assistant Store Incharge';
  
  const myRequestsNotificationCount = isApprover ? pendingStoreRequestCount : myRequestUpdateCount;
  const inventoryNotificationCount = isApprover ? pendingCertificateRequestCount : 0;

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks' },
    { href: '/my-requests', icon: History, label: 'My Requests', notification: myRequestsNotificationCount },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/achievements', icon: Award, label: 'Achievements' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/account', icon: Users, label: 'Employees' },
    { href: '/activity-tracker', icon: Clock, label: 'Activity Tracker' },
    { href: '/store-inventory', icon: Archive, label: 'Store Inventory', notification: inventoryNotificationCount },
  ];

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
                  {item.notification && item.notification > 0 && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {item.notification}
                    </Badge>
                  )}
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
