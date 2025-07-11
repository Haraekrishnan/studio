
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, DRIVERS, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, ANNOUNCEMENTS, INCIDENTS } from '@/lib/mock-data';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';


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
  const { user } = useAuth(); // Use the auth context to get the current user

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

  // Collections to fetch from Firestore
  const collectionsToFetch = useMemo(() => ({
      users: setUsers, roles: setRoles, tasks: setTasks, projects: setProjects,
      inventoryItems: setInventoryItems, inventoryTransferRequests: setInventoryTransferRequests,
      certificateRequests: setCertificateRequests, plannerEvents: setPlannerEvents,
      dailyPlannerComments: setDailyPlannerComments, achievements: setAchievements,
      activityLogs: setActivityLogs, manpowerLogs: setManpowerLogs,
      manpowerProfiles: setManpowerProfiles, utMachines: setUtMachines,
      dftMachines: setDftMachines, mobileSims: setMobileSims,
      otherEquipments: setOtherEquipments, vehicles: setVehicles,
      drivers: setDrivers, internalRequests: setInternalRequests,
      managementRequests: setManagementRequests, announcements: setAnnouncements,
      incidents: setIncidents
  }), []);

  // Effect to fetch all data when a user is authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsDataLoading(true);
        try {
          // Fetch branding info
          const brandingQuerySnapshot = await getDocs(collection(db, "branding"));
          if (!brandingQuerySnapshot.empty) {
            const brandingData = brandingQuerySnapshot.docs[0].data();
            setAppName(brandingData.appName || 'Aries Marine');
            setAppLogo(brandingData.appLogo || null);
          }

          // Fetch all other collections in parallel
          await Promise.all(Object.entries(collectionsToFetch).map(async ([key, setter]) => {
            const querySnapshot = await getDocs(collection(db, key));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setter(data as any);
          }));
        } catch (error) {
          console.error("Error fetching data from Firestore:", error);
        } finally {
          setIsDataLoading(false);
        }
      } else {
        // If no user, set loading to false as there's nothing to fetch
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [user, collectionsToFetch]);

  const updateBranding = useCallback(async (name: string, logo: string | null) => {
      setAppName(name);
      setAppLogo(logo);
      const brandingRef = doc(db, 'branding', 'main');
      await setDoc(brandingRef, { appName: name, appLogo: logo }, { merge: true });
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

  const addUser = useCallback(async (newUser: Omit<User, 'id'>) => {
    const docRef = await addDoc(collection(db, "users"), newUser);
    setUsers(prev => [...prev, { id: docRef.id, ...newUser }]);
  }, []);

  const value = {
      user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, 
      isDataLoading,
      updateBranding,
      getExpandedPlannerEvents,
      getVisibleUsers: () => [], // This will be properly implemented later
      addUser,
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
