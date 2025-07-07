export const ALL_PERMISSIONS = [
  'manage_branding',
  'manage_users',
  'manage_roles',
  'assign_supervisors',
  'create_tasks',
  'reassign_tasks',
  'delete_tasks',
  'grant_manual_achievements',
  'approve_manual_achievements',
  'view_all_activity',
  'view_subordinates_activity',
  'view_all_users',
  'view_subordinates_users',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface RoleDefinition {
  id: string;
  name: string;
  permissions: Permission[];
  isEditable: boolean;
}

export type Role = 'Admin' | 'Manager' | 'Supervisor' | 'HSE' | 'Junior Supervisor' | 'Junior HSE' | 'Team Member' | 'Store in Charge' | 'Assistant Store Incharge';

export type TaskStatus = 'To Do' | 'In Progress' | 'Pending Approval' | 'Completed' | 'Overdue';

export type Priority = 'Low' | 'Medium' | 'High';

export type Frequency = 'once' | 'daily' | 'weekly' | 'weekends' | 'monthly' | 'daily-except-sundays';

export type ApprovalState = 'none' | 'pending' | 'approved' | 'returned';

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
  
  // New workflow fields
  requiresAttachmentForCompletion: boolean;
  
  // Approval flow
  previousStatus?: TaskStatus;
  pendingStatus?: TaskStatus; 
  approvalState: ApprovalState;
  
  // Attachment
  attachment?: {
    url: string;
    name: string;
    data?: string; // base64 data for new uploads
  };

  // PPE Request fields
  firstJoiningDate?: string;
  rejoiningDate?: string;
  employeeName?: string;
  plant?: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string, represents the start date for recurring events
  frequency: Frequency;
  creatorId: string;
  userId: string; // The user this event is for
  comments?: Comment[];
}

export interface DailyPlannerComment {
  id: string;
  // The user whose planner this comment belongs to
  plannerUserId: string; 
  // The specific day the comment is for, in 'yyyy-MM-dd' format
  day: string; 
  comments: Comment[];
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'performance' | 'manual';
  title: string;
  description: string;
  points: number;
  date: string; // ISO string
  awardedById?: string;
  status: 'pending' | 'approved';
}

export interface ActivityLog {
  id: string;
  userId: string;
  loginTime: string; // ISO
  logoutTime: string | null; // ISO or null if active
  duration: number | null; // in minutes
  actions: string[];
}
