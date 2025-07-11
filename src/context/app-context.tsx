
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { User, Task, PlannerEvent, Comment, Role, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from '../lib/types';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
    if (isAuthLoading) return;
    if (!user) {
        setIsDataLoading(false);
        // Clear all data if user logs out
        setUsers([]); setRoles([]); setTasks([]); setProjects([]);
        setInventoryItems([]); setInventoryTransferRequests([]); setCertificateRequests([]);
        setPlannerEvents([]); setDailyPlannerComments([]); setAchievements([]);
        setActivityLogs([]); setManpowerLogs([]); setManpowerProfiles([]);
        setUtMachines([]); setDftMachines([]); setMobileSims([]); setOtherEquipments([]);
        setVehicles([]); setDrivers([]); setInternalRequests([]); setManagementRequests([]);
        setAnnouncements([]); setIncidents([]);
        return;
    }

    setIsDataLoading(true);
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
      }, (error) => {
        console.error(`Error fetching ${name}:`, error);
        toast({ variant: 'destructive', title: `Error loading ${name}`, description: 'Could not fetch data from the database.' });
      })
    );
    
    const settingsDoc = doc(db, 'settings', 'branding');
    const unsubSettings = onSnapshot(settingsDoc, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            setAppName(data.appName || 'TaskMaster Pro');
            setAppLogo(data.appLogo || null);
        }
    });

    unsubscribes.push(unsubSettings);


    const loadingTimeout = setTimeout(() => {
        setIsDataLoading(false);
    }, 1500); // Give it a moment to fetch initial data

    return () => {
      unsubscribes.forEach(unsub => unsub());
      clearTimeout(loadingTimeout);
    };
  }, [user, isAuthLoading, toast]);


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
      setAppName(name);
      setAppLogo(logo);
      try {
        await setDoc(doc(db, 'settings', 'branding'), { appName: name, appLogo: logo });
      } catch (error) {
        console.error("Error updating branding:", error);
        toast({ variant: 'destructive', title: 'Could not save branding settings.'});
      }
  }, [toast]);
  
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
  
  // Generic CRUD Functions
  const addDocToCollection = useCallback(async (collectionName: string, data: any) => {
    try {
      await addDoc(collection(db, collectionName), data);
    } catch (e) {
      console.error(`Error adding document to ${collectionName}:`, e);
    }
  }, []);

  const updateDocInCollection = useCallback(async (collectionName: string, docId: string, data: any) => {
    try {
      const { id, ...rest } = data;
      await updateDoc(doc(db, collectionName, docId), rest);
    } catch (e) {
      console.error(`Error updating document in ${collectionName}:`, e);
    }
  }, []);

  const deleteDocFromCollection = useCallback(async (collectionName: string, docId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (e) {
      console.error(`Error deleting document from ${collectionName}:`, e);
    }
  }, []);

  const approvedAnnouncements = useMemo(() => {
    return announcements.filter(a => a.status === 'approved');
  }, [announcements]);

  const myFulfilledUTRequests = useMemo(() => {
    if (!user) return [];
    return certificateRequests.filter(req => req.requesterId === user.id && req.status === 'Fulfilled' && !req.isViewedByRequester);
  }, [certificateRequests, user]);
  
  const addCommentToDoc = useCallback(async (collectionName: string, docId: string, text: string) => {
    if (!user) return;
    const docRef = doc(db, collectionName, docId);
    try {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        text,
        date: new Date().toISOString(),
      };
      await updateDoc(docRef, { comments: arrayUnion(newComment) });
    } catch (e) {
        console.error(`Error adding comment to ${collectionName}:`, e);
    }
  }, [user]);

  const value = {
      users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, 
      isDataLoading,
      updateBranding,
      getExpandedPlannerEvents,
      getVisibleUsers,
      approvedAnnouncements,
      myFulfilledUTRequests,
      
      // User Functions
      addUser: (data: any) => {
        const { supervisorId, ...rest } = data;
        const dataToSave = supervisorId ? { supervisorId, ...rest } : rest;
        addDocToCollection('users', dataToSave);
      },
      updateUser: (data: User) => updateDocInCollection('users', data.id, data),
      deleteUser: (id: string) => deleteDocFromCollection('users', id),
      updateProfile: (name: string, email: string, avatar: string, password?: string) => {
        if (user) {
          const dataToUpdate: Partial<User> = { name, email, avatar };
          // Password changes should ideally be handled by a dedicated Firebase Auth flow, not directly in Firestore.
          // This is a simplified approach for this context.
          if (password) dataToUpdate.password = password;
          updateDocInCollection('users', user.id, dataToUpdate);
        }
      },
      updateUserPlanningScore: (userId: string, newScore: number) => updateDocInCollection('users', userId, { planningScore: newScore }),

      // Project Functions
      addProject: (name: string) => addDocToCollection('projects', { name }),
      updateProject: (data: Project) => updateDocInCollection('projects', data.id, data),
      deleteProject: (id: string) => deleteDocFromCollection('projects', id),

      // Role Functions
      addRole: (data: Omit<RoleDefinition, 'id'>) => addDocToCollection('roles', {...data, isEditable: true}),
      updateRole: (data: RoleDefinition) => updateDocInCollection('roles', data.id, data),
      deleteRole: (id: string) => deleteDocFromCollection('roles', id),

      // Task Functions
      addTask: (data: Omit<Task, 'id'|'status'|'isViewedByAssignee'|'approvalState'|'comments'>) => addDocToCollection('tasks', {...data, status: 'To Do', isViewedByAssignee: false, approvalState: 'none', comments: []}),
      updateTask: (data: Task) => updateDocInCollection('tasks', data.id, data),
      deleteTask: (id: string) => deleteDocFromCollection('tasks', id),
      addComment: (taskId: string, text: string) => addCommentToDoc('tasks', taskId, text),
      requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, comment: string, attachment?: Task['attachment']) => {
        if (!user) return;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const dataToUpdate: Partial<Task> = {
          status: 'Pending Approval',
          previousStatus: task.status,
          pendingStatus: newStatus,
          approvalState: 'pending'
        };
        if (attachment) dataToUpdate.attachment = attachment;
        
        updateDocInCollection('tasks', taskId, dataToUpdate);
        addCommentToDoc('tasks', taskId, `Status change to ${newStatus} requested: ${comment}`);
      },
      approveTaskStatusChange: (taskId: string, comment: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || (!task.pendingStatus && !task.pendingAssigneeId)) return;
        
        const dataToUpdate: Partial<Task> = {
            status: task.pendingStatus || task.status,
            completionDate: task.pendingStatus === 'Completed' ? new Date().toISOString() : undefined,
            approvalState: 'approved',
            assigneeId: task.pendingAssigneeId || task.assigneeId,
            pendingStatus: undefined,
            previousStatus: undefined,
            pendingAssigneeId: undefined,
        };

        updateDocInCollection('tasks', taskId, dataToUpdate);
        addCommentToDoc('tasks', taskId, `Request Approved: ${comment}`);
      },
      returnTaskStatusChange: (taskId: string, comment: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const dataToUpdate: Partial<Task> = {
          status: task.previousStatus || task.status,
          approvalState: 'returned',
          pendingStatus: undefined,
          previousStatus: undefined,
          pendingAssigneeId: undefined,
        };
        updateDocInCollection('tasks', taskId, dataToUpdate);
        addCommentToDoc('tasks', taskId, `Request Returned: ${comment}`);
      },
      markTaskAsViewed: (taskId: string) => updateDocInCollection('tasks', taskId, { isViewedByAssignee: true }),
      requestTaskReassignment: (taskId: string, newAssigneeId: string, comment: string) => {
          const task = tasks.find(t => t.id === taskId);
          if(!task) return;
          updateDocInCollection('tasks', taskId, {
            status: 'Pending Approval',
            approvalState: 'pending',
            previousStatus: task.status,
            pendingAssigneeId: newAssigneeId,
          });
          addCommentToDoc('tasks', taskId, `Reassignment requested to ${users.find(u => u.id === newAssigneeId)?.name}: ${comment}`);
      },

      addManpowerProfile: (data: any) => addDocToCollection('manpowerProfiles', data),
      updateManpowerProfile: (data: ManpowerProfile) => updateDocInCollection('manpowerProfiles', data.id, data),
      deleteManpowerProfile: (id: string) => deleteDocFromCollection('manpowerProfiles', id),
      addManpowerLog: (data: any) => addDocToCollection('manpowerLogs', {...data, date: format(new Date(), 'yyyy-MM-dd'), updatedBy: user?.id}),
      
      addInventoryItem: (data: any) => addDocToCollection('inventoryItems', data),
      updateInventoryItem: (data: InventoryItem) => updateDocInCollection('inventoryItems', data.id, data),
      deleteInventoryItem: (id: string) => deleteDocFromCollection('inventoryItems', id),
      addMultipleInventoryItems: async (items: any[]) => {
        if (!user) return 0;
        const allItemsSnapshot = await getDocs(collection(db, 'inventoryItems'));
        const existingSerialNumbers = new Map(allItemsSnapshot.docs.map(doc => [doc.data().serialNumber, doc.id]));
        
        const batch = writeBatch(db);
        let importedCount = 0;

        for (const item of items) {
          const serialNumber = item['SERIAL NUMBER']?.toString().trim();
          if (!serialNumber) continue;

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

          const existingId = existingSerialNumbers.get(serialNumber);
          if (existingId) {
            batch.update(doc(db, 'inventoryItems', existingId), newItemData);
          } else {
            batch.set(doc(collection(db, 'inventoryItems')), newItemData);
          }
          importedCount++;
        }
        await batch.commit();
        return importedCount;
      },
      requestInventoryTransfer: (itemsToTransfer: InventoryItem[], fromProjectId: string, toProjectId: string, comment: string) => {
        if(!user) return;
        const newRequest = {
            items: itemsToTransfer,
            fromProjectId, toProjectId,
            requesterId: user.id,
            date: new Date().toISOString(),
            status: 'Pending',
            comments: [{ id: `c-${Date.now()}`, userId: user.id, text: comment, date: new Date().toISOString() }],
        };
        addDocToCollection('inventoryTransferRequests', newRequest);
      },
      approveInventoryTransfer: async (requestId: string, comment: string) => {
        if(!user) return;
        const request = inventoryTransferRequests.find(r => r.id === requestId);
        if (!request) return;
        
        const batch = writeBatch(db);
        // Move items
        request.items.forEach(item => {
            const itemRef = doc(db, 'inventoryItems', item.id);
            batch.update(itemRef, { projectId: request.toProjectId, location: projects.find(p => p.id === request.toProjectId)?.name });
        });
        // Update request status
        const requestRef = doc(db, 'inventoryTransferRequests', requestId);
        const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text: `Approved: ${comment}`, date: new Date().toISOString() };
        batch.update(requestRef, { status: 'Approved', comments: arrayUnion(newComment) });
        await batch.commit();
      },
      rejectInventoryTransfer: (requestId: string, comment: string) => {
        if(!user) return;
        const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text: `Rejected: ${comment}`, date: new Date().toISOString() };
        updateDocInCollection('inventoryTransferRequests', requestId, { status: 'Rejected', comments: arrayUnion(newComment) });
      },
      
      addUTMachine: (data: any) => addDocToCollection('utMachines', {...data, usageLog: []}),
      updateUTMachine: (data: UTMachine) => updateDocInCollection('utMachines', data.id, data),
      deleteUTMachine: (id: string) => deleteDocFromCollection('utMachines', id),
      addUTMachineLog: (machineId: string, logData: any) => {
        if (!user) return;
        const newLog = { ...logData, id: `log-${Date.now()}`, date: new Date().toISOString(), loggedBy: user.id };
        updateDocInCollection('utMachines', machineId, { usageLog: arrayUnion(newLog) });
      },
      requestUTMachineCertificate: (machineId: string, requestType: CertificateRequestType, comment: string) => {
        if (!user) return;
        const newRequest = {
            utMachineId: machineId, requesterId: user.id, requestType,
            status: 'Pending', date: new Date().toISOString(),
            comments: [{ userId: user.id, text: comment, date: new Date().toISOString(), id: `c-${Date.now()}`}]
        };
        addDocToCollection('certificateRequests', newRequest);
      },
      fulfillCertificateRequest: (requestId: string, comment: string) => {
        if (!user) return;
        const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text: `Fulfilled: ${comment}`, date: new Date().toISOString() };
        updateDocInCollection('certificateRequests', requestId, { status: 'Fulfilled', isViewedByRequester: false, comments: arrayUnion(newComment) });
      },
      addCertificateRequestComment: (requestId: string, text: string) => addCommentToDoc('certificateRequests', requestId, text),
      acknowledgeFulfilledUTRequest: (requestId: string) => updateDocInCollection('certificateRequests', requestId, { isViewedByRequester: true }),

      addDftMachine: (data: any) => addDocToCollection('dftMachines', {...data, usageLog: []}),
      updateDftMachine: (data: DftMachine) => updateDocInCollection('dftMachines', data.id, data),
      deleteDftMachine: (id: string) => deleteDocFromCollection('dftMachines', id),

      addMobileSim: (data: any) => addDocToCollection('mobileSims', data),
      updateMobileSim: (data: MobileSim) => updateDocInCollection('mobileSims', data.id, data),
      deleteMobileSim: (id: string) => deleteDocFromCollection('mobileSims', id),

      addOtherEquipment: (data: any) => addDocToCollection('otherEquipments', data),
      updateOtherEquipment: (data: OtherEquipment) => updateDocInCollection('otherEquipments', data.id, data),
      deleteOtherEquipment: (id: string) => deleteDocFromCollection('otherEquipments', id),

      addDriver: (data: any) => addDocToCollection('drivers', data),
      updateDriver: (data: Driver) => updateDocInCollection('drivers', data.id, data),
      deleteDriver: (id: string) => deleteDocFromCollection('drivers', id),

      addVehicle: (data: any) => addDocToCollection('vehicles', data),
      updateVehicle: (data: Vehicle) => updateDocInCollection('vehicles', data.id, data),
      deleteVehicle: (id: string) => deleteDocFromCollection('vehicles', id),
      
      addInternalRequest: (data: Omit<InternalRequest, 'id'>) => {
        if(!user) return;
        const newRequest: Partial<InternalRequest> = {
            ...data,
            requesterId: user.id,
            date: new Date().toISOString(),
            status: 'Pending',
            isViewedByRequester: true,
            comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        }
        addDocToCollection('internalRequests', newRequest);
      },
      updateInternalRequest: (data: InternalRequest) => updateDocInCollection('internalRequests', data.id, {...data, isViewedByRequester: false}),
      deleteInternalRequest: (id: string) => deleteDocFromCollection('internalRequests', id),
      addInternalRequestComment: (requestId: string, text: string) => {
        addCommentToDoc('internalRequests', requestId, text);
        updateDocInCollection('internalRequests', requestId, { isViewedByRequester: false });
      },
      markRequestAsViewed: (requestId: string) => updateDocInCollection('internalRequests', requestId, { isViewedByRequester: true }),
      forwardInternalRequest: (requestId: string, role: Role, comment: string) => {
        updateDocInCollection('internalRequests', requestId, { forwardedTo: role });
        addCommentToDoc('internalRequests', requestId, `Forwarded to ${role}: ${comment}`);
      },
      escalateInternalRequest: (requestId: string, comment: string) => {
        updateDocInCollection('internalRequests', requestId, { isEscalated: true, forwardedTo: 'Manager' });
        addCommentToDoc('internalRequests', requestId, `Request Escalated: ${comment}`);
      },
      
      addManagementRequest: (data: Omit<ManagementRequest, 'id' | 'requesterId' | 'date' | 'status' | 'comments' | 'isViewedByRecipient' | 'isViewedByRequester'>) => {
        if(!user) return;
        const newRequest: Partial<ManagementRequest> = {
            ...data,
            requesterId: user.id,
            date: new Date().toISOString(),
            status: 'Pending',
            isViewedByRecipient: false,
            isViewedByRequester: true,
            comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Request created.', date: new Date().toISOString() }],
        }
        addDocToCollection('managementRequests', newRequest);
      },
      updateManagementRequest: (data: ManagementRequest) => updateDocInCollection('managementRequests', data.id, {...data, isViewedByRecipient: false, isViewedByRequester: false }),
      addManagementRequestComment: (requestId: string, text: string) => {
        addCommentToDoc('managementRequests', requestId, text);
        updateDocInCollection('managementRequests', requestId, { isViewedByRecipient: false, isViewedByRequester: false });
      },
      markManagementRequestAsViewed: (requestId: string) => {
          const request = managementRequests.find(r => r.id === requestId);
          if(!request || !user) return;
          if(user.id === request.requesterId) {
            updateDocInCollection('managementRequests', requestId, { isViewedByRequester: true });
          } else if(user.id === request.recipientId) {
            updateDocInCollection('managementRequests', requestId, { isViewedByRecipient: true });
          }
      },
      
      addAnnouncement: (data: Pick<Announcement, 'title' | 'content'>) => {
        if(!user || !user.supervisorId) {
          toast({ variant: 'destructive', title: 'Cannot create announcement', description: 'You do not have a supervisor assigned to approve your announcement.' });
          return;
        }
        const newAnnouncement: Partial<Announcement> = {
            ...data,
            creatorId: user.id,
            approverId: user.supervisorId,
            date: new Date().toISOString(),
            status: 'pending',
            isViewed: [],
        }
        addDocToCollection('announcements', newAnnouncement);
      },
      updateAnnouncement: (data: Announcement) => updateDocInCollection('announcements', data.id, data),
      approveAnnouncement: (id: string) => updateDocInCollection('announcements', id, { status: 'approved' }),
      rejectAnnouncement: (id: string) => updateDocInCollection('announcements', id, { status: 'rejected' }),
      deleteAnnouncement: (id: string) => deleteDocFromCollection('announcements', id),
      returnAnnouncement: (id: string, comment: string) => {
         if(!user) return;
         updateDocInCollection('announcements', id, { status: 'rejected', comments: arrayUnion({ userId: user.id, text: `Returned for modification: ${comment}`, date: new Date().toISOString() }) });
      },
      dismissAnnouncement: (id: string) => {
        if(!user) return;
        updateDocInCollection('announcements', id, { isViewed: arrayUnion(user.id) });
      },
      
      addIncidentReport: (data: any) => {
        if(!user) return;
        const supervisorId = user.supervisorId;
        const hseUser = users.find(u => u.role === 'HSE');
        const reportedToUserIds = [supervisorId, hseUser?.id].filter(Boolean) as string[];
        
        const newIncident: Partial<IncidentReport> = {
            ...data,
            reporterId: user.id,
            reportedToUserIds,
            reportTime: new Date().toISOString(),
            status: 'New',
            isPublished: false,
            comments: [{ id: `c-${Date.now()}`, userId: user.id, text: 'Incident reported.', date: new Date().toISOString() }],
        }
        addDocToCollection('incidents', newIncident);
      },
      updateIncident: (data: IncidentReport) => updateDocInCollection('incidents', data.id, data),
      addIncidentComment: (id: string, text: string) => addCommentToDoc('incidents', id, text),
      publishIncident: (id: string) => updateDocInCollection('incidents', id, { isPublished: true }),
      addUsersToIncidentReport: (id: string, userIds: string[]) => {
          updateDocInCollection('incidents', id, { reportedToUserIds: arrayUnion(...userIds) });
      },
      
      addManualAchievement: (data: any) => {
        if(!user) return;
        const isAdminOrManager = user.role === 'Admin' || user.role === 'Manager';
        const newAchievement = {
            ...data,
            type: 'manual',
            awardedById: user.id,
            date: new Date().toISOString(),
            status: isAdminOrManager ? 'approved' : 'pending',
        };
        addDocToCollection('achievements', newAchievement);
      },
      updateManualAchievement: (data: Achievement) => updateDocInCollection('achievements', data.id, data),
      approveAchievement: (id: string, points: number) => updateDocInCollection('achievements', id, { status: 'approved', points }),
      rejectAchievement: (id: string) => updateDocInCollection('achievements', id, { status: 'rejected' }),
      deleteManualAchievement: (id: string) => deleteDocFromCollection('achievements', id),

      addPlannerEvent: (data: any) => addDocToCollection('plannerEvents', data),
      updatePlannerEvent: (data: PlannerEvent) => updateDocInCollection('plannerEvents', data.id, data),
      deletePlannerEvent: (id: string) => deleteDocFromCollection('plannerEvents', id),
      addPlannerEventComment: (eventId: string, text: string) => addCommentToDoc('plannerEvents', eventId, text),
      
      addDailyPlannerComment: async (plannerUserId: string, date: Date, text: string) => {
        if(!user) return;
        const dayKey = format(date, 'yyyy-MM-dd');
        const q = query(collection(db, 'dailyPlannerComments'), where('day', '==', dayKey), where('plannerUserId', '==', plannerUserId));
        const querySnapshot = await getDocs(q);
        const newComment: Comment = { id: `c-${Date.now()}`, userId: user.id, text, date: new Date().toISOString() };
        if(querySnapshot.empty) {
            addDocToCollection('dailyPlannerComments', { day: dayKey, plannerUserId, comments: [newComment] });
        } else {
            const docId = querySnapshot.docs[0].id;
            updateDocInCollection('dailyPlannerComments', docId, { comments: arrayUnion(newComment) });
        }
      },
      updateDailyPlannerComment: async (commentId: string, plannerUserId: string, day: string, newText: string) => {
         const q = query(collection(db, 'dailyPlannerComments'), where('day', '==', day), where('plannerUserId', '==', plannerUserId));
         const querySnapshot = await getDocs(q);
         if(!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            const existingData = querySnapshot.docs[0].data() as DailyPlannerComment;
            const updatedComments = existingData.comments.map(c => c.id === commentId ? {...c, text: newText} : c);
            updateDocInCollection('dailyPlannerComments', docId, { comments: updatedComments });
         }
      },
      deleteDailyPlannerComment: async (commentId: string, plannerUserId: string, day: string) => {
          const q = query(collection(db, 'dailyPlannerComments'), where('day', '==', day), where('plannerUserId', '==', plannerUserId));
          const querySnapshot = await getDocs(q);
          if(!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            const existingData = querySnapshot.docs[0].data() as DailyPlannerComment;
            const updatedComments = existingData.comments.filter(c => c.id !== commentId);
            updateDocInCollection('dailyPlannerComments', docId, { comments: updatedComments });
          }
      },
      deleteAllDailyPlannerComments: async (plannerUserId: string, day: string) => {
           const q = query(collection(db, 'dailyPlannerComments'), where('day', '==', day), where('plannerUserId', '==', plannerUserId));
           const querySnapshot = await getDocs(q);
           if(!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                deleteDocFromCollection('dailyPlannerComments', docId);
           }
      },
  };
    
  // Placeholder for derived state (notifications)
  const derivedState = {
    pendingStoreRequestCount: 0,
    myRequestUpdateCount: 0,
    pendingCertificateRequestCount: 0,
    myCertificateRequestUpdateCount: 0,
    workingManpowerCount: 0,
    onLeaveManpowerCount: 0,
    pendingAnnouncementCount: 0,
    unreadAnnouncementCount: 0,
    newIncidentCount: 0,
    myUnreadManagementRequestCount: 0,
    unreadManagementRequestCountForMe: 0,
    expiringVehicleDocsCount: 0,
    expiringDriverDocsCount: 0,
    expiringUtMachineCalibrationsCount: 0,
    expiringManpowerCount: 0,
    pendingTaskApprovalCount: 0,
    myNewTaskCount: 0,
  };


  const contextValue = { ...value, ...derivedState };

  return <AppContext.Provider value={contextValue as any}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
