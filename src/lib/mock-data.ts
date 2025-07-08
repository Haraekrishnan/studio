import type { User, Task, PlannerEvent, Achievement, ActivityLog, DailyPlannerComment, RoleDefinition, InternalRequest, Project, InventoryItem, InventoryTransferRequest, CertificateRequest, ManpowerLog, UTMachine, Vehicle } from './types';
import { sub, add, format } from 'date-fns';
import { ALL_PERMISSIONS } from './types';

export { ALL_PERMISSIONS };

export const ROLES: RoleDefinition[] = [
  {
    id: 'role-admin',
    name: 'Admin',
    permissions: [...ALL_PERMISSIONS],
    isEditable: false,
  },
  {
    id: 'role-manager',
    name: 'Manager',
    permissions: [
      'manage_users', 'assign_supervisors', 'create_tasks', 'reassign_tasks', 'delete_tasks', 
      'grant_manual_achievements', 'approve_manual_achievements', 
      'view_all_activity', 'view_all_users', 'manage_inventory',
      'manage_manpower', 'manage_ut_machines', 'manage_ut_machine_logs', 'manage_vehicles'
    ],
    isEditable: false,
  },
  {
    id: 'role-supervisor',
    name: 'Supervisor',
    permissions: [
      'create_tasks', 'reassign_tasks', 'grant_manual_achievements', 
      'view_subordinates_activity', 'view_subordinates_users'
    ],
    isEditable: false,
  },
  {
    id: 'role-hse',
    name: 'HSE',
    permissions: [
      'create_tasks', 'reassign_tasks', 'grant_manual_achievements', 
      'view_subordinates_activity', 'view_subordinates_users'
    ],
    isEditable: false,
  },
  {
    id: 'role-jr-supervisor',
    name: 'Junior Supervisor',
    permissions: ['view_subordinates_activity', 'view_subordinates_users'],
    isEditable: false,
  },
  {
    id: 'role-jr-hse',
    name: 'Junior HSE',
    permissions: ['view_subordinates_activity', 'view_subordinates_users'],
    isEditable: false,
  },
    {
    id: 'role-store-in-charge',
    name: 'Store in Charge',
    permissions: [
      'create_tasks', 'reassign_tasks', 'grant_manual_achievements', 
      'view_subordinates_activity', 'view_subordinates_users', 'manage_inventory'
    ],
    isEditable: false,
  },
  {
    id: 'role-asst-store-incharge',
    name: 'Assistant Store Incharge',
    permissions: ['view_subordinates_activity', 'view_subordinates_users', 'manage_inventory'],
    isEditable: false,
  },
  {
    id: 'role-team-member',
    name: 'Team Member',
    permissions: [],
    isEditable: false,
  },
];

export const PROJECTS: Project[] = [
    { id: 'proj-1', name: 'SEZ' },
    { id: 'proj-2', name: 'DTA' },
    { id: 'proj-3', name: 'MTF' },
    { id: 'proj-4', name: 'JPC' },
    { id: 'proj-5', name: 'SOLAR' },
    { id: 'proj-6', name: 'Head Office' },
];

