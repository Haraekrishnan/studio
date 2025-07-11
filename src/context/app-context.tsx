'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, CertificateRequestType, ManpowerLog, UTMachine, Vehicle, UTMachineUsageLog, ManpowerProfile, Trade, ManagementRequest, DftMachine, MobileSim, OtherEquipment, Driver, Announcement, IncidentReport } from './types';
import { addDays, isBefore, eachDayOfInterval, endOfMonth, isSameDay, isWeekend, startOfDay, differenceInMinutes, format, differenceInDays, subDays, startOfMonth, isPast, isAfter } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, query, where, getDocs } from 'firebase/firestore';
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
    if (isAuthLoading) return; // Wait for authentication to resolve
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

    setIsDataLoading(false);

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user, isAuthLoading, toast]);


  const getVisibleUsers = useCallback(() => {
    if (!user) return [];

    const userRole = roles.find(r => r.name === user.role);
    if (!userRole) return [user];

    if (userRole.permissions.includes('view_all_users')) return users;
    if (userRole.permissions.includes('view_subordinates_users')) {
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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        text,
        date: new Date().toISOString(),
      };
      const updatedComments = [...(docData.comments || []), newComment];
      await updateDoc(docRef, { comments: updatedComments });
    }
  }, [user]);

  const value = {
      user, users, roles, tasks, projects, inventoryItems, inventoryTransferRequests, certificateRequests, plannerEvents, dailyPlannerComments, achievements, activityLogs, manpowerLogs, manpowerProfiles, utMachines, dftMachines, mobileSims, otherEquipments, vehicles, drivers, appName, appLogo, internalRequests, managementRequests, announcements, incidents, 
      isDataLoading,
      updateBranding,
      getExpandedPlannerEvents,
      getVisibleUsers,
      approvedAnnouncements,
      myFulfilledUTRequests,
      
      // User Functions
      addUser: (data: any) => addDocToCollection('users', data),
      updateUser: (data: User) => updateDocInCollection('users', data.id, data),
      deleteUser: (id: string) => deleteDocFromCollection('users', id),
      updateProfile: (name: string, email: string, avatar: string, password?: string) => {
        if (user) {
          const dataToUpdate: Partial<User> = { name, email, avatar };
          if (password) dataToUpdate.password = password; // Hashing should be done server-side in a real app
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
        if (!task || !task.pendingStatus) return;

        const dataToUpdate: Partial<Task> = {
          status: task.pendingStatus,
          completionDate: task.pendingStatus === 'Completed' ? new Date().toISOString() : undefined,
          approvalState: 'approved',
          pendingStatus: undefined,
          previousStatus: undefined,
        };
        updateDocInCollection('tasks', taskId, dataToUpdate);
        addCommentToDoc('tasks', taskId, `Request Approved: ${comment}`);
      },
      returnTaskStatusChange: (taskId: string, comment: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.previousStatus) return;
        
        const dataToUpdate: Partial<Task> = {
          status: task.previousStatus,
          approvalState: 'returned',
          pendingStatus: undefined,
          previousStatus: undefined,
        };
        updateDocInCollection('tasks', taskId, dataToUpdate);
        addCommentToDoc('tasks', taskId, `Request Returned: ${comment}`);
      },
      markTaskAsViewed: (taskId: string) => updateDocInCollection('tasks', taskId, { isViewedByAssignee: true }),
      requestTaskReassignment: (taskId: string, newAssigneeId: string, comment: string) => {
          updateDocInCollection('tasks', taskId, {
            status: 'Pending Approval',
            approvalState: 'pending',
            pendingAssigneeId: newAssigneeId,
          });
          addCommentToDoc('tasks', taskId, `Reassignment requested to ${users.find(u => u.id === newAssigneeId)?.name}: ${comment}`);
      },

      // Other entities...
      addManpowerProfile: (data: any) => addDocToCollection('manpowerProfiles', data),
      updateManpowerProfile: (data: ManpowerProfile) => updateDocInCollection('manpowerProfiles', data.id, data),
      deleteManpowerProfile: (id: string) => deleteDocFromCollection('manpowerProfiles', id),
      addManpowerLog: (data: any) => addDocToCollection('manpowerLogs', {...data, date: format(new Date(), 'yyyy-MM-dd'), updatedBy: user?.id}),
      
      addInventoryItem: (data: any) => addDocToCollection('inventoryItems', data),
      updateInventoryItem: (data: InventoryItem) => updateDocInCollection('inventoryItems', data.id, data),
      deleteInventoryItem: (id: string) => deleteDocFromCollection('inventoryItems', id),
      
      addUTMachine: (data: any) => addDocToCollection('utMachines', {...data, usageLog: []}),
      updateUTMachine: (data: UTMachine) => updateDocInCollection('utMachines', data.id, data),
      deleteUTMachine: (id: string) => deleteDocFromCollection('utMachines', id),
      addUTMachineLog: (machineId: string, logData: any) => {
        const machine = utMachines.find(m => m.id === machineId);
        if (machine) {
            const newLog = { ...logData, id: `log-${Date.now()}`, date: new Date().toISOString(), loggedBy: user?.id };
            const updatedLogs = [...(machine.usageLog || []), newLog];
            updateDocInCollection('utMachines', machineId, { usageLog: updatedLogs });
        }
      },
      requestUTMachineCertificate: (machineId: string, requestType: CertificateRequestType, comment: string) => {
        if (!user) return;
        const newRequest = {
            utMachineId: machineId,
            requesterId: user.id,
            requestType,
            status: 'Pending',
            date: new Date().toISOString(),
            comments: [{ userId: user.id, text: comment, date: new Date().toISOString(), id: `c-${Date.now()}`}]
        };
        addDocToCollection('certificateRequests', newRequest);
      },

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
      updateInternalRequest: (data: InternalRequest) => updateDocInCollection('internalRequests', data.id, data),
      deleteInternalRequest: (id: string) => deleteDocFromCollection('internalRequests', id),
      addInternalRequestComment: (requestId: string, text: string) => addCommentToDoc('internalRequests', requestId, text),
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
      updateManagementRequest: (data: ManagementRequest) => updateDocInCollection('managementRequests', data.id, data),
      addManagementRequestComment: (requestId: string, text: string) => addCommentToDoc('managementRequests', requestId, text),
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
         // In a real app, you might have a different status like 'returned'. For now, just add a comment.
         addCommentToDoc('announcements', id, `Returned for modification: ${comment}`);
      },
      dismissAnnouncement: (id: string) => {
        if(!user) return;
        const announcement = announcements.find(a => a.id === id);
        if(announcement && !announcement.isViewed.includes(user.id)) {
            updateDocInCollection('announcements', id, { isViewed: [...announcement.isViewed, user.id] });
        }
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
        const incident = incidents.find(i => i.id === id);
        if(!incident) return;
        const updatedUserIds = Array.from(new Set([...(incident.reportedToUserIds || []), ...userIds]));
        updateDocInCollection('incidents', id, { reportedToUserIds: updatedUserIds });
      },
      
      // Other functions to be implemented...
      addMultipleInventoryItems: () => {},
      approveInventoryTransfer: () => {},
      rejectInventoryTransfer: () => {},
      addInventoryTransferComment: () => {},
      addCertificateRequest: () => {},
      fulfillCertificateRequest: () => {},
      addCertificateRequestComment: () => {},
      markCertificateRequestAsViewed: () => {},
      approveManualAchievement: () => {},
      rejectManualAchievement: () => {},
      deleteManualAchievement: () => {},
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
