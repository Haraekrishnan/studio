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
    .describe('List of available users and their roles. Example: ["User A (Manager)", "User B (Team Member)"]'),
});
export type SuggestTaskPriorityInput = z.infer<typeof SuggestTaskPriorityInputSchema>;

const SuggestTaskPriorityOutputSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']).describe('The suggested priority for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested priority.'),
});
export type SuggestTaskPriorityOutput = z.infer<typeof SuggestTaskPriorityOutputSchema>;

export async function suggestTaskPriority(input: SuggestTaskPriorityInput): Promise<SuggestTaskPriorityOutput> {
  return suggestTaskPriorityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskPriorityPrompt',
  input: {schema: SuggestTaskPriorityInputSchema},
  output: {schema: SuggestTaskPriorityOutputSchema},
  prompt: `You are an expert at task management and prioritization.
Analyze the task details provided below to suggest a priority level (High, Medium, or Low).

Task Description: {{{taskDescription}}}
Current Importance: {{{importance}}}
Deadline: {{{deadline}}}
User Role of creator/assigner: {{{userRole}}}
List of available users:
{{#each availableUsers}}
- {{{this}}}
{{/each}}

Consider the deadline, the stated importance, and the roles of users involved. A closer deadline usually means a higher priority. A task assigned by a manager might be more important. Your primary goal is to provide a sensible priority.
Explain your reasoning for the suggested priority.
`,
});

const suggestTaskPriorityFlow = ai.defineFlow(
  {
    name: 'suggestTaskPriorityFlow',
    inputSchema: SuggestTaskPriorityInputSchema,
    outputSchema: SuggestTaskPriorityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
