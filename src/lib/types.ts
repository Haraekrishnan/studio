'use client';
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
  'manage_inventory',
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

export type InternalRequestStatus = 'Pending' | 'Approved' | 'On Hold' | 'Allotted' | 'Rejected';
export type InternalRequestCategory = 'Site Items' | 'RA Equipments' | 'Stationery' | 'Other';

export interface Project {
    id: string;
    name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  supervisorId?: string;
  projectId?: string;
}

export interface Comment {
    userId: string;
    text: string;
    date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
  creatorId: string;
  comments?: Comment[];
  requiresAttachmentForCompletion: boolean;
  previousStatus?: TaskStatus;
  pendingStatus?: TaskStatus; 
  approvalState: ApprovalState;
  attachment?: {
    url: string;
    name: string;
    data?: string;
  };
}

export interface InternalRequest {
  id: string;
  requesterId: string;
  category: InternalRequestCategory;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  status: InternalRequestStatus;
  date: string;
  comments?: Comment[];
  isViewedByRequester: boolean;
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  frequency: Frequency;
  creatorId: string;
  userId: string;
  comments?: Comment[];
}

export interface DailyPlannerComment {
  id: string;
  plannerUserId: string; 
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
  date: string;
  awardedById?: string;
  status: 'pending' | 'approved';
}

export interface ActivityLog {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime: string | null;
  duration: number | null;
  actions: string[];
}

export type InventoryItemStatus = 'In Use' | 'In Store' | 'Damaged' | 'Expired';

export interface InventoryItem {
    id: string;
    name: string;
    serialNumber: string;
    chestCrollNo?: string;
    ariesId?: string;
    status: InventoryItemStatus;
    inspectionDate: string; // ISO Date
    inspectionDueDate: string; // ISO Date
    tpInspectionDueDate: string; // ISO Date
    location: string; // Project Name
    projectId: string;
}

export type InventoryTransferStatus = 'Pending' | 'Approved' | 'Rejected';

export interface InventoryTransferRequest {
    id: string;
    items: InventoryItem[];
    fromProjectId: string;
    toProjectId: string;
    requesterId: string;
    date: string; // ISO Date
    status: InventoryTransferStatus;
    comments: Comment[];
}
