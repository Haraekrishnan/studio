
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, DRIVERS, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, ANNOUNCEMENTS, INCIDENTS } from '@/lib/mock-data';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';


interface AppContextType {
  user: User | null;
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'isViewedByAssignee' | 'completionDate'>) => void;
  deleteTask: (taskId: string) => void;
  addPlannerEvent: (event: Omit<PlannerEvent, 'id' | 'comments'>) => void;
  updatePlannerEvent: (event: PlannerEvent) => void;
  deletePlannerEvent: (eventId: string) => void;
  getExpandedPlannerEvents: (date: Date, userId: string) => (PlannerEvent & { eventDate: Date })[];
  getVisibleUsers: () => User[];
  addUser: (newUser: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (updatedUser: User) => void;
  updateUserPlanningScore: (userId: string, score: number) => void;
  deleteUser: (userId: string) => void;
  addRole: (role: Omit<RoleDefinition, 'id' | 'isEditable'>) => void;
  updateRole: (updatedRole: RoleDefinition) => void;
  deleteRole: (roleId: string) => void;
  addProject: (projectName: string) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  updateProfile: (name: string, email: string, avatar: string, password?: string) => void;
  requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => Promise<boolean>;
  approveTaskStatusChange: (taskId: string, commentText: string) => void;
  returnTaskStatusChange: (taskId: string, commentText: string) => void;
  requestTaskReassignment: (taskId: string, newAssigneeId: string, commentText: string) => void;
  addComment: (taskId: string, commentText: string) => void;
  markTaskAsViewed: (taskId: string) => void;
  addManualAchievement: (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => void;
  approveAchievement: (achievementId: string, points: number) => void;
  rejectAchievement: (achievementId: string) => void;
  updateManualAchievement: (achievement: Achievement) => void;
  deleteManualAchievement: (achievementId: string) => void;
  addPlannerEventComment: (eventId: string, commentText: string) => void;
  addDailyPlannerComment: (plannerUserId: string, date: Date, commentText: string) => void;
  updateDailyPlannerComment: (commentId: string, plannerUserId: string, day: string, newText: string) => void;
  deleteDailyPlannerComment: (commentId: string, plannerUserId: string, day: string) => void;
  deleteAllDailyPlannerComments: (plannerUserId: string, day: string) => void;
  updateBranding: (name: string, logo: string | null) => void;
  addInternalRequest: (request: Omit<InternalRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isEscalated'>) => void;
  updateInternalRequest: (updatedRequest: InternalRequest) => void;
  deleteInternalRequest: (requestId: string) => void;
  addInternalRequestComment: (requestId: string, commentText: string) => void;
  markRequestAsViewed: (requestId: string) => void;
  forwardInternalRequest: (requestId: string, role: Role, comment: string) => void;
  escalateInternalRequest: (requestId: string, reason: string) => void;
  createPpeRequestTask: (data: any) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  addMultipleInventoryItems: (items: any[]) => number;
  requestInventoryTransfer: (items: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => void;
  approveInventoryTransfer: (requestId: string, comment: string) => void;
  rejectInventoryTransfer: (requestId: string, comment: string) => void;
  addCertificateRequest: (itemId: string, requestType: CertificateRequestType, comment: string) => void;
  requestUTMachineCertificate: (machineId: string, requestType: CertificateRequestType, comment: string) => void;
  addCertificateRequestComment: (requestId: string, commentText: string) => void;
  fulfillCertificateRequest: (requestId: string, commentText: string) => void;
  markUTRequestsAsViewed: () => void;
  acknowledgeFulfilledUTRequest: (requestId: string) => void;
  addManpowerLog: (log: Omit<ManpowerLog, 'id' | 'date' | 'updatedBy'>) => void;
  addManpowerProfile: (profile: Omit<ManpowerProfile, 'id'>) => void;
  updateManpowerProfile: (profile: ManpowerProfile) => void;
  deleteManpowerProfile: (profileId: string) => void;
  addUTMachine: (machine: Omit<UTMachine, 'id' | 'usageLog'>) => void;
  updateUTMachine: (machine: UTMachine) => void;
  deleteUTMachine: (machineId: string) => void;
  addUTMachineLog: (machineId: string, logData: Omit<UTMachineUsageLog, 'id' | 'date' | 'loggedBy'>) => void;
  addDftMachine: (machine: Omit<DftMachine, 'id' | 'usageLog'>) => void;
  updateDftMachine: (machine: DftMachine) => void;
  deleteDftMachine: (machineId: string) => void;
  addMobileSim: (item: Omit<MobileSim, 'id'>) => void;
  updateMobileSim: (item: MobileSim) => void;
  deleteMobileSim: (itemId: string) => void;
  addOtherEquipment: (item: Omit<OtherEquipment, 'id'>) => void;
  updateOtherEquipment: (item: OtherEquipment) => void;
  deleteOtherEquipment: (itemId: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (vehicleId: string) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (driverId: string) => void;
  addManagementRequest: (request: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isViewedByRecipient'>) => void;
  updateManagementRequest: (updatedRequest: ManagementRequest) => void;
  addManagementRequestComment: (requestId: string, commentText: string) => void;
  markManagementRequestAsViewed: (requestId: string) => void;
  addAnnouncement: (announcement: Pick<Announcement, 'title' | 'content'>) => void;
  approveAnnouncement: (announcementId: string) => void;
  rejectAnnouncement: (announcementId: string) => void;
  returnAnnouncement: (announcementId: string, comment: string) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (announcementId: string) => void;
  dismissAnnouncement: (announcementId: string) => void;
  addIncidentReport: (report: Omit<IncidentReport, 'id' | 'reporterId' | 'reportTime' | 'status' | 'comments' | 'reportedToUserIds' | 'isPublished' | 'projectLocation'>) => void;
  updateIncident: (incident: IncidentReport) => void;
  addIncidentComment: (incidentId: string, commentText: string) => void;
  addUsersToIncidentReport: (incidentId: string, userIds: string[]) => void;
  publishIncident: (incidentId: string) => void;
  expiringVehicleDocsCount: number;
  expiringDriverDocsCount: number;
  expiringUtMachineCalibrationsCount: number;
  expiringManpowerCount: number;
  pendingTaskApprovalCount: number;
  myNewTaskCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
  
  const [appName, setAppName] = useState<string>('Aries Marine');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
        const collections = {
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
        };

        const brandingQuerySnapshot = await getDocs(collection(db, "branding"));
        if (!brandingQuerySnapshot.empty) {
            const brandingData = brandingQuerySnapshot.docs[0].data();
            setAppName(brandingData.appName || 'Aries Marine');
            setAppLogo(brandingData.appLogo || null);
        }

        for (const [key, setter] of Object.entries(collections)) {
            const querySnapshot = await getDocs(collection(db, key));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // @ts-ignore
            setter(data);
        }
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
        setIsLoading(true);
        try {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                await fetchData();
            }
        } catch (error) {
            console.error("Session check failed", error);
            sessionStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };
    checkUser();
  }, [fetchData]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return false;
    
    const foundUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as User;
    
    if (foundUser.password === password) {
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        setIsLoading(true);
        await fetchData();
        setIsLoading(false);
        router.push('/dashboard');
        return true;
    }
    return false;
  }, [fetchData, router]);
  
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'isViewedByAssignee' | 'completionDate'>) => {
    if (!user) return;
    const newTask: Omit<Task, 'id'> = {
        ...task,
        status: 'To Do',
        comments: [{
            userId: user.id,
            text: `Task created and assigned to ${users.find(u => u.id === task.assigneeId)?.name}.`,
            date: new Date().toISOString()
        }],
        approvalState: 'none',
        isViewedByAssignee: false,
    };
    const docRef = await addDoc(collection(db, 'tasks'), newTask);
    setTasks(prev => [...prev, { id: docRef.id, ...newTask }]);
  }, [user, users]);

  const updateTask = useCallback(async (updatedTask: Task) => {
    const taskRef = doc(db, 'tasks', updatedTask.id);
    await setDoc(taskRef, updatedTask, { merge: true });
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);
  
  const addProject = useCallback(async (projectName: string) => {
    const newProject: Omit<Project, 'id'> = { name: projectName };
    const docRef = await addDoc(collection(db, 'projects'), newProject);
    setProjects(prev => [...prev, { id: docRef.id, ...newProject }]);
  }, []);

  const updateProject = useCallback(async (updatedProject: Project) => {
      await setDoc(doc(db, 'projects', updatedProject.id), updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);
  
  const addUser = useCallback(async (userData: Omit<User, 'id' | 'avatar'>) => {
      const newUser: Omit<User, 'id'> = {
          ...userData,
          avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      };
      const docRef = await addDoc(collection(db, 'users'), newUser);
      setUsers(prev => [...prev, { id: docRef.id, ...newUser }]);
  }, []);

  const updateUser = useCallback(async (updatedUser: User) => {
    const { id, ...userWithoutId } = updatedUser;
    await setDoc(doc(db, 'users', id), userWithoutId);
    setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
    if (user?.id === id) {
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const updateProfile = useCallback(async (name: string, email: string, avatar: string, password?: string) => {
    if (user) {
        let updatedUserData: Partial<User> = { name, email, avatar };
        if (password) {
            updatedUserData.password = password;
        }
        const updatedUser = { ...user, ...updatedUserData } as User;
        await updateUser(updatedUser);
    }
  }, [user, updateUser]);

  const updateBranding = useCallback(async (name: string, logo: string | null) => {
      setAppName(name);
      setAppLogo(logo);
      const brandingRef = doc(db, 'branding', 'main');
      await setDoc(brandingRef, { appName: name, appLogo: logo }, { merge: true });
  }, []);
  
  const addComment = useCallback(async (taskId: string, commentText: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newComment: Comment = {
        userId: user.id,
        text: commentText,
        date: new Date().toISOString(),
    };

    const updatedTask = {
        ...task,
        comments: [...(task.comments || []), newComment],
    };

    await updateTask(updatedTask);
  }, [tasks, user, updateTask]);

  const requestTaskStatusChange = useCallback(async (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user) return false;

    let updatedTaskData: Partial<Task> = {
        status: 'Pending Approval',
        previousStatus: task.status,
        pendingStatus: newStatus,
        approvalState: 'pending',
    };

    if (attachment) {
      updatedTaskData.attachment = attachment;
    }

    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updatedTaskData);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTaskData } as Task : t));
    await addComment(taskId, commentText);
    return true;
  }, [tasks, user, addComment]);
  
  const approveTaskStatusChange = useCallback(async (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.pendingStatus) return;

    let updateData: Partial<Task> = {
        status: task.pendingStatus,
        approvalState: 'approved',
        previousStatus: undefined,
        pendingStatus: undefined,
    };
    
    if (task.pendingStatus === 'Completed') {
        updateData.completionDate = new Date().toISOString();
    }
    
    if (task.pendingAssigneeId) {
        updateData.assigneeId = task.pendingAssigneeId;
        updateData.pendingAssigneeId = undefined;
    }

    await updateDoc(doc(db, 'tasks', taskId), updateData);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updateData } as Task : t));
    await addComment(taskId, commentText);
  }, [tasks, addComment]);
  
  const returnTaskStatusChange = useCallback(async (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.previousStatus) return;

    const updateData: Partial<Task> = {
        status: task.previousStatus,
        approvalState: 'returned',
        previousStatus: undefined,
        pendingStatus: undefined,
        pendingAssigneeId: undefined, // Also clear pending assignee on return
    };

    await updateDoc(doc(db, 'tasks', taskId), updateData);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updateData } as Task : t));
    await addComment(taskId, commentText);
  }, [tasks, addComment]);
  
  const requestTaskReassignment = useCallback(async (taskId: string, newAssigneeId: string, commentText: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTaskData: Partial<Task> = {
        status: 'Pending Approval',
        previousStatus: task.status,
        pendingAssigneeId: newAssigneeId,
        approvalState: 'pending',
      };
      
      await updateDoc(doc(db, 'tasks', taskId), updatedTaskData);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTaskData } as Task : t));
      await addComment(taskId, commentText);
  }, [tasks, addComment]);

  // Placeholder for other functions to be implemented...
  const unimplemented = (...args: any[]): any => {
    console.warn("Function not implemented", ...args);
    if(args[0] && typeof args[0] === 'string' && args[0].includes('delete')) {
        alert('Delete functionality is not fully implemented in this demo.');
    }
  };
  
  const unimplementedPromise = async (...args: any[]): Promise<any> => {
    unimplemented(...args);
    return Promise.resolve();
  }

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

  const value = {
      user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, isLoading,
      login, logout,
      addTask, updateTask, deleteTask, addComment, requestTaskStatusChange, approveTaskStatusChange, returnTaskStatusChange, requestTaskReassignment,
      addProject, updateProject, deleteProject,
      updateUser, updateProfile, addUser,
      updateBranding,
      getVisibleUsers: unimplemented,
      // MOCK other functions until they are requested
      updateUserPlanningScore: unimplemented, deleteUser: unimplemented, addRole: unimplemented, updateRole: unimplemented, deleteRole: unimplemented, 
      markTaskAsViewed: unimplemented, addManualAchievement: unimplemented, approveAchievement: unimplemented, rejectAchievement: unimplemented, updateManualAchievement: unimplemented, deleteManualAchievement: unimplemented,
      addPlannerEvent: unimplemented, updatePlannerEvent: unimplemented, deletePlannerEvent: unimplemented, getExpandedPlannerEvents, addPlannerEventComment: unimplemented, addDailyPlannerComment: unimplemented, updateDailyPlannerComment: unimplemented, deleteDailyPlannerComment: unimplemented, deleteAllDailyPlannerComments: unimplemented,
      myRequestUpdateCount: 0, pendingStoreRequestCount: 0, pendingCertificateRequestCount: 0, myCertificateRequestUpdateCount: 0, myFulfilledUTRequests: [], workingManpowerCount: 0, onLeaveManpowerCount: 0, approvedAnnouncements: [], pendingAnnouncementCount: 0, unreadAnnouncementCount: 0, newIncidentCount: 0, myUnreadManagementRequestCount: 0, unreadManagementRequestCountForMe: 0,
      addInternalRequest: unimplemented, updateInternalRequest: unimplemented, deleteInternalRequest: unimplemented, addInternalRequestComment: unimplemented, markRequestAsViewed: unimplemented, forwardInternalRequest: unimplemented, escalateInternalRequest: unimplemented, createPpeRequestTask: unimplemented, addInventoryItem: unimplemented, updateInventoryItem: unimplemented, deleteInventoryItem: unimplemented, addMultipleInventoryItems: unimplemented, requestInventoryTransfer: unimplemented, approveInventoryTransfer: unimplemented, rejectInventoryTransfer: unimplemented, addCertificateRequest: unimplemented, requestUTMachineCertificate: unimplemented, addCertificateRequestComment: unimplemented, fulfillCertificateRequest: unimplemented, markUTRequestsAsViewed: unimplemented, acknowledgeFulfilledUTRequest: unimplemented, addManpowerLog: unimplemented, addManpowerProfile: unimplemented, updateManpowerProfile: unimplemented, deleteManpowerProfile: unimplemented, addUTMachine: unimplemented, updateUTMachine: unimplemented, deleteUTMachine: unimplemented, addUTMachineLog: unimplemented, addDftMachine: unimplemented, updateDftMachine: unimplemented, deleteDftMachine: unimplemented, addMobileSim: unimplemented, updateMobileSim: unimplemented, deleteMobileSim: unimplemented, addOtherEquipment: unimplemented, updateOtherEquipment: unimplemented, deleteOtherEquipment: unimplemented, addVehicle: unimplemented, updateVehicle: unimplemented, deleteVehicle: unimplemented, addDriver: unimplemented, updateDriver: unimplemented, deleteDriver: unimplemented, addManagementRequest: unimplemented, updateManagementRequest: unimplemented, addManagementRequestComment: unimplemented, markManagementRequestAsViewed: unimplemented, addAnnouncement: unimplemented, approveAnnouncement: unimplemented, rejectAnnouncement: unimplemented, returnAnnouncement: unimplemented, updateAnnouncement: unimplemented, deleteAnnouncement: unimplemented, dismissAnnouncement: unimplemented, addIncidentReport: unimplemented, updateIncident: unimplemented, addIncidentComment: unimplemented, addUsersToIncidentReport: unimplemented, publishIncident: unimplemented,
      expiringVehicleDocsCount: 0, expiringDriverDocsCount: 0, expiringUtMachineCalibrationsCount: 0, expiringManpowerCount: 0, pendingTaskApprovalCount: 0, myNewTaskCount: 0,
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
