'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, DRIVERS, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, ANNOUNCEMENTS, INCIDENTS } from '@/lib/mock-data';
import { addDays, isBefore, addMonths, eachDayOfInterval, endOfMonth, isMatch, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth } from 'date-fns';

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
  login: (email: string, password: string) => boolean;
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
  requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => boolean;
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
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [appName, setAppName] = useState('Aries Marine - Task Management System');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const storedAppName = localStorage.getItem('appName');
    const storedAppLogo = localStorage.getItem('appLogo');
    if (storedAppName) setAppName(storedAppName);
    if (storedAppLogo) setAppLogo(storedAppLogo);
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
  }, []);

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
  }, [currentLogId]);

  const login = useCallback((email: string, password: string): boolean => {
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

      router.push('/dashboard');
      return true;
    }
    return false;
  }, [router, users]);

  const logout = useCallback(() => {
    if (currentLogId) {
      const logoutTime = new Date();
      setActivityLogs(prevLogs => 
        prevLogs.map(log => {
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
        })
      );
      setCurrentLogId(null);
    }
    setUser(null);
    router.push('/login');
  }, [router, currentLogId]);

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
  }, [recordAction]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
    recordAction(`Updated task details for: "${updatedTask.title}"`);
  }, [recordAction]);

  const addComment = useCallback((taskId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setTasks(prevTasks => {
        return prevTasks.map(t => {
            if (t.id === taskId) {
                const updatedComments = t.comments ? [newComment, ...t.comments] : [newComment];
                return { ...t, comments: updatedComments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
            }
            return t;
        });
    });

    const task = tasks.find(t => t.id === taskId);
    recordAction(`Commented on task: "${task?.title}"`);
  }, [user, tasks, recordAction]);
  
  const requestTaskStatusChange = useCallback((taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user || !commentText) return false;

    if (newStatus === 'Completed' && task.requiresAttachmentForCompletion && !attachment && !task.attachment) {
      return false; // Prevents completion without attachment
    }
    
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        const formattedComment = `Status change requested to "${newStatus}": ${commentText}`;
        const newComment: Comment = { userId: user.id, text: formattedComment, date: new Date().toISOString() };
        return {
          ...t,
          comments: [newComment, ...(t.comments || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          previousStatus: t.status,
          pendingStatus: newStatus,
          approvalState: 'pending' as ApprovalState,
          status: 'Pending Approval' as TaskStatus,
          attachment: attachment || t.attachment,
        };
      }
      return t;
    }));
    
    recordAction(`Requested status change to "${newStatus}" for task: "${task.title}"`);
    return true;
  }, [tasks, user, recordAction]);

  const requestTaskReassignment = useCallback((taskId: string, newAssigneeId: string, commentText: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newAssignee = users.find(u => u.id === newAssigneeId);
    if (!newAssignee) return;
    
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        const formattedComment = `Reassignment requested to ${newAssignee.name}. Reason: ${commentText}`;
        const newComment: Comment = { userId: user.id, text: formattedComment, date: new Date().toISOString() };
        return {
          ...t,
          comments: [newComment, ...(t.comments || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          pendingAssigneeId: newAssigneeId,
          status: 'Pending Approval',
          previousStatus: t.status,
          approvalState: 'pending',
        };
      }
      return t;
    }));

    recordAction(`Requested reassignment of task "${task.title}" to ${newAssignee.name}`);
  }, [user, users, tasks, recordAction]);
  
  const approveTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    if (!user) return;

    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        const approvalComment = `Request Approved: ${commentText}`;
        const newComment: Comment = { userId: user.id, text: approvalComment, date: new Date().toISOString() };
        const updatedComments = [newComment, ...(t.comments || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (t.pendingAssigneeId) { // It's a reassignment request
          const newAssignee = users.find(u => u.id === t.pendingAssigneeId);
          recordAction(`Approved reassignment of task "${t.title}" to ${newAssignee?.name}`);
          return {
            ...t,
            comments: updatedComments,
            assigneeId: t.pendingAssigneeId,
            status: t.previousStatus || 'To Do',
            pendingAssigneeId: undefined,
            previousStatus: undefined,
            pendingStatus: undefined, // Clear pending status
            approvalState: 'approved',
            isViewedByAssignee: false,
          };
        } else if (t.pendingStatus) { // It's a status change request
          const isCompleting = t.pendingStatus === 'Completed';
          recordAction(`Approved status change for task: "${t.title}"`);
          return {
            ...t,
            comments: updatedComments,
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
  }, [user, users, recordAction]);
  
  const returnTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    if (!user) return;
    
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId) {
        const returnComment = `Request Returned: ${commentText}`;
        const newComment: Comment = { userId: user.id, text: returnComment, date: new Date().toISOString() };
        const updatedComments = [newComment, ...(t.comments || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (t.pendingAssigneeId) { // It's a reassignment request being returned
            recordAction(`Returned (rejected) reassignment of task "${t.title}"`);
            return {
                ...t,
                comments: updatedComments,
                status: t.previousStatus || 'To Do',
                pendingAssigneeId: undefined,
                previousStatus: undefined,
                approvalState: 'returned',
            };
        } else if (t.pendingStatus) { // It's a status change request being returned
            const returnToStatus = t.previousStatus || 'In Progress';
            recordAction(`Returned task "${t.title}" to status "${returnToStatus}"`);
            return {
                ...t,
                comments: updatedComments,
                status: returnToStatus,
                pendingStatus: undefined,
                previousStatus: undefined,
                approvalState: 'returned',
            };
        }
      }
      return t;
    }));
  }, [user, recordAction]);

  const deleteTask = useCallback((taskId: string) => {
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    recordAction(`Deleted task: "${taskTitle}"`);
  }, [tasks, recordAction]);

  const markTaskAsViewed = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isViewedByAssignee: true } : t));
  }, []);

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
  }, [user, recordAction]);

  const updatePlannerEvent = useCallback((updatedEvent: PlannerEvent) => {
    setPlannerEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    recordAction(`Updated planner event: "${updatedEvent.title}"`);
  }, [recordAction]);
  
  const deletePlannerEvent = useCallback((eventId: string) => {
    const event = plannerEvents.find(e => e.id === eventId);
    setPlannerEvents(prev => prev.filter(e => e.id !== eventId));
    if (event) {
        recordAction(`Deleted planner event: "${event.title}"`);
    }
  }, [plannerEvents, recordAction]);
  
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
    setPlannerEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
          if (event.id === eventId) {
              const updatedComments = event.comments ? [...event.comments, newComment] : [newComment];
              return { ...event, comments: updatedComments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
          }
          return event;
      });
      return updatedEvents;
    });
    const eventTitle = plannerEvents.find(e => e.id === eventId)?.title;
    recordAction(`Commented on event: "${eventTitle}"`);
  }, [user, plannerEvents, recordAction]);

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
        const existingEntry = prev.find(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
        if (existingEntry) {
            return prev.map(dpc => 
                dpc.id === existingEntry.id 
                ? { ...dpc, comments: [...dpc.comments, newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } 
                : dpc
            );
        } else {
            const newEntry: DailyPlannerComment = {
                id: `dpc-${Date.now()}`,
                plannerUserId,
                day: dayKey,
                comments: [newComment],
            };
            return [...prev, newEntry];
        }
    });
    const plannerUser = users.find(u => u.id === plannerUserId);
    recordAction(`Commented on ${plannerUser?.name}'s planner for ${dayKey}`);
  }, [user, users, recordAction]);
  
  const updateDailyPlannerComment = useCallback((commentId: string, plannerUserId: string, day: string, newText: string) => {
    setDailyPlannerComments(prev => prev.map(dpc => {
      if(dpc.plannerUserId === plannerUserId && dpc.day === day) {
        return {
          ...dpc,
          comments: dpc.comments.map(c => c.id === commentId ? { ...c, text: newText } : c)
        }
      }
      return dpc;
    }));
  }, []);

  const deleteDailyPlannerComment = useCallback((commentId: string, plannerUserId: string, day: string) => {
    setDailyPlannerComments(prev => prev.map(dpc => {
      if(dpc.plannerUserId === plannerUserId && dpc.day === day) {
        return {
          ...dpc,
          comments: dpc.comments.filter(c => c.id !== commentId)
        }
      }
      return dpc;
    }).filter(dpc => dpc.comments.length > 0));
  }, []);

  const deleteAllDailyPlannerComments = useCallback((plannerUserId: string, day: string) => {
    setDailyPlannerComments(prev => prev.filter(dpc => !(dpc.plannerUserId === plannerUserId && dpc.day === day)));
  }, []);

  const addUser = useCallback((newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      planningScore: 0,
    };
    setUsers(prev => [...prev, userToAdd]);
    recordAction(`Added new user: ${newUser.name}`);
  }, [recordAction]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
    recordAction(`Updated user profile: ${updatedUser.name}`);
  }, [user, recordAction]);

  const updateUserPlanningScore = useCallback((userId: string, score: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, planningScore: score } : u));
    const scoredUser = users.find(u => u.id === userId);
    recordAction(`Updated planning score for ${scoredUser?.name} to ${score}.`);
  }, [users, recordAction]);
  
  const deleteUser = useCallback((userId: string) => {
    const userName = users.find(u => u.id === userId)?.name;
    setUsers(prev => prev.filter(u => u.id !== userId));
    setTasks(prev => prev.map(t => t.assigneeId === userId ? {...t, assigneeId: ''} : t));
    recordAction(`Deleted user: ${userName}`);
  }, [users, recordAction]);

  const addRole = useCallback((roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole: RoleDefinition = {
      ...roleData,
      id: `role-${Date.now()}`,
      isEditable: true,
    };
    setRoles(prev => [...prev, newRole]);
    recordAction(`Added new role: ${newRole.name}`);
  }, [recordAction]);

  const updateRole = useCallback((updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    recordAction(`Updated role: ${updatedRole.name}`);
  }, [recordAction]);

  const deleteRole = useCallback((roleId: string) => {
    const roleName = roles.find(r => r.id === roleId)?.name;
    setRoles(prev => prev.filter(r => r.id !== roleId));
    recordAction(`Deleted role: ${roleName}`);
  }, [roles, recordAction]);

  const addProject = useCallback((projectName: string) => {
    const newProject: Project = { id: `proj-${Date.now()}`, name: projectName };
    setProjects(prev => [...prev, newProject]);
    recordAction(`Added project: ${projectName}`);
  }, [recordAction]);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    recordAction(`Updated project: ${updatedProject.name}`);
  }, [recordAction]);
  
  const deleteProject = useCallback((projectId: string) => {
    const projectName = projects.find(p => p.id === projectId)?.name;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    recordAction(`Deleted project: ${projectName}`);
  }, [projects, recordAction]);

  const updateProfile = useCallback((name: string, email: string, avatar: string, password?: string) => {
    if (user) {
        const updatedUser = {...user, name, email, avatar};
        if (password) {
            updatedUser.password = password;
        }
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        recordAction(`Updated own profile`);
    }
  }, [user, recordAction]);

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
    setAchievements(prev => [...prev, newAchievement]);
    const userName = users.find(u => u.id === achievement.userId)?.name;
    recordAction(`Awarded manual achievement "${achievement.title}" to ${userName}`);
  }, [user, users, recordAction]);
  
  const approveAchievement = useCallback((achievementId: string, points: number) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === achievementId) {
        return { ...ach, status: 'approved', points };
      }
      return ach;
    }));
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    recordAction(`Approved achievement: "${achTitle}"`);
  }, [achievements, recordAction]);

  const rejectAchievement = useCallback((achievementId: string) => {
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
    recordAction(`Rejected achievement: "${achTitle}"`);
  }, [achievements, recordAction]);

  const updateManualAchievement = useCallback((updatedAchievement: Achievement) => {
    setAchievements(prev => prev.map(ach => ach.id === updatedAchievement.id ? updatedAchievement : ach));
    const userName = users.find(u => u.id === updatedAchievement.userId)?.name;
    recordAction(`Updated manual achievement "${updatedAchievement.title}" for ${userName}`);
  }, [users, recordAction]);

  const deleteManualAchievement = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        const userName = users.find(u => u.id === achievement.userId)?.name;
        recordAction(`Deleted manual achievement "${achievement.title}" for ${userName}`);
    }
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
  }, [achievements, users, recordAction]);

  const updateBranding = useCallback((name: string, logo: string | null) => {
    setAppName(name);
    localStorage.setItem('appName', name);
    if (logo) {
      setAppLogo(logo);
      localStorage.setItem('appLogo', logo);
    } else {
      setAppLogo(null);
      localStorage.removeItem('appLogo');
    }
    recordAction(`Updated app branding.`);
  }, [recordAction]);

  const addInternalRequest = useCallback((request: Omit<InternalRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isEscalated'>) => {
    if (!user) return;
    const newRequest: InternalRequest = {
      ...request,
      id: `ireq-${Date.now()}`,
      requesterId: user.id,
      date: new Date().toISOString(),
      status: 'Pending',
      comments: [{ id: 'c-ireq-1', userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
      isViewedByRequester: true,
      isEscalated: false,
    };
    setInternalRequests(prev => [newRequest, ...prev]);
    recordAction(`Created internal request for ${request.category}`);
  }, [user, recordAction]);

  const updateInternalRequest = useCallback((updatedRequest: InternalRequest) => {
    setInternalRequests(prev => prev.map(r => {
      if (r.id === updatedRequest.id) {
        const originalRequest = internalRequests.find(req => req.id === updatedRequest.id);
        const isApproverAction = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Store in Charge' || user?.role === 'Assistant Store Incharge';
        
        if (originalRequest && originalRequest.status !== updatedRequest.status && isApproverAction) {
          return { ...updatedRequest, isViewedByRequester: false };
        }
        return updatedRequest;
      }
      return r;
    }));
    recordAction(`Updated internal request ID: ${updatedRequest.id}`);
  }, [user, internalRequests, recordAction]);

  const deleteInternalRequest = useCallback((requestId: string) => {
    setInternalRequests(prev => prev.filter(r => r.id !== requestId));
    recordAction(`Deleted internal request ID: ${requestId}`);
  }, [recordAction]);

  const addInternalRequestComment = useCallback((requestId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setInternalRequests(prev => {
        return prev.map(r => {
            if (r.id === requestId) {
                const updatedComments = r.comments ? [newComment, ...r.comments] : [newComment];
                return { ...r, comments: updatedComments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), isViewedByRequester: user.id !== r.requesterId ? false : true };
            }
            return r;
        });
    });
    const request = internalRequests.find(r => r.id === requestId);
    recordAction(`Commented on internal request ID: ${request?.id}`);
  }, [user, internalRequests, recordAction]);

  const markRequestAsViewed = useCallback((requestId: string) => {
    setInternalRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, isViewedByRequester: true } : r
    ));
  }, []);
  
  const forwardInternalRequest = useCallback((requestId: string, role: Role, comment: string) => {
    if (!user) return;
    const request = internalRequests.find(r => r.id === requestId);
    if (!request) return;

    const forwardComment: Comment = {
      userId: user.id,
      text: `Request forwarded to ${role}: ${comment}`,
      date: new Date().toISOString(),
    };
    
    setInternalRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          forwardedTo: role,
          comments: [forwardComment, ...(r.comments || [])],
          isViewedByRequester: false,
        };
      }
      return r;
    }));
    recordAction(`Forwarded internal request ID: ${requestId}`);
  }, [user, internalRequests, recordAction]);
  
  const escalateInternalRequest = useCallback((requestId: string, reason: string) => {
      if (!user) return;
      const request = internalRequests.find(r => r.id === requestId);
      if (!request) return;
      
      const escalationComment: Comment = {
          userId: user.id,
          text: `Request escalated to management. Reason: ${reason}`,
          date: new Date().toISOString(),
      };
      
      setInternalRequests(prev => prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            forwardedTo: 'Manager',
            status: 'Pending',
            comments: [escalationComment, ...(r.comments || [])],
            isViewedByRequester: false,
            isEscalated: true,
          };
        }
        return r;
      }));
      recordAction(`Escalated internal request ID: ${requestId}`);
  }, [user, internalRequests, recordAction]);


  const createPpeRequestTask = useCallback((data: any) => {
    if (!user) return;
    const ppeTask = {
      title: `PPE Request: ${data.employeeName}`,
      description: `Plant: ${data.plant}, First Joining: ${format(data.firstJoiningDate, 'PPP')}, Rejoining: ${data.rejoiningDate ? format(data.rejoiningDate, 'PPP') : 'N/A'}`,
      assigneeId: user.id,
      dueDate: new Date().toISOString(),
      priority: 'Medium' as Priority,
      creatorId: user.id,
      requiresAttachmentForCompletion: false,
    };
    addTask(ppeTask);
  }, [user, addTask]);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: `inv-${Date.now()}` };
    setInventoryItems(prev => [newItem, ...prev]);
  }, []);
  
  const updateInventoryItem = useCallback((item: InventoryItem) => {
    setInventoryItems(prev => prev.map(i => i.id === item.id ? item : i));
  }, []);

  const deleteInventoryItem = useCallback((itemId: string) => {
    setInventoryItems(prev => prev.filter(i => i.id !== itemId));
  }, []);
  
  const addMultipleInventoryItems = useCallback((itemsData: any[]): number => {
    let importedCount = 0;
    const newItems: InventoryItem[] = [];
    const updatedItems = new Map<string, InventoryItem>();

    itemsData.forEach((item, index) => {
        try {
            const projectName = item['PROJECT'];
            const project = projects.find(p => p.name.toLowerCase() === projectName?.toLowerCase());

            if (!item['ITEM NAME'] || !item['SERIAL NUMBER'] || !item['INSPECTION DATE'] || !item['INSPECTION DUE DATE'] || !item['TP INSPECTION DUE DATE'] || !item['STATUS'] || !project) {
                console.warn(`Skipping row ${index + 2} due to missing required data.`);
                return;
            }

            const parsedItem = {
                id: `inv-import-${Date.now()}-${index}`,
                name: item['ITEM NAME'],
                serialNumber: String(item['SERIAL NUMBER']),
                chestCrollNo: item['CHEST CROLL NO'] ? String(item['CHEST CROLL NO']) : undefined,
                ariesId: item['ARIES ID'] ? String(item['ARIES ID']) : undefined,
                status: item['STATUS'] as InventoryItem['status'],
                inspectionDate: new Date(item['INSPECTION DATE']).toISOString(),
                inspectionDueDate: new Date(item['INSPECTION DUE DATE']).toISOString(),
                tpInspectionDueDate: new Date(item['TP INSPECTION DUE DATE']).toISOString(),
                projectId: project.id,
                location: project.name,
            };

            const existingItem = inventoryItems.find(i => i.serialNumber === parsedItem.serialNumber);
            if (existingItem) {
                updatedItems.set(existingItem.id, { ...existingItem, ...parsedItem, id: existingItem.id });
            } else {
                newItems.push(parsedItem);
            }
            importedCount++;
        } catch(e) {
            console.error(`Failed to process row ${index + 2}`, e);
        }
    });

    setInventoryItems(prev => {
        const afterUpdates = prev.map(item => updatedItems.get(item.id) || item);
        return [...afterUpdates, ...newItems];
    });

    return importedCount;
  }, [projects, inventoryItems]);
  
  const requestInventoryTransfer = useCallback((items: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => {
    if (!user) return;
    const newRequest: InventoryTransferRequest = {
        id: `inv-tr-${Date.now()}`,
        items,
        fromProjectId,
        toProjectId,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
    };
    setInventoryTransferRequests(prev => [newRequest, ...prev]);
  }, [user]);

  const addInventoryTransferComment = useCallback((requestId: string, commentText: string) => {
    if (!user) return;
     const newComment: Comment = { userId: user.id, text: commentText, date: new Date().toISOString() };
     setInventoryTransferRequests(prev => prev.map(req => req.id === requestId ? { ...req, comments: [...req.comments, newComment] } : req));
  }, [user]);

  const approveInventoryTransfer = useCallback((requestId: string, comment: string) => {
    addInventoryTransferComment(requestId, comment);
    setInventoryTransferRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Approved' } : req));
    const request = inventoryTransferRequests.find(r => r.id === requestId);
    if(request) {
        setInventoryItems(prevItems => prevItems.map(item => {
            if (request.items.some(i => i.id === item.id)) {
                return { ...item, projectId: request.toProjectId, location: projects.find(p => p.id === request.toProjectId)?.name || item.location };
            }
            return item;
        }));
    }
  }, [inventoryTransferRequests, projects, addInventoryTransferComment]);
  
  const rejectInventoryTransfer = useCallback((requestId: string, comment: string) => {
    addInventoryTransferComment(requestId, comment);
    setInventoryTransferRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Rejected' } : req));
  }, [addInventoryTransferComment]);

  const addCertificateRequest = useCallback((itemId: string, requestType: CertificateRequestType, comment: string) => {
    if (!user) return;
    const newRequest: CertificateRequest = {
      id: `cert-req-${Date.now()}`,
      itemId,
      requesterId: user.id,
      requestType,
      status: 'Pending',
      date: new Date().toISOString(),
      comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
    };
    setCertificateRequests(prev => [newRequest, ...prev]);
  }, [user]);

  const requestUTMachineCertificate = useCallback((machineId: string, requestType: CertificateRequestType, comment: string) => {
    if (!user) return;
    const newRequest: CertificateRequest = {
      id: `cert-req-${Date.now()}`,
      utMachineId: machineId,
      requesterId: user.id,
      requestType,
      status: 'Pending',
      date: new Date().toISOString(),
      comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
      isViewedByRequester: true,
    };
    setCertificateRequests(prev => [newRequest, ...prev]);
    recordAction(`Requested ${requestType} for UT Machine ID ${machineId}`);
  }, [user, recordAction]);

  const addCertificateRequestComment = useCallback((requestId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = { userId: user.id, text: commentText, date: new Date().toISOString() };
    setCertificateRequests(prev => prev.map(req => 
      req.id === requestId 
      ? { ...req, comments: [...req.comments, newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), isViewedByRequester: user.id !== req.requesterId ? false : true } 
      : req
    ));
  }, [user]);

  const fulfillCertificateRequest = useCallback((requestId: string, commentText: string) => {
      if (!user) return;
      const newComment: Comment = { 
        userId: user.id, 
        text: `Request fulfilled: ${commentText}`, 
        date: new Date().toISOString() 
      };

      setCertificateRequests(prev => prev.map(req => {
          if (req.id === requestId) {
              return {
                  ...req,
                  status: 'Fulfilled',
                  isViewedByRequester: user.id !== req.requesterId ? false : req.isViewedByRequester,
                  comments: [...req.comments, newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              }
          }
          return req;
      }));
      
      const request = certificateRequests.find(r => r.id === requestId);
      if (request) {
          recordAction(`Fulfilled certificate request for item ID ${request.itemId || request.utMachineId}`);
      }
  }, [user, recordAction, certificateRequests]);

  const acknowledgeFulfilledUTRequest = useCallback((requestId: string) => {
    if (!user) return;
    setCertificateRequests(prev => prev.filter(req => req.id !== requestId));
    recordAction(`Acknowledged fulfilled certificate request ID: ${requestId}`);
  }, [user, recordAction]);

  const markUTRequestsAsViewed = useCallback(() => {
    if (!user) return;
    setCertificateRequests(prev => prev.map(req => 
        (req.requesterId === user.id && req.utMachineId) ? { ...req, isViewedByRequester: true } : req
    ));
  }, [user]);

  const addManpowerLog = useCallback((logData: Omit<ManpowerLog, 'id' | 'date' | 'updatedBy'>) => {
    if (!user) return;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newLog: ManpowerLog = {
      ...logData,
      id: `mp-${logData.projectId}-${todayStr}`,
      date: todayStr,
      updatedBy: user.id,
    };
    setManpowerLogs(prev => {
        const otherLogs = prev.filter(l => !(l.date === todayStr && l.projectId === newLog.projectId));
        return [...otherLogs, newLog];
    });
  }, [user]);

  const addManpowerProfile = useCallback((profileData: Omit<ManpowerProfile, 'id'>) => {
    if (!user) return;
    const newProfile: ManpowerProfile = {
        ...profileData,
        id: `mpprof-${Date.now()}`
    };
    setManpowerProfiles(prev => [newProfile, ...prev]);
  }, [user]);
  
  const updateManpowerProfile = useCallback((profile: ManpowerProfile) => {
    if (!user) return;
    setManpowerProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  }, [user]);

  const deleteManpowerProfile = useCallback((profileId: string) => {
    setManpowerProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  const addUTMachine = useCallback((machineData: Omit<UTMachine, 'id' | 'usageLog'>) => {
    if (!user) return;
    const newMachine: UTMachine = {
        ...machineData,
        id: `ut-${Date.now()}`,
        usageLog: [],
    };
    setUtMachines(prev => [newMachine, ...prev]);
    recordAction(`Added new UT Machine: ${newMachine.machineName}`);
  }, [user, recordAction]);

  const updateUTMachine = useCallback((updatedMachine: UTMachine) => {
      if (!user) return;
      setUtMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
      recordAction(`Updated UT Machine: ${updatedMachine.machineName}`);
  }, [user, recordAction]);

  const addUTMachineLog = useCallback((machineId: string, logData: Omit<UTMachineUsageLog, 'id' | 'date' | 'loggedBy'>) => {
    if (!user) return;
    const newLog: UTMachineUsageLog = {
        ...logData,
        id: `utlog-${Date.now()}`,
        date: new Date().toISOString(),
        loggedBy: user.id,
    };
    setUtMachines(prev => prev.map(m => {
        if (m.id === machineId) {
            return { ...m, usageLog: [newLog, ...(m.usageLog || [])] };
        }
        return m;
    }));
    recordAction(`Added usage log for UT Machine ID: ${machineId}`);
  }, [user, recordAction]);

  const deleteUTMachine = useCallback((machineId: string) => {
      if (!user) return;
      const machineName = utMachines.find(m => m.id === machineId)?.machineName;
      setUtMachines(prev => prev.filter(m => m.id !== machineId));
      recordAction(`Deleted UT Machine: ${machineName}`);
  }, [user, utMachines, recordAction]);

  const addDftMachine = useCallback((machineData: Omit<DftMachine, 'id' | 'usageLog'>) => {
    if (!user) return;
    const newMachine: DftMachine = { ...machineData, id: `dft-${Date.now()}`, usageLog: [] };
    setDftMachines(prev => [newMachine, ...prev]);
    recordAction(`Added new DFT Machine: ${newMachine.machineName}`);
  }, [user, recordAction]);

  const updateDftMachine = useCallback((updatedMachine: DftMachine) => {
    if (!user) return;
    setDftMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
    recordAction(`Updated DFT Machine: ${updatedMachine.machineName}`);
  }, [user, recordAction]);

  const deleteDftMachine = useCallback((machineId: string) => {
    if (!user) return;
    const machineName = dftMachines.find(m => m.id === machineId)?.name;
    setDftMachines(prev => prev.filter(m => m.id !== machineId));
    recordAction(`Deleted DFT Machine: ${machineName}`);
  }, [user, dftMachines, recordAction]);

  const addMobileSim = useCallback((itemData: Omit<MobileSim, 'id'>) => {
    if (!user) return;
    const newItem: MobileSim = { ...itemData, id: `ms-${Date.now()}` };
    setMobileSims(prev => [newItem, ...prev]);
    recordAction(`Added new Mobile/SIM: ${newItem.number}`);
  }, [user, recordAction]);

  const updateMobileSim = useCallback((updatedItem: MobileSim) => {
    if (!user) return;
    setMobileSims(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    recordAction(`Updated Mobile/SIM: ${updatedItem.number}`);
  }, [user, recordAction]);

  const deleteMobileSim = useCallback((itemId: string) => {
    if (!user) return;
    const itemNumber = mobileSims.find(i => i.id === itemId)?.number;
    setMobileSims(prev => prev.filter(i => i.id !== itemId));
    recordAction(`Deleted Mobile/SIM: ${itemNumber}`);
  }, [user, mobileSims, recordAction]);

  const addOtherEquipment = useCallback((itemData: Omit<OtherEquipment, 'id'>) => {
    if (!user) return;
    const newItem: OtherEquipment = { ...itemData, id: `oe-${Date.now()}` };
    setOtherEquipments(prev => [newItem, ...prev]);
    recordAction(`Added new equipment: ${newItem.name}`);
  }, [user, recordAction]);

  const updateOtherEquipment = useCallback((updatedItem: OtherEquipment) => {
    if (!user) return;
    setOtherEquipments(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    recordAction(`Updated equipment: ${updatedItem.name}`);
  }, [user, recordAction]);

  const deleteOtherEquipment = useCallback((itemId: string) => {
    if (!user) return;
    const itemName = otherEquipments.find(i => i.id === itemId)?.name;
    setOtherEquipments(prev => prev.filter(i => i.id !== itemId));
    recordAction(`Deleted equipment: ${itemName}`);
  }, [user, otherEquipments, recordAction]);

  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id'>) => {
      if (!user) return;
      const newVehicle: Vehicle = {
          ...vehicleData,
          id: `vh-${Date.now()}`,
      };
      setVehicles(prev => [newVehicle, ...prev]);
      recordAction(`Added new vehicle: ${newVehicle.vehicleNumber}`);
  }, [user, recordAction]);

  const updateVehicle = useCallback((updatedVehicle: Vehicle) => {
      if (!user) return;
      setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
      recordAction(`Updated vehicle: ${updatedVehicle.vehicleNumber}`);
  }, [user, recordAction]);

  const deleteVehicle = useCallback((vehicleId: string) => {
      if (!user) return;
      const vehicleNumber = vehicles.find(v => v.id === vehicleId)?.vehicleNumber;
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      recordAction(`Deleted vehicle: ${vehicleNumber}`);
  }, [user, vehicles, recordAction]);

  const addDriver = useCallback((driverData: Omit<Driver, 'id'>) => {
    if (!user) return;
    const newDriver: Driver = { ...driverData, id: `drv-${Date.now()}` };
    setDrivers(prev => [newDriver, ...prev]);
    recordAction(`Added new driver: ${newDriver.name}`);
  }, [user, recordAction]);

  const updateDriver = useCallback((updatedDriver: Driver) => {
    if (!user) return;
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    recordAction(`Updated driver: ${updatedDriver.name}`);
  }, [user, recordAction]);

  const deleteDriver = useCallback((driverId: string) => {
    if (!user) return;
    const driverName = drivers.find(d => d.id === driverId)?.name;
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    // Also unassign from any vehicle
    setVehicles(prev => prev.map(v => v.driverId === driverId ? { ...v, driverId: undefined } : v));
    recordAction(`Deleted driver: ${driverName}`);
  }, [user, drivers, recordAction]);

  const addManagementRequest = useCallback((request: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isViewedByRecipient'>) => {
    if (!user) return;
    const newRequest: ManagementRequest = {
        ...request,
        id: `mreq-${Date.now()}`,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ id: 'c-mreq-1', userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRequester: true,
        isViewedByRecipient: false,
    };
    setManagementRequests(prev => [newRequest, ...prev]);
    recordAction(`Created management request: ${request.subject}`);
  }, [user, recordAction]);

  const updateManagementRequest = useCallback((updatedRequest: ManagementRequest) => {
      if (!user) return;
      const originalRequest = managementRequests.find(r => r.id === updatedRequest.id);
      
      setManagementRequests(prev => prev.map(r => {
          if (r.id === updatedRequest.id) {
              const isStatusChange = originalRequest && originalRequest.status !== updatedRequest.status;
              const isRecipientAction = user.id === r.recipientId;
              const isRequesterAction = user.id === r.requesterId;
              
              return {
                  ...updatedRequest,
                  isViewedByRecipient: isRequesterAction ? false : r.isViewedByRecipient,
                  isViewedByRequester: isRecipientAction ? false : r.isViewedByRequester,
              };
          }
          return r;
      }));
      recordAction(`Updated management request: ${updatedRequest.subject}`);
  }, [user, managementRequests, recordAction]);

  const addManagementRequestComment = useCallback((requestId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
        userId: user.id,
        text: commentText,
        date: new Date().toISOString(),
    };
    setManagementRequests(prev => prev.map(r => {
        if (r.id === requestId) {
            return {
                ...r,
                comments: [...(r.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                isViewedByRecipient: user.id === r.requesterId ? false : r.isViewedByRecipient,
                isViewedByRequester: user.id === r.recipientId ? false : r.isViewedByRequester,
            };
        }
        return r;
    }));
    const request = managementRequests.find(r => r.id === requestId);
    recordAction(`Commented on management request: ${request?.subject}`);
  }, [user, managementRequests, recordAction]);

  const markManagementRequestAsViewed = useCallback((requestId: string) => {
    if (!user) return;
    setManagementRequests(prev => prev.map(r => {
        if (r.id === requestId) {
            if (user.id === r.requesterId) return { ...r, isViewedByRequester: true };
            if (user.id === r.recipientId) return { ...r, isViewedByRecipient: true };
        }
        return r;
    }));
  }, [user]);

  const addAnnouncement = useCallback((announcement: Pick<Announcement, 'title' | 'content'>) => {
    if (!user) return;
    const supervisor = users.find(u => u.id === user.supervisorId);
    const admin = users.find(u => u.role === 'Admin');
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      creatorId: user.id,
      date: new Date().toISOString(),
      status: 'pending',
      approverId: supervisor?.id || admin?.id || '1',
      isViewed: [],
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    recordAction(`Submitted announcement: "${announcement.title}"`);
  }, [user, users, recordAction]);
  
  const approveAnnouncement = useCallback((announcementId: string) => {
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, status: 'approved' } : a));
  }, []);
  
  const returnAnnouncement = useCallback((announcementId: string, comment: string) => {
    if (!user) return;
    setAnnouncements(prev => prev.map(a => {
        if (a.id === announcementId) {
            return {
                ...a,
                status: 'rejected', // Or a new 'returned' status if needed
                comments: [...(a.comments || []), {
                    userId: user.id,
                    text: `Returned for modification: ${comment}`,
                    date: new Date().toISOString()
                }]
            }
        }
        return a;
    }));
  }, [user]);

  const updateAnnouncement = useCallback((announcement: Announcement) => {
    setAnnouncements(prev => prev.map(a => a.id === announcement.id ? announcement : a));
  }, []);

  const deleteAnnouncement = useCallback((announcementId: string) => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  }, []);
  
  const rejectAnnouncement = useCallback((announcementId: string) => {
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, status: 'rejected' } : a));
  }, []);

  const dismissAnnouncement = useCallback((announcementId: string) => {
    if (!user) return;
    setAnnouncements(prev => prev.map(a => 
      a.id === announcementId ? { ...a, isViewed: [...new Set([...a.isViewed, user.id])] } : a
    ));
  }, [user]);
  
  const addIncidentReport = useCallback((report: Omit<IncidentReport, 'id' | 'reporterId' | 'reportTime' | 'status' | 'comments' | 'reportedToUserIds' | 'isPublished' | 'projectLocation'>) => {
    if (!user) return;
    const project = projects.find(p => p.id === report.projectId);
    const supervisor = users.find(u => u.id === user.supervisorId);
    const hseUsers = users.filter(u => u.role === 'HSE').map(u => u.id);
    
    const initialReportedTo = new Set<string>();
    if(supervisor) initialReportedTo.add(supervisor.id);
    hseUsers.forEach(id => initialReportedTo.add(id));
    
    const newIncident: IncidentReport = {
        ...report,
        id: `inc-${Date.now()}`,
        reporterId: user.id,
        reportTime: new Date().toISOString(),
        projectLocation: project?.name || 'Unknown Project',
        status: 'New',
        comments: [{
            userId: user.id,
            text: `Incident reported by ${user.name}`,
            date: new Date().toISOString(),
        }],
        reportedToUserIds: Array.from(initialReportedTo),
        isPublished: false,
    };
    setIncidents(prev => [newIncident, ...prev]);
    recordAction(`Reported new incident`);
  }, [user, projects, users, recordAction]);

  const updateIncident = useCallback((incident: IncidentReport) => {
    setIncidents(prev => prev.map(i => i.id === incident.id ? incident : i));
    recordAction(`Updated incident ID: ${incident.id}`);
  }, [recordAction]);

  const addIncidentComment = useCallback((incidentId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = { userId: user.id, text: commentText, date: new Date().toISOString() };
    setIncidents(prev => prev.map(i => 
        i.id === incidentId 
        ? { ...i, comments: [...(i.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } 
        : i
    ));
    recordAction(`Commented on incident ID: ${incidentId}`);
  }, [user, recordAction]);

  const addUsersToIncidentReport = useCallback((incidentId: string, userIds: string[]) => {
    if (!user) return;
    setIncidents(prev => prev.map(i => {
        if (i.id === incidentId) {
            const addedUsers = users.filter(u => userIds.includes(u.id));
            const commentText = `${user.name} added ${addedUsers.map(u => u.name).join(', ')} to the report.`;
            const newComment: Comment = {
                userId: user.id,
                text: commentText,
                date: new Date().toISOString(),
            };
            const updatedReportedTo = [...new Set([...(i.reportedToUserIds || []), ...userIds])];
            return {
                ...i,
                reportedToUserIds: updatedReportedTo,
                comments: [...(i.comments || []), newComment],
            };
        }
        return i;
    }));
  }, [user, users]);
  
  const publishIncident = useCallback((incidentId: string) => {
    if (!user) return;
    const incident = incidents.find(i => i.id === incidentId);
    if(!incident) return;

    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, isPublished: true } : i));
    
    // Create an announcement for the published incident
    const newAnnouncement: Announcement = {
      id: `ann-inc-${incident.id}`,
      creatorId: user.id,
      approverId: user.id, // Auto-approved by the publisher
      title: `Incident Report Published: ${incident.projectLocation}`,
      content: `An incident reported on ${format(new Date(incident.reportTime), 'PPP')} has been published for general awareness. Details:\n\n${incident.incidentDetails}`,
      date: new Date().toISOString(),
      status: 'approved',
      isViewed: [],
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);

    recordAction(`Published incident ID: ${incidentId}`);
  }, [user, recordAction, incidents]);
  
  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const pendingStoreRequestCount = useMemo(() => {
    if (!user) return 0;
    const isStorePersonnel = ['Store in Charge', 'Assistant Store Incharge'].includes(user.role);
    const isAdminOrManager = ['Admin', 'Manager'].includes(user.role);

    if (isAdminOrManager) {
        return internalRequests.filter(r => r.status === 'Pending' && r.forwardedTo).length;
    }
    if (isStorePersonnel) {
        return internalRequests.filter(r => r.status === 'Pending' && !r.forwardedTo).length;
    }
    return 0;
  }, [internalRequests, user]);

  const myRequestUpdateCount = useMemo(() => {
    if (!user) return 0;
    return internalRequests.filter(r => r.requesterId === user.id && !r.isViewedByRequester).length;
  }, [internalRequests, user]);
  
  const pendingCertificateRequestCount = useMemo(() => {
    return certificateRequests.filter(r => r.status === 'Pending').length;
  }, [certificateRequests]);

  const myCertificateRequestUpdateCount = useMemo(() => {
    if (!user) return 0;
    return certificateRequests.filter(r => r.requesterId === user.id && r.utMachineId && r.isViewedByRequester === false).length;
  }, [certificateRequests, user]);

  const myFulfilledUTRequests = useMemo(() => {
    if (!user) return [];
    return certificateRequests.filter(r => r.requesterId === user.id && r.status === 'Fulfilled' && r.utMachineId);
  }, [certificateRequests, user]);

  const canManageVehicles = useMemo(() => {
    if (!user) return false;
    const userRole = roles.find(r => r.name === user.role);
    return userRole?.permissions.includes('manage_vehicles') ?? false;
  }, [user, roles]);
  
  const canManageUtMachines = useMemo(() => {
    if (!user) return false;
    const userRole = roles.find(r => r.name === user.role);
    return userRole?.permissions.includes('manage_ut_machines') ?? false;
  }, [user, roles]);
  
  const canManageManpowerList = useMemo(() => {
    if (!user) return false;
    const userRole = roles.find(r => r.name === user.role);
    return userRole?.permissions.includes('manage_manpower_list');
  }, [user, roles]);

  const expiringVehicleDocsCount = useMemo(() => {
    if (!canManageVehicles) return 0;
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return vehicles.filter(v => {
        const vapDate = v.vapValidity ? new Date(v.vapValidity) : null;
        const sdpDate = v.sdpValidity ? new Date(v.sdpValidity) : null;
        const epDate = v.epValidity ? new Date(v.epValidity) : null;
        const isExpiring = (vapDate && isBefore(vapDate, thirtyDaysFromNow)) ||
                           (sdpDate && isBefore(sdpDate, thirtyDaysFromNow)) ||
                           (epDate && isBefore(epDate, thirtyDaysFromNow));
        return isExpiring;
    }).length;
  }, [vehicles, canManageVehicles]);
  
   const expiringDriverDocsCount = useMemo(() => {
    if (!canManageVehicles) return 0;
    const thirtyDaysFromNow = addDays(new Date(), 30);
    const expiringDrivers = new Set<string>();

    drivers.forEach(d => {
        const datesToCheck = [
            d.epExpiry, d.medicalExpiry, d.safetyExpiry, d.sdpExpiry,
            d.woExpiry, d.labourContractExpiry, d.wcPolicyExpiry,
        ];
        
        datesToCheck.forEach(dateStr => {
            if (dateStr) {
                const date = new Date(dateStr);
                if (isBefore(date, thirtyDaysFromNow)) {
                    expiringDrivers.add(d.id);
                }
            }
        });
    });
    return expiringDrivers.size;
  }, [drivers, canManageVehicles]);

  const expiringUtMachineCalibrationsCount = useMemo(() => {
    if (!canManageUtMachines) return 0;
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return utMachines.filter(m => isBefore(new Date(m.calibrationDueDate), thirtyDaysFromNow)).length;
  }, [utMachines, canManageUtMachines]);
  
  const expiringManpowerCount = useMemo(() => {
    if (!canManageManpowerList) return 0;
    const thirtyDaysFromNow = addDays(new Date(), 30);
    const expiringProfiles = new Set<string>();

    manpowerProfiles.forEach(p => {
        const datesToCheck = [
            p.passIssueDate, p.woValidity, p.wcPolicyValidity, 
            p.labourContractValidity, p.medicalExpiryDate, 
            p.safetyExpiryDate, p.irataValidity, p.contractValidity
        ];
        
        datesToCheck.forEach(dateStr => {
            if (dateStr) {
                const date = new Date(dateStr);
                if (isBefore(date, thirtyDaysFromNow)) {
                    expiringProfiles.add(p.id);
                }
            }
        });
    });
    return expiringProfiles.size;
  }, [manpowerProfiles, canManageManpowerList]);


  const pendingTaskApprovalCount = useMemo(() => {
    if (!user) return 0;
    return tasks.filter(task => {
        if (task.status !== 'Pending Approval') return false;

        const assignee = users.find(u => u.id === task.assigneeId);
        if (!assignee) return false;

        if (task.assigneeId === user.id) return false;

        const isCreator = task.creatorId === user.id;
        const isSupervisor = assignee.supervisorId === user.id;
        
        return isCreator || isSupervisor;
    }).length;
  }, [tasks, user, users]);

  const myNewTaskCount = useMemo(() => {
    if (!user) return 0;
    return tasks.filter(task => task.assigneeId === user.id && !task.isViewedByAssignee).length;
  }, [tasks, user]);

  const workingManpowerCount = useMemo(() => manpowerProfiles.filter(p => p.status === 'Working').length, [manpowerProfiles]);
  const onLeaveManpowerCount = useMemo(() => manpowerProfiles.filter(p => p.status === 'On Leave').length, [manpowerProfiles]);

  const myUnreadManagementRequestCount = useMemo(() => {
    if (!user) return 0;
    return managementRequests.filter(r => r.requesterId === user.id && !r.isViewedByRequester).length;
  }, [managementRequests, user]);
  
  const unreadManagementRequestCountForMe = useMemo(() => {
    if (!user) return 0;
    return managementRequests.filter(r => r.recipientId === user.id && !r.isViewedByRecipient).length;
  }, [managementRequests, user]);
  
  const pendingAnnouncementCount = useMemo(() => {
      if (!user) return 0;
      return announcements.filter(a => a.approverId === user.id && a.status === 'pending').length;
  }, [announcements, user]);

  const unreadAnnouncementCount = useMemo(() => {
      if (!user) return 0;
      return approvedAnnouncements.filter(a => !a.isViewed.includes(user.id)).length;
  }, [approvedAnnouncements, user]);
  
  const newIncidentCount = useMemo(() => {
    if (!user) return 0;
    return incidents.filter(i => {
      if (i.status !== 'New') return false;
      return (i.reportedToUserIds || []).includes(user.id);
    }).length;
  }, [incidents, user]);

  const value = {
    user,
    users,
    roles,
    tasks,
    projects,
    inventoryItems,
    inventoryTransferRequests,
    certificateRequests,
    plannerEvents,
    dailyPlannerComments,
    achievements,
    activityLogs,
    manpowerLogs,
    manpowerProfiles,
    utMachines,
    dftMachines,
    mobileSims,
    otherEquipments,
    vehicles,
    drivers,
    appName,
    appLogo,
    internalRequests,
    managementRequests,
    announcements,
    incidents,
    approvedAnnouncements,
    pendingAnnouncementCount,
    unreadAnnouncementCount,
    newIncidentCount,
    myUnreadManagementRequestCount,
    unreadManagementRequestCountForMe,
    pendingStoreRequestCount,
    myRequestUpdateCount,
    pendingCertificateRequestCount,
    myCertificateRequestUpdateCount,
    myFulfilledUTRequests,
    workingManpowerCount,
    onLeaveManpowerCount,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addPlannerEvent,
    updatePlannerEvent,
    deletePlannerEvent,
    getExpandedPlannerEvents,
    getVisibleUsers,
    addUser,
    updateUser,
    updateUserPlanningScore,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    addProject,
    updateProject,
    deleteProject,
    updateProfile,
    requestTaskStatusChange,
    approveTaskStatusChange,
    returnTaskStatusChange,
    requestTaskReassignment,
    addComment,
    markTaskAsViewed,
    addManualAchievement,
    approveAchievement,
    rejectAchievement,
    updateManualAchievement,
    deleteManualAchievement,
    addPlannerEventComment,
    addDailyPlannerComment,
    updateDailyPlannerComment,
    deleteDailyPlannerComment,
    deleteAllDailyPlannerComments,
    updateBranding,
    addInternalRequest,
    updateInternalRequest,
    deleteInternalRequest,
    addInternalRequestComment,
    markRequestAsViewed,
    forwardInternalRequest,
    escalateInternalRequest,
    createPpeRequestTask,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addMultipleInventoryItems,
    requestInventoryTransfer,
    approveInventoryTransfer,
    rejectInventoryTransfer,
    addCertificateRequest,
    requestUTMachineCertificate,
    addCertificateRequestComment,
    fulfillCertificateRequest,
    markUTRequestsAsViewed,
    acknowledgeFulfilledUTRequest,
    addManpowerLog,
    addManpowerProfile,
    updateManpowerProfile,
    deleteManpowerProfile,
    addUTMachine,
    updateUTMachine,
    deleteUTMachine,
    addUTMachineLog,
    addDftMachine,
    updateDftMachine,
    deleteDftMachine,
    addMobileSim,
    updateMobileSim,
    deleteMobileSim,
    addOtherEquipment,
    updateOtherEquipment,
    deleteOtherEquipment,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    deleteDriver,
    addManagementRequest,
    updateManagementRequest,
    addManagementRequestComment,
    markManagementRequestAsViewed,
    addAnnouncement,
    approveAnnouncement,
    rejectAnnouncement,
    returnAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    dismissAnnouncement,
    addIncidentReport,
    updateIncident,
    addIncidentComment,
    addUsersToIncidentReport,
    publishIncident,
    expiringVehicleDocsCount,
    expiringDriverDocsCount,
    expiringUtMachineCalibrationsCount,
    expiringManpowerCount,
    pendingTaskApprovalCount,
    myNewTaskCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}

    