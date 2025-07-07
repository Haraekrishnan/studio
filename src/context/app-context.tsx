'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Priority, User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS, ACTIVITY_LOGS, DAILY_PLANNER_COMMENTS, ROLES as MOCK_ROLES } from '@/lib/mock-data';
import { addMonths, eachDayOfInterval, endOfMonth, isMatch, isSameDay, isWeekend, startOfMonth, differenceInMinutes, format } from 'date-fns';

interface PpeRequestData {
    title: string;
    description: string;
    department: string;
    items: string;
    expectedDate: Date;
    priority: Priority;
    remarks: string;
}

interface AppContextType {
  user: User | null;
  users: User[];
  roles: RoleDefinition[];
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  dailyPlannerComments: DailyPlannerComment[];
  achievements: Achievement[];
  activityLogs: ActivityLog[];
  appName: string;
  appLogo: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState' | 'completionDateIsMandatory'>) => void;
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
  updateProfile: (name: string, email: string, avatar: string) => void;
  requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => boolean;
  approveTaskStatusChange: (taskId: string, commentText: string) => void;
  returnTaskStatusChange: (taskId: string, commentText: string) => void;
  addComment: (taskId: string, commentText: string) => void;
  addManualAchievement: (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => void;
  approveAchievement: (achievementId: string, points: number) => void;
  rejectAchievement: (achievementId: string) => void;
  updateManualAchievement: (achievement: Achievement) => void;
  deleteManualAchievement: (achievementId: string) => void;
  addPlannerEventComment: (eventId: string, commentText: string) => void;
  addDailyPlannerComment: (plannerUserId: string, date: Date, commentText: string) => void;
  updateBranding: (name: string, logo: string | null) => void;
  createPpeRequestTask: (data: PpeRequestData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(PLANNER_EVENTS);
  const [dailyPlannerComments, setDailyPlannerComments] = useState<DailyPlannerComment[]>(DAILY_PLANNER_COMMENTS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [appName, setAppName] = useState('Aries Marine - Task Management System');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const storedAppName = localStorage.getItem('appName');
    const storedAppLogo = localStorage.getItem('appLogo');
    if (storedAppName) {
      setAppName(storedAppName);
    }
    if (storedAppLogo) {
      setAppLogo(storedAppLogo);
    }
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

  const login = (email: string, password: string): boolean => {
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
  };

  const logout = () => {
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
  };

  const getSubordinates = useCallback((managerId: string): string[] => {
    let subordinates: string[] = [];
    const directReports = users.filter(u => u.supervisorId === managerId);
    for (const report of directReports) {
      subordinates.push(report.id);
      if (['Manager', 'Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE', 'Store in Charge', 'Assistant Store Incharge'].includes(report.role)) {
        subordinates = subordinates.concat(getSubordinates(report.id));
      }
    }
    return subordinates;
  }, [users]);
  
  const getVisibleUsers = useCallback((): User[] => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Manager') {
      return users;
    }
    if (['Supervisor', 'HSE', 'Junior Supervisor', 'Junior HSE', 'Store in Charge', 'Assistant Store Incharge'].includes(user.role)) {
      const subordinateIds = getSubordinates(user.id);
      return users.filter(u => u.id === user.id || subordinateIds.includes(u.id));
    }
    return users.filter(u => u.id === user.id);
  }, [user, users, getSubordinates]);
  
  const addTask = (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState'>) => {
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        comments: [],
        status: 'To Do',
        approvalState: 'none'
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    recordAction(`Created task: "${task.title}"`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    recordAction(`Updated task details for: "${updatedTask.title}"`);
  };

  const addComment = (taskId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    const task = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } : t
    ));
    recordAction(`Commented on task: "${task?.title}"`);
  };
  
  const requestTaskStatusChange = (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']): boolean => {
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
  };
  
  const approveTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.pendingStatus) return;

    addComment(taskId, `Request Approved: ${commentText}`);
    const updatedTask = {
      ...task,
      status: task.pendingStatus,
      pendingStatus: undefined,
      previousStatus: undefined,
      approvalState: 'approved' as ApprovalState,
    };
    updateTask(updatedTask);
    recordAction(`Approved status change for task: "${task.title}"`);
  };
  
  const returnTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    addComment(taskId, `Request Returned: ${commentText}`);
    const updatedTask = {
      ...task,
      status: task.previousStatus || 'In Progress', // Revert to a sensible state
      pendingStatus: undefined,
      previousStatus: undefined,
      approvalState: 'returned' as ApprovalState,
    };
    updateTask(updatedTask);
    recordAction(`Returned task "${task.title}" to status "${updatedTask.status}"`);
  };

  const deleteTask = (taskId: string) => {
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    recordAction(`Deleted task: "${taskTitle}"`);
  };

  const addPlannerEvent = (event: Omit<PlannerEvent, 'id' | 'comments'>) => {
    const newEvent: PlannerEvent = {
      ...event,
      id: `event-${Date.now()}`,
      comments: [],
    };
    setPlannerEvents(prevEvents => [newEvent, ...prevEvents]);
    recordAction(`Created planner event: "${event.title}"`);
  };
  
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

  const addPlannerEventComment = (eventId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setPlannerEvents(prevEvents => prevEvents.map(event => 
      event.id === eventId ? { ...event, comments: [...(event.comments || []), newComment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) } : event
    ));
    const eventTitle = plannerEvents.find(e => e.id === eventId)?.title;
    recordAction(`Commented on event: "${eventTitle}"`);
  };

  const addDailyPlannerComment = (plannerUserId: string, date: Date, commentText: string) => {
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
                ? { ...dpc, comments: [...dpc.comments, newComment] } 
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
  };

  const addUser = (newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setUsers(prev => [...prev, userToAdd]);
    recordAction(`Added new user: ${newUser.name}`);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
    recordAction(`Updated user profile: ${updatedUser.name}`);
  };
  
  const deleteUser = (userId: string) => {
    const userName = users.find(u => u.id === userId)?.name;
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also consider un-assigning tasks or re-assigning them
    setTasks(prev => prev.map(t => t.assigneeId === userId ? {...t, assigneeId: ''} : t));
    recordAction(`Deleted user: ${userName}`);
  };

  const addRole = (roleData: Omit<RoleDefinition, 'id' | 'isEditable'>) => {
    const newRole: RoleDefinition = {
      ...roleData,
      id: `role-${Date.now()}`,
      isEditable: true,
    };
    setRoles(prev => [...prev, newRole]);
    recordAction(`Added new role: ${newRole.name}`);
  };

  const updateRole = (updatedRole: RoleDefinition) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    recordAction(`Updated role: ${updatedRole.name}`);
  };

  const deleteRole = (roleId: string) => {
    const roleName = roles.find(r => r.id === roleId)?.name;
    setRoles(prev => prev.filter(r => r.id !== roleId));
    recordAction(`Deleted role: ${roleName}`);
  };

  const updateProfile = (name: string, email: string, avatar: string) => {
    if (user) {
        const updatedUser = {...user, name, email, avatar};
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        recordAction(`Updated own profile`);
    }
  };

  const addManualAchievement = (achievement: Omit<Achievement, 'id' | 'type' | 'date' | 'awardedById' | 'status'>) => {
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
  };
  
  const approveAchievement = (achievementId: string, points: number) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === achievementId) {
        return { ...ach, status: 'approved', points };
      }
      return ach;
    }));
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    recordAction(`Approved achievement: "${achTitle}"`);
  };

  const rejectAchievement = (achievementId: string) => {
    const achTitle = achievements.find(a => a.id === achievementId)?.title;
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
    recordAction(`Rejected achievement: "${achTitle}"`);
  };

  const updateManualAchievement = (updatedAchievement: Achievement) => {
    setAchievements(prev => prev.map(ach => ach.id === updatedAchievement.id ? updatedAchievement : ach));
    const userName = users.find(u => u.id === updatedAchievement.userId)?.name;
    recordAction(`Updated manual achievement "${updatedAchievement.title}" for ${userName}`);
  };

  const deleteManualAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
        const userName = users.find(u => u.id === achievement.userId)?.name;
        recordAction(`Deleted manual achievement "${achievement.title}" for ${userName}`);
    }
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
  };

  const updateBranding = (name: string, logo: string | null) => {
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
  };

  const createPpeRequestTask = (data: PpeRequestData) => {
    if (!user) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: 'Pending Approval',
      priority: data.priority,
      dueDate: data.expectedDate.toISOString(),
      assigneeId: user.id,
      creatorId: user.id, // User is creating it for themselves
      comments: [],
      requiresAttachmentForCompletion: false,
      approvalState: 'pending',
      previousStatus: 'To Do', // The state before pending
      department: data.department,
      items: data.items,
      remarks: data.remarks,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    recordAction(`Created PPE Request: "${data.title}"`);
  };

  const value = {
    user,
    users,
    roles,
    tasks,
    plannerEvents,
    dailyPlannerComments,
    achievements,
    activityLogs,
    appName,
    appLogo,
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
    updateProfile,
    requestTaskStatusChange,
    approveTaskStatusChange,
    returnTaskStatusChange,
    addComment,
    addManualAchievement,
    approveAchievement,
    rejectAchievement,
    updateManualAchievement,
    deleteManualAchievement,
    addPlannerEventComment,
    addDailyPlannerComment,
    updateBranding,
    createPpeRequestTask,
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
