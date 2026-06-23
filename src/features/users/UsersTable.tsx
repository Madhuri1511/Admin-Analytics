import {
  memo,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchUsers,
  setQuery,
  toggleColumn,
  deleteUser,
} from '../../store/usersSlice';
import type { User, UsersQuery } from '../../store/usersSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatters';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Pencil, Search, Settings2 } from 'lucide-react';

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const COLUMN_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  role: 'Role',
  status: 'Status',
  createdAt: 'Created Date',
  actions: 'Actions',
};

const ALL_COLUMNS = [
  'name',
  'email',
  'role',
  'status',
  'createdAt',
  'actions',
];

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive" | "ghost" | "link"> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
};

const StatusBadge = memo(function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? 'outline'} className="capitalize">
      {status}
    </Badge>
  );
});

interface SortButtonProps {
  column: string;
  label: string;
  onSort: (column: string) => void;
  sortIndicator: (column: string) => string;
}

function SortButton({ column, label, onSort, sortIndicator }: SortButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-medium hover:text-primary"
      onClick={() => onSort(column)}
    >
      {label} {sortIndicator(column)}
    </button>
  );
}

interface UsersTableProps {
  compact?: boolean;
  onEditUser?: (user: User) => void;
}

const UsersTable = memo(function UsersTable({ compact = false, onEditUser }: UsersTableProps) {
  const dispatch = useAppDispatch();
  const { list, loading, error, query, visibleColumns } = useAppSelector(
    (state) => state.users,
  );
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const isColumnVisible = useCallback(
    (col: string) => {
      if (compact) {
        // Hide less important columns in compact mode to fit the side-by-side layout
        if (['actions', 'email', 'createdAt'].includes(col)) return false;
      }
      return visibleColumns.includes(col);
    },
    [compact, visibleColumns],
  );

  const renderedColumnsCount = useMemo(() => {
    return visibleColumns.filter((col) => {
      if (compact && ['actions', 'email', 'createdAt'].includes(col)) return false;
      return true;
    }).length;
  }, [visibleColumns, compact]);

  const debouncedSearch = useDebounce(query.search, 300);

  const loadUsers = useCallback(() => {
    dispatch(
      fetchUsers({
        ...query,
        search: debouncedSearch,
        pageSize: compact ? 5 : query.pageSize,
      }),
    );
  }, [dispatch, query, debouncedSearch, compact]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSort = useCallback(
    (column: string) => {
      const newOrder =
        query.sortBy === column && query.sortOrder === 'asc' ? 'desc' : 'asc';
      dispatch(setQuery({ sortBy: column, sortOrder: newOrder, page: 1 }));
    },
    [dispatch, query.sortBy, query.sortOrder],
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setQuery({ search: e.target.value, page: 1 }));
    },
    [dispatch],
  );

  const handleRoleFilter = useCallback(
    (value: string) => {
      dispatch(setQuery({ role: value === 'all' ? '' : value, page: 1 }));
    },
    [dispatch],
  );

  const handleStatusFilter = useCallback(
    (value: string) => {
      dispatch(setQuery({ status: value === 'all' ? '' : value, page: 1 }));
    },
    [dispatch],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setQuery({ page }));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setUserToDelete(id);
    },
    [],
  );

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete)).unwrap().then(() => {
        toast.success('User deleted successfully');
      }).catch((err) => {
        toast.error(err || 'Failed to delete user');
      });
      setUserToDelete(null);
    }
  }, [dispatch, userToDelete]);

  const sortIndicator = useMemo(
    () => (column: string) => {
      if (query.sortBy !== column) return '↕';
      return query.sortOrder === 'asc' ? '↑' : '↓';
    },
    [query.sortBy, query.sortOrder],
  );

  const pageNumbers = useMemo(() => {
    if (!list) return [];
    return Array.from({ length: list.totalPages }, (_, i) => i + 1);
  }, [list]);


  return (
    <div className={compact ? "space-y-4" : "rounded-xl border border-border bg-card shadow-sm overflow-hidden"}>
      {!compact ? (
        <div className="flex flex-col gap-5 p-5 border-b border-border bg-muted/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full sm:max-w-sm items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users by name or email..."
                value={query.search}
                onChange={handleSearch}
                className="h-10 pl-9 bg-background transition-colors focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 border-dashed bg-background hover:bg-muted/50 cursor-pointer">
                    <Settings2 className="mr-2 h-4 w-4" />
                    View Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[200px] p-3 shadow-lg">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Toggle columns</div>
                  <div className="flex flex-col gap-1">
                    {ALL_COLUMNS.map((col) => (
                      <label key={col} className="flex items-center gap-2.5 cursor-pointer text-sm hover:bg-muted p-2 rounded-md transition-colors">
                        <Checkbox
                          checked={visibleColumns.includes(col)}
                          onCheckedChange={() => dispatch(toggleColumn(col))}
                          className="size-4"
                        />
                        <span className="capitalize">{COLUMN_LABELS[col]}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={query.role || 'all'} onValueChange={handleRoleFilter}>
                <SelectTrigger className="h-10 w-[140px] bg-background transition-colors hover:bg-muted/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={query.status || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger className="h-10 w-[140px] bg-background transition-colors hover:bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <div className="bg-background rounded-md transition-colors hover:bg-muted/50">
                <DatePickerWithRange
                  date={{
                    from: query.startDate ? new Date(query.startDate) : undefined,
                    to: query.endDate ? new Date(query.endDate) : undefined,
                  }}
                  setDate={(range) => {
                    dispatch(setQuery({
                      startDate: range?.from ? range.from.toISOString() : '',
                      endDate: range?.to ? range.to.toISOString() : '',
                      page: 1
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="p-4 border-b">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              {isColumnVisible('name') ? (
                <TableHead>
                  <SortButton column="name" label="Name" onSort={handleSort} sortIndicator={sortIndicator} />
                </TableHead>
              ) : null}
              {isColumnVisible('email') ? (
                <TableHead>
                  <SortButton column="email" label="Email" onSort={handleSort} sortIndicator={sortIndicator} />
                </TableHead>
              ) : null}
              {isColumnVisible('role') ? (
                <TableHead>
                  <SortButton column="role" label="Role" onSort={handleSort} sortIndicator={sortIndicator} />
                </TableHead>
              ) : null}
              {isColumnVisible('status') ? (
                <TableHead>
                  <SortButton column="status" label="Status" onSort={handleSort} sortIndicator={sortIndicator} />
                </TableHead>
              ) : null}
              {isColumnVisible('createdAt') ? (
                <TableHead>
                  <SortButton column="createdAt" label="Created Date" onSort={handleSort} sortIndicator={sortIndicator} />
                </TableHead>
              ) : null}
              {isColumnVisible('actions') ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: compact ? 5 : 10 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {isColumnVisible('name') ? (
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                  ) : null}
                  {isColumnVisible('email') ? (
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  ) : null}
                  {isColumnVisible('role') ? (
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  ) : null}
                  {isColumnVisible('status') ? (
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  ) : null}
                  {isColumnVisible('createdAt') ? (
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  ) : null}
                  {isColumnVisible('actions') ? (
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : list?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={renderedColumnsCount}
                  className="py-12 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                const displayedData = compact ? list?.data.slice(0, 5) : list?.data;
                return displayedData?.map((user) => (
                  <TableRow key={user.id} className="group transition-colors hover:bg-muted/40">
                    {isColumnVisible('name') ? (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt=""
                              className="size-8 rounded-full object-cover border"
                            />
                          ) : (
                            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                              {getInitials(user.name)}
                            </span>
                          )}
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                    ) : null}
                    {isColumnVisible('email') ? (
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    ) : null}
                    {isColumnVisible('role') ? (
                      <TableCell>
                        <Badge variant="secondary" className="capitalize font-normal text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                    ) : null}
                    {isColumnVisible('status') ? (
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                    ) : null}
                    {isColumnVisible('createdAt') ? (
                      <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    ) : null}
                    {isColumnVisible('actions') ? (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEditUser ? (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => onEditUser(user)}
                              title="Edit user"
                              className="h-8 w-8 cursor-pointer text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                            className="h-8 w-8 cursor-pointer text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </div>
      {!compact && list ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-border bg-muted/10">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(list.page - 1) * list.pageSize + 1}</span>–
            <span className="font-medium text-foreground">{Math.min(list.page * list.pageSize, list.total)}</span> of <span className="font-medium text-foreground">{list.total}</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={list.page <= 1}
              onClick={() => handlePageChange(list.page - 1)}
              className="cursor-pointer"
            >
              Prev
            </Button>
            <span className="px-2 text-sm tabular-nums sm:hidden">
              {list.page} / {list.totalPages}
            </span>
            {pageNumbers.map((page) => (
              <Button
                key={page}
                type="button"
                variant={page === list.page ? 'default' : 'outline'}
                size="sm"
                className="hidden sm:inline-flex cursor-pointer"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={list.page >= list.totalPages}
              onClick={() => handlePageChange(list.page + 1)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="cursor-pointer" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default UsersTable;
