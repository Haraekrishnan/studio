'use client';
import { useState } from 'react';
import type { Task, User } from '@/lib/types';
import { useAppContext } from '@/context/app-context';
import { aiTaskSuggestions } from '@/ai/flows/ai-task-suggestions';
import type { AiTaskSuggestionsOutput } from '@/ai/flows/ai-task-suggestions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bot, Lightbulb, UserCheck, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface AiToolsDialogProps {
  task: Task;
  assignee: User | undefined;
}

export default function AiToolsDialog({ task, assignee }: AiToolsDialogProps) {
  const { users } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiTaskSuggestionsOutput | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await aiTaskSuggestions({
        taskDescription: `${task.title}: ${task.description}`,
        currentAssigneeRole: assignee?.role || 'N/A',
        availableAssignees: users.map(u => ({ name: u.name, role: u.role })),
        taskStatus: task.status,
        taskDeadline: task.dueDate,
      });
      setSuggestion(result);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not get suggestions at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bot className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Task Assistant</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Get AI-powered suggestions for this task to improve efficiency.
          </p>
          {!suggestion && (
            <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Get Suggestions'}
            </Button>
          )}
          {suggestion && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="font-semibold flex items-center mb-2"><UserCheck className="mr-2 h-4 w-4 text-primary" />Optimal Assignee</h3>
                <Badge>{suggestion.optimalAssignee}</Badge>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-4 w-4 text-primary" />Suggested Actions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {suggestion.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
              <Separator />
               <div>
                <h3 className="font-semibold mb-2">Reasoning</h3>
                <p className="text-sm text-muted-foreground italic">"{suggestion.reasoning}"</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {suggestion && (
            <Button onClick={handleGetSuggestions} disabled={isLoading} variant="secondary">
                 {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Re-analyzing...' : 'Regenerate'}
            </Button>
          )}
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
