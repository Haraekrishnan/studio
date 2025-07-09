'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import type { ManpowerProfile, Trade } from '@/lib/types';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, CalendarIcon, PlusCircle, ExternalLink } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TRADES, MANDATORY_DOCS, RA_TRADES } from '@/lib/mock-data';

const documentSchema = z.object({
    name: z.string().min(1, 'Document name is required'),
    details: z.string().optional(),
    status: z.enum(['Collected', 'Pending', 'Received']),
});

const skillSchema = z.object({
    name: z.string().min(1, 'Skill name is required'),
    details: z.string().min(1, 'Details are required'),
    link: z.string().url().optional().or(z.literal('')),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  trade: z.string().min(1, 'Trade is required'),
  documentFolderUrl: z.string().url().optional().or(z.literal('')),
  documents: z.array(documentSchema),
  
  hasSkills: z.boolean(),
  skills: z.array(skillSchema).optional(),

  epNumber: z.string().optional(),
  plantName: z.string().optional(),
  eicName: z.string().optional(),
  passIssueDate: z.date().optional(),
  joiningDate: z.date().optional(),
  woValidity: z.date().optional(),
  wcPolicyValidity: z.date().optional(),
  labourContractValidity: z.date().optional(),
  medicalExpiryDate: z.date().optional(),
  safetyExpiryDate: z.date().optional(),
  irataValidity: z.date().optional(),
  contractValidity: z.date().optional(),
  remarks: z.string().optional(),
  
  status: z.enum(['Working', 'On Leave', 'Resigned', 'Terminated']),
  leaveType: z.enum(['Emergency', 'Annual']).optional(),
  leaveStartDate: z.date().optional(),
  leaveEndDate: z.date().optional(),
  rejoinedDate: z.date().optional(),
  terminationDate: z.date().optional(),
  resignationDate: z.date().optional(),
  feedback: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ManpowerProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  profile: ManpowerProfile | null;
}

const DatePickerController = ({ name, control }: { name: keyof ProfileFormValues, control: any }) => (
    <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'dd-MM-yyyy') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus /></PopoverContent>
            </Popover>
        )}
    />
);

