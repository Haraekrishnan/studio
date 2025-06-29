export type Role = 'Admin' | 'Manager' | 'Team Member';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export type Priority = 'Low' | 'Medium' | 'High';

export type Frequency = 'once' | 'daily' | 'weekly' | 'weekends' | 'monthly';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string; // URL to avatar image
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string; // ISO string date
  assigneeId: string;
  creatorId: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  frequency: Frequency;
  creatorId: string;
}
