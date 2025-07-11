
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, DRIVERS, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, ANNOUNCEMENTS, INCIDENTS } from '@/lib/mock-data';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth } from 'date-fns';


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
  addUser: (newUser: Omit<User, 'id' | 'avatar' | 'password'> & { password?: string }) => void;
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
  const [users, setUsers] = useState<User[]>(USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [inventoryTransferRequests, setInventoryTransferRequests] = useState<InventoryTransferRequest[]>(INVENTORY_TRANSFER_REQUESTS);
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(CERTIFICATE_REQUESTS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(PLANNER_EVENTS);
  const [dailyPlannerComments, setDailyPlannerComments] = useState<DailyPlannerComment[]>(DAILY_PLANNER_COMMENTS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [manpowerLogs, setManpowerLogs] = useState<ManpowerLog[]>(MANPOWER_LOGS);
  const [manpowerProfiles, setManpowerProfiles] = useState<ManpowerProfile[]>(MANPOWER_PROFILES);
  const [utMachines, setUtMachines] = useState<UTMachine[]>(UT_MACHINES);
  const [dftMachines, setDftMachines] = useState<DftMachine[]>(DFT_MACHINES);
  const [mobileSims, setMobileSims] = useState<MobileSim[]>(MOBILE_SIMS);
  const [otherEquipments, setOtherEquipments] = useState<OtherEquipment[]>(OTHER_EQUIPMENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [internalRequests, setInternalRequests] = useState<InternalRequest[]>(INTERNAL_REQUESTS);
  const [managementRequests, setManagementRequests] = useState<ManagementRequest[]>(MANAGEMENT_REQUESTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INCIDENTS);
  
  const [appName, setAppName] = useState<string>('Aries Marine - Task Management System');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On initial load, check for a user session.
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('user');
    } finally {
        // This now happens regardless of whether a user was found or not.
        // It signals that the initial session check is complete.
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        router.push('/dashboard');
        return true;
    }
    return false;
  }, [users, router]);
  
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const recordAction = useCallback((actionText: string) => {
    // This function can be expanded to log to a backend if needed
  }, []);
  
  const getVisibleUsers = useCallback((): User[] => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return users;
    }
    const userRole = roles.find(r => r.name === user.role);
    // Simple implementation: Supervisors see their team, others see themselves.
    if (user.role === 'Supervisor' || user.role === 'HSE') {
        const myTeamIds = users.filter(u => u.supervisorId === user.id).map(u => u.id);
        return users.filter(u => u.id === user.id || myTeamIds.includes(u.id));
    }
    return users.filter(u => u.id === user.id);
  }, [user, users, roles]);
  
  const addUser = useCallback((newUser: Omit<User, 'id' | 'avatar'> & { password?: string }) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      password: newUser.password || 'password', // Default password if not provided
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      planningScore: 0,
    };
    setUsers(prev => [...prev, userToAdd]);
    recordAction(`Added new user: ${newUser.name}`);
  }, [setUsers, recordAction]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    if (user?.id === updatedUser.id) {
      setUser(prevUser => ({ ...prevUser!, ...updatedUser }));
      sessionStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
    }
    recordAction(`Updated user profile: ${updatedUser.name}`);
  }, [user, setUsers, setUser, recordAction]);

  const updateProfile = useCallback((name: string, email: string, avatar: string, password?: string) => {
    if (user) {
        let updatedUserData: Partial<User> = { name, email, avatar };
        if (password) {
            updatedUserData.password = password;
        }
        const updatedUser = { ...user, ...updatedUserData };
        updateUser(updatedUser as User);
        recordAction(`Updated own profile`);
    }
  }, [user, recordAction, updateUser]);

  // All other data modification functions would go here...
  const a = (d:any) => {};
  const b = (d:any):any => {};
  const c = (d:any):any => [];

    const value = {
        user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, isLoading,
        login, logout, getVisibleUsers, addUser, updateUser, updateProfile,
        // The rest of the functions are mocked for now as they don't impact the login flow
        updateTask: a, addTask: a, deleteTask: a, addPlannerEvent: a, updatePlannerEvent: a, deletePlannerEvent: a, getExpandedPlannerEvents: c, updateUserPlanningScore: a, deleteUser: a, addRole: a, updateRole: a, deleteRole: a, addProject: a, updateProject: a, deleteProject: a, requestTaskStatusChange: b, approveTaskStatusChange: a, returnTaskStatusChange: a, requestTaskReassignment: a, addComment: a, markTaskAsViewed: a, addManualAchievement: a, approveAchievement: a, rejectAchievement: a, updateManualAchievement: a, deleteManualAchievement: a, addPlannerEventComment: a, addDailyPlannerComment: a, updateDailyPlannerComment: a, deleteDailyPlannerComment: a, deleteAllDailyPlannerComments: a, updateBranding: a,
        myRequestUpdateCount: 0, pendingStoreRequestCount: 0, pendingCertificateRequestCount: 0, myCertificateRequestUpdateCount: 0, myFulfilledUTRequests: [], workingManpowerCount: 0, onLeaveManpowerCount: 0, approvedAnnouncements: [], pendingAnnouncementCount: 0, unreadAnnouncementCount: 0, newIncidentCount: 0, myUnreadManagementRequestCount: 0, unreadManagementRequestCountForMe: 0,
        addInternalRequest: a, updateInternalRequest: a, deleteInternalRequest: a, addInternalRequestComment: a, markRequestAsViewed: a, forwardInternalRequest: a, escalateInternalRequest: a, createPpeRequestTask: a, addInventoryItem: a, updateInventoryItem: a, deleteInventoryItem: a, addMultipleInventoryItems: (d:any): number => 0, requestInventoryTransfer: a, approveInventoryTransfer: a, rejectInventoryTransfer: a, addCertificateRequest: a, requestUTMachineCertificate: a, addCertificateRequestComment: a, fulfillCertificateRequest: a, markUTRequestsAsViewed: a, acknowledgeFulfilledUTRequest: a, addManpowerLog: a, addManpowerProfile: a, updateManpowerProfile: a, deleteManpowerProfile: a, addUTMachine: a, updateUTMachine: a, deleteUTMachine: a, addUTMachineLog: a, addDftMachine: a, updateDftMachine: a, deleteDftMachine: a, addMobileSim: a, updateMobileSim: a, deleteMobileSim: a, addOtherEquipment: a, updateOtherEquipment: a, deleteOtherEquipment: a, addVehicle: a, updateVehicle: a, deleteVehicle: a, addDriver: a, updateDriver: a, deleteDriver: a, addManagementRequest: a, updateManagementRequest: a, addManagementRequestComment: a, markManagementRequestAsViewed: a, addAnnouncement: a, approveAnnouncement: a, rejectAnnouncement: a, returnAnnouncement: a, updateAnnouncement: a, deleteAnnouncement: a, dismissAnnouncement: a, addIncidentReport: a, updateIncident: a, addIncidentComment: a, addUsersToIncidentReport: a, publishIncident: a,
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
