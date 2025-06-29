export type Role = 'Admin' | 'Manager' | 'Supervisor' | 'Junior Supervisor' | 'Team Member';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export type Priority = 'Low' | 'Medium' | 'High';

export type Frequency = 'once' | 'daily' | 'weekly' | 'weekends' | 'monthly';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password is optional on the type for security reasons
  role: Role;
  avatar: string; // URL to avatar image
  supervisorId?: string; // ID of this user's supervisor
}

export interface Comment {
    userId: string;
    text: string;
    date: string; // ISO string
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
  comments?: Comment[];
  attachment?: {
    url: string;
    name: string;
  };
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string, represents the start date for recurring events
  frequency: Frequency;
  creatorId: string;
}
