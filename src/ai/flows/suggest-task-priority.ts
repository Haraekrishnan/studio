'use server';

/**
 * @fileOverview An AI agent for suggesting task priorities based on deadlines, importance, and user roles.
 *
 * - suggestTaskPriority - A function that suggests task priorities.
 * - SuggestTaskPriorityInput - The input type for the suggestTaskPriority function.
 * - SuggestTaskPriorityOutput - The return type for the suggestTaskPriority function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskPriorityInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  deadline: z.string().describe('The deadline for the task (YYYY-MM-DD).'),
  importance: z.enum(['High', 'Medium', 'Low']).describe('The importance level of the task.'),
  userRole: z.string().describe('The role of the user assigned to the task.'),
  availableUsers: z
    .array(z.string())
    .describe('List of available users and their roles. Example: [\