
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { User, Task, PlannerEvent, Comment, Role, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '../lib/types';
import { useAuth } from '@/hooks/use-auth';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { USERS, TASKS, PLANNER_EVENTS, DAILY_PLANNER_COMMENTS, ACHIEVEMENTS, ACTIVITY_LOGS, ROLES, INTERNAL_REQUESTS, PROJECTS, INVENTORY_ITEMS, INVENTORY_TRANSFER_REQUESTS, CERTIFICATE_REQUESTS, MANPOWER_LOGS, UT_MACHINES, VEHICLES, MANPOWER_PROFILES, MANAGEMENT_REQUESTS, DFT_MACHINES, MOBILE_SIMS, OTHER_EQUIPMENTS, DRIVERS, ANNOUNCEMENTS, INCIDENTS } from '../lib/mock-data';

interface AppContextType {
  // Directly managed state from local storage or mock data
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
  const { user } = useAuth();
  
  const [users, setUsers] = useLocalStorage<User[]>('users', USERS);
  const [roles, setRoles] = useLocalStorage<RoleDefinition[]>('roles', ROLES);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', TASKS);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', PROJECTS);
  const [inventoryItems, setInventoryItems] = useLocalStorage<InventoryItem[]>('inventoryItems', INVENTORY_ITEMS);
  const [inventoryTransferRequests, setInventoryTransferRequests] = useLocalStorage<InventoryTransferRequest[]>('inventoryTransferRequests', INVENTORY_TRANSFER_REQUESTS);
  const [certificateRequests, setCertificateRequests] = useLocalStorage<CertificateRequest[]>('certificateRequests', CERTIFICATE_REQUESTS);
  const [plannerEvents, setPlannerEvents] = useLocalStorage<PlannerEvent[]>('plannerEvents', PLANNER_EVENTS);
  const [dailyPlannerComments, setDailyPlannerComments] = useLocalStorage<DailyPlannerComment[]>('dailyPlannerComments', DAILY_PLANNER_COMMENTS);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', ACHIEVEMENTS);
  const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('activityLogs', ACTIVITY_LOGS);
  const [manpowerLogs, setManpowerLogs] = useLocalStorage<ManpowerLog[]>('manpowerLogs', MANPOWER_LOGS);
  const [manpowerProfiles, setManpowerProfiles] = useLocalStorage<ManpowerProfile[]>('manpowerProfiles', MANPOWER_PROFILES);
  const [utMachines, setUtMachines] = useLocalStorage<UTMachine[]>('utMachines', UT_MACHINES);
  const [dftMachines, setDftMachines] = useLocalStorage<DftMachine[]>('dftMachines', DFT_MACHINES);
  const [mobileSims, setMobileSims] = useLocalStorage<MobileSim[]>('mobileSims', MOBILE_SIMS);
  const [otherEquipments, setOtherEquipments] = useLocalStorage<OtherEquipment[]>('otherEquipments', OTHER_EQUIPMENTS);
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('vehicles', VEHICLES);
  const [drivers, setDrivers] = useLocalStorage<Driver[]>('drivers', DRIVERS);
  const [internalRequests, setInternalRequests] = useLocalStorage<InternalRequest[]>('internalRequests', INTERNAL_REQUESTS);
  const [managementRequests, setManagementRequests] = useLocalStorage<ManagementRequest[]>('managementRequests', MANAGEMENT_REQUESTS);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', ANNOUNCEMENTS);
  const [incidents, setIncidents] = useLocalStorage<IncidentReport[]>('incidents', INCIDENTS);
  
  const [appName, setAppName] = useLocalStorage<string>('appName', 'Aries Marine');
  const [appLogo, setAppLogo] = useLocalStorage<string | null>('appLogo', null);
  
  const isDataLoading = false; // No async loading with local storage

  const getVisibleUsers = useCallback(() => {
    if (!user) return [];

    const userRoleDef = roles.find(r => r.name === user.role);
    if (!userRoleDef) return [user];

    if (userRoleDef.permissions.includes('view_all_users')) return users;
    if (userRoleDef.permissions.includes('view_subordinates_users')) {
      const subordinates = users.filter(u => u.supervisorId === user.id);
      const subIds = subordinates.map(s => s.id);
      const subSubordinates = users.filter(u => u.supervisorId && subIds.includes(u.supervisorId));
      return [user, ...subordinates, ...subSubordinates];
    }
    return [user];
  }, [user, users, roles]);


  const updateBranding = useCallback((name: string, logo: string | null) => {
    setAppName(name);
    setAppLogo(logo);
  }, [setAppName, setAppLogo]);
  
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
  
  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const myFulfilledUTRequests = useMemo(() => {
    if (!user) return [];
    return certificateRequests.filter(req => req.requesterId === user.id && req.status === 'Fulfilled' && !req.isViewedByRequester);
  }, [certificateRequests, user]);
  
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
  };
  
  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  const updateProfile = (name: string, email: string, avatar: string) => {
    if (user) {
        const updatedUser = { ...user, name, email, avatar };
        updateUser(updatedUser);
    }
  };

  const updateUserPlanningScore = (userId: string, score: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, planningScore: score } : u));
  };

  const addRole = (roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole: RoleDefinition = { ...roleData, id: `role-${Date.now()}`, isEditable: true };
    setRoles(prev => [...prev, newRole]);
  };
  
  const updateRole = (updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };
  
  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const addProject = (projectName: string) => {
    const newProject: Project = { id: `proj-${Date.now()}`, name: projectName };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };
  
  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'isViewedByAssignee' | 'approvalState' | 'comments'>) => {
    const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        status: 'To Do',
        isViewedByAssignee: false,
        approvalState: 'none',
        comments: [],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const addComment = (taskId: string, text: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment] } : t));
  };

  const requestTaskStatusChange = (taskId: string, newStatus: TaskStatus, comment: string, attachment?: Task['attachment']) => {
    if(!user) return;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newComment: Comment = { userId: user.id, text: `Status change to ${newStatus} requested: ${comment}`, date: new Date().toISOString()};
        const updatedTask = {
          ...t,
          status: 'Pending Approval',
          previousStatus: t.status,
          pendingStatus: newStatus,
          approvalState: 'pending',
          comments: [...(t.comments || []), newComment]
        };
        if (attachment) {
          updatedTask.attachment = attachment;
        }
        return updatedTask;
      }
      return t;
    }));
  };
  
  const approveTaskStatusChange = (taskId: string, comment: string) => {
    if(!user) return;
    setTasks(prev => prev.map(t => {
        if (t.id === taskId && t.pendingStatus) {
            const finalStatus = t.pendingStatus;
            const newAssigneeId = t.pendingAssigneeId || t.assigneeId;

            return {
                ...t,
                status: finalStatus,
                completionDate: finalStatus === 'Completed' ? new Date().toISOString() : t.completionDate,
                approvalState: 'approved',
                assigneeId: newAssigneeId,
                pendingStatus: undefined,
                previousStatus: undefined,
                pendingAssigneeId: undefined,
                comments: [...(t.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Request Approved: ${comment}`, date: new Date().toISOString() }]
            };
        }
        return t;
    }));
  };
  
  const returnTaskStatusChange = (taskId: string, comment: string) => {
    if(!user) return;
    setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
            return {
                ...t,
                status: t.previousStatus || t.status,
                approvalState: 'returned',
                pendingStatus: undefined,
                previousStatus: undefined,
                pendingAssigneeId: undefined,
                comments: [...(t.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Request Returned: ${comment}`, date: new Date().toISOString() }]
            };
        }
        return t;
    }));
  };

  const markTaskAsViewed = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isViewedByAssignee: true } : t));
  };
  
  const requestTaskReassignment = (taskId: string, newAssigneeId: string, comment: string) => {
    if(!user) return;
    setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
            return {
                ...t,
                status: 'Pending Approval',
                approvalState: 'pending',
                previousStatus: t.status,
                pendingAssigneeId: newAssigneeId,
                comments: [...(t.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Reassignment requested to ${users.find(u => u.id === newAssigneeId)?.name}: ${comment}`, date: new Date().toISOString() }]
            };
        }
        return t;
    }));
  };
  
  const addManpowerProfile = (data: Omit<ManpowerProfile, 'id'>) => {
    const newProfile: ManpowerProfile = { ...data, id: `mpp-${Date.now()}` };
    setManpowerProfiles(prev => [...prev, newProfile]);
  };

  const updateManpowerProfile = (updatedProfile: ManpowerProfile) => {
    setManpowerProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const deleteManpowerProfile = (profileId: string) => {
    setManpowerProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const addManpowerLog = (logData: Omit<ManpowerLog, 'id' | 'date' | 'updatedBy'>) => {
    if(!user) return;
    const newLog: ManpowerLog = {
        ...logData,
        id: `mplog-${Date.now()}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        updatedBy: user.id
    };
    setManpowerLogs(prev => [...prev, newLog]);
  };
  
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...itemData, id: `inv-${Date.now()}` };
    setInventoryItems(prev => [...prev, newItem]);
  };
  
  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  
  const deleteInventoryItem = (itemId: string) => {
    setInventoryItems(prev => prev.filter(i => i.id !== itemId));
  };

  const addMultipleInventoryItems = (items: any[]) => {
    const newItems: InventoryItem[] = [];
    let updatedCount = 0;

    const updatedExistingItems = inventoryItems.map(existingItem => {
        const matchingNewItem = items.find(newItem => newItem['SERIAL NUMBER'] === existingItem.serialNumber);
        if (matchingNewItem) {
            updatedCount++;
            const location = projects.find(p => p.name === matchingNewItem['PROJECT']);
            return {
                ...existingItem,
                name: matchingNewItem['ITEM NAME'] || 'Unknown',
                chestCrollNo: matchingNewItem['CHEST CROLL NO'] || existingItem.chestCrollNo,
                ariesId: matchingNewItem['ARIES ID'] || existingItem.ariesId,
                status: matchingNewItem['STATUS'] || existingItem.status,
                inspectionDate: matchingNewItem['INSPECTION DATE'] instanceof Date ? matchingNewItem['INSPECTION DATE'].toISOString() : existingItem.inspectionDate,
                inspectionDueDate: matchingNewItem['INSPECTION DUE DATE'] instanceof Date ? matchingNewItem['INSPECTION DUE DATE'].toISOString() : existingItem.inspectionDueDate,
                tpInspectionDueDate: matchingNewItem['TP INSPECTION DUE DATE'] instanceof Date ? matchingNewItem['TP INSPECTION DUE DATE'].toISOString() : existingItem.tpInspectionDueDate,
                location: location?.name || existingItem.location,
                projectId: location?.id || existingItem.projectId,
            };
        }
        return existingItem;
    });

    items.forEach(newItem => {
        const serialNumber = newItem['SERIAL NUMBER'];
        if (serialNumber && !inventoryItems.some(i => i.serialNumber === serialNumber)) {
            const location = projects.find(p => p.name === newItem['PROJECT']);
            newItems.push({
                id: `inv-${Date.now()}-${newItems.length}`,
                name: newItem['ITEM NAME'] || 'Unknown',
                serialNumber: serialNumber,
                chestCrollNo: newItem['CHEST CROLL NO'] || '',
                ariesId: newItem['ARIES ID'] || '',
                status: newItem['STATUS'] || 'In Store',
                inspectionDate: newItem['INSPECTION DATE'] instanceof Date ? newItem['INSPECTION DATE'].toISOString() : new Date().toISOString(),
                inspectionDueDate: newItem['INSPECTION DUE DATE'] instanceof Date ? newItem['INSPECTION DUE DATE'].toISOString() : new Date().toISOString(),
                tpInspectionDueDate: newItem['TP INSPECTION DUE DATE'] instanceof Date ? newItem['TP INSPECTION DUE DATE'].toISOString() : new Date().toISOString(),
                location: location?.name || 'Head Office',
                projectId: location?.id || projects.find(p => p.name === 'Head Office')?.id || '',
            });
        }
    });

    setInventoryItems([...updatedExistingItems, ...newItems]);
    return newItems.length + updatedCount;
  };

  const requestInventoryTransfer = (itemsToTransfer: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => {
    if(!user) return;
    const newRequest: InventoryTransferRequest = {
        id: `transfer-${Date.now()}`,
        items: itemsToTransfer,
        fromProjectId,
        toProjectId,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
    };
    setInventoryTransferRequests(prev => [...prev, newRequest]);
  };
  
  const addInventoryTransferComment = (requestId: string, text: string) => {
    if(!user) return;
    setInventoryTransferRequests(prev => prev.map(r => r.id === requestId ? { ...r, comments: [...r.comments, { userId: user.id, text, date: new Date().toISOString() }] } : r));
  };
  
  const approveInventoryTransfer = (requestId: string, comment: string) => {
    const request = inventoryTransferRequests.find(r => r.id === requestId);
    if (!request) return;

    // Move items
    const updatedItems = inventoryItems.map(item => {
        if (request.items.some(reqItem => reqItem.id === item.id)) {
            return { ...item, projectId: request.toProjectId, location: projects.find(p => p.id === request.toProjectId)?.name || 'Unknown' };
        }
        return item;
    });
    setInventoryItems(updatedItems);
    
    // Update request
    addInventoryTransferComment(requestId, `Approved: ${comment}`);
    setInventoryTransferRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
  };
  
  const rejectInventoryTransfer = (requestId: string, comment: string) => {
     addInventoryTransferComment(requestId, `Rejected: ${comment}`);
     setInventoryTransferRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
  };

  const addCertificateRequest = (itemId: string, requestType: CertificateRequestType, comment: string) => {
    if(!user) return;
    const newRequest: CertificateRequest = {
        id: `cert-${Date.now()}`,
        itemId: itemId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    };
    setCertificateRequests(prev => [...prev, newRequest]);
  };
  
  const addUTMachine = (data: Omit<UTMachine, 'id' | 'usageLog'>) => {
    const newMachine: UTMachine = { ...data, id: `ut-${Date.now()}`, usageLog: [] };
    setUtMachines(prev => [...prev, newMachine]);
  };

  const updateUTMachine = (updatedMachine: UTMachine) => {
    setUtMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
  };
  
  const deleteUTMachine = (machineId: string) => {
    setUtMachines(prev => prev.filter(m => m.id !== machineId));
  };

  const addUTMachineLog = (machineId: string, logData: Omit<UTMachineUsageLog, 'id' | 'date' | 'loggedBy'>) => {
    if(!user) return;
    const newLog: UTMachineUsageLog = {
      ...logData,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      loggedBy: user.id,
    };
    setUtMachines(prev => prev.map(m => m.id === machineId ? { ...m, usageLog: [...(m.usageLog || []), newLog] } : m));
  };

  const requestUTMachineCertificate = (machineId: string, requestType: CertificateRequestType, comment: string) => {
     if(!user) return;
    const newRequest: CertificateRequest = {
        id: `cert-${Date.now()}`,
        utMachineId: machineId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    };
    setCertificateRequests(prev => [...prev, newRequest]);
  };
  
  const fulfillCertificateRequest = (requestId: string, comment: string) => {
    if(!user) return;
    setCertificateRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Fulfilled', isViewedByRequester: false, comments: [...r.comments, { userId: user.id, text: `Fulfilled: ${comment}`, date: new Date().toISOString() }] } : r));
  };

  const addCertificateRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    setCertificateRequests(prev => prev.map(r => r.id === requestId ? { ...r, comments: [...r.comments, { userId: user.id, text, date: new Date().toISOString() }] } : r));
  };
  
  const acknowledgeFulfilledUTRequest = (requestId: string) => {
    setCertificateRequests(prev => prev.map(r => r.id === requestId ? { ...r, isViewedByRequester: true } : r));
  };

  const addDftMachine = (data: Omit<DftMachine, 'id' | 'usageLog'>) => {
    const newMachine: DftMachine = { ...data, id: `dft-${Date.now()}`, usageLog: [] };
    setDftMachines(prev => [...prev, newMachine]);
  };
  const updateDftMachine = (updatedMachine: DftMachine) => {
    setDftMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
  };
  const deleteDftMachine = (machineId: string) => {
    setDftMachines(prev => prev.filter(m => m.id !== machineId));
  };

  const addMobileSim = (data: Omit<MobileSim, 'id'>) => {
    const newItem: MobileSim = { ...data, id: `ms-${Date.now()}` };
    setMobileSims(prev => [...prev, newItem]);
  };
  const updateMobileSim = (updatedItem: MobileSim) => {
    setMobileSims(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const deleteMobileSim = (itemId: string) => {
    setMobileSims(prev => prev.filter(i => i.id !== itemId));
  };

  const addOtherEquipment = (data: Omit<OtherEquipment, 'id'>) => {
    const newItem: OtherEquipment = { ...data, id: `oe-${Date.now()}` };
    setOtherEquipments(prev => [...prev, newItem]);
  };
  const updateOtherEquipment = (updatedItem: OtherEquipment) => {
    setOtherEquipments(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const deleteOtherEquipment = (itemId: string) => {
    setOtherEquipments(prev => prev.filter(i => i.id !== itemId));
  };
  
  const addDriver = (data: Omit<Driver, 'id'>) => {
    const newDriver: Driver = { ...data, id: `driver-${Date.now()}` };
    setDrivers(prev => [...prev, newDriver]);
  };
  const updateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  };
  const deleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const addVehicle = (data: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = { ...data, id: `vh-${Date.now()}` };
    setVehicles(prev => [...prev, newVehicle]);
  };
  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };
  const deleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const addInternalRequest = (data: Omit<InternalRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester'>) => {
    if (!user) return;
    const newRequest: InternalRequest = {
        ...data,
        id: `ireq-${Date.now()}`,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRequester: true
    };
    setInternalRequests(prev => [...prev, newRequest]);
  };
  const updateInternalRequest = (updatedRequest: InternalRequest) => {
    setInternalRequests(prev => prev.map(r => r.id === updatedRequest.id ? {...updatedRequest, isViewedByRequester: false} : r));
  };
  const addInternalRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    setInternalRequests(prev => prev.map(r => r.id === requestId ? { ...r, comments: [...(r.comments || []), { userId: user.id, text, date: new Date().toISOString() }], isViewedByRequester: false } : r));
  };
  const deleteInternalRequest = (requestId: string) => {
    setInternalRequests(prev => prev.filter(r => r.id !== requestId));
  };
  const markRequestAsViewed = (requestId: string) => {
    setInternalRequests(prev => prev.map(r => r.id === requestId ? { ...r, isViewedByRequester: true } : r));
  };
  const forwardInternalRequest = (requestId: string, role: Role, comment: string) => {
    addInternalRequestComment(requestId, `Forwarded to ${role}: ${comment}`);
    setInternalRequests(prev => prev.map(r => r.id === requestId ? { ...r, forwardedTo: role } : r));
  };
  const escalateInternalRequest = (requestId: string, comment: string) => {
    addInternalRequestComment(requestId, `Request Escalated: ${comment}`);
    setInternalRequests(prev => prev.map(r => r.id === requestId ? { ...r, isEscalated: true, forwardedTo: 'Manager' } : r));
  };

  const addManagementRequest = (data: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRecipient' | 'isViewedByRequester'>) => {
     if (!user) return;
    const newRequest: ManagementRequest = {
        ...data,
        id: `mreq-${Date.now()}`,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ id: `c-mreq-${Date.now()}`, userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRecipient: false,
        isViewedByRequester: true,
    };
    setManagementRequests(prev => [...prev, newRequest]);
  };
  const updateManagementRequest = (updatedRequest: ManagementRequest) => {
    setManagementRequests(prev => prev.map(r => r.id === updatedRequest.id ? {...updatedRequest, isViewedByRequester: false, isViewedByRecipient: false} : r));
  };
  const addManagementRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    setManagementRequests(prev => prev.map(r => r.id === requestId ? { ...r, comments: [...(r.comments || []), { userId: user.id, text, date: new Date().toISOString() }], isViewedByRequester: false, isViewedByRecipient: false } : r));
  };
  const markManagementRequestAsViewed = (requestId: string) => {
    if (!user) return;
    setManagementRequests(prev => prev.map(r => {
        if(r.id === requestId) {
            if(r.requesterId === user.id) return { ...r, isViewedByRequester: true };
            if(r.recipientId === user.id) return { ...r, isViewedByRecipient: true };
        }
        return r;
    }));
  };
  
  const addAnnouncement = (data: Pick<Announcement, 'title' | 'content'>) => {
    if (!user || !user.supervisorId) return;
    const newAnnouncement: Announcement = {
        ...data,
        id: `ann-${Date.now()}`,
        creatorId: user.id,
        approverId: user.supervisorId,
        date: new Date().toISOString(),
        status: 'pending',
        isViewed: [],
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };
  const updateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements(prev => prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
  };
  const approveAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, status: 'approved' } : a));
  };
  const rejectAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, status: 'rejected' } : a));
  };
  const returnAnnouncement = (announcementId: string, commentText: string) => {
    if (!user) return;
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement) return;
    const comment: Comment = {
      userId: user.id,
      text: `Returned for modification: ${commentText}`,
      date: new Date().toISOString(),
    };
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, status: 'rejected', comments: [...(a.comments || []), comment] } : a));
  };
  const deleteAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  };
  const dismissAnnouncement = (announcementId: string) => {
    if(!user) return;
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, isViewed: [...a.isViewed, user.id] } : a));
  };
  
  const addIncidentReport = (data: Omit<IncidentReport, 'id' | 'reporterId' | 'reportTime' | 'status' | 'comments' | 'isPublished' | 'reportedToUserIds'>) => {
    if(!user) return;
    const supervisorId = user.supervisorId;
    const hseUser = users.find(u => u.role === 'HSE');
    const reportedToUserIds = [supervisorId, hseUser?.id].filter(Boolean) as string[];
    
    const newIncident: IncidentReport = {
        ...data,
        id: `inc-${Date.now()}`,
        reporterId: user.id,
        reportedToUserIds: reportedToUserIds,
        reportTime: new Date().toISOString(),
        status: 'New',
        isPublished: false,
        comments: [{ userId: user.id, text: 'Incident reported.', date: new Date().toISOString() }],
    };
    setIncidents(prev => [...prev, newIncident]);
  };
  
  const updateIncident = (updatedIncident: IncidentReport) => {
    setIncidents(prev => prev.map(i => i.id === updatedIncident.id ? updatedIncident : i));
  };
  
  const addIncidentComment = (incidentId: string, text: string) => {
    if(!user) return;
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, comments: [...(i.comments || []), { userId: user.id, text, date: new Date().toISOString() }] } : i));
  };

  const publishIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, isPublished: true } : i));
  };
  
  const addUsersToIncidentReport = (incidentId: string, userIds: string[]) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, reportedToUserIds: Array.from(new Set([...(i.reportedToUserIds || []), ...userIds])) } : i));
  };
  
  const addManualAchievement = (data: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => {
    if (!user) return;
    const isAdminOrManager = user.role === 'Admin' || user.role === 'Manager';
    const newAchievement: Achievement = {
        ...data,
        id: `ach-${Date.now()}`,
        type: 'manual',
        awardedById: user.id,
        date: new Date().toISOString(),
        status: isAdminOrManager ? 'approved' : 'pending',
    };
    setAchievements(prev => [...prev, newAchievement]);
  };
  
  const updateManualAchievement = (updatedAchievement: Achievement) => {
    setAchievements(prev => prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a));
  };
  
  const approveAchievement = (achievementId: string, points: number) => {
    setAchievements(prev => prev.map(a => a.id === achievementId ? { ...a, status: 'approved', points } : a));
  };

  const rejectAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(a => a.id === achievementId ? { ...a, status: 'rejected' } : a));
  };

  const deleteManualAchievement = (achievementId: string) => {
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
  };
  
  const addPlannerEvent = (data: Omit<PlannerEvent, 'id' | 'comments'>) => {
    const newEvent: PlannerEvent = {
        ...data,
        id: `event-${Date.now()}`,
        comments: [],
    };
    setPlannerEvents(prev => [...prev, newEvent]);
  };
  
  const updatePlannerEvent = (updatedEvent: PlannerEvent) => {
    setPlannerEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  
  const deletePlannerEvent = (eventId: string) => {
    setPlannerEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const addPlannerEventComment = (eventId: string, text: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    setPlannerEvents(prev => prev.map(e => e.id === eventId ? { ...e, comments: [...(e.comments || []), newComment] } : e));
  };
  
  const addDailyPlannerComment = (plannerUserId: string, date: Date, text: string) => {
    if (!user) return;
    const dayKey = format(date, 'yyyy-MM-dd');
    const existingEntry = dailyPlannerComments.find(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
    const newComment: Comment = { id: `dpc-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    
    if (existingEntry) {
        setDailyPlannerComments(prev => prev.map(dpc => dpc.id === existingEntry.id ? { ...dpc, comments: [...dpc.comments, newComment] } : dpc));
    } else {
        const newEntry: DailyPlannerComment = {
            id: `dp-${dayKey}-${plannerUserId}`,
            plannerUserId,
            day: dayKey,
            comments: [newComment]
        };
        setDailyPlannerComments(prev => [...prev, newEntry]);
    }
  };

  const updateDailyPlannerComment = (commentId: string, plannerUserId: string, day: string, newText: string) => {
    setDailyPlannerComments(prev => prev.map(dpc => {
      if(dpc.day === day && dpc.plannerUserId === plannerUserId) {
        return {
          ...dpc,
          comments: dpc.comments.map(c => c.id === commentId ? { ...c, text: newText } : c)
        }
      }
      return dpc;
    }));
  };

  const deleteDailyPlannerComment = (commentId: string, plannerUserId: string, day: string) => {
     setDailyPlannerComments(prev => prev.map(dpc => {
      if(dpc.day === day && dpc.plannerUserId === plannerUserId) {
        return {
          ...dpc,
          comments: dpc.comments.filter(c => c.id !== commentId)
        }
      }
      return dpc;
    }));
  };

  const deleteAllDailyPlannerComments = (plannerUserId: string, day: string) => {
    setDailyPlannerComments(prev => prev.filter(dpc => !(dpc.day === day && dpc.plannerUserId === plannerUserId)));
  };

  const pendingStoreRequestCount = useMemo(() => internalRequests.filter(r => r.status === 'Pending').length, [internalRequests]);
  const myRequestUpdateCount = useMemo(() => {
    if (!user) return 0;
    return internalRequests.filter(r => r.requesterId === user.id && !r.isViewedByRequester).length;
  }, [internalRequests, user]);
  
  const pendingCertificateRequestCount = useMemo(() => certificateRequests.filter(r => r.status === 'Pending').length, [certificateRequests]);
  const myCertificateRequestUpdateCount = useMemo(() => {
    if (!user) return 0;
    return certificateRequests.filter(r => r.requesterId === user.id && r.status === 'Fulfilled' && !r.isViewedByRequester).length;
  }, [certificateRequests, user]);
  
  const workingManpowerCount = useMemo(() => manpowerProfiles.filter(p => p.status === 'Working').length, [manpowerProfiles]);
  const onLeaveManpowerCount = useMemo(() => manpowerProfiles.filter(p => p.status === 'On Leave').length, [manpowerProfiles]);

  const pendingAnnouncementCount = useMemo(() => {
    if(!user) return 0;
    return announcements.filter(a => a.status === 'pending' && a.approverId === user.id).length
  }, [announcements, user]);

  const unreadAnnouncementCount = useMemo(() => {
    if (!user) return 0;
    return announcements.filter(a => a.status === 'approved' && !a.isViewed.includes(user.id)).length;
  }, [announcements, user]);
  
  const newIncidentCount = useMemo(() => {
    if(!user) return 0;
    return incidents.filter(i => i.status === 'New' && (i.reportedToUserIds || []).includes(user.id)).length;
  }, [incidents, user]);
  
  const myUnreadManagementRequestCount = useMemo(() => {
    if (!user) return 0;
    return managementRequests.filter(r => r.requesterId === user.id && !r.isViewedByRequester).length;
  }, [managementRequests, user]);

  const unreadManagementRequestCountForMe = useMemo(() => {
    if(!user) return 0;
    return managementRequests.filter(r => r.recipientId === user.id && !r.isViewedByRecipient).length;
  }, [managementRequests, user]);

  const thirtyDaysFromNow = useMemo(() => addDays(new Date(), 30), []);

  const expiringVehicleDocsCount = useMemo(() => {
    return vehicles.filter(v => 
      (v.vapValidity && isBefore(new Date(v.vapValidity), thirtyDaysFromNow)) ||
      (v.sdpValidity && isBefore(new Date(v.sdpValidity), thirtyDaysFromNow)) ||
      (v.epValidity && isBefore(new Date(v.epValidity), thirtyDaysFromNow))
    ).length;
  }, [vehicles, thirtyDaysFromNow]);
  
  const expiringDriverDocsCount = useMemo(() => {
     return drivers.filter(d => 
      (d.epExpiry && isBefore(new Date(d.epExpiry), thirtyDaysFromNow)) ||
      (d.medicalExpiry && isBefore(new Date(d.medicalExpiry), thirtyDaysFromNow)) ||
      (d.safetyExpiry && isBefore(new Date(d.safetyExpiry), thirtyDaysFromNow))
    ).length;
  }, [drivers, thirtyDaysFromNow]);

  const expiringUtMachineCalibrationsCount = useMemo(() => utMachines.filter(m => isBefore(new Date(m.calibrationDueDate), thirtyDaysFromNow)).length, [utMachines, thirtyDaysFromNow]);

  const expiringManpowerCount = useMemo(() => {
     return manpowerProfiles.filter(p => 
      (p.passIssueDate && isBefore(new Date(p.passIssueDate), thirtyDaysFromNow)) ||
      (p.woValidity && isBefore(new Date(p.woValidity), thirtyDaysFromNow)) ||
      (p.wcPolicyValidity && isBefore(new Date(p.wcPolicyValidity), thirtyDaysFromNow)) ||
      (p.labourContractValidity && isBefore(new Date(p.labourContractValidity), thirtyDaysFromNow)) ||
      (p.medicalExpiryDate && isBefore(new Date(p.medicalExpiryDate), thirtyDaysFromNow)) ||
      (p.safetyExpiryDate && isBefore(new Date(p.safetyExpiryDate), thirtyDaysFromNow)) ||
      (p.irataValidity && isBefore(new Date(p.irataValidity), thirtyDaysFromNow)) ||
      (p.contractValidity && isBefore(new Date(p.contractValidity), thirtyDaysFromNow))
    ).length;
  }, [manpowerProfiles, thirtyDaysFromNow]);
  
  const pendingTaskApprovalCount = useMemo(() => {
    if(!user) return 0;
    return tasks.filter(t => t.status === 'Pending Approval' && t.assigneeId !== user.id && (t.creatorId === user.id || users.find(u => u.id === t.assigneeId)?.supervisorId === user.id)).length;
  }, [tasks, users, user]);
  
  const myNewTaskCount = useMemo(() => {
    if(!user) return 0;
    return tasks.filter(t => t.assigneeId === user.id && !t.isViewedByAssignee).length;
  }, [tasks, user]);


  const value: AppContextType = {
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
    internalRequests,
    managementRequests,
    announcements,
    incidents,
    appName,
    appLogo,
    isDataLoading,

    pendingStoreRequestCount,
    myRequestUpdateCount,
    pendingCertificateRequestCount,
    myCertificateRequestUpdateCount,
    myFulfilledUTRequests,
    workingManpowerCount,
    onLeaveManpowerCount,
    approvedAnnouncements,
    pendingAnnouncementCount,
    unreadAnnouncementCount,
    newIncidentCount,
    myUnreadManagementRequestCount,
    unreadManagementRequestCountForMe,
    expiringVehicleDocsCount,
    expiringDriverDocsCount,
    expiringUtMachineCalibrationsCount,
    expiringManpowerCount,
    pendingTaskApprovalCount,
    myNewTaskCount,
    
    getVisibleUsers,
    getExpandedPlannerEvents,
    updateBranding,
    
    addUser,
    updateUser,
    deleteUser,
    updateProfile,
    updateUserPlanningScore,

    addRole,
    updateRole,
    deleteRole,
    
    addProject,
    updateProject,
    deleteProject,
    
    addTask,
    updateTask,
    deleteTask,
    addComment,
    requestTaskStatusChange,
    approveTaskStatusChange,
    returnTaskStatusChange,
    markTaskAsViewed,
    requestTaskReassignment,

    addManpowerProfile,
    updateManpowerProfile,
    deleteManpowerProfile,
    addManpowerLog,
    
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addMultipleInventoryItems,
    requestInventoryTransfer,
    approveInventoryTransfer,
    rejectInventoryTransfer,
    
    addCertificateRequest,
    fulfillCertificateRequest,
    addCertificateRequestComment,

    requestUTMachineCertificate,
    addUTMachine,
    updateUTMachine,
    deleteUTMachine,
    addUTMachineLog,
    acknowledgeFulfilledUTRequest,
    
    addDftMachine,
    updateDftMachine,
    deleteDftMachine,
    
    addMobileSim,
    updateMobileSim,
    deleteMobileSim,
    
    addOtherEquipment,
    updateOtherEquipment,
    deleteOtherEquipment,

    addDriver,
    updateDriver,
    deleteDriver,
    
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    addInternalRequest,
    updateInternalRequest,
    deleteInternalRequest,
    addInternalRequestComment,
    markRequestAsViewed,
    forwardInternalRequest,
    escalateInternalRequest,
    
    addManagementRequest,
    updateManagementRequest,
    addManagementRequestComment,
    markManagementRequestAsViewed,
    
    addAnnouncement,
    updateAnnouncement,
    approveAnnouncement,
    rejectAnnouncement,
    returnAnnouncement,
    deleteAnnouncement,
    dismissAnnouncement,

    addIncidentReport,
    updateIncident,
    addIncidentComment,
    publishIncident,
    addUsersToIncidentReport,
    
    addManualAchievement,
    updateManualAchievement,
    approveAchievement,
    rejectAchievement,
    deleteManualAchievement,

    addPlannerEvent,
    updatePlannerEvent,
    deletePlannerEvent,
    addPlannerEventComment,
    addDailyPlannerComment,
    updateDailyPlannerComment,
    deleteDailyPlannerComment,
    deleteAllDailyPlannerComments,
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
