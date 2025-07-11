'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from './types';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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
  const { user, isAuthLoading } = useAuth();

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
    if (!user) {
        setIsDataLoading(false);
        return;
    }

    const collections: { name: string; setter: (data: any[]) => void }[] = [
      { name: 'users', setter: setUsers },
      { name: 'roles', setter: setRoles },
      { name: 'tasks', setter: setTasks },
      { name: 'projects', setter: setProjects },
      { name: 'inventoryItems', setter: setInventoryItems },
      { name: 'inventoryTransferRequests', setter: setInventoryTransferRequests },
      { name: 'certificateRequests', setter: setCertificateRequests },
      { name: 'plannerEvents', setter: setPlannerEvents },
      { name: 'dailyPlannerComments', setter: setDailyPlannerComments },
      { name: 'achievements', setter: setAchievements },
      { name: 'activityLogs', setter: setActivityLogs },
      { name: 'manpowerLogs', setter: setManpowerLogs },
      { name: 'manpowerProfiles', setter: setManpowerProfiles },
      { name: 'utMachines', setter: setUtMachines },
      { name: 'dftMachines', setter: setDftMachines },
      { name: 'mobileSims', setter: setMobileSims },
      { name: 'otherEquipments', setter: setOtherEquipments },
      { name: 'vehicles', setter: setVehicles },
      { name: 'drivers', setter: setDrivers },
      { name: 'internalRequests', setter: setInternalRequests },
      { name: 'managementRequests', setter: setManagementRequests },
      { name: 'announcements', setter: setAnnouncements },
      { name: 'incidents', setter: setIncidents },
    ];

    const unsubscribes = collections.map(({ name, setter }) => 
      onSnapshot(collection(db, name), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setter(data as any);
      })
    );

    setIsDataLoading(false);

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user]);

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


  const updateBranding = useCallback(async (name: string, logo: string | null) => {
      setAppName(name);
      setAppLogo(logo);
      // In a real app, you'd save this to a 'settings' collection in Firestore
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
    await addDoc(collection(db, 'users'), newUser);
  }, []);

  const updateUser = useCallback(async (updatedUser: User) => {
    const { id, ...data } = updatedUser;
    await setDoc(doc(db, 'users', id), data);
  }, []);
  
  const deleteUser = useCallback(async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  }, []);

  const updateProfile = useCallback(async (name: string, email: string, avatar: string, password?: string) => {
    if (user) {
      const userRef = doc(db, 'users', user.id);
      const dataToUpdate: Partial<User> = { name, email, avatar };
      if (password) {
        dataToUpdate.password = password; // In a real app, you would hash this on the server
      }
      await updateDoc(userRef, dataToUpdate);
    }
  }, [user]);

  const addTask = useCallback(async (newTask: Omit<Task, 'id' | 'status'>) => {
    const taskData: Omit<Task, 'id'> = {
      ...newTask,
      status: 'To Do',
      isViewedByAssignee: false,
      approvalState: 'none',
      comments: [],
    };
    await addDoc(collection(db, 'tasks'), taskData);
  }, []);

  const updateTask = useCallback(async (updatedTask: Task) => {
    const { id, ...data } = updatedTask;
    await setDoc(doc(db, 'tasks', id), data);
  }, []);
  
  const deleteTask = useCallback(async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  }, []);

  const addComment = useCallback(async (taskId: string, text: string) => {
    if (!user) return;
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    if (taskDoc.exists()) {
      const taskData = taskDoc.data() as Task;
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        text,
        date: new Date().toISOString(),
      };
      const updatedComments = [...(taskData.comments || []), newComment];
      await updateDoc(taskRef, { comments: updatedComments });
    }
  }, [user]);

  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const myFulfilledUTRequests = useMemo(() => {
    if (!user) return [];
    return certificateRequests.filter(req => req.requesterId === user.id && req.status === 'Fulfilled' && !req.isViewedByRequester);
  }, [certificateRequests, user]);

  // Placeholder for the myriad of functions to be implemented
  const placeholderFunc = useCallback(() => console.warn("Function not implemented"), []);

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
      addTask,
      updateTask,
      deleteTask,
      addComment,
      approvedAnnouncements,
      myFulfilledUTRequests,
      // Add all other functions here, pointing to a placeholder for now
      addProject: placeholderFunc,
      updateProject: placeholderFunc,
      deleteProject: placeholderFunc,
      addRole: placeholderFunc,
      updateRole: placeholderFunc,
      deleteRole: placeholderFunc,
      addManualAchievement: placeholderFunc,
      approveAchievement: placeholderFunc,
      rejectAchievement: placeholderFunc,
      deleteManualAchievement: placeholderFunc,
      updateUserPlanningScore: placeholderFunc,
      addPlannerEvent: placeholderFunc,
      updatePlannerEvent: placeholderFunc,
      deletePlannerEvent: placeholderFunc,
      addPlannerEventComment: placeholderFunc,
      addDailyPlannerComment: placeholderFunc,
      updateDailyPlannerComment: placeholderFunc,
      deleteDailyPlannerComment: placeholderFunc,
      deleteAllDailyPlannerComments: placeholderFunc,
      requestTaskStatusChange: placeholderFunc,
      approveTaskStatusChange: placeholderFunc,
      returnTaskStatusChange: placeholderFunc,
      markTaskAsViewed: placeholderFunc,
      requestTaskReassignment: placeholderFunc,
      addInventoryItem: placeholderFunc,
      updateInventoryItem: placeholderFunc,
      deleteInventoryItem: placeholderFunc,
      addMultipleInventoryItems: placeholderFunc,
      requestInventoryTransfer: placeholderFunc,
      approveInventoryTransfer: placeholderFunc,
      rejectInventoryTransfer: placeholderFunc,
      addInventoryTransferComment: placeholderFunc,
      addCertificateRequest: placeholderFunc,
      fulfillCertificateRequest: placeholderFunc,
      addCertificateRequestComment: placeholderFunc,
      markCertificateRequestAsViewed: placeholderFunc,
      addManpowerLog: placeholderFunc,
      addManpowerProfile: placeholderFunc,
      updateManpowerProfile: placeholderFunc,
      deleteManpowerProfile: placeholderFunc,
      addUTMachine: placeholderFunc,
      updateUTMachine: placeholderFunc,
      deleteUTMachine: placeholderFunc,
      addUTMachineLog: placeholderFunc,
      requestUTMachineCertificate: placeholderFunc,
      addDftMachine: placeholderFunc,
      updateDftMachine: placeholderFunc,
      deleteDftMachine: placeholderFunc,
      addMobileSim: placeholderFunc,
      updateMobileSim: placeholderFunc,
      deleteMobileSim: placeholderFunc,
      addOtherEquipment: placeholderFunc,
      updateOtherEquipment: placeholderFunc,
      deleteOtherEquipment: placeholderFunc,
      addDriver: placeholderFunc,
      updateDriver: placeholderFunc,
      deleteDriver: placeholderFunc,
      addVehicle: placeholderFunc,
      updateVehicle: placeholderFunc,
      deleteVehicle: placeholderFunc,
      addInternalRequest: placeholderFunc,
      updateInternalRequest: placeholderFunc,
      deleteInternalRequest: placeholderFunc,
      markRequestAsViewed: placeholderFunc,
      forwardInternalRequest: placeholderFunc,
      escalateInternalRequest: placeholderFunc,
      addInternalRequestComment: placeholderFunc,
      addManagementRequest: placeholderFunc,
      updateManagementRequest: placeholderFunc,
      addManagementRequestComment: placeholderFunc,
      markManagementRequestAsViewed: placeholderFunc,
      addAnnouncement: placeholderFunc,
      updateAnnouncement: placeholderFunc,
      approveAnnouncement: placeholderFunc,
      rejectAnnouncement: placeholderFunc,
      deleteAnnouncement: placeholderFunc,
      returnAnnouncement: placeholderFunc,
      dismissAnnouncement: placeholderFunc,
      addIncidentReport: placeholderFunc,
      updateIncident: placeholderFunc,
      addIncidentComment: placeholderFunc,
      publishIncident: placeholderFunc,
      addUsersToIncidentReport: placeholderFunc,
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
