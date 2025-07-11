
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { User, Task, PlannerEvent, Comment, Role, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '../lib/types';
import { useLocalStorage } from '../hooks/use-local-storage';
import * as mock from '../lib/mock-data';
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
  const { user } = useAuth();
  
  const [users, setUsers] = useLocalStorage<User[]>('users', mock.USERS);
  const [roles, setRoles] = useLocalStorage<RoleDefinition[]>('roles', mock.ROLES);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', mock.TASKS);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', mock.PROJECTS);
  const [inventoryItems, setInventoryItems] = useLocalStorage<InventoryItem[]>('inventoryItems', mock.INVENTORY_ITEMS);
  const [inventoryTransferRequests, setInventoryTransferRequests] = useLocalStorage<InventoryTransferRequest[]>('inventoryTransferRequests', mock.INVENTORY_TRANSFER_REQUESTS);
  const [certificateRequests, setCertificateRequests] = useLocalStorage<CertificateRequest[]>('certificateRequests', mock.CERTIFICATE_REQUESTS);
  const [plannerEvents, setPlannerEvents] = useLocalStorage<PlannerEvent[]>('plannerEvents', mock.PLANNER_EVENTS);
  const [dailyPlannerComments, setDailyPlannerComments] = useLocalStorage<DailyPlannerComment[]>('dailyPlannerComments', mock.DAILY_PLANNER_COMMENTS);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', mock.ACHIEVEMENTS);
  const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('activityLogs', mock.ACTIVITY_LOGS);
  const [manpowerLogs, setManpowerLogs] = useLocalStorage<ManpowerLog[]>('manpowerLogs', mock.MANPOWER_LOGS);
  const [manpowerProfiles, setManpowerProfiles] = useLocalStorage<ManpowerProfile[]>('manpowerProfiles', mock.MANPOWER_PROFILES);
  const [utMachines, setUtMachines] = useLocalStorage<UTMachine[]>('utMachines', mock.UT_MACHINES);
  const [dftMachines, setDftMachines] = useLocalStorage<DftMachine[]>('dftMachines', mock.DFT_MACHINES);
  const [mobileSims, setMobileSims] = useLocalStorage<MobileSim[]>('mobileSims', mock.MOBILE_SIMS);
  const [otherEquipments, setOtherEquipments] = useLocalStorage<OtherEquipment[]>('otherEquipments', mock.OTHER_EQUIPMENTS);
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('vehicles', mock.VEHICLES);
  const [drivers, setDrivers] = useLocalStorage<Driver[]>('drivers', mock.DRIVERS);
  const [internalRequests, setInternalRequests] = useLocalStorage<InternalRequest[]>('internalRequests', mock.INTERNAL_REQUESTS);
  const [managementRequests, setManagementRequests] = useLocalStorage<ManagementRequest[]>('managementRequests', mock.MANAGEMENT_REQUESTS);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', mock.ANNOUNCEMENTS);
  const [incidents, setIncidents] = useLocalStorage<IncidentReport[]>('incidents', mock.INCIDENTS);
  
  const [appName, setAppName] = useLocalStorage<string>('appName', 'Aries Marine');
  const [appLogo, setAppLogo] = useLocalStorage<string | null>('appLogo', null);
  const [isDataLoading, setIsDataLoading] = useState(false);

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
    const newUser = { ...userData, id: `user-${Date.now()}` };
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
        updateUser({...user, name, email, avatar});
    }
  };

  const addRole = (roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole = { ...roleData, id: `role-${Date.now()}`, isEditable: true };
    setRoles(prev => [...prev, newRole]);
  };
  
  const updateRole = (updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };
  
  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const addProject = (projectName: string) => {
    const newProject = { id: `proj-${Date.now()}`, name: projectName };
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
      id: `comment-${Date.now()}`,
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment] } : t
    ));
  };

  const requestTaskStatusChange = (taskId: string, newStatus: TaskStatus, comment: string, attachment?: Task['attachment']) => {
    if(!user) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTask: Task = {
          ...t,
          status: 'Pending Approval',
          previousStatus: t.status,
          pendingStatus: newStatus,
          approvalState: 'pending',
          comments: [...(t.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Status change to ${newStatus} requested: ${comment}`, date: new Date().toISOString()}]
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
            }
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
        }
      }
      return t;
    }));
  };
  
  const addManpowerProfile = (data: Omit<ManpowerProfile, 'id'>) => {
    setManpowerProfiles(prev => [...prev, { ...data, id: `mp-prof-${Date.now()}` }]);
  };

  const updateManpowerProfile = (updatedProfile: ManpowerProfile) => {
    setManpowerProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const deleteManpowerProfile = (profileId: string) => {
    setManpowerProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const addManpowerLog = (logData: Omit<ManpowerLog, 'id' | 'date' | 'updatedBy'>) => {
    if(!user) return;
    const newLog = {
      ...logData,
      id: `mp-log-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      updatedBy: user.id
    };
    setManpowerLogs(prev => [...prev, newLog]);
  };
  
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    setInventoryItems(prev => [...prev, { ...itemData, id: `inv-${Date.now()}` }]);
  };
  
  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const deleteInventoryItem = (itemId: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addMultipleInventoryItems = (items: any[]) => {
    const existingSerialNumbers = new Set(inventoryItems.map(i => i.serialNumber));
    const newItems: InventoryItem[] = [];
    let updatedCount = 0;

    items.forEach(item => {
        const serialNumber = item['SERIAL NUMBER'];
        if (!serialNumber) return;

        const location = projects.find(p => p.name === item['PROJECT']);

        const newItemData: Omit<InventoryItem, 'id'> = {
            name: item['ITEM NAME'] || 'Unknown',
            serialNumber: serialNumber,
            chestCrollNo: item['CHEST CROLL NO'] || '',
            ariesId: item['ARIES ID'] || '',
            status: item['STATUS'] || 'In Store',
            inspectionDate: item['INSPECTION DATE'] instanceof Date ? item['INSPECTION DATE'].toISOString() : new Date().toISOString(),
            inspectionDueDate: item['INSPECTION DUE DATE'] instanceof Date ? item['INSPECTION DUE DATE'].toISOString() : new Date().toISOString(),
            tpInspectionDueDate: item['TP INSPECTION DUE DATE'] instanceof Date ? item['TP INSPECTION DUE DATE'].toISOString() : new Date().toISOString(),
            location: location?.name || 'Head Office',
            projectId: location?.id || projects.find(p => p.name === 'Head Office')?.id || '',
        };

        if (existingSerialNumbers.has(serialNumber)) {
            // Update existing
            setInventoryItems(prev => prev.map(i => i.serialNumber === serialNumber ? { ...i, ...newItemData } : i));
            updatedCount++;
        } else {
            // Add new
            newItems.push({ ...newItemData, id: `inv-${Date.now()}-${serialNumber}` });
        }
    });

    setInventoryItems(prev => [...prev, ...newItems]);
    return newItems.length + updatedCount;
  };

  const requestInventoryTransfer = (itemsToTransfer: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => {
    if(!user) return;
    const newRequest: InventoryTransferRequest = {
        id: `inv-transfer-${Date.now()}`,
        items: itemsToTransfer,
        fromProjectId,
        toProjectId,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: comment, date: new Date().toISOString() }],
    };
    setInventoryTransferRequests(prev => [...prev, newRequest]);
  };
  
  const addInventoryTransferComment = (requestId: string, text: string) => {
    if(!user) return;
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    setInventoryTransferRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, comments: [...r.comments, newComment] } : r
    ));
  };
  
  const approveInventoryTransfer = (requestId: string, comment: string) => {
    const request = inventoryTransferRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Move items
    const movedItemIds = new Set(request.items.map(i => i.id));
    setInventoryItems(prev => prev.map(item =>
        movedItemIds.has(item.id) ? { ...item, projectId: request.toProjectId, location: projects.find(p => p.id === request.toProjectId)?.name || 'Unknown' } : item
    ));

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
        id: `cert-req-${Date.now()}`,
        itemId: itemId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    };
    setCertificateRequests(prev => [...prev, newRequest]);
  };
  
  const addUTMachine = (data: Omit<UTMachine, 'id' | 'usageLog'>) => {
    setUtMachines(prev => [...prev, { ...data, id: `ut-${Date.now()}`, usageLog: [] }]);
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
        id: `cert-req-${Date.now()}`,
        utMachineId: machineId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    };
    setCertificateRequests(prev => [...prev, newRequest]);
  };
  
  const fulfillCertificateRequest = (requestId: string, comment: string) => {
    if(!user) return;
    setCertificateRequests(prev => prev.map(req => {
        if(req.id === requestId) {
            const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text: `Fulfilled: ${comment}`, date: new Date().toISOString() };
            return { ...req, status: 'Fulfilled', isViewedByRequester: false, comments: [...req.comments, newComment] };
        }
        return req;
    }));
  };

  const addCertificateRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    setCertificateRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, comments: [...req.comments, newComment] } : req
    ));
  };
  
  const acknowledgeFulfilledUTRequest = (requestId: string) => {
    setCertificateRequests(prev => prev.map(req => req.id === requestId ? { ...req, isViewedByRequester: true } : req));
  };

  const addDftMachine = (data: Omit<DftMachine, 'id' | 'usageLog'>) => {
    setDftMachines(prev => [...prev, { ...data, id: `dft-${Date.now()}`, usageLog: [] }]);
  };
  const updateDftMachine = (updatedMachine: DftMachine) => {
    setDftMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
  };
  const deleteDftMachine = (machineId: string) => {
    setDftMachines(prev => prev.filter(m => m.id !== machineId));
  };

  const addMobileSim = (data: Omit<MobileSim, 'id'>) => {
    setMobileSims(prev => [...prev, { ...data, id: `ms-${Date.now()}` }]);
  };
  const updateMobileSim = (updatedItem: MobileSim) => {
    setMobileSims(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  const deleteMobileSim = (itemId: string) => {
    setMobileSims(prev => prev.filter(item => item.id !== itemId));
  };

  const addOtherEquipment = (data: Omit<OtherEquipment, 'id'>) => {
    setOtherEquipments(prev => [...prev, { ...data, id: `oe-${Date.now()}` }]);
  };
  const updateOtherEquipment = (updatedItem: OtherEquipment) => {
    setOtherEquipments(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  const deleteOtherEquipment = (itemId: string) => {
    setOtherEquipments(prev => prev.filter(item => item.id !== itemId));
  };
  
  const addDriver = (data: Omit<Driver, 'id'>) => {
    setDrivers(prev => [...prev, { ...data, id: `driver-${Date.now()}` }]);
  };
  const updateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  };
  const deleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const addVehicle = (data: Omit<Vehicle, 'id'>) => {
    setVehicles(prev => [...prev, { ...data, id: `vh-${Date.now()}` }]);
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
    setInternalRequests(prev => prev.map(req => req.id === updatedRequest.id ? {...updatedRequest, isViewedByRequester: false } : req));
  };
  const addInternalRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    setInternalRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, comments: [...(r.comments || []), newComment], isViewedByRequester: false } : r
    ));
  };
  const deleteInternalRequest = (requestId: string) => {
    setInternalRequests(prev => prev.filter(req => req.id !== requestId));
  };
  const markRequestAsViewed = (requestId: string) => {
    setInternalRequests(prev => prev.map(req => req.id === requestId ? { ...req, isViewedByRequester: true } : req));
  };
  const forwardInternalRequest = (requestId: string, role: Role, comment: string) => {
    addInternalRequestComment(requestId, `Forwarded to ${role}: ${comment}`);
    setInternalRequests(prev => prev.map(req => req.id === requestId ? { ...req, forwardedTo: role } : req));
  };
  const escalateInternalRequest = (requestId: string, comment: string) => {
    addInternalRequestComment(requestId, `Request Escalated: ${comment}`);
    setInternalRequests(prev => prev.map(req => req.id === requestId ? { ...req, isEscalated: true, forwardedTo: 'Manager' } : req));
  };

  const addManagementRequest = (data: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRecipient' | 'isViewedByRequester'>) => {
     if (!user) return;
    const newRequest: ManagementRequest = {
        ...data,
        id: `mreq-${Date.now()}`,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRecipient: false,
        isViewedByRequester: true,
    };
    setManagementRequests(prev => [...prev, newRequest]);
  };
  const updateManagementRequest = (updatedRequest: ManagementRequest) => {
    setManagementRequests(prev => prev.map(req => req.id === updatedRequest.id ? {...updatedRequest, isViewedByRequester: false, isViewedByRecipient: false } : req));
  };
  const addManagementRequestComment = (requestId: string, text: string) => {
    if(!user) return;
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    setManagementRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, comments: [...(r.comments || []), newComment], isViewedByRequester: false, isViewedByRecipient: false } : r
    ));
  };
  const markManagementRequestAsViewed = (requestId: string) => {
    if (!user) return;
    setManagementRequests(prev => prev.map(req => {
        if (req.id === requestId) {
            if (req.requesterId === user.id) return { ...req, isViewedByRequester: true };
            if (req.recipientId === user.id) return { ...req, isViewedByRecipient: true };
        }
        return req;
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
    const comment: Comment = {
      id: `c-${Date.now()}`,
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
  
  const addIncidentReport = (data: Omit<IncidentReport, 'id' | 'reporterId' | 'reportTime' | 'status' | 'comments' | 'isPublished'>) => {
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
        comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Incident reported.', date: new Date().toISOString() }],
    };
    setIncidents(prev => [...prev, newIncident]);
  };
  
  const updateIncident = (updatedIncident: IncidentReport) => {
    setIncidents(prev => prev.map(i => i.id === updatedIncident.id ? updatedIncident : i));
  };
  
  const addIncidentComment = (incidentId: string, text: string) => {
    if(!user) return;
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    setIncidents(prev => prev.map(i => 
        i.id === incidentId ? { ...i, comments: [...(i.comments || []), newComment] } : i
    ));
  };

  const publishIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, isPublished: true } : i));
  };
  
  const addUsersToIncidentReport = (incidentId: string, userIds: string[]) => {
    setIncidents(prev => prev.map(i => 
        i.id === incidentId ? { ...i, reportedToUserIds: Array.from(new Set([...(i.reportedToUserIds || []), ...userIds])) } : i
    ));
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
      id: `comment-${Date.now()}`,
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    setPlannerEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, comments: [...(e.comments || []), newComment] } : e
    ));
  };
  
  const addDailyPlannerComment = (plannerUserId: string, date: Date, text: string) => {
    if (!user) return;
    const dayKey = format(date, 'yyyy-MM-dd');
    const existingEntryIndex = dailyPlannerComments.findIndex(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
    const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
    
    if (existingEntryIndex > -1) {
        setDailyPlannerComments(prev => prev.map((entry, index) => 
            index === existingEntryIndex ? { ...entry, comments: [...entry.comments, newComment] } : entry
        ));
    } else {
        const newEntry: DailyPlannerComment = {
            id: `dpc-${Date.now()}`,
            plannerUserId,
            day: dayKey,
            comments: [newComment]
        };
        setDailyPlannerComments(prev => [...prev, newEntry]);
    }
  };

  const updateDailyPlannerComment = (commentId: string, plannerUserId: string, day: string, newText: string) => {
     setDailyPlannerComments(prev => prev.map(dpc => {
        if (dpc.day === day && dpc.plannerUserId === plannerUserId) {
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
        if (dpc.day === day && dpc.plannerUserId === plannerUserId) {
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

  // ----- DERIVED STATE & NOTIFICATIONS ----- //

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