export const USERS: User[] = [
  { id: '1', name: 'Harikrishnan P S', email: 'satanin2013@gmail.com', password: 'password', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=1', projectId: 'proj-6' },
  { id: '2', name: 'Manu M G', email: 'manu@ariesmarine.com', password: 'password', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=2', supervisorId: '1', projectId: 'proj-6' },
  { id: '3', name: 'Mujeeb', email: 'mujeeb@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=3', supervisorId: '2', projectId: 'proj-1' },
  { id: '4', name: 'Albin Raju', email: 'albin@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=4', supervisorId: '2', projectId: 'proj-2' },
  { id: '5', name: 'Arjun P', email: 'arjun@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=5', supervisorId: '2', projectId: 'proj-3' },
  { id: '6', name: 'Sreehari', email: 'sreehari@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=6', supervisorId: '2', projectId: 'proj-4' },
  { id: '7', name: 'Vishnu H', email: 'vishnu.h@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=7', supervisorId: '2', projectId: 'proj-5' },
  { id: '8', name: 'Akhil A', email: 'akhil.a@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=8', supervisorId: '2', projectId: 'proj-1' },
  { id: '9', name: 'Dhaneesh Kumar', email: 'dhaneesh@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=9', supervisorId: '2', projectId: 'proj-2' },
  { id: '10', name: 'Rakhil Raj', email: 'rakhil@ariesmarine.com', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=10', supervisorId: '2', projectId: 'proj-3' },
  { id: '11', name: 'Akhil Pillai', email: 'akhil.pillai@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=11', supervisorId: '3', projectId: 'proj-1' },
  { id: '12', name: 'Athul Kumar', email: 'athul@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=12', supervisorId: '3', projectId: 'proj-1' },
  { id: '13', name: 'Rinu Sam', email: 'rinu@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=13', supervisorId: '4', projectId: 'proj-2' },
  { id: '14', name: 'Syam Kumar', email: 'syam@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=14', supervisorId: '4', projectId: 'proj-2' },
  { id: '15', name: 'Vishnu S', email: 'vishnu.s@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=15', supervisorId: '5', projectId: 'proj-3' },
  { id: '16', name: 'Vishnu J', email: 'vishnu.j@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=16', supervisorId: '5', projectId: 'proj-3' },
  { id: '17', name: 'Amaldas M', email: 'amaldas@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=17', supervisorId: '6', projectId: 'proj-4' },
  { id: '18', name: 'Sajin Soman', email: 'sajin@ariesmarine.com', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=18', supervisorId: '6', projectId: 'proj-4' },
  { id: '19', name: 'Aparna M R', email: 'aparna@ariesmarine.com', password: 'password', role: 'Team Member', avatar: 'https://i.pravatar.cc/150?u=19', supervisorId: '11', projectId: 'proj-1' },
  { id: '20', name: 'John Safety', email: 'john.safety@ariesmarine.com', password: 'password', role: 'HSE', avatar: 'https://i.pravatar.cc/150?u=20', supervisorId: '2', projectId: 'proj-6' },
  { id: '21', name: 'Peter Hazard', email: 'peter.hazard@ariesmarine.com', password: 'password', role: 'Junior HSE', avatar: 'https://i.pravatar.cc/150?u=21', supervisorId: '20', projectId: 'proj-6' },
  { id: '22', name: 'Store Keeper', email: 'store@ariesmarine.com', password: 'password', role: 'Store in Charge', avatar: 'https://i.pravatar.cc/150?u=22', supervisorId: '2', projectId: 'proj-6' },
  { id: '23', name: 'Asst. Store Keeper', email: 'asst.store@ariesmarine.com', password: 'password', role: 'Assistant Store Incharge', avatar: 'https://i.pravatar.cc/150?u=23', supervisorId: '22', projectId: 'proj-6' },
];

export const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Develop new homepage design',
    description: 'Create a modern and responsive design for the company homepage. Focus on user experience and brand consistency.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '19', // Aparna M R
    creatorId: '11', // Akhil Pillai
    isViewedByAssignee: true,
    comments: [
        { userId: '11', text: 'Let me know if you have any questions on the design brief.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    requiresAttachmentForCompletion: true,
    approvalState: 'none'
  },
  {
    id: 'task-2',
    title: 'Set up CI/CD pipeline',
    description: 'Implement a continuous integration and deployment pipeline for the main application using GitHub Actions.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '12', // Athul Kumar
    creatorId: '3', // Mujeeb
    isViewedByAssignee: true,
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-3',
    title: 'Quarterly performance review',
    description: 'Prepare and conduct quarterly performance reviews for all team members. Collect feedback and set goals.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2', // Manu M G
    creatorId: '1', // Harikrishnan P S
    isViewedByAssignee: true,
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-4',
    title: 'Fix login page bug',
    description: 'A critical bug is preventing some users from logging in. Needs immediate attention.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '15', // Vishnu S
    creatorId: '5', // Arjun P
    isViewedByAssignee: true,
    comments: [
        { userId: '5', text: 'This is a top priority, please escalate if you run into issues.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { userId: '15', text: 'On it. I think I have an idea of what the issue is.', date: new Date().toISOString() }
    ],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-5',
    title: 'Update brand style guide',
    description: 'Revise the brand style guide with new logos and color palettes. Distribute to all relevant teams.',
    status: 'Completed',
    priority: 'Low',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '19', // Aparna M R
    creatorId: '11', // Akhil Pillai
    isViewedByAssignee: true,
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'approved'
  },
  {
    id: 'task-6',
    title: 'Plan team offsite event',
    description: 'Organize a team-building offsite event for the end of the quarter. Handle logistics, budget, and activities.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2', // Manu M G
    creatorId: '1', // Harikrishnan P S
    isViewedByAssignee: true,
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'none'
  },
  {
    id: 'task-7',
    title: 'Migrate database to new server',
    description: 'Plan and execute the migration of the production database to a new, more powerful server.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '12', // Athul Kumar
    creatorId: '3', // Mujeeb
    isViewedByAssignee: false,
    comments: [],
    requiresAttachmentForCompletion: true,
    approvalState: 'none'
  },
  {
    id: 'task-8',
    title: 'User testing for new feature',
    description: 'Conduct user testing sessions for the upcoming feature release. Gather feedback and report findings.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '16', // Vishnu J
    creatorId: '5', // Arjun P
    isViewedByAssignee: true,
    comments: [],
    requiresAttachmentForCompletion: false,
    approvalState: 'approved'
  },
];

export const INTERNAL_REQUESTS: InternalRequest[] = [
    {
        id: 'ireq-1',
        requesterId: '19', // Aparna M R
        category: 'Stationery',
        description: 'A4 paper ream, 5 nos. Blue and black pens, 1 box each.',
        quantity: 7,
        unit: 'Nos',
        location: 'Head Office',
        status: 'Pending',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comments: [{ userId: '19', text: 'Requesting stationery for the design team.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }],
        isViewedByRequester: true
    },
    {
        id: 'ireq-2',
        requesterId: '12', // Athul Kumar
        category: 'RA Equipments',
        description: 'Need 2 new multimeters (Fluke brand preferred).',
        quantity: 2,
        unit: 'Pairs',
        location: 'Sharjah Site',
        status: 'Approved',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        comments: [
            { userId: '12', text: 'The old ones are malfunctioning.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { userId: '22', text: 'Approved. Please collect from the main store.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        isViewedByRequester: false
    }
];

export const INVENTORY_ITEMS: InventoryItem[] = [
    { id: 'inv-1', name: 'Harness', serialNumber: 'HN-001', chestCrollNo: 'CCN-A1', ariesId: 'ARIES-001', status: 'In Use', inspectionDate: sub(new Date(), { months: 2 }).toISOString(), inspectionDueDate: add(new Date(), { months: 4 }).toISOString(), tpInspectionDueDate: add(new Date(), { months: 10 }).toISOString(), location: 'SEZ', projectId: 'proj-1' },
    { id: 'inv-2', name: 'Harness', serialNumber: 'HN-002', chestCrollNo: 'CCN-A2', ariesId: 'ARIES-002', status: 'In Store', inspectionDate: sub(new Date(), { months: 1 }).toISOString(), inspectionDueDate: add(new Date(), { months: 5 }).toISOString(), tpInspectionDueDate: add(new Date(), { months: 11 }).toISOString(), location: 'Head Office', projectId: 'proj-6' },
    { id: 'inv-3', name: 'Foot Loop', serialNumber: 'FL-001', status: 'In Use', inspectionDate: sub(new Date(), { days: 10 }).toISOString(), inspectionDueDate: add(new Date(), { months: 5, days: 20 }).toISOString(), tpInspectionDueDate: add(new Date(), { months: 11, days: 20 }).toISOString(), location: 'DTA', projectId: 'proj-2' },
    { id: 'inv-4', name: 'Grinder', serialNumber: 'GR-001', status: 'Damaged', inspectionDate: sub(new Date(), { years: 1 }).toISOString(), inspectionDueDate: sub(new Date(), { months: 6 }).toISOString(), tpInspectionDueDate: sub(new Date(), { months: 1 }).toISOString(), location: 'MTF', projectId: 'proj-3' },
    { id: 'inv-5', name: 'Harness', serialNumber: 'HN-003', chestCrollNo: 'CCN-B1', ariesId: 'ARIES-003', status: 'In Use', inspectionDate: new Date().toISOString(), inspectionDueDate: add(new Date(), { days: 25 }).toISOString(), tpInspectionDueDate: add(new Date(), { months: 6, days: 25 }).toISOString(), location: 'JPC', projectId: 'proj-4' },
    { id: 'inv-6', name: 'Harness', serialNumber: 'HN-004', chestCrollNo: 'CCN-B2', ariesId: 'ARIES-004', status: 'Expired', inspectionDate: sub(new Date(), { months: 7 }).toISOString(), inspectionDueDate: sub(new Date(), { months: 1 }).toISOString(), tpInspectionDueDate: sub(new Date(), { months: 1 }).toISOString(), location: 'SEZ', projectId: 'proj-1' },
];

export const INVENTORY_TRANSFER_REQUESTS: InventoryTransferRequest[] = [];

export const CERTIFICATE_REQUESTS: CertificateRequest[] = [
  {
    id: 'cert-req-1',
    itemId: 'inv-1',
    requesterId: '3', // Mujeeb
    requestType: 'TP Certificate',
    status: 'Pending',
    date: new Date().toISOString(),
    comments: [{ userId: '3', text: 'Need this for client audit next week.', date: new Date().toISOString() }],
  }
];

export const MANPOWER_LOGS: ManpowerLog[] = [
    { id: 'mp-1', date: format(new Date(), 'yyyy-MM-dd'), projectId: 'proj-1', countIn: 20, countOut: 1, reason: '1 person sick leave', updatedBy: '3', personOutName: 'David' },
    { id: 'mp-2', date: format(new Date(), 'yyyy-MM-dd'), projectId: 'proj-2', countIn: 15, countOut: 0, reason: 'Full attendance', updatedBy: '4' },
    { id: 'mp-3', date: format(sub(new Date(), { days: 1 }), 'yyyy-MM-dd'), projectId: 'proj-1', countIn: 19, countOut: 0, reason: 'Full attendance', updatedBy: '3' },
];

export const UT_MACHINES: UTMachine[] = [
    { id: 'ut-1', machineName: 'Krautkramer USM 36', serialNumber: 'UTM-001', projectId: 'proj-1', unit: 'Unit A', calibrationDueDate: add(new Date(), { months: 3 }).toISOString(), probeDetails: '5MHz Dual Crystal', cableDetails: 'Standard RG-58', status: 'In Service', usageLog: [] },
    { id: 'ut-2', machineName: 'Olympus EPOCH 650', serialNumber: 'UTM-002', projectId: 'proj-2', unit: 'Unit B', calibrationDueDate: add(new Date(), { days: 20 }).toISOString(), probeDetails: '2.25MHz Single Crystal', cableDetails: 'Heavy Duty', status: 'In Service', usageLog: [] },
];

export const VEHICLES: Vehicle[] = [
    { id: 'vh-1', vehicleNumber: 'DXB 12345', vehicleDetails: 'Toyota HiAce 2022', seatingCapacity: 14, driverName: 'Ali Khan', supervisorId: '3', projectId: 'proj-1', vapNumber: 'VAP-001', driverLicenseNumber: 'DL-001', driverEpNumber: 'EP-001', driverSdpNumber: 'SDP-001', vapValidity: add(new Date(), { months: 6 }).toISOString(), sdpValidity: add(new Date(), { years: 1 }).toISOString(), epValidity: add(new Date(), { years: 2 }).toISOString(), status: 'Operational' },
    { id: 'vh-2', vehicleNumber: 'SHJ 54321', vehicleDetails: 'Nissan Urvan 2021', seatingCapacity: 12, driverName: 'Babu Raj', supervisorId: '4', projectId: 'proj-2', vapNumber: 'VAP-002', driverLicenseNumber: 'DL-002', driverEpNumber: 'EP-002', driverSdpNumber: 'SDP-002', vapValidity: add(new Date(), { days: 25 }).toISOString(), sdpValidity: add(new Date(), { months: 8 }).toISOString(), epValidity: add(new Date(), { years: 1 }).toISOString(), status: 'In Workshop' },
];


export const PLANNER_EVENTS: PlannerEvent[] = [
    {
        id: 'event-1',
        title: 'Daily Standup',
        description: 'Sync up on project progress and blockers.',
        date: new Date().toISOString(),
        frequency: 'daily',
        creatorId: '11', // Akhil Pillai
        userId: '19', // Aparna M R
        comments: [],
    },
    {
        id: 'event-2',
        title: 'Product Sprint Demo',
        description: 'Showcase new features developed in the current sprint.',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        frequency: 'once',
        creatorId: '2', // Manu M G
        userId: '2', // Manu M G
        comments: [],
    },
    {
        id: 'event-3',
        title: 'Monthly All-Hands',
        description: 'Company-wide update meeting.',
        date: new Date(new Date().setDate(15)).toISOString(),
        frequency: 'monthly',
        creatorId: '1', // Harikrishnan P S
        userId: '1', // Harikrishnan P S
        comments: [],
    },
    {
        id: 'event-4',
        title: 'Team Retrospective',
        description: 'Discuss what went well and what could be improved.',
        date: new Date(new Date().setDate(25)).toISOString(),
        frequency: 'weekly',
        creatorId: '3', // Mujeeb
        userId: '12', // Athul Kumar
        comments: [],
    }
];

export const DAILY_PLANNER_COMMENTS: DailyPlannerComment[] = [];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', userId: '19', type: 'manual', title: 'Safety Star', description: 'Maintained a perfect safety record for Q2.', points: 50, date: new Date().toISOString(), awardedById: '11', status: 'approved' },
  { id: 'ach-2', userId: '12', type: 'manual', title: 'Innovation Award', description: 'Proposed a new workflow that saved 10 hours per week.', points: 100, date: new Date().toISOString(), awardedById: '2', status: 'approved' },
];

const now = new Date();
export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: '19',
    loginTime: sub(now, { days: 1, hours: 8 }).toISOString(),
    logoutTime: sub(now, { days: 1, hours: 3 }).toISOString(),
    duration: 300, // 5 hours
    actions: ['Updated task: "Develop new homepage design"', 'Commented on task: "Update brand style guide"'],
  },
  {
    id: 'log-2',
    userId: '12',
    loginTime: sub(now, { days: 1, hours: 7 }).toISOString(),
    logoutTime: sub(now, { days: 1, hours: 1 }).toISOString(),
    duration: 360, // 6 hours
    actions: ['Created task: "Set up CI/CD pipeline"', 'Completed task: "User testing for new feature"'],
  },
    {
    id: 'log-3',
    userId: '2',
    loginTime: sub(now, { days: 2, hours: 8 }).toISOString(),
    logoutTime: sub(now, { days: 2, hours: 0 }).toISOString(),
    duration: 480, // 8 hours
    actions: ['Conducted performance review prep', 'Planned team offsite event details'],
  },
];
