"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Task, TaskStatus, Priority } from '@/lib/types';
import { USERS, TASKS } from '@/lib/mock-data';

interface AppContextType {
  user: User | null;
  users: User[];
  tasks: Task[];
  login: (userId: string) => void;
  logout: () => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
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

  const value = {
    user,
    users: USERS,
    tasks,
    login,
    logout,
    updateTaskStatus,
    addTask,
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
