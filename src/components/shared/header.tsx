'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LayoutDashboard, Briefcase, Layers, LogOut, TrendingUp, FileText, User, CalendarDays, Users, Award, Clock, History, Archive, Users2, Car, HardHat, Megaphone, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import NewAnnouncementDialog from '../announcements/NewAnnouncementDialog';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout, appName, appLogo, myRequestUpdateCount, pendingCertificateRequestCount, myNewTaskCount, expiringVehicleDocsCount, expiringUtMachineCalibrationsCount, pendingTaskApprovalCount, myCertificateRequestUpdateCount, roles, expiringManpowerCount, expiringDriverDocsCount, unreadAnnouncementCount, pendingAnnouncementCount, newIncidentCount, myUnreadManagementRequestCount, unreadManagementRequestCountForMe } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const canManageVehicles = user?.role && roles.find(r => r.name === user.role)?.permissions.includes('manage_vehicles');
  const canManageUtMachines = user?.role && roles.find(r => r.name === user.role)?.permissions.includes('manage_ut_machines');

  const myRequestsNotificationCount = myRequestUpdateCount + myUnreadManagementRequestCount;
  
  let inventoryNotificationCount = 0;
  if(user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Store in Charge') inventoryNotificationCount += pendingCertificateRequestCount;

  const taskNotificationCount = pendingTaskApprovalCount + myNewTaskCount;

  let equipmentNotificationCount = myCertificateRequestUpdateCount;
  if (canManageUtMachines) equipmentNotificationCount += expiringUtMachineCalibrationsCount;

  let vehicleNotificationCount = 0;
  if (canManageVehicles) vehicleNotificationCount += (expiringVehicleDocsCount + expiringDriverDocsCount);

  let announcementsNotificationCount = unreadAnnouncementCount;
  if(user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Supervisor') {
      announcementsNotificationCount += pendingAnnouncementCount;
  }

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/tasks')) return 'Manage Tasks';
    if (pathname.startsWith('/my-requests')) return 'My Requests';
    if (pathname.startsWith('/planner')) return 'Planner';
    if (pathname.startsWith('/performance')) return 'Performance';
    if (pathname.startsWith('/achievements')) return 'Achievements';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/account')) return 'Account';
    if (pathname.startsWith('/activity-tracker')) return 'Activity Tracker';
    if (pathname.startsWith('/store-inventory')) return 'Store Inventory';
    if (pathname.startsWith('/manpower')) return 'Manpower';
    if (pathname.startsWith('/ut-machine-status')) return 'Equipment Status';
    if (pathname.startsWith('/vehicle-status')) return 'Vehicle Status';
    if (pathname.startsWith('/driver-list')) return 'Driver List';
    if (pathname.startsWith('/announcements')) return 'Announcements';
    if (pathname.startsWith('/incident-reporting')) return 'Incident Reporting';
    return 'Task Management System';
  };
  
  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: Briefcase, label: 'Manage Tasks', notification: taskNotificationCount },
    { href: '/my-requests', icon: History, label: 'My Requests', notification: myRequestsNotificationCount },
    { href: '/planner', icon: CalendarDays, label: 'Planner' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
    { href: '/achievements', icon: Award, label: 'Achievements' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/store-inventory', icon: Archive, label: 'Store Inventory', notification: inventoryNotificationCount },
    { href: '/manpower', icon: Users2, label: 'Manpower', notification: expiringManpowerCount },
    { href: '/ut-machine-status', icon: HardHat, label: 'Equipment Status', notification: equipmentNotificationCount },
    { href: '/vehicle-status', icon: Car, label: 'Vehicle Status', notification: vehicleNotificationCount },
    { href: '/account', icon: Users, label: 'Account' },
  ];

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
            <nav className="flex-1 p-4 overflow-y-auto">
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
                                {(item.notification ?? 0) > 0 && (
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        {item.notification}
                                    </Badge>
                                )}
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
      <div className="flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => router.push('/announcements')} className="relative">
                        <Megaphone />
                        {announcementsNotificationCount > 0 && <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center" variant="destructive">{announcementsNotificationCount}</Badge>}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Announcements</p>
                </TooltipContent>
            </Tooltip>
            <NewAnnouncementDialog />
             <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/incident-reporting">
                            <ShieldAlert />
                             {newIncidentCount > 0 && <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center" variant="destructive">{newIncidentCount}</Badge>}
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Incident Reporting</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/activity-tracker">
                            <Clock />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Activity Tracker</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Avatar className="hidden md:block">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
