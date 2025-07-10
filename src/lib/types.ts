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
  'manage_manpower',
  'manage_manpower_list',
  'manage_ut_machines',
  'manage_ut_machine_logs',
  'manage_dft_machines',
  'manage_mobile_sims',
  'manage_other_equipment',
  'manage_vehicles',
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
  completionDate?: string; // ISO string
  isViewedByAssignee?: boolean;
  assigneeId: string;
  creatorId: string;
  comments?: Comment[];
  requiresAttachmentForCompletion: boolean;
  previousStatus?: TaskStatus;
  pendingStatus?: TaskStatus; 
  approvalState: ApprovalState;
  pendingAssigneeId?: string | null;
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
  forwardedTo?: Role;
  isEscalated?: boolean;
}

export interface ManagementRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  subject: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
  date: string;
  comments?: Comment[];
  isViewedByRequester: boolean;
  isViewedByRecipient: boolean;
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

export type CertificateRequestStatus = 'Pending' | 'Fulfilled';
export type CertificateRequestType = 'TP Certificate' | 'Inspection Certificate';

export interface CertificateRequest {
    id: string;
    itemId?: string;
    utMachineId?: string;
    dftMachineId?: string;
    otherEquipmentId?: string;
    requesterId: string;
    requestType: CertificateRequestType;
    status: CertificateRequestStatus;
    date: string; // ISO Date
    comments: Comment[];
    isViewedByRequester?: boolean;
}

export interface ManpowerLog {
  id: string;
  date: string; // yyyy-MM-dd
  projectId: string;
  countIn: number;
  personInName?: string;
  countOut: number;
  personOutName?: string;
  reason: string;
  updatedBy: string; // userId
}

export type EquipmentUsageStatus = 'Active' | 'IDLE' | 'Others';

export interface UsageLog {
  id: string;
  date: string; // ISO Date
  cableNumber?: string;
  probeNumber?: string;
  areaOfWorking?: string;
  usedBy?: string; // user name or id
  jobDetails?: string;
  remarks: string;
  loggedBy: string; // userId
  status: EquipmentUsageStatus;
  reason?: string;
}

export interface UTMachine {
  id: string;
  machineName: string;
  serialNumber: string;
  projectId: string;
  unit: string;
  calibrationDueDate: string;
  probeDetails: string;
  cableDetails: string;
  status: string;
  usageLog: UsageLog[];
}

export interface DftMachine {
  id: string;
  machineName: string;
  serialNumber: string;
  projectId: string;
  unit: string;
  calibrationDueDate: string;
  probeDetails: string;
  cableDetails: string;
  status: string;
  usageLog: UsageLog[];
}

export interface MobileSim {
  id: string;
  type: 'Mobile' | 'SIM';
  provider: string;
  number: string;
  allottedToUserId: string;
  allotmentDate: string;
  projectId: string;
  status: 'Active' | 'Inactive' | 'Returned';
  remarks?: string;
}

export interface OtherEquipment {
  id: string;
  name: string;
  serialNumber: string;
  projectId: string;
  status: string;
  remarks?: string;
}

export type VehicleStatus = 'Operational' | 'In Workshop' | 'Unavailable';

export interface Driver {
    id: string;
    name: string;
    licenseNumber: string;
    epNumber?: string;
    sdpNumber?: string;
    epExpiry?: string;
    medicalExpiry?: string;
    safetyExpiry?: string;
    sdpExpiry?: string;
    woExpiry?: string;
    labourContractExpiry?: string;
    wcPolicyExpiry?: string;
}


export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleDetails: string;
  seatingCapacity: number;
  currentManpower?: number;
  driverId?: string;
  supervisorId: string;
  projectId: string;
  vapNumber: string;
  vapValidity: string;
  sdpValidity: string;
  epValidity: string;
  status: VehicleStatus;
}

export type ManpowerDocumentStatus = 'Collected' | 'Pending' | 'Received';

export interface ManpowerDocument {
    name: string;
    details?: string;
    status: ManpowerDocumentStatus;
}

export type Trade = 'RA Level 1' | 'RA Level 2' | 'RA Level 3' | 'HSE' | 'Supervisor' | 'Document Controller' | 'Cook';

export interface ManpowerSkill {
    name: string;
    details: string;
    link?: string;
}

export interface LeaveRecord {
    id: string;
    leaveType?: 'Emergency' | 'Annual';
    leaveStartDate: string;
    plannedEndDate?: string;
    leaveEndDate?: string; // Actual end date
    rejoinedDate?: string;
}

export interface ManpowerProfile {
    id: string;
    name: string;
    trade: Trade;
    hardCopyFileNo?: string;
    documentFolderUrl?: string;
    documents: ManpowerDocument[];
    
    epNumber?: string;
    plantName?: string;
    eicName?: string;
    passIssueDate?: string;
    joiningDate?: string;
    woValidity?: string;
    wcPolicyValidity?: string;
    labourContractValidity?: string;
    medicalExpiryDate?: string;
    safetyExpiryDate?: string;
    irataValidity?: string;
    contractValidity?: string;
    remarks?: string;
    
    skills?: ManpowerSkill[];
    
    status: 'Working' | 'On Leave' | 'Resigned' | 'Terminated';
    
    leaveHistory?: LeaveRecord[];
    
    terminationDate?: string;
    resignationDate?: string;
    feedback?: string;
}
