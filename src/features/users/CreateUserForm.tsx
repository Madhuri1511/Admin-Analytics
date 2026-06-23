import {
  memo,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createUser, clearCreateError, fetchUsers, updateUser, clearUpdateError } from '../../store/usersSlice';
import type { User } from '../../store/usersSlice';
import { validateCreateUser, hasValidationErrors } from '../../utils/validators';
import { toast } from 'react-toastify';
import { FormField } from '@/components/common/form-field';
import { FormSelect } from '@/components/common/form-select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ROLE_OPTIONS = [
  { value: '', label: 'Select role' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const initialForm = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
  profileImage: '',
};

interface CreateUserFormProps {
  isModal?: boolean;
  onClose?: () => void;
  user?: User;
}

const CreateUserForm = memo(function CreateUserForm({ isModal = false, onClose, user }: CreateUserFormProps) {
  const [form, setForm] = useState(user ? {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage || '',
  } : initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(user?.profileImage || null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { createLoading, createError, updateLoading, updateError, query } = useAppSelector((state) => state.users);

  const isLoading = user ? updateLoading : createLoading;
  const apiError = user ? updateError : createError;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      dispatch(clearCreateError());
      dispatch(clearUpdateError());
    },
    [dispatch],
  );

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setPreviewImage(result);
        if (typeof result === 'string') {
          setForm((prev) => ({ ...prev, profileImage: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate('/users');
    }
  }, [onClose, navigate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearCreateError());
      dispatch(clearUpdateError());

      const errors = validateCreateUser(form);
      if (hasValidationErrors(errors)) {
        setFieldErrors(errors as Record<string, string>);
        return;
      }

      const result = user
        ? await dispatch(updateUser({ id: user.id, payload: form }))
        : await dispatch(createUser(form));

      if (user ? updateUser.fulfilled.match(result) : createUser.fulfilled.match(result)) {
        toast.success(user ? 'User updated successfully' : 'User created successfully');
        if (onClose) {
          dispatch(fetchUsers(query));
          onClose();
        } else {
          navigate('/users');
        }
      }
    },
    [form, dispatch, navigate, onClose, query, user],
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          placeholder="Priya Sharma"
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder="priya.sharma@yopmail.com"
        />
        <FormSelect
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
          error={fieldErrors.role}
        />
        <FormSelect
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          error={fieldErrors.status}
        />
      </div>

      <div className="grid gap-3">
        <Label>Profile Image</Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {previewImage ? (
            <img
              src={previewImage as string}
              alt="Preview"
              className="size-24 rounded-lg border object-cover"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              No image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
          />
        </div>
        <FormField
          name="profileImage"
          value={form.profileImage ?? ''}
          onChange={handleChange}
          error={fieldErrors.profileImage}
          placeholder="Or paste image URL"
        />
      </div>

      {apiError ? (
        <Alert variant="destructive">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className='cursor-pointer transition-all duration-300 hover:bg-secondary/80'
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className='cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
          {user ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Edit User' : 'Create New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
});

export default CreateUserForm;
