'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LayoutDashboard, Briefcase, CheckSquare, LogOut, TrendingUp, FileText, User, CalendarDays } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAppContext();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/tasks')) return 'Manage Tasks';
    if (pathname.startsWith('/planner')) return 'Planner';
    if (pathname.startsWith('/performance')) return 'Performance';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/account')) return 'Account';
    return 'TaskMaster Pro';
  };
  
  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks' },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/account', icon: User, label: 'Account' },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg">
                        <CheckSquare className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">TaskMaster Pro</h1>
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
                                className="w-full justify-start"
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
            <div className="p-4 mt-auto border-t">
                <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                </div>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" onClick={logout} title="Log Out">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </SheetClose>
                </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold text-foreground hidden md:block">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="hidden md:block">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
