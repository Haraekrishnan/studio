'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from './types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, DRIVERS, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, ANNOUNCEMENTS, INCIDENTS } from '@/lib/mock-data';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { useAuth } from '@/hooks/use-auth.tsx';


interface AppContextType {
  // Directly managed state
  users: User[];
  roles: RoleDefinition[];
  tasks: Task[];
  projects: Project[];
  inventoryItems: InventoryItem[];
  inventoryTransferRequests: InventoryTransferRequest[];
  certificateRequests: CertificateRequest[];
  plannerEvents: PlannerEvent[];
  dailyPlannerComments: DailyPlannerComment[];
  achievements: Achievement[];
  activityLogs: ActivityLog[];
  manpowerLogs: ManpowerLog[];
  manpowerProfiles: ManpowerProfile[];
  utMachines: UTMachine[];
  dftMachines: DftMachine[];
  mobileSims: MobileSim[];
  otherEquipments: OtherEquipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  appName: string;
  appLogo: string | null;
  internalRequests: InternalRequest[];
  managementRequests: ManagementRequest[];
  announcements: Announcement[];
  incidents: IncidentReport[];
  isDataLoading: boolean;

  // Derived state (notifications/counts)
  pendingStoreRequestCount: number;
  myRequestUpdateCount: number;
  pendingCertificateRequestCount: number;
  myCertificateRequestUpdateCount: number;
  myFulfilledUTRequests: CertificateRequest[];
  workingManpowerCount: number;
  onLeaveManpowerCount: number;
  approvedAnnouncements: Announcement[];
  pendingAnnouncementCount: number;
  unreadAnnouncementCount: number;
  newIncidentCount: number;
  myUnreadManagementRequestCount: number;
  unreadManagementRequestCountForMe: number;
  expiringVehicleDocsCount: number;
  expiringDriverDocsCount: number;
  expiringUtMachineCalibrationsCount: number;
  expiringManpowerCount: number;
  pendingTaskApprovalCount: number;
  myNewTaskCount: number;

  // Functions
  getVisibleUsers: () => User[];
  getExpandedPlannerEvents: (date: Date, userId: string) => (PlannerEvent & { eventDate: Date })[];
  updateBranding: (name: string, logo: string | null) => void;
  // All other add/update/delete functions
  [key: string]: any; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth(); // Use the auth context to get the current user

