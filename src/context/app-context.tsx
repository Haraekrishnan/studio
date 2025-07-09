'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS } from '@/lib/mock-data';
import { addDays, isBefore, addMonths, eachDayOfInterval, endOfMonth, isMatch, isSameDay, isWeekend, startOfMonth, differenceInMinutes, format, differenceInDays } from 'date-fns';

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
  appName: string;
  appLogo: string | null;
  internalRequests: InternalRequest[];
  managementRequests: ManagementRequest[];
  pendingStoreRequestCount: number;
  myRequestUpdateCount: number;
  pendingCertificateRequestCount: number;
  myCertificateRequestUpdateCount: number;
  myFulfilledUTRequests: CertificateRequest[];
  workingManpowerCount: number;
  onLeaveManpowerCount: number;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'isViewedByAssignee' | 'completionDate'>) => void;
  deleteTask: (taskId: string) => void;
  addPlannerEvent: (event: Omit<PlannerEvent, 'id' | 'comments'>) => void;
  getExpandedPlannerEvents: (date: Date, userId: string) => (PlannerEvent & { eventDate: Date })[];
  getVisibleUsers: () => User[];
  addUser: (newUser: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (updatedUser: User) => void;
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
  addComment: (taskId: string, commentText: string) => void;
  markTaskAsViewed: (taskId: string) => void;
  addManualAchievement: (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => void;
  approveAchievement: (achievementId: string, points: number) => void;
  rejectAchievement: (achievementId: string) => void;
  updateManualAchievement: (achievement: Achievement) => void;
  deleteManualAchievement: (achievementId: string) => void;
  addPlannerEventComment: (eventId: string, commentText: string) => void;
  addDailyPlannerComment: (plannerUserId: string, date: Date, commentText: string) => void;
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
  addMultipleInventoryItems: (items: any[]) => void;
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
  addManagementRequest: (request: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isViewedByRecipient'>) => void;
  updateManagementRequest: (updatedRequest: ManagementRequest) => void;
  addManagementRequestComment: (requestId: string, commentText: string) => void;
  markManagementRequestAsViewed: (requestId: string) => void;
  expiringVehicleDocsCount: number;
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
  const [internalRequests, setInternalRequests] = useState<InternalRequest[]>(INTERNAL_REQUESTS);
  const [managementRequests, setManagementRequests] = useState<ManagementRequest[]>(MANAGEMENT_REQUESTS);
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
        const updatedTasks = prevTasks.map(t => {
            if (t.id === taskId) {
                const updatedComments = t.comments ? [...t.comments, newComment] : [newComment];
                return { ...t, comments: updatedComments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
            }
            return t;
        });
        return updatedTasks;
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

    addComment(taskId, `Status change requested to "${newStatus}": ${commentText}`);
    const updatedTask = {
      ...task,
      previousStatus: task.status,
      pendingStatus: newStatus,
      approvalState: 'pending' as ApprovalState,
      status: 'Pending Approval' as TaskStatus,
      attachment: attachment || task.attachment,
    };
    updateTask(updatedTask);
    recordAction(`Requested status change to "${newStatus}" for task: "${task.title}"`);
    return true;
  }, [tasks, user, addComment, updateTask, recordAction]);
  
  const approveTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    addComment(taskId, `Request Approved: ${commentText}`);
    
    let updatedTask: Partial<Task>;

    if (task.pendingAssigneeId) { // It's a reassignment request
        const newAssignee = users.find(u => u.id === task.pendingAssigneeId);
        updatedTask = {
            assigneeId: task.pendingAssigneeId,
            status: task.previousStatus || 'To Do',
            pendingAssigneeId: undefined,
            previousStatus: undefined,
            approvalState: 'none',
            isViewedByAssignee: false,
        };
        recordAction(`Approved reassignment of task "${task.title}" to ${newAssignee?.name}`);
    } else if (task.pendingStatus) { // It's a status change request
        const isCompleting = task.pendingStatus === 'Completed';
        updatedTask = {
            status: task.pendingStatus,
            completionDate: isCompleting ? new Date().toISOString() : task.completionDate,
            pendingStatus: undefined,
            previousStatus: undefined,
            approvalState: 'approved',
        };
        recordAction(`Approved status change for task: "${task.title}"`);
    } else {
        return; // Nothing to approve
    }
    
    updateTask({ ...task, ...updatedTask });
  }, [tasks, users, addComment, updateTask, recordAction]);
  
  const returnTaskStatusChange = useCallback((taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    addComment(taskId, `Request Returned: ${commentText}`);
    
    let updatedTask: Partial<Task>;

    if (task.pendingAssigneeId) { // It's a reassignment request being returned
        updatedTask = {
            status: task.previousStatus || 'To Do',
            pendingAssigneeId: undefined,
            previousStatus: undefined,
            approvalState: 'returned',
        };
        recordAction(`Returned (rejected) reassignment of task "${task.title}"`);
    } else if (task.pendingStatus) { // It's a status change request being returned
        updatedTask = {
            status: task.previousStatus || 'In Progress',
            pendingStatus: undefined,
            previousStatus: undefined,
            approvalState: 'returned',
        };
        recordAction(`Returned task "${task.title}" to status "${updatedTask.status}"`);
    } else {
        return;
    }

    updateTask({ ...task, ...updatedTask });
  }, [tasks, addComment, updateTask, recordAction]);

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

  const addUser = useCallback((newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
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
      comments: [{ userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
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
  
  const addMultipleInventoryItems = useCallback((items: any[]) => {
      const newItems: InventoryItem[] = items.map((item, index) => ({
        id: `inv-import-${Date.now()}-${index}`,
        name: item.name,
        serialNumber: item.serialNumber,
        chestCrollNo: item.chestCrollNo,
        ariesId: item.ariesId,
        status: item.status,
        projectId: projects.find(p => p.name.toLowerCase() === item.location?.toLowerCase())?.id || '',
        location: item.location,
        inspectionDate: new Date(item.inspectionDate).toISOString(),
        inspectionDueDate: new Date(item.inspectionDueDate).toISOString(),
        tpInspectionDueDate: new Date(item.tpInspectionDueDate).toISOString(),
      }));
      setInventoryItems(prev => [...prev, ...newItems]);
  }, [projects]);
  
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
    const machineName = dftMachines.find(m => m.id === machineId)?.machineName;
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

  const addManagementRequest = useCallback((request: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester' | 'isViewedByRecipient'>) => {
    if (!user) return;
    const newRequest: ManagementRequest = {
        ...request,
        id: `mreq-${Date.now()}`,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
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
        const vapDate = new Date(v.vapValidity);
        const sdpDate = new Date(v.sdpValidity);
        const epDate = new Date(v.epValidity);
        const isExpiring = isBefore(vapDate, thirtyDaysFromNow) ||
                           isBefore(sdpDate, thirtyDaysFromNow) ||
                           isBefore(epDate, thirtyDaysFromNow);
        return isExpiring;
    }).length;
  }, [vehicles, canManageVehicles]);

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
    appName,
    appLogo,
    internalRequests,
    managementRequests,
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
    getExpandedPlannerEvents,
    getVisibleUsers,
    addUser,
    updateUser,
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
    addComment,
    markTaskAsViewed,
    addManualAchievement,
    approveAchievement,
    rejectAchievement,
    updateManualAchievement,
    deleteManualAchievement,
    addPlannerEventComment,
    addDailyPlannerComment,
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
    addManagementRequest,
    updateManagementRequest,
    addManagementRequestComment,
    markManagementRequestAsViewed,
    expiringVehicleDocsCount,
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
