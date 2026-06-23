import { memo, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UsersTable from './UsersTable';
// Force Vite HMR Cache Invalidation
import CreateUserForm from './CreateUserForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { User } from '../../store/usersSlice';

const UsersPage = memo(function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setSelectedUser(null);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Users Management
          </h2>
          <p className="mt-2 text-sm text-muted-foreground/80 font-medium">
            Search, filter and manage your team members effortlessly
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="size-4" />
          Add User
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10 blur-xl" />
        <UsersTable onEditUser={handleEditUser} />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new user
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm isModal onClose={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify the details below to update the user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <CreateUserForm
              isModal
              user={selectedUser}
              onClose={handleCloseEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default UsersPage;