  // Raw data states
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryTransferRequests, setInventoryTransferRequests] = useState<InventoryTransferRequest[]>([]);
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>([]);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>([]);
  const [dailyPlannerComments, setDailyPlannerComments] = useState<DailyPlannerComment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [manpowerLogs, setManpowerLogs] = useState<ManpowerLog[]>([]);
  const [manpowerProfiles, setManpowerProfiles] = useState<ManpowerProfile[]>([]);
  const [utMachines, setUtMachines] = useState<UTMachine[]>([]);
  const [dftMachines, setDftMachines] = useState<DftMachine[]>([]);
  const [mobileSims, setMobileSims] = useState<MobileSim[]>([]);
  const [otherEquipments, setOtherEquipments] = useState<OtherEquipment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [internalRequests, setInternalRequests] = useState<InternalRequest[]>([]);
  const [managementRequests, setManagementRequests] = useState<ManagementRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  
  // App branding state
  const [appName, setAppName] = useState<string>('Aries Marine');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  
  // Loading state for data
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // Only load data if auth is done and we have a user.
    if (!isAuthLoading && user) {
      setIsDataLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        setUsers(USERS);
        setRoles(MOCK_ROLES);
        setTasks(TASKS);
        setProjects(PROJECTS);
        setInventoryItems(INVENTORY_ITEMS);
        setInventoryTransferRequests(INVENTORY_TRANSFER_REQUESTS);
        setCertificateRequests(CERTIFICATE_REQUESTS);
        setPlannerEvents(PLANNER_EVENTS);
        setDailyPlannerComments(DAILY_PLANNER_COMMENTS);
        setAchievements(ACHIEVEMENTS);
        setActivityLogs(ACTIVITY_LOGS);
        setManpowerLogs(MANPOWER_LOGS);
        setManpowerProfiles(MANPOWER_PROFILES);
        setUtMachines(UT_MACHINES);
        setDftMachines(DFT_MACHINES);
        setMobileSims(MOBILE_SIMS);
        setOtherEquipments(OTHER_EQUIPMENTS);
        setVehicles(VEHICLES);
        setDrivers(DRIVERS);
        setInternalRequests(INTERNAL_REQUESTS);
        setManagementRequests(MANAGEMENT_REQUESTS);
        setAnnouncements(ANNOUNCEMENTS);
        setIncidents(INCIDENTS);
        setIsDataLoading(false);
      }, 500);
    } else if (!isAuthLoading && !user) {
        // If auth is done and there's no user, we don't need to load data.
        setIsDataLoading(false);
    }
  }, [isAuthLoading, user]);


  const getVisibleUsers = useCallback(() => {
    if (!user) return [];

    const userRoleLevel = roles.find(r => r.name === user.role)?.permissions.length || 0;
    const canViewAll = user.role === 'Admin' || user.role === 'Manager' || user.role === 'Store in Charge';

    if (canViewAll) return users;

    const subordinates = users.filter(u => u.supervisorId === user.id);
    const subIds = subordinates.map(s => s.id);
    const subSubordinates = users.filter(u => u.supervisorId && subIds.includes(u.supervisorId));

    return [user, ...subordinates, ...subSubordinates];
  }, [user, users, roles]);


  const updateBranding = useCallback((name: string, logo: string | null) => {
      setAppName(name);
      setAppLogo(logo);
  }, []);
  
  const getExpandedPlannerEvents = useCallback((date: Date, userId: string) => {
    const events = plannerEvents.filter(e => e.userId === userId);
    if (!events.length) return [];
  
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });
    const expandedEvents: (PlannerEvent & { eventDate: Date })[] = [];
  
    daysInMonth.forEach(day => {
      events.forEach(event => {
        const eventStartDate = startOfDay(new Date(event.date));
        if (isPast(eventStartDate) && event.frequency === 'once') return;
        if (isAfter(day, eventStartDate) || isSameDay(day, eventStartDate)) {
            let shouldAdd = false;
            switch (event.frequency) {
                case 'once':
                    if (isSameDay(day, eventStartDate)) shouldAdd = true;
                    break;
                case 'daily':
                    shouldAdd = true;
                    break;
                case 'daily-except-sundays':
                    if (day.getDay() !== 0) shouldAdd = true;
                    break;
                case 'weekly':
                    if (day.getDay() === eventStartDate.getDay()) shouldAdd = true;
                    break;
                case 'weekends':
                    if (isWeekend(day)) shouldAdd = true;
                    break;
                case 'monthly':
                    if (day.getDate() === eventStartDate.getDate()) shouldAdd = true;
                    break;
            }
            if (shouldAdd) {
                expandedEvents.push({ ...event, eventDate: day });
            }
        }
      });
    });
    return expandedEvents;
  }, [plannerEvents]);

  const addUser = useCallback((newUser: Omit<User, 'id'>) => {
    const userWithId: User = { ...newUser, id: `user-${Date.now()}` };
    setUsers(prev => [...prev, userWithId]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const updateProfile = useCallback((name: string, email: string, avatar: string, password?: string) => {
    if (user) {
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          const updatedUser = { ...u, name, email, avatar };
          if (password) {
            (updatedUser as any).password = password;
          }
          return updatedUser;
        }
        return u;
      }));
    }
  }, [user]);

  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const value = {
      user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, 
      isDataLoading,
      updateBranding,
      getExpandedPlannerEvents,
      getVisibleUsers,
      addUser,
      updateUser,
      deleteUser,
      updateProfile,
      approvedAnnouncements,
      // All other functions are placeholders for now and will be implemented
  };
    
  return <AppContext.Provider value={value as any}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
