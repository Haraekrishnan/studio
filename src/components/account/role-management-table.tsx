'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import EditRoleDialog from './edit-role-dialog';
import type { RoleDefinition } from '@/lib/types';

export default function RoleManagementTable() {
    const { user, roles, deleteRole } = useAppContext();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

    const handleEditClick = (role: RoleDefinition) => {
        setSelectedRole(role);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (roleId: string) => {
        deleteRole(roleId);
        toast({
            variant: 'destructive',
            title: 'Role Deleted',
            description: 'The role has been removed from the system.',
        });
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map(role => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions.map(permission => (
                                        <Badge key={permission} variant="secondary">
                                            {permission.replace(/_/g, ' ')}
                                        </Badge>
                                    ))}
                                    {role.permissions.length === 0 && <span className="text-xs text-muted-foreground">No permissions</span>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {user?.role === 'Admin' || role.isEditable ? (
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleEditClick(role)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                {role.isEditable && (
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the role "{role.name}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(role.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <span className="text-xs text-muted-foreground">System Role</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedRole && (
                <EditRoleDialog
                    isOpen={isEditDialogOpen}
                    setIsOpen={setIsEditDialogOpen}
                    role={selectedRole}
                />
            )}
        </>
    );
}
