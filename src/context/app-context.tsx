"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Task, TaskStatus, PlannerEvent } from '@/lib/types';
import { USERS, TASKS, PLANNER_EVENTS } from '@/lib/mock-data';

interface AppContextType {
  user: User | null;
  users: User[];
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  login: (userId: string) => void;
  logout: () => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  addPlannerEvent: (event: Omit<PlannerEvent, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(PLANNER_EVENTS);
  const router = useRouter();

  const login = (userId: string) => {
    const foundUser = USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      router.push('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
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

  const value = {
    user,
    users: USERS,
    tasks,
    plannerEvents,
    login,
    logout,
    updateTaskStatus,
    addTask,
    updateTask,
    deleteTask,
    addPlannerEvent,
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
