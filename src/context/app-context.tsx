
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { User, Task, PlannerEvent, Comment, Role, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '../lib/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';

interface AppContextType {
  // Directly managed state from Firestore
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

// Helper function to create a listener for a collection
const useCollection = <T,>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: T[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${collectionName}: `, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
};


export function AppContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Use the custom hook for each collection
  const { data: users, loading: usersLoading } = useCollection<User>('users');
  const { data: roles, loading: rolesLoading } = useCollection<RoleDefinition>('roles');
  const { data: tasks, loading: tasksLoading } = useCollection<Task>('tasks');
  const { data: projects, loading: projectsLoading } = useCollection<Project>('projects');
  const { data: inventoryItems, loading: inventoryItemsLoading } = useCollection<InventoryItem>('inventoryItems');
  const { data: inventoryTransferRequests, loading: inventoryTransferRequestsLoading } = useCollection<InventoryTransferRequest>('inventoryTransferRequests');
  const { data: certificateRequests, loading: certificateRequestsLoading } = useCollection<CertificateRequest>('certificateRequests');
  const { data: plannerEvents, loading: plannerEventsLoading } = useCollection<PlannerEvent>('plannerEvents');
  const { data: dailyPlannerComments, loading: dailyPlannerCommentsLoading } = useCollection<DailyPlannerComment>('dailyPlannerComments');
  const { data: achievements, loading: achievementsLoading } = useCollection<Achievement>('achievements');
  const { data: activityLogs, loading: activityLogsLoading } = useCollection<ActivityLog>('activityLogs');
  const { data: manpowerLogs, loading: manpowerLogsLoading } = useCollection<ManpowerLog>('manpowerLogs');
  const { data: manpowerProfiles, loading: manpowerProfilesLoading } = useCollection<ManpowerProfile>('manpowerProfiles');
  const { data: utMachines, loading: utMachinesLoading } = useCollection<UTMachine>('utMachines');
  const { data: dftMachines, loading: dftMachinesLoading } = useCollection<DftMachine>('dftMachines');
  const { data: mobileSims, loading: mobileSimsLoading } = useCollection<MobileSim>('mobileSims');
  const { data: otherEquipments, loading: otherEquipmentsLoading } = useCollection<OtherEquipment>('otherEquipments');
  const { data: vehicles, loading: vehiclesLoading } = useCollection<Vehicle>('vehicles');
  const { data: drivers, loading: driversLoading } = useCollection<Driver>('drivers');
  const { data: internalRequests, loading: internalRequestsLoading } = useCollection<InternalRequest>('internalRequests');
  const { data: managementRequests, loading: managementRequestsLoading } = useCollection<ManagementRequest>('managementRequests');
  const { data: announcements, loading: announcementsLoading } = useCollection<Announcement>('announcements');
  const { data: incidents, loading: incidentsLoading } = useCollection<IncidentReport>('incidents');
  const { data: brandingData, loading: brandingLoading } = useCollection<{ name: string; logo: string | null }>('branding');

  const appName = useMemo(() => brandingData.find(b => b.id === 'main')?.name || 'TaskMaster Pro', [brandingData]);
  const appLogo = useMemo(() => brandingData.find(b => b.id === 'main')?.logo || null, [brandingData]);
  
  const isDataLoading = [
    usersLoading, rolesLoading, tasksLoading, projectsLoading, inventoryItemsLoading,
    inventoryTransferRequestsLoading, certificateRequestsLoading, plannerEventsLoading,
    dailyPlannerCommentsLoading, achievementsLoading, activityLogsLoading,
    manpowerLogsLoading, manpowerProfilesLoading, utMachinesLoading, dftMachinesLoading,
    mobileSimsLoading, otherEquipmentsLoading, vehiclesLoading, driversLoading,
    internalRequestsLoading, managementRequestsLoading, announcementsLoading,
    incidentsLoading, brandingLoading
  ].some(Boolean);

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


  const updateBranding = useCallback(async (name: string, logo: string | null) => {
    const brandingDocRef = doc(db, 'branding', 'main');
    await updateDoc(brandingDocRef, { name, logo });
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
  
  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const myFulfilledUTRequests = useMemo(() => {
    if (!user) return [];
    return certificateRequests.filter(req => req.requesterId === user.id && req.status === 'Fulfilled' && !req.isViewedByRequester);
  }, [certificateRequests, user]);
  
  const addUser = async (userData: Omit<User, 'id'>) => {
    // Note: This only adds to Firestore. You need to create the user in Firebase Auth separately.
    await addDoc(collection(db, "users"), userData);
  };
  
  const updateUser = async (updatedUser: User) => {
    const { id, ...data } = updatedUser;
    await updateDoc(doc(db, "users", id), data);
  };
  
  const deleteUser = async (userId: string) => {
    // Note: This only deletes from Firestore. You need to delete the user from Firebase Auth separately.
    await deleteDoc(doc(db, "users", userId));
  };
  
  const updateProfile = (name: string, email: string, avatar: string, password?: string) => {
    if (user) {
        // Note: Updating email/password requires Firebase Auth functions which should be handled carefully.
        // This function will only update the Firestore document.
        const updatedUser = { ...user, name, email, avatar };
        updateUser(updatedUser);
    }
  };

  const updateUserPlanningScore = async (userId: string, score: number) => {
    await updateDoc(doc(db, "users", userId), { planningScore: score });
  };

  const addRole = async (roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    await addDoc(collection(db, "roles"), { ...roleData, isEditable: true });
  };
  
  const updateRole = async (updatedRole: RoleDefinition) => {
    const { id, ...data } = updatedRole;
    await updateDoc(doc(db, "roles", id), data);
  };
  
  const deleteRole = async (roleId: string) => {
    await deleteDoc(doc(db, "roles", roleId));
  };

  const addProject = async (projectName: string) => {
    await addDoc(collection(db, "projects"), { name: projectName });
  };

  const updateProject = async (updatedProject: Project) => {
    const { id, ...data } = updatedProject;
    await updateDoc(doc(db, "projects", id), data);
  };

  const deleteProject = async (projectId: string) => {
    await deleteDoc(doc(db, "projects", projectId));
  };
  
  const addTask = async (taskData: Omit<Task, 'id' | 'status' | 'isViewedByAssignee' | 'approvalState' | 'comments'>) => {
    const newTask: Omit<Task, 'id'> = {
        ...taskData,
        status: 'To Do',
        isViewedByAssignee: false,
        approvalState: 'none',
        comments: [],
    };
    await addDoc(collection(db, "tasks"), newTask);
  };

  const updateTask = async (updatedTask: Task) => {
    const { id, ...data } = updatedTask;
    await updateDoc(doc(db, "tasks", id), data);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };
  
  const addComment = async (taskId: string, text: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newComment: Comment = {
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    const updatedComments = [...(task.comments || []), newComment];
    await updateDoc(doc(db, "tasks", taskId), { comments: updatedComments });
  };

  const requestTaskStatusChange = async (taskId: string, newStatus: TaskStatus, comment: string, attachment?: Task['attachment']) => {
    if(!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newComment: Comment = { userId: user.id, text: `Status change to ${newStatus} requested: ${comment}`, date: new Date().toISOString()};
    const updatedTaskData: Partial<Task> = {
      status: 'Pending Approval',
      previousStatus: task.status,
      pendingStatus: newStatus,
      approvalState: 'pending',
      comments: [...(task.comments || []), newComment]
    };
     if (attachment) {
        updatedTaskData.attachment = attachment;
    }
    await updateDoc(doc(db, "tasks", taskId), updatedTaskData);
  };
  
  const approveTaskStatusChange = async (taskId: string, comment: string) => {
    if(!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.pendingStatus) return;

    const finalStatus = task.pendingStatus;
    const newAssigneeId = task.pendingAssigneeId || task.assigneeId;

    const updatedTaskData: Partial<Task> = {
      status: finalStatus,
      completionDate: finalStatus === 'Completed' ? new Date().toISOString() : task.completionDate,
      approvalState: 'approved',
      assigneeId: newAssigneeId,
      pendingStatus: undefined,
      previousStatus: undefined,
      pendingAssigneeId: undefined,
      comments: [...(task.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Request Approved: ${comment}`, date: new Date().toISOString() }]
    };
    await updateDoc(doc(db, "tasks", taskId), updatedTaskData);
  };
  
  const returnTaskStatusChange = async (taskId: string, comment: string) => {
    if(!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTaskData: Partial<Task> = {
        status: task.previousStatus || task.status,
        approvalState: 'returned',
        pendingStatus: undefined,
        previousStatus: undefined,
        pendingAssigneeId: undefined,
        comments: [...(task.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Request Returned: ${comment}`, date: new Date().toISOString() }]
    };
    await updateDoc(doc(db, "tasks", taskId), updatedTaskData);
  };

  const markTaskAsViewed = async (taskId: string) => {
    await updateDoc(doc(db, "tasks", taskId), { isViewedByAssignee: true });
  };
  
  const requestTaskReassignment = async (taskId: string, newAssigneeId: string, comment: string) => {
    if(!user) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTaskData: Partial<Task> = {
        status: 'Pending Approval',
        approvalState: 'pending',
        previousStatus: task.status,
        pendingAssigneeId: newAssigneeId,
        comments: [...(task.comments || []), { id: `c-${Date.now()}`, userId: user.id, text: `Reassignment requested to ${users.find(u => u.id === newAssigneeId)?.name}: ${comment}`, date: new Date().toISOString() }]
    };
    await updateDoc(doc(db, "tasks", taskId), updatedTaskData);
  };
  
  const addManpowerProfile = async (data: Omit<ManpowerProfile, 'id'>) => {
    await addDoc(collection(db, "manpowerProfiles"), data);
  };

  const updateManpowerProfile = async (updatedProfile: ManpowerProfile) => {
    const { id, ...data } = updatedProfile;
    await updateDoc(doc(db, "manpowerProfiles", id), data);
  };

  const deleteManpowerProfile = async (profileId: string) => {
    await deleteDoc(doc(db, "manpowerProfiles", profileId));
  };

  const addManpowerLog = async (logData: Omit<ManpowerLog, 'id' | 'date' | 'updatedBy'>) => {
    if(!user) return;
    await addDoc(collection(db, "manpowerLogs"), {
        ...logData,
        date: format(new Date(), 'yyyy-MM-dd'),
        updatedBy: user.id
    });
  };
  
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    await addDoc(collection(db, "inventoryItems"), itemData);
  };
  
  const updateInventoryItem = async (updatedItem: InventoryItem) => {
    const { id, ...data } = updatedItem;
    await updateDoc(doc(db, "inventoryItems", id), data);
  };
  
  const deleteInventoryItem = async (itemId: string) => {
    await deleteDoc(doc(db, "inventoryItems", itemId));
  };

  const addMultipleInventoryItems = async (items: any[]) => {
    const existingItemsQuery = query(collection(db, "inventoryItems"));
    const querySnapshot = await getDocs(existingItemsQuery);
    const existingItems = new Map(querySnapshot.docs.map(doc => [doc.data().serialNumber, doc.id]));

    const batch = writeBatch(db);
    let importedCount = 0;

    items.forEach(item => {
        const serialNumber = item['SERIAL NUMBER'];
        if (!serialNumber) return;

        const location = projects.find(p => p.name === item['PROJECT']);
        const newItemData = {
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

        const existingId = existingItems.get(serialNumber);
        if (existingId) {
            batch.update(doc(db, "inventoryItems", existingId), newItemData);
        } else {
            batch.set(doc(collection(db, "inventoryItems")), newItemData);
        }
        importedCount++;
    });

    await batch.commit();
    return importedCount;
  };

  const requestInventoryTransfer = async (itemsToTransfer: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => {
    if(!user) return;
    await addDoc(collection(db, "inventoryTransferRequests"), {
        items: itemsToTransfer,
        fromProjectId,
        toProjectId,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
    });
  };
  
  const addInventoryTransferComment = async (requestId: string, text: string) => {
    if(!user) return;
    const request = inventoryTransferRequests.find(r => r.id === requestId);
    if(!request) return;
    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    await updateDoc(doc(db, "inventoryTransferRequests", requestId), { comments: [...request.comments, newComment] });
  };
  
  const approveInventoryTransfer = async (requestId: string, comment: string) => {
    const request = inventoryTransferRequests.find(r => r.id === requestId);
    if (!request) return;

    const batch = writeBatch(db);
    
    // Move items
    request.items.forEach(item => {
        batch.update(doc(db, "inventoryItems", item.id), { 
            projectId: request.toProjectId, 
            location: projects.find(p => p.id === request.toProjectId)?.name || 'Unknown' 
        });
    });

    // Update request
    const newComment: Comment = { userId: user.id, text: `Approved: ${comment}`, date: new Date().toISOString() };
    batch.update(doc(db, "inventoryTransferRequests", requestId), { status: 'Approved', comments: [...request.comments, newComment] });
    
    await batch.commit();
  };
  
  const rejectInventoryTransfer = async (requestId: string, comment: string) => {
     addInventoryTransferComment(requestId, `Rejected: ${comment}`);
     await updateDoc(doc(db, "inventoryTransferRequests", requestId), { status: 'Rejected' });
  };

  const addCertificateRequest = async (itemId: string, requestType: CertificateRequestType, comment: string) => {
    if(!user) return;
    await addDoc(collection(db, "certificateRequests"), {
        itemId: itemId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    });
  };
  
  const addUTMachine = async (data: Omit<UTMachine, 'id' | 'usageLog'>) => {
    await addDoc(collection(db, "utMachines"), { ...data, usageLog: [] });
  };

  const updateUTMachine = async (updatedMachine: UTMachine) => {
    const { id, ...data } = updatedMachine;
    await updateDoc(doc(db, "utMachines", id), data);
  };
  
  const deleteUTMachine = async (machineId: string) => {
    await deleteDoc(doc(db, "utMachines", machineId));
  };

  const addUTMachineLog = async (machineId: string, logData: Omit<UTMachineUsageLog, 'id' | 'date' | 'loggedBy'>) => {
    if(!user) return;
    const machine = utMachines.find(m => m.id === machineId);
    if(!machine) return;

    const newLog: UTMachineUsageLog = {
      ...logData,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      loggedBy: user.id,
    };
    await updateDoc(doc(db, "utMachines", machineId), { usageLog: [...(machine.usageLog || []), newLog] });
  };

  const requestUTMachineCertificate = async (machineId: string, requestType: CertificateRequestType, comment: string) => {
     if(!user) return;
    await addDoc(collection(db, "certificateRequests"), {
        utMachineId: machineId,
        requesterId: user.id,
        requestType,
        status: 'Pending',
        date: new Date().toISOString(),
        comments: [{ userId: user.id, text: comment, date: new Date().toISOString() }],
        isViewedByRequester: true,
    });
  };
  
  const fulfillCertificateRequest = async (requestId: string, comment: string) => {
    if(!user) return;
    const request = certificateRequests.find(r => r.id === requestId);
    if (!request) return;

    const newComment: Comment = { userId: user.id, text: `Fulfilled: ${comment}`, date: new Date().toISOString() };
    await updateDoc(doc(db, "certificateRequests", requestId), { status: 'Fulfilled', isViewedByRequester: false, comments: [...request.comments, newComment] });
  };

  const addCertificateRequestComment = async (requestId: string, text: string) => {
    if(!user) return;
    const request = certificateRequests.find(r => r.id === requestId);
    if(!request) return;

    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    await updateDoc(doc(db, "certificateRequests", requestId), { comments: [...request.comments, newComment] });
  };
  
  const acknowledgeFulfilledUTRequest = async (requestId: string) => {
    await updateDoc(doc(db, "certificateRequests", requestId), { isViewedByRequester: true });
  };

  const addDftMachine = async (data: Omit<DftMachine, 'id' | 'usageLog'>) => {
    await addDoc(collection(db, "dftMachines"), { ...data, usageLog: [] });
  };
  const updateDftMachine = async (updatedMachine: DftMachine) => {
    const { id, ...data } = updatedMachine;
    await updateDoc(doc(db, "dftMachines", id), data);
  };
  const deleteDftMachine = async (machineId: string) => {
    await deleteDoc(doc(db, "dftMachines", machineId));
  };

  const addMobileSim = async (data: Omit<MobileSim, 'id'>) => {
    await addDoc(collection(db, "mobileSims"), data);
  };
  const updateMobileSim = async (updatedItem: MobileSim) => {
    const { id, ...data } = updatedItem;
    await updateDoc(doc(db, "mobileSims", id), data);
  };
  const deleteMobileSim = async (itemId: string) => {
    await deleteDoc(doc(db, "mobileSims", itemId));
  };

  const addOtherEquipment = async (data: Omit<OtherEquipment, 'id'>) => {
    await addDoc(collection(db, "otherEquipments"), data);
  };
  const updateOtherEquipment = async (updatedItem: OtherEquipment) => {
    const { id, ...data } = updatedItem;
    await updateDoc(doc(db, "otherEquipments", id), data);
  };
  const deleteOtherEquipment = async (itemId: string) => {
    await deleteDoc(doc(db, "otherEquipments", itemId));
  };
  
  const addDriver = async (data: Omit<Driver, 'id'>) => {
    await addDoc(collection(db, "drivers"), data);
  };
  const updateDriver = async (updatedDriver: Driver) => {
    const { id, ...data } = updatedDriver;
    await updateDoc(doc(db, "drivers", id), data);
  };
  const deleteDriver = async (driverId: string) => {
    await deleteDoc(doc(db, "drivers", driverId));
  };

  const addVehicle = async (data: Omit<Vehicle, 'id'>) => {
    await addDoc(collection(db, "vehicles"), data);
  };
  const updateVehicle = async (updatedVehicle: Vehicle) => {
    const { id, ...data } = updatedVehicle;
    await updateDoc(doc(db, "vehicles", id), data);
  };
  const deleteVehicle = async (vehicleId: string) => {
    await deleteDoc(doc(db, "vehicles", vehicleId));
  };

  const addInternalRequest = async (data: Omit<InternalRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRequester'>) => {
    if (!user) return;
    const newRequest: Omit<InternalRequest, 'id'> = {
        ...data,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRequester: true
    };
    await addDoc(collection(db, "internalRequests"), newRequest);
  };
  const updateInternalRequest = async (updatedRequest: InternalRequest) => {
    const { id, ...data } = updatedRequest;
    await updateDoc(doc(db, "internalRequests", id), {...data, isViewedByRequester: false });
  };
  const addInternalRequestComment = async (requestId: string, text: string) => {
    if(!user) return;
    const request = internalRequests.find(r => r.id === requestId);
    if (!request) return;
    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    await updateDoc(doc(db, "internalRequests", requestId), { comments: [...(request.comments || []), newComment], isViewedByRequester: false });
  };
  const deleteInternalRequest = async (requestId: string) => {
    await deleteDoc(doc(db, "internalRequests", requestId));
  };
  const markRequestAsViewed = async (requestId: string) => {
    await updateDoc(doc(db, "internalRequests", requestId), { isViewedByRequester: true });
  };
  const forwardInternalRequest = async (requestId: string, role: Role, comment: string) => {
    addInternalRequestComment(requestId, `Forwarded to ${role}: ${comment}`);
    await updateDoc(doc(db, "internalRequests", requestId), { forwardedTo: role });
  };
  const escalateInternalRequest = async (requestId: string, comment: string) => {
    addInternalRequestComment(requestId, `Request Escalated: ${comment}`);
    await updateDoc(doc(db, "internalRequests", requestId), { isEscalated: true, forwardedTo: 'Manager' });
  };

  const addManagementRequest = async (data: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRecipient' | 'isViewedByRequester'>) => {
     if (!user) return;
    const newRequest: Omit<ManagementRequest, 'id'> = {
        ...data,
        requesterId: user.id,
        date: new Date().toISOString(),
        status: 'Pending',
        comments: [{ userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        isViewedByRecipient: false,
        isViewedByRequester: true,
    };
    await addDoc(collection(db, "managementRequests"), newRequest);
  };
  const updateManagementRequest = async (updatedRequest: ManagementRequest) => {
    const { id, ...data } = updatedRequest;
    await updateDoc(doc(db, "managementRequests", id), {...data, isViewedByRequester: false, isViewedByRecipient: false });
  };
  const addManagementRequestComment = async (requestId: string, text: string) => {
    if(!user) return;
    const request = managementRequests.find(r => r.id === requestId);
    if (!request) return;
    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    await updateDoc(doc(db, "managementRequests", requestId), { comments: [...(request.comments || []), newComment], isViewedByRequester: false, isViewedByRecipient: false });
  };
  const markManagementRequestAsViewed = async (requestId: string) => {
    if (!user) return;
    const request = managementRequests.find(r => r.id === requestId);
    if (!request) return;
    if (request.requesterId === user.id) await updateDoc(doc(db, "managementRequests", requestId), { isViewedByRequester: true });
    if (request.recipientId === user.id) await updateDoc(doc(db, "managementRequests", requestId), { isViewedByRecipient: true });
  };
  
  const addAnnouncement = async (data: Pick<Announcement, 'title' | 'content'>) => {
    if (!user || !user.supervisorId) return;
    const newAnnouncement: Omit<Announcement, 'id'> = {
        ...data,
        creatorId: user.id,
        approverId: user.supervisorId,
        date: new Date().toISOString(),
        status: 'pending',
        isViewed: [],
    };
    await addDoc(collection(db, "announcements"), newAnnouncement);
  };
  const updateAnnouncement = async (updatedAnnouncement: Announcement) => {
    const { id, ...data } = updatedAnnouncement;
    await updateDoc(doc(db, "announcements", id), data);
  };
  const approveAnnouncement = async (announcementId: string) => {
    await updateDoc(doc(db, "announcements", announcementId), { status: 'approved' });
  };
  const rejectAnnouncement = async (announcementId: string) => {
    await updateDoc(doc(db, "announcements", announcementId), { status: 'rejected' });
  };
  const returnAnnouncement = async (announcementId: string, commentText: string) => {
    if (!user) return;
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement) return;
    const comment: Comment = {
      userId: user.id,
      text: `Returned for modification: ${commentText}`,
      date: new Date().toISOString(),
    };
    await updateDoc(doc(db, "announcements", announcementId), { status: 'rejected', comments: [...(announcement.comments || []), comment] });
  };
  const deleteAnnouncement = async (announcementId: string) => {
    await deleteDoc(doc(db, "announcements", announcementId));
  };
  const dismissAnnouncement = async (announcementId: string) => {
    if(!user) return;
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement) return;
    await updateDoc(doc(db, "announcements", announcementId), { isViewed: [...announcement.isViewed, user.id] });
  };
  
  const addIncidentReport = async (data: Omit<IncidentReport, 'id' | 'reporterId' | 'reportTime' | 'status' | 'comments' | 'isPublished' | 'reportedToUserIds'>) => {
    if(!user) return;
    const supervisorId = user.supervisorId;
    const hseUser = users.find(u => u.role === 'HSE');
    const reportedToUserIds = [supervisorId, hseUser?.id].filter(Boolean) as string[];
    
    const newIncident: Omit<IncidentReport, 'id'> = {
        ...data,
        reporterId: user.id,
        reportedToUserIds: reportedToUserIds,
        reportTime: new Date().toISOString(),
        status: 'New',
        isPublished: false,
        comments: [{ userId: user.id, text: 'Incident reported.', date: new Date().toISOString() }],
    };
    await addDoc(collection(db, "incidents"), newIncident);
  };
  
  const updateIncident = async (updatedIncident: IncidentReport) => {
    const { id, ...data } = updatedIncident;
    await updateDoc(doc(db, "incidents", id), data);
  };
  
  const addIncidentComment = async (incidentId: string, text: string) => {
    if(!user) return;
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    await updateDoc(doc(db, "incidents", incidentId), { comments: [...(incident.comments || []), newComment] });
  };

  const publishIncident = async (incidentId: string) => {
    await updateDoc(doc(db, "incidents", incidentId), { isPublished: true });
  };
  
  const addUsersToIncidentReport = async (incidentId: string, userIds: string[]) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    await updateDoc(doc(db, "incidents", incidentId), { reportedToUserIds: Array.from(new Set([...(incident.reportedToUserIds || []), ...userIds])) });
  };
  
  const addManualAchievement = async (data: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => {
    if (!user) return;
    const isAdminOrManager = user.role === 'Admin' || user.role === 'Manager';
    const newAchievement: Omit<Achievement, 'id'> = {
        ...data,
        type: 'manual',
        awardedById: user.id,
        date: new Date().toISOString(),
        status: isAdminOrManager ? 'approved' : 'pending',
    };
    await addDoc(collection(db, "achievements"), newAchievement);
  };
  
  const updateManualAchievement = async (updatedAchievement: Achievement) => {
    const { id, ...data } = updatedAchievement;
    await updateDoc(doc(db, "achievements", id), data);
  };
  
  const approveAchievement = async (achievementId: string, points: number) => {
    await updateDoc(doc(db, "achievements", achievementId), { status: 'approved', points });
  };

  const rejectAchievement = async (achievementId: string) => {
    await updateDoc(doc(db, "achievements", achievementId), { status: 'rejected' });
  };

  const deleteManualAchievement = async (achievementId: string) => {
    await deleteDoc(doc(db, "achievements", achievementId));
  };
  
  const addPlannerEvent = async (data: Omit<PlannerEvent, 'id' | 'comments'>) => {
    const newEvent: Omit<PlannerEvent, 'id'> = {
        ...data,
        comments: [],
    };
    await addDoc(collection(db, "plannerEvents"), newEvent);
  };
  
  const updatePlannerEvent = async (updatedEvent: PlannerEvent) => {
    const { id, ...data } = updatedEvent;
    await updateDoc(doc(db, "plannerEvents", id), data);
  };
  
  const deletePlannerEvent = async (eventId: string) => {
    await deleteDoc(doc(db, "plannerEvents", eventId));
  };

  const addPlannerEventComment = async (eventId: string, text: string) => {
    if (!user) return;
    const event = plannerEvents.find(e => e.id === eventId);
    if (!event) return;
    const newComment: Comment = {
      userId: user.id,
      text,
      date: new Date().toISOString(),
    };
    await updateDoc(doc(db, "plannerEvents", eventId), { comments: [...(event.comments || []), newComment] });
  };
  
  const addDailyPlannerComment = async (plannerUserId: string, date: Date, text: string) => {
    if (!user) return;
    const dayKey = format(date, 'yyyy-MM-dd');
    const existingEntry = dailyPlannerComments.find(dpc => dpc.day === dayKey && dpc.plannerUserId === plannerUserId);
    const newComment: Comment = { userId: user.id, text, date: new Date().toISOString() };
    
    if (existingEntry) {
        await updateDoc(doc(db, "dailyPlannerComments", existingEntry.id), { comments: [...existingEntry.comments, newComment] });
    } else {
        await addDoc(collection(db, "dailyPlannerComments"), {
            plannerUserId,
            day: dayKey,
            comments: [newComment]
        });
    }
  };

  const updateDailyPlannerComment = async (commentId: string, plannerUserId: string, day: string, newText: string) => {
    const dayEntry = dailyPlannerComments.find(dpc => dpc.day === day && dpc.plannerUserId === plannerUserId);
    if (!dayEntry) return;

    const updatedComments = dayEntry.comments.map(c => c.id === commentId ? { ...c, text: newText } : c);
    await updateDoc(doc(db, "dailyPlannerComments", dayEntry.id), { comments: updatedComments });
  };

  const deleteDailyPlannerComment = async (commentId: string, plannerUserId: string, day: string) => {
     const dayEntry = dailyPlannerComments.find(dpc => dpc.day === day && dpc.plannerUserId === plannerUserId);
     if (!dayEntry) return;

     const updatedComments = dayEntry.comments.filter(c => c.id !== commentId);
     await updateDoc(doc(db, "dailyPlannerComments", dayEntry.id), { comments: updatedComments });
  };

  const deleteAllDailyPlannerComments = async (plannerUserId: string, day: string) => {
    const dayEntry = dailyPlannerComments.find(dpc => dpc.day === day && dpc.plannerUserId === plannerUserId);
    if (!dayEntry) return;
    await deleteDoc(doc(db, "dailyPlannerComments", dayEntry.id));
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
