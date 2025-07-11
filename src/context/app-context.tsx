
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

  // This effect runs once on mount to set the initial loading state.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (
                    new Date(task.dueDate) < new Date() &&
                    task.status !== 'Completed' &&
                    task.status !== 'Overdue'
                ) {
                    return { ...task, status: 'Overdue' };
                }
                return task;
            })
        );
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [setTasks]);

  const recordAction = useCallback((actionText: string) => {
    if (!currentLogId) return;
    
    setActivityLogs(prevLogs => {
      return prevLogs.map(log => {
        if (log.id === currentLogId) {
          return { ...log, actions: [...log.actions, actionText] };
        }
        return log;
      });
    });
  }, [currentLogId, setActivityLogs]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        userId: foundUser.id,
        loginTime: new Date().toISOString(),
        logoutTime: null,
        duration: null,
        actions: ['User logged in.'],
      };
      setActivityLogs(prev => [newLog, ...prev]);
      setCurrentLogId(newLog.id);
      return true;
    }
    return false;
  }, [users, setUser, setActivityLogs, setCurrentLogId]);

  const logout = useCallback(() => {
    if (currentLogId) {
      const logoutTime = new Date();
      setActivityLogs(prevLogs => {
        return prevLogs.map(log => {
          if (log.id === currentLogId) {
            const loginTime = new Date(log.loginTime);
            return {
              ...log,
              logoutTime: logoutTime.toISOString(),
              duration: differenceInMinutes(logoutTime, loginTime),
              actions: [...log.actions, 'User logged out.'],
            };
          }
          return log;
        });
      });
      setCurrentLogId(null);
    }
    setUser(null);
    router.push('/login');
  }, [currentLogId, setActivityLogs, setCurrentLogId, setUser, router]);

  const getSubordinates = useCallback((managerId: string, allUsers: User[]): string[] => {
    const subordinates: string[] = [];
    const queue: string[] = [managerId];
    const visited: Set<string> = new Set(queue);

    while (queue.length > 0) {
        const currentManagerId = queue.shift()!;
        const directSubordinates = allUsers.filter(u => u.supervisorId === currentManagerId);

        for (const subordinate of directSubordinates) {
            if (!visited.has(subordinate.id)) {
                visited.add(subordinate.id);
                subordinates.push(subordinate.id);
                queue.push(subordinate.id);
            }
        }
    }
    return subordinates;
  }, []);
  
  const getVisibleUsers = useCallback((): User[] => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return users;
    }
    const userRole = roles.find(r => r.name === user.role);
    if (userRole?.permissions.includes('view_subordinates_users')) {
      const subordinateIds = getSubordinates(user.id, users);
      return users.filter(u => u.id === user.id || subordinateIds.includes(u.id));
    }
    return users.filter(u => u.id === user.id);
  }, [user, users, roles, getSubordinates]);
  
  const addTask = useCallback((task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'isViewedByAssignee' | 'completionDate'>) => {
    if (!user) return;
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        comments: [],
        status: 'To Do',
        approvalState: 'none',
        isViewedByAssignee: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    recordAction(`Created task: "${task.title}"`);
  }, [user, setTasks, recordAction]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
    recordAction(`Updated task details for: "${updatedTask.title}"`);
  }, [setTasks, recordAction]);

  const addComment = useCallback((taskId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [newComment, ...(task.comments || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }
          : task
      )
    );
    recordAction(`Commented on task: "${tasks.find(t=>t.id === taskId)?.title}"`);
  }, [user, tasks, setTasks, recordAction]);
  
  const requestTaskStatusChange = useCallback(async (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user || !commentText) return false;

    if (newStatus === 'Completed' && task.requiresAttachmentForCompletion && !attachment && !task.attachment) {
      return false; 
    }
    
    const formattedComment = `Status change requested to "${newStatus}": ${commentText}`;
    addComment(taskId, formattedComment);
    
    setTasks(prevTasks => prevTasks.map(t =>
        t.id === taskId
        ? {
            ...t,
            previousStatus: t.status,
            pendingStatus: newStatus,
            approvalState: 'pending',
            status: 'Pending Approval',
            attachment: attachment || t.attachment,
          }
        : t
    ));
    recordAction(`Requested status change to "${newStatus}" for task: "${task.title}"`);
    return true;
  }, [tasks, user, setTasks, addComment, recordAction]);

  const requestTaskReassignment = useCallback((taskId: string, newAssigneeId: string, commentText: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newAssignee = users.find(u => u.id === newAssigneeId);
    if (!newAssignee) return;
    
    const formattedComment = `Reassignment requested to ${newAssignee.name}. Reason: ${commentText}`;
    addComment(taskId, formattedComment);
    
    setTasks(prev => prev.map(t => t.id === taskId ? {
        ...t,
        pendingAssigneeId: newAssigneeId,
        status: 'Pending Approval',
        previousStatus: t.status,
        approvalState: 'pending',
    } : t));

    recordAction(`Requested reassignment of task "${task.title}" to ${newAssignee.name}`);
  }, [user, users, tasks, setTasks, recordAction, addComment]);
  
  const approveTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const approvalComment = `Request Approved: ${commentText}`;
    addComment(taskId, approvalComment);

    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        if (t.pendingAssigneeId) { // Reassignment approval
          recordAction(`Approved reassignment of task "${t.title}"`);
          return {
            ...t,
            assigneeId: t.pendingAssigneeId,
            status: t.previousStatus || 'To Do',
            pendingAssigneeId: undefined,
            previousStatus: undefined,
            pendingStatus: undefined,
            approvalState: 'approved',
            isViewedByAssignee: false,
          };
        }
        if (t.pendingStatus) { // Status change approval
          const isCompleting = t.pendingStatus === 'Completed';
          recordAction(`Approved status change for task: "${t.title}"`);
          return {
            ...t,
            status: t.pendingStatus,
            completionDate: isCompleting ? new Date().toISOString() : t.completionDate,
            pendingStatus: undefined,
            previousStatus: undefined,
            approvalState: 'approved',
          };
        }
      }
      return t;
    }));
  }, [user, tasks, setTasks, recordAction, addComment]);
  
  const returnTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const returnComment = `Request Returned: ${commentText}`;
    addComment(taskId, returnComment);
    
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        if (t.pendingAssigneeId) { // Reassignment rejection
            recordAction(`Returned (rejected) reassignment of task "${t.title}"`);
            return {
                ...t,
                status: t.previousStatus || 'To Do',
                pendingAssigneeId: undefined,
                previousStatus: undefined,
                approvalState: 'returned',
            };
        }
        if (t.pendingStatus) { // Status change rejection
            const returnToStatus = t.previousStatus || 'In Progress';
            recordAction(`Returned task "${t.title}" to status "${returnToStatus}"`);
            return {
                ...t,
                status: returnToStatus,
                pendingStatus: undefined,
                previousStatus: undefined,
                approvalState: 'returned',
            };
        }
      }
      return t;
    }));
  }, [user, tasks, setTasks, recordAction, addComment]);

  const deleteTask = useCallback((taskId: string) => {
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    recordAction(`Deleted task: "${taskTitle}"`);
  }, [tasks, setTasks, recordAction]);

  const markTaskAsViewed = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isViewedByAssignee: true } : t));
  }, [setTasks]);

  const addPlannerEvent = useCallback((event: Omit<PlannerEvent, 'id' | 'comments'>) => {
    if (!user) return;
    const newEvent: PlannerEvent = {
      ...event,
      id: `event-${Date.now()}`,
      creatorId: user.id,
      comments: [],
    };
    setPlannerEvents(prevEvents => [newEvent, ...prevEvents]);
    recordAction(`Created planner event: "${event.title}"`);
  }, [user, setPlannerEvents, recordAction]);

  const updatePlannerEvent = useCallback((updatedEvent: PlannerEvent) => {
    setPlannerEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    recordAction(`Updated planner event: "${updatedEvent.title}"`);
  }, [setPlannerEvents, recordAction]);
  
  const deletePlannerEvent = useCallback((eventId: string) => {
    const event = plannerEvents.find(e => e.id === eventId);
    setPlannerEvents(prev => prev.filter(e => e.id !== eventId));
    if (event) {
        recordAction(`Deleted planner event: "${event.title}"`);
    }
  }, [plannerEvents, setPlannerEvents, recordAction]);
  
  const getExpandedPlannerEvents = useCallback((date: Date, userId: string) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });
    const expandedEvents: (PlannerEvent & { eventDate: Date })[] = [];

    const userEvents = plannerEvents.filter(event => event.userId === userId);

    userEvents.forEach(event => {
      const eventStartDate = new Date(event.date);
      daysInMonth.forEach(day => {
        let shouldAdd = false;
        switch (event.frequency) {
          case 'once':
            if (isSameDay(day, eventStartDate)) shouldAdd = true;
            break;
          case 'daily':
            if (day >= eventStartDate) shouldAdd = true;
            break;
          case 'daily-except-sundays':
            if (day >= eventStartDate && day.getDay() !== 0) shouldAdd = true;
            break;
          case 'weekly':
            if (day >= eventStartDate && day.getDay() === eventStartDate.getDay()) shouldAdd = true;
            break;
          case 'weekends':
            if (day >= eventStartDate && isWeekend(day)) shouldAdd = true;
            break;
          case 'monthly':
            if (day >= eventStartDate && day.getDate() === eventStartDate.getDate()) shouldAdd = true;
            break;
        }
        if (shouldAdd) {
          expandedEvents.push({ ...event, eventDate: day });
        }
      });
    });
    return expandedEvents;
  }, [plannerEvents]);

  const addPlannerEventComment = useCallback((eventId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setPlannerEvents(prev => prev.map(e => e.id === eventId ? {...e, comments: [...(e.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())} : e));
    recordAction(`Commented on event: "${plannerEvents.find(e=>e.id === eventId)?.title}"`);
  }, [user, plannerEvents, setPlannerEvents, recordAction]);

  const addDailyPlannerComment = useCallback((plannerUserId: string, date: Date, commentText: string) => {
    if (!user) return;
    const dayKey = format(date, 'yyyy-MM-dd');
    const newComment: Comment = {
        userId: user.id,
        text: commentText,
        date: new Date().toISOString(),
        id: `comment-${Date.now()}`
    };

    setDailyPlannerComments(prev => {
        const existingEntryIndex = prev.findIndex(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
        if (existingEntryIndex > -1) {
            const newDpcs = [...prev];
            const updatedEntry = {
                ...newDpcs[existingEntryIndex],
                comments: [...newDpcs[existingEntryIndex].comments, newComment]
            };
            newDpcs[existingEntryIndex] = updatedEntry;
            return newDpcs;
        } else {
            const newEntry: DailyPlannerComment = {
                id: `${plannerUserId}_${dayKey}`,
                plannerUserId,
                day: dayKey,
                comments: [newComment]
            };
            return [...prev, newEntry];
        }
    });
    const plannerUser = users.find(u => u.id === plannerUserId);
    recordAction(`Commented on ${plannerUser?.name}'s planner for ${dayKey}`);
  }, [user, users, setDailyPlannerComments, recordAction]);
  
  const updateDailyPlannerComment = useCallback((commentId: string, plannerUserId: string, day: string, newText: string) => {
    setDailyPlannerComments(prev => prev.map(dpc => {
      if (dpc.day === day && dpc.plannerUserId === plannerUserId) {
        return {
          ...dpc,
          comments: dpc.comments.map(c => c.id === commentId ? { ...c, text: newText } : c)
        }
      }
      return dpc;
    }));
  }, [setDailyPlannerComments]);

  const deleteDailyPlannerComment = useCallback((commentId: string, plannerUserId: string, day: string) => {
    setDailyPlannerComments(prev => prev.map(dpc => {
      if (dpc.day === day && dpc.plannerUserId === plannerUserId) {
        return { ...dpc, comments: dpc.comments.filter(c => c.id !== commentId) }
      }
      return dpc;
    }));
  }, [setDailyPlannerComments]);

  const deleteAllDailyPlannerComments = useCallback((plannerUserId: string, day: string) => {
     setDailyPlannerComments(prev => prev.map(dpc => {
      if (dpc.day === day && dpc.plannerUserId === plannerUserId) {
        return { ...dpc, comments: [] }
      }
      return dpc;
    }));
  }, [setDailyPlannerComments]);

  const addUser = useCallback((newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      planningScore: 0,
    };
    setUsers(prev => [...prev, userToAdd]);
    recordAction(`Added new user: ${newUser.name}`);
  }, [setUsers, recordAction]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
    recordAction(`Updated user profile: ${updatedUser.name}`);
  }, [user, setUsers, setUser, recordAction]);

  const updateUserPlanningScore = useCallback((userId: string, score: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, planningScore: score } : u));
    const scoredUser = users.find(u => u.id === userId);
    recordAction(`Updated planning score for ${scoredUser?.name} to ${score}.`);
  }, [users, setUsers, recordAction]);
  
  const deleteUser = useCallback((userId: string) => {
    const userName = users.find(u => u.id === userId)?.name;
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Unassign tasks from the deleted user
    setTasks(prev => prev.map(t => t.assigneeId === userId ? {...t, assigneeId: ''} : t));
    
    recordAction(`Deleted user: ${userName}`);
  }, [users, setUsers, setTasks, recordAction]);

  const addRole = useCallback((roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole: RoleDefinition = {
      ...roleData,
      id: `role-${Date.now()}`,
      isEditable: true,
    };
    setRoles(prev => [...prev, newRole]);
    recordAction(`Added new role: ${newRole.name}`);
  }, [setRoles, recordAction]);

  const updateRole = useCallback((updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    recordAction(`Updated role: ${updatedRole.name}`);
  }, [setRoles, recordAction]);

  const deleteRole = useCallback((roleId: string) => {
    const roleName = roles.find(r => r.id === roleId)?.name;
    setRoles(prev => prev.filter(r => r.id !== roleId));
    recordAction(`Deleted role: ${roleName}`);
  }, [roles, setRoles, recordAction]);

  const addProject = useCallback((projectName: string) => {
    const newProject: Project = { id: `proj-${Date.now()}`, name: projectName };
    setProjects(prev => [...prev, newProject]);
    recordAction(`Added project: ${projectName}`);
  }, [setProjects, recordAction]);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    recordAction(`Updated project: ${updatedProject.name}`);
  }, [setProjects, recordAction]);
  
  const deleteProject = useCallback((projectId: string) => {
    const projectName = projects.find(p => p.id === projectId)?.name;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    recordAction(`Deleted project: ${projectName}`);
  }, [projects, setProjects, recordAction]);

  const updateProfile = useCallback((name: string, email: string, avatar: string, password?: string) => {
    if (user) {
        let updatedUser = {...user, name, email, avatar};
        if (password) {
            updatedUser.password = password;
        }
        updateUser(updatedUser);
        recordAction(`Updated own profile`);
    }
  }, [user, recordAction, updateUser]);

  const addManualAchievement = useCallback((achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => {
    if (!user) return;
    const newAchievement: Achievement = {
      ...achievement,
      id: `ach-${Date.now()}`,
      type: 'manual',
      date: new Date().toISOString(),
      awardedById: user.id,
      status: (user.role === 'Admin' || user.role === 'Manager') ? 'approved' : 'pending',
    };
    setAchievements(prev => [newAchievement, ...prev]);
    const userName = users.find(u => u.id === achievement.userId)?.name;
    recordAction(`Awarded manual achievement "${achievement.title}" to ${userName}`);
  }, [user, users, setAchievements, recordAction]);
  
  const approveAchievement = useCallback((achievementId: string, points: number) => {
    setAchievements(prev => prev.map(ach => ach.id === achievementId ? { ...ach, status: 'approved', points } : ach));
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    recordAction(`Approved achievement: "${achTitle}"`);
  }, [achievements, setAchievements, recordAction]);

  const rejectAchievement = useCallback((achievementId: string) => {
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
    recordAction(`Rejected achievement: "${achTitle}"`);
  }, [achievements, setAchievements, recordAction]);

  const updateManualAchievement = useCallback((updatedAchievement: Achievement) => {
    setAchievements(prev => prev.map(ach => ach.id === updatedAchievement.id ? updatedAchievement : ach));
    const userName = users.find(u => u.id === updatedAchievement.userId)?.name;
    recordAction(`Updated manual achievement "${updatedAchievement.title}" for ${userName}`);
  }, [users, setAchievements, recordAction]);

  const deleteManualAchievement = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        const userName = users.find(u => u.id === achievement.userId)?.name;
        recordAction(`Deleted manual achievement "${achievement.title}" for ${userName}`);
    }
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
  }, [achievements, users, setAchievements, recordAction]);

  const updateBranding = useCallback((name: string, logo: string | null) => {
    setAppName(name);
    setAppLogo(logo);
    recordAction(`Updated app branding.`);
  }, [setAppName, setAppLogo, recordAction]);

  // All other functions need to be converted to async and use Firestore...
  // This is a simplified conversion, more complex logic might be needed for some functions.

  const a = (d:any) => {};
  const b = (d:any):any => {};
  const c = (d:any):any => [];

    const value = {
        user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, isLoading,
        login, logout, updateTask, addTask, deleteTask, addPlannerEvent, updatePlannerEvent, deletePlannerEvent, getExpandedPlannerEvents, getVisibleUsers, addUser, updateUser, updateUserPlanningScore, deleteUser, addRole, updateRole, deleteRole, addProject, updateProject, deleteProject, updateProfile, requestTaskStatusChange, approveTaskStatusChange, returnTaskStatusChange, requestTaskReassignment, addComment, markTaskAsViewed, addManualAchievement, approveAchievement, rejectAchievement, updateManualAchievement, deleteManualAchievement, addPlannerEventComment, addDailyPlannerComment, updateDailyPlannerComment, deleteDailyPlannerComment, deleteAllDailyPlannerComments, updateBranding,
        // TODO: Convert these to async firestore functions
        myRequestUpdateCount: 0, pendingStoreRequestCount: 0, pendingCertificateRequestCount: 0, myCertificateRequestUpdateCount: 0, myFulfilledUTRequests: [], workingManpowerCount: 0, onLeaveManpowerCount: 0, approvedAnnouncements: [], pendingAnnouncementCount: 0, unreadAnnouncementCount: 0, newIncidentCount: 0, myUnreadManagementRequestCount: 0, unreadManagementRequestCountForMe: 0,
        addInternalRequest: a, updateInternalRequest: a, deleteInternalRequest: a, addInternalRequestComment: a, markRequestAsViewed: a, forwardInternalRequest: a, escalateInternalRequest: a, createPpeRequestTask: a, addInventoryItem: a, updateInventoryItem: a, deleteInventoryItem: a, addMultipleInventoryItems: (d:any): number => 0, requestInventoryTransfer: a, approveInventoryTransfer: a, rejectInventoryTransfer: a, addCertificateRequest: a, requestUTMachineCertificate: a, addCertificateRequestComment: a, fulfillCertificateRequest: a, markUTRequestsAsViewed: a, acknowledgeFulfilledUTRequest: a, addManpowerLog: a, addManpowerProfile: a, updateManpowerProfile: a, deleteManpowerProfile: a, addUTMachine: a, updateUTMachine: a, deleteUTMachine: a, addUTMachineLog: a, addDftMachine: a, updateDftMachine: a, deleteDftMachine: a, addMobileSim: a, updateMobileSim: a, deleteMobileSim: a, addOtherEquipment: a, updateOtherEquipment: a, deleteOtherEquipment: a, addVehicle: a, updateVehicle: a, deleteVehicle: a, addDriver: a, updateDriver: a, deleteDriver: a, addManagementRequest: a, updateManagementRequest: a, addManagementRequestComment: a, markManagementRequestAsViewed: a, addAnnouncement: a, approveAnnouncement: a, rejectAnnouncement: a, returnAnnouncement: a, updateAnnouncement: a, deleteAnnouncement: a, dismissAnnouncement: a, addIncidentReport: a, updateIncident: a, addIncidentComment: a, addUsersToIncidentReport: a, publishIncident: a,
        expiringVehicleDocsCount: 0, expiringDriverDocsCount: 0, expiringUtMachineCalibrationsCount: 0, expiringManpowerCount: 0, pendingTaskApprovalCount: 0, myNewTaskCount: 0,
    };
    
      if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background"><p>Loading...</p></div>;
      }
    
  return <AppContext.Provider value={value as any}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
