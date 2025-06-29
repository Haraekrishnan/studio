"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Task, TaskStatus, PlannerEvent, Comment, Role, ApprovalState, Achievement } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS, ACHIEVEMENTS } from '@/lib/mock-data';
import { addMonths, eachDayOfInterval, endOfMonth, isMatch, isSameDay, isWeekend, startOfMonth } from 'date-fns';

interface AppContextType {
  user: User | null;
  users: User[];
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  achievements: Achievement[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'status' | 'approvalState'>) => void;
  deleteTask: (taskId: string) => void;
  addPlannerEvent: (event: Omit<PlannerEvent, 'id'>) => void;
  getExpandedPlannerEvents: (date: Date) => (PlannerEvent & { eventDate: Date })[];
  getVisibleUsers: () => User[];
  addUser: (newUser: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  updateProfile: (name: string, avatar: string) => void;
  requestTaskStatusChange: (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']) => boolean;
  approveTaskStatusChange: (taskId: string, commentText: string) => void;
  returnTaskStatusChange: (taskId: string, commentText: string) => void;
  addComment: (taskId: string, commentText: string) => void;
  addManualAchievement: (achievement: Omit<Achievement, 'id' | 'type' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(PLANNER_EVENTS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const router = useRouter();
  
  // Logic to automatically update tasks to "Overdue"
  useEffect(() => {
    const interval = setInterval(() => {
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (
                    task.completionDateIsMandatory &&
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

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const getSubordinates = useCallback((managerId: string): string[] => {
    let subordinates: string[] = [];
    const directReports = users.filter(u => u.supervisorId === managerId);
    for (const report of directReports) {
      subordinates.push(report.id);
      if (['Manager', 'Supervisor', 'Junior Supervisor'].includes(report.role)) {
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
    if (user.role === 'Supervisor' || user.role === 'Junior Supervisor') {
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
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const addComment = (taskId: string, commentText: string) => {
    if (!user) return;
    const newComment: Comment = {
      userId: user.id,
      text: commentText,
      date: new Date().toISOString(),
    };
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, comments: [...(task.comments || []), newComment] } : task
    ));
  };
  
  const requestTaskStatusChange = (taskId: string, newStatus: TaskStatus, commentText: string, attachment?: Task['attachment']): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user || !commentText) return false;

    if (newStatus === 'Completed' && task.requiresAttachmentForCompletion && !attachment) {
      return false; // Prevents completion without attachment
    }

    addComment(taskId, commentText);
    const updatedTask = {
      ...task,
      pendingStatus: newStatus,
      approvalState: 'pending' as ApprovalState,
      status: 'Pending Approval' as TaskStatus,
      attachment: attachment || task.attachment,
    };
    updateTask(updatedTask);
    return true;
  };
  
  const approveTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.pendingStatus) return;

    addComment(taskId, commentText);
    const updatedTask = {
      ...task,
      status: task.pendingStatus,
      pendingStatus: undefined,
      approvalState: 'approved' as ApprovalState,
    };
    updateTask(updatedTask);
  };
  
  const returnTaskStatusChange = (taskId: string, commentText: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    addComment(taskId, commentText);
    const originalStatus = tasks.find(t => t.id === taskId)?.status || 'To Do';
    const updatedTask = {
      ...task,
      status: task.status === 'Pending Approval' ? 'In Progress' : task.status, // Revert to a sensible state
      pendingStatus: undefined,
      approvalState: 'returned' as ApprovalState,
    };
    updateTask(updatedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addPlannerEvent = (event: Omit<PlannerEvent, 'id'>) => {
    const newEvent: PlannerEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setPlannerEvents(prevEvents => [newEvent, ...prevEvents]);
  };
  
  const getExpandedPlannerEvents = useCallback((date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start, end });
    const expandedEvents: (PlannerEvent & { eventDate: Date })[] = [];

    plannerEvents.forEach(event => {
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

  const addUser = (newUser: Omit<User, 'id' | 'avatar'>) => {
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setUsers(prev => [...prev, userToAdd]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
  };
  
  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also consider un-assigning tasks or re-assigning them
    setTasks(prev => prev.map(t => t.assigneeId === userId ? {...t, assigneeId: ''} : t));
  };

  const updateProfile = (name: string, avatar: string) => {
    if (user) {
        const updatedUser = {...user, name, avatar};
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const addManualAchievement = (achievement: Omit<Achievement, 'id' | 'type' | 'date'>) => {
    if (!user) return;
    const newAchievement: Achievement = {
      ...achievement,
      id: `ach-${Date.now()}`,
      type: 'manual',
      date: new Date().toISOString(),
      awardedById: user.id,
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const value = {
    user,
    users,
    tasks,
    plannerEvents,
    achievements,
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
    updateProfile,
    requestTaskStatusChange,
    approveTaskStatusChange,
    returnTaskStatusChange,
    addComment,
    addManualAchievement,
    updateTaskStatus: () => {}, // placeholder to satisfy old components if any
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
