'use client';
import { useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import type { ManpowerProfile, ManpowerDocument, ManpowerDocumentStatus } from '@/lib/types';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const documentSchema = z.object({
    name: z.string().min(1, 'Document name is required'),
    status: z.enum(['Collected', 'Pending']),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  trade: z.string().min(1, 'Trade is required'),
  documentFolderUrl: z.string().url().optional().or(z.literal('')),
  documents: z.array(documentSchema),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ManpowerProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  profile: ManpowerProfile | null;
}

export default function ManpowerProfileDialog({ isOpen, setIsOpen, profile }: ManpowerProfileDialogProps) {
  const { addManpowerProfile, updateManpowerProfile } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      documents: []
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const documents = form.watch('documents');
  
  const progress = useMemo(() => {
    if (!documents || documents.length === 0) return 0;
    const collected = documents.filter(doc => doc.status === 'Collected').length;
    return (collected / documents.length) * 100;
  }, [documents]);

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        trade: profile.trade,
        documentFolderUrl: profile.documentFolderUrl,
        documents: profile.documents,
      });
    } else {
        // Set default documents for a new profile
        form.reset({
            name: '',
            trade: '',
            documentFolderUrl: '',
            documents: [
                { name: 'Passport', status: 'Pending' },
                { name: 'Visa', status: 'Pending' },
                { name: 'Emirates ID', status: 'Pending' },
                { name: 'Driving License', status: 'Pending' },
            ]
        });
    }
  }, [profile, form.reset]);

  const onSubmit = (data: ProfileFormValues) => {
    if (profile) {
      updateManpowerProfile({ ...profile, ...data });
      toast({ title: 'Profile Updated', description: `${data.name}'s profile has been updated.` });
    } else {
      addManpowerProfile(data as Omit<ManpowerProfile, 'id'>);
      toast({ title: 'Profile Added', description: `${data.name} has been added to the manpower list.` });
    }
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{profile ? `Edit Profile: ${profile.name}` : 'Add New Manpower Profile'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[65vh] p-1">
                <div className="space-y-4 pr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Full Name</Label><Input {...form.register('name')} />{form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}</div>
                        <div><Label>Trade</Label><Input {...form.register('trade')} />{form.formState.errors.trade && <p className="text-xs text-destructive">{form.formState.errors.trade.message}</p>}</div>
                    </div>
                    <div><Label>Document Folder URL</Label><Input type="url" {...form.register('documentFolderUrl')} placeholder="https://example.com/folder" />{form.formState.errors.documentFolderUrl && <p className="text-xs text-destructive">{form.formState.errors.documentFolderUrl.message}</p>}</div>
                    
                    <Separator />

                    <h3 className="text-lg font-semibold">Document Management</h3>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                            <Controller control={form.control} name={`documents.${index}.name`} render={({ field }) => (<Input {...field} className="flex-1"/>)}/>
                            <Controller control={form.control} name={`documents.${index}.status`} render={({ field: selectField }) => (<Select onValueChange={selectField.onChange} value={selectField.value}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Collected">Collected</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent></Select>)}/>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', status: 'Pending' })}>Add Document Type</Button>

                    <div className="mt-4">
                        <Label>Completion Progress</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-full" />
                            <span>{progress.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className="mt-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">{profile ? 'Save Changes' : 'Add Profile'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