export default function ManpowerProfileDialog({ isOpen, setIsOpen, profile }: ManpowerProfileDialogProps) {
  const { addManpowerProfile, updateManpowerProfile } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { documents: [], skills: [], hasSkills: false, status: 'Working' }
  });
  
  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({ control: form.control, name: "documents" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });

  const watchedTrade = form.watch('trade');
  const watchedDocuments = form.watch('documents');
  const hasSkills = form.watch('hasSkills');
  const employeeStatus = form.watch('status');
  
  const progress = useMemo(() => {
    const requiredDocs = [...MANDATORY_DOCS];
    if (RA_TRADES.includes(watchedTrade as Trade)) {
        requiredDocs.push('IRATA Certificate');
    }
    if (requiredDocs.length === 0) return 100;

    const collectedCount = requiredDocs.filter(docName => {
        const doc = watchedDocuments.find(d => d.name === docName);
        return doc && doc.status !== 'Pending';
    }).length;
    
    return (collectedCount / requiredDocs.length) * 100;
  }, [watchedTrade, watchedDocuments]);


  useEffect(() => {
    if (profile) {
      form.reset({
        ...profile,
        hasSkills: !!profile.skills && profile.skills.length > 0,
        // Convert date strings back to Date objects for the pickers
        passIssueDate: profile.passIssueDate ? new Date(profile.passIssueDate) : undefined,
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate) : undefined,
        woValidity: profile.woValidity ? new Date(profile.woValidity) : undefined,
        wcPolicyValidity: profile.wcPolicyValidity ? new Date(profile.wcPolicyValidity) : undefined,
        labourContractValidity: profile.labourContractValidity ? new Date(profile.labourContractValidity) : undefined,
        medicalExpiryDate: profile.medicalExpiryDate ? new Date(profile.medicalExpiryDate) : undefined,
        safetyExpiryDate: profile.safetyExpiryDate ? new Date(profile.safetyExpiryDate) : undefined,
        irataValidity: profile.irataValidity ? new Date(profile.irataValidity) : undefined,
        contractValidity: profile.contractValidity ? new Date(profile.contractValidity) : undefined,
        leaveStartDate: profile.leaveStartDate ? new Date(profile.leaveStartDate) : undefined,
        leaveEndDate: profile.leaveEndDate ? new Date(profile.leaveEndDate) : undefined,
        rejoinedDate: profile.rejoinedDate ? new Date(profile.rejoinedDate) : undefined,
        terminationDate: profile.terminationDate ? new Date(profile.terminationDate) : undefined,
        resignationDate: profile.resignationDate ? new Date(profile.resignationDate) : undefined,
      });
    } else {
        const defaultDocs = MANDATORY_DOCS.map(name => ({ name, details: '', status: 'Pending' as const }));
        form.reset({
            name: '', trade: '', documentFolderUrl: '',
            documents: defaultDocs,
            skills: [], hasSkills: false, status: 'Working',
        });
    }
  }, [profile, form.reset]);
  
  useEffect(() => {
    const isRATrade = RA_TRADES.includes(watchedTrade as Trade);
    const hasIrataCert = watchedDocuments.some(d => d.name === 'IRATA Certificate');

    if (isRATrade && !hasIrataCert) {
        appendDoc({ name: 'IRATA Certificate', details: '', status: 'Pending' });
    } else if (!isRATrade && hasIrataCert) {
        const index = watchedDocuments.findIndex(d => d.name === 'IRATA Certificate');
        if (index > -1) removeDoc(index);
    }
  }, [watchedTrade, watchedDocuments, appendDoc, removeDoc]);

  const onSubmit = (data: ProfileFormValues) => {
    // Convert Date objects back to ISO strings
    const dataToSubmit = {
        ...data,
        passIssueDate: data.passIssueDate?.toISOString(),
        joiningDate: data.joiningDate?.toISOString(),
        woValidity: data.woValidity?.toISOString(),
        wcPolicyValidity: data.wcPolicyValidity?.toISOString(),
        labourContractValidity: data.labourContractValidity?.toISOString(),
        medicalExpiryDate: data.medicalExpiryDate?.toISOString(),
        safetyExpiryDate: data.safetyExpiryDate?.toISOString(),
        irataValidity: data.irataValidity?.toISOString(),
        contractValidity: data.contractValidity?.toISOString(),
        leaveStartDate: data.leaveStartDate?.toISOString(),
        leaveEndDate: data.leaveEndDate?.toISOString(),
        rejoinedDate: data.rejoinedDate?.toISOString(),
        terminationDate: data.terminationDate?.toISOString(),
        resignationDate: data.resignationDate?.toISOString(),
    };

    if (profile) {
      updateManpowerProfile({ ...profile, ...dataToSubmit });
      toast({ title: 'Profile Updated' });
    } else {
      addManpowerProfile(dataToSubmit as Omit<ManpowerProfile, 'id'>);
      toast({ title: 'Profile Added' });
    }
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader><DialogTitle>{profile ? `Edit Profile: ${profile.name}` : 'Add New Manpower Profile'}</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh] p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pr-4">
                    
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                        <div><Label>Full Name</Label><Input {...form.register('name')} />{form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}</div>
                        <div><Label>Trade</Label><Controller control={form.control} name="trade" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select trade..." /></SelectTrigger><SelectContent>{TRADES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>)}/></div>
                        <div><Label>EP Number</Label><Input {...form.register('epNumber')} /></div>
                        <div><Label>Plant Name</Label><Input {...form.register('plantName')} /></div>
                        <div><Label>EIC Name</Label><Input {...form.register('eicName')} /></div>
                        <div><Label>Joining Date</Label><DatePickerController name="joiningDate" control={form.control} /></div>
                        <div><Label>Pass Issue Date</Label><DatePickerController name="passIssueDate" control={form.control} /></div>
                        
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold border-b pb-2">Employee Status</h3>
                        <div><Label>Status</Label><Controller control={form.control} name="status" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Working">Working</SelectItem><SelectItem value="On Leave">On Leave</SelectItem><SelectItem value="Resigned">Resigned</SelectItem><SelectItem value="Terminated">Terminated</SelectItem></SelectContent></Select>)}/></div>
                        {employeeStatus === 'On Leave' && (
                            <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                                <div><Label>Leave Type</Label><Controller control={form.control} name="leaveType" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent><SelectItem value="Emergency">Emergency</SelectItem><SelectItem value="Annual">Annual</SelectItem></SelectContent></Select>)}/></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Leave Start</Label><DatePickerController name="leaveStartDate" control={form.control} /></div>
                                    <div><Label>Leave End</Label><DatePickerController name="leaveEndDate" control={form.control} /></div>
                                </div>
                                <div><Label>Rejoined Date</Label><DatePickerController name="rejoinedDate" control={form.control} /></div>
                            </div>
                        )}
                        {employeeStatus === 'Resigned' && <div><Label>Resignation Date</Label><DatePickerController name="resignationDate" control={form.control} /></div>}
                        {employeeStatus === 'Terminated' && <div><Label>Termination Date</Label><DatePickerController name="terminationDate" control={form.control} /></div>}
                        <div><Label>Feedback (Optional)</Label><Textarea {...form.register('feedback')} /></div>
                    </div>
                    
                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Expiry Dates</h3>
                        <div><Label>WO Expiry Date</Label><DatePickerController name="woValidity" control={form.control} /></div>
                        <div><Label>WC Policy Expiry Date</Label><DatePickerController name="wcPolicyValidity" control={form.control} /></div>
                        <div><Label>Labour Contract Expiry Date</Label><DatePickerController name="labourContractValidity" control={form.control} /></div>
                        <div><Label>Medical Expiry Date</Label><DatePickerController name="medicalExpiryDate" control={form.control} /></div>
                        <div><Label>Safety Expiry Date</Label><DatePickerController name="safetyExpiryDate" control={form.control} /></div>
                        <div><Label>IRATA Expiry Date</Label><DatePickerController name="irataValidity" control={form.control} /></div>
                        <div><Label>Contract Expiry Date</Label><DatePickerController name="contractValidity" control={form.control} /></div>
                        <div><Label>Remarks</Label><Textarea {...form.register('remarks')} /></div>
                        
                        <Separator className="my-4" />
                        <div className="flex items-center space-x-2"><Controller name="hasSkills" control={form.control} render={({ field }) => <Checkbox id="hasSkills" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="hasSkills">Add Skills</Label></div>
                        {hasSkills && (
                             <div className="p-4 border rounded-md space-y-2 bg-muted/50">
                                {skillFields.map((field, index) => (
                                    <div key={field.id} className="p-2 border rounded-md bg-background space-y-2">
                                        <div className="flex justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="h-6 w-6"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                                        <Input {...form.register(`skills.${index}.name`)} placeholder="Skill Name"/>
                                        <Textarea {...form.register(`skills.${index}.details`)} placeholder="Skill Details"/>
                                        <Input {...form.register(`skills.${index}.link`)} placeholder="https://example.com/certificate"/>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ name: '', details: '', link: '' })}>Add Skill</Button>
                            </div>
                        )}
                    </div>

                    {/* Full Span Row for Documents */}
                    <div className="md:col-span-2 space-y-4">
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold border-b pb-2">Document Management</h3>
                        <div className="flex items-center gap-2">
                           <Label>Document Folder URL</Label>
                           {form.getValues('documentFolderUrl') && <a href={form.getValues('documentFolderUrl')} target='_blank' rel="noreferrer"><ExternalLink className="h-4 w-4"/></a>}
                        </div>
                        <Input type="url" {...form.register('documentFolderUrl')} placeholder="https://example.com/folder" />
                        {docFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr,1fr,120px,auto] items-center gap-2 p-2 border rounded-md">
                            <Input {...form.register(`documents.${index}.name`)} placeholder="Document Name"/>
                            <Input {...form.register(`documents.${index}.details`)} placeholder="Details (e.g., number)"/>
                            <Controller control={form.control} name={`documents.${index}.status`} render={({ field: selectField }) => (<Select onValueChange={selectField.onChange} value={selectField.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Received">Received</SelectItem><SelectItem value="Collected">Collected</SelectItem></SelectContent></Select>)}/>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ name: '', details: '', status: 'Pending' })}><PlusCircle className="mr-2"/>Add Document Type</Button>

                        <div className="mt-4">
                            <Label>Documentation Progress</Label>
                            <div className="flex items-center gap-2"><Progress value={progress} className="w-full" /><span>{progress.toFixed(0)}%</span></div>
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
