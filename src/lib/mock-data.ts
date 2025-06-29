import type { User, Task, PlannerEvent } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Alex Williams', email: 'alex@taskmaster.pro', password: 'password', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: '2', name: 'Samantha Jones', email: 'samantha@taskmaster.pro', password: 'password', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=samantha' },
  { id: '6', name: 'David Wilson', email: 'david@taskmaster.pro', password: 'password', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?u=david', supervisorId: '2' },
  { id: '7', name: 'Laura Green', email: 'laura@taskmaster.pro', password: 'password', role: 'Junior Supervisor', avatar: 'https://i.pravatar.cc/150?u=laura', supervisorId: '6' },
  { id: '3', name: 'Michael Brown', email: 'michael@taskmaster.pro', password: 'password', role: 'Team Member', avatar: 'https://i.pravatar.cc/150?u=michael', supervisorId: '7' },
  { id: '4', name: 'Jessica Davis', email: 'jessica@taskmaster.pro', password: 'password', role: 'Team Member', avatar: 'https://i.pravatar.cc/150?u=jessica', supervisorId: '7' },
  { id: '5', name: 'Chris Miller', email: 'chris@taskmaster.pro', password: 'password', role: 'Team Member', avatar: 'https://i.pravatar.cc/150?u=chris', supervisorId: '6' },
];

export const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Develop new homepage design',
    description: 'Create a modern and responsive design for the company homepage. Focus on user experience and brand consistency.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '3',
    creatorId: '7',
    comments: [
        { userId: '7', text: 'Let me know if you have any questions on the design brief.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: 'task-2',
    title: 'Set up CI/CD pipeline',
    description: 'Implement a continuous integration and deployment pipeline for the main application using GitHub Actions.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '4',
    creatorId: '7',
    comments: [],
  },
  {
    id: 'task-3',
    title: 'Quarterly performance review',
    description: 'Prepare and conduct quarterly performance reviews for all team members. Collect feedback and set goals.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2',
    creatorId: '1',
    comments: [],
  },
  {
    id: 'task-4',
    title: 'Fix login page bug',
    description: 'A critical bug is preventing some users from logging in. Needs immediate attention.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '5',
    creatorId: '6',
    comments: [
        { userId: '6', text: 'This is a top priority, please escalate if you run into issues.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { userId: '5', text: 'On it. I think I have an idea of what the issue is.', date: new Date().toISOString() }
    ],
  },
  {
    id: 'task-5',
    title: 'Update brand style guide',
    description: 'Revise the brand style guide with new logos and color palettes. Distribute to all relevant teams.',
    status: 'Completed',
    priority: 'Low',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '3',
    creatorId: '7',
    comments: [],
  },
  {
    id: 'task-6',
    title: 'Plan team offsite event',
    description: 'Organize a team-building offsite event for the end of the quarter. Handle logistics, budget, and activities.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '2',
    creatorId: '1',
    comments: [],
  },
  {
    id: 'task-7',
    title: 'Migrate database to new server',
    description: 'Plan and execute the migration of the production database to a new, more powerful server.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '4',
    creatorId: '7',
    comments: [],
  },
  {
    id: 'task-8',
    title: 'User testing for new feature',
    description: 'Conduct user testing sessions for the upcoming feature release. Gather feedback and report findings.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeId: '5',
    creatorId: '6',
    comments: [],
  },
];

export const PLANNER_EVENTS: PlannerEvent[] = [
    {
        id: 'event-1',
        title: 'Daily Standup',
        description: 'Sync up on project progress and blockers.',
        date: new Date().toISOString(),
        frequency: 'daily',
        creatorId: '1',
    },
    {
        id: 'event-2',
        title: 'Product Sprint Demo',
        description: 'Showcase new features developed in the current sprint.',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        frequency: 'once',
        creatorId: '2',
    },
    {
        id: 'event-3',
        title: 'Monthly All-Hands',
        description: 'Company-wide update meeting.',
        date: new Date(new Date().setDate(15)).toISOString(),
        frequency: 'monthly',
        creatorId: '1',
    },
    {
        id: 'event-4',
        title: 'Team Retrospective',
        description: 'Discuss what went well and what could be improved.',
        date: new Date(new Date().setDate(25)).toISOString(),
        frequency: 'weekly',
        creatorId: '6'
    }
];
