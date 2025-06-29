'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered task suggestions,
 * including actions and assignee recommendations, to enhance task management efficiency.
 *
 * - aiTaskSuggestions - A function that triggers the AI task suggestion flow.
 * - AiTaskSuggestionsInput - The input type for the aiTaskSuggestions function.
 * - AiTaskSuggestionsOutput - The return type for the aiTaskSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskSuggestionsInputSchema = z.object({
  taskDescription: z.string().describe('Detailed description of the task.'),
  currentAssigneeRole: z.string().describe('Role of the current task assignee.'),
  availableAssignees: z.array(z.object({
    name: z.string(),
    role: z.string(),
  })).describe('List of available assignees with their roles.'),
  taskStatus: z.string().describe('The current status of the task (e.g., To Do, In Progress).'),
  taskDeadline: z.string().describe('The deadline for the task.'),
});
export type AiTaskSuggestionsInput = z.infer<typeof AiTaskSuggestionsInputSchema>;

const AiTaskSuggestionsOutputSchema = z.object({
  suggestedActions: z.array(z.string()).describe('AI-suggested actions to move the task forward.'),
  optimalAssignee: z.string().describe('AI-recommended assignee based on role and task requirements.'),
  reasoning: z.string().describe('Explanation of why the suggested actions and assignee are optimal.'),
});
export type AiTaskSuggestionsOutput = z.infer<typeof AiTaskSuggestionsOutputSchema>;

export async function aiTaskSuggestions(input: AiTaskSuggestionsInput): Promise<AiTaskSuggestionsOutput> {
  return aiTaskSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskSuggestionsPrompt',
  input: {schema: AiTaskSuggestionsInputSchema},
  output: {schema: AiTaskSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide suggestions for task management.

Given the following task description, current assignee role, list of available assignees with their roles, task status, and task deadline, suggest actions to move the task forward and recommend an optimal assignee.

Task Description: {{{taskDescription}}}
Current Assignee Role: {{{currentAssigneeRole}}}
Available Assignees: {{#each availableAssignees}}{{{name}}} ({{{role}}}) {{/each}}
Task Status: {{{taskStatus}}}
Task Deadline: {{{taskDeadline}}}

Consider the task requirements, assignee roles and availability, and task status when generating suggestions. Explain your reasoning for the suggested actions and assignee.

Output the suggested actions, optimal assignee, and your reasoning in the format specified by the schema.
`,
});

const aiTaskSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiTaskSuggestionsFlow',
    inputSchema: AiTaskSuggestionsInputSchema,
    outputSchema: AiTaskSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
