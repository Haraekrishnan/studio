'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { PlusCircle, ExternalLink } from 'lucide-react';

const requestSchema = z.object({
  title: z.string().min(1, 'Request title is required'),
  description: z.string().min(1, 'Request description is required'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function NewPpeRequestDialog() {
  const { user, createPpeRequestTask } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleGoogleFormRedirect = (data: RequestFormValues) => {
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeH2T0V1NnZrIs_3e2j6g9n8qI8lP3bV1jV7lB0iX8uOqM_qQ/viewform";
    const requesterNameEntryId = "entry.1759454944";
    const taskTitleEntryId = "entry.1018919637";
    const taskDescriptionEntryId = "entry.1517458215";

    const params = new URLSearchParams();
    if (user) {
        params.append(requesterNameEntryId, user.name);
    }
    params.append(taskTitleEntryId, data.title);
    params.append(taskDescriptionEntryId, data.description);
    
    const prefilledUrl = `${googleFormUrl}?${params.toString()}`;
    window.open(prefilledUrl, '_blank');
  };

  const onSubmit = (data: RequestFormValues) => {
    if (!user) return;

    createPpeRequestTask(data.title, data.description);
    handleGoogleFormRedirect(data);
    
    toast({
      title: 'Request Submitted',
      description: `Your request "${data.title}" has been submitted for approval.`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New PPE Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New PPE Request</DialogTitle>
          <DialogDescription>
            This will create a request for approval and open a pre-filled Google Form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Request Title</Label>
            <Input id="title" {...form.register('title')} placeholder="e.g., Request for new safety helmets" />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description / Justification</Label>
            <Textarea id="description" {...form.register('description')} placeholder="Provide details about the request" />
            {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">
              Submit & Open Form
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
