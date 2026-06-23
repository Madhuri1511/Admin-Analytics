import * as yup from 'yup';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = yup.object({
  email: yup.string()
    .trim()
    .required('Email is required')
    .matches(EMAIL_REGEX, {
      message: 'Enter a valid email address',
      excludeEmptyString: true,
    }),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
}).required();

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  profileImage?: string;
}

export function validateLogin(email?: string, password?: string): string | null {
  try {
    loginSchema.validateSync({ email, password }, { abortEarly: true });
    return null;
  } catch (err: any) {
    return err.message;
  }
}

export function validateCreateUser(data: CreateUserPayload): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!data.role) {
    errors.role = 'Role is required';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  if (
    data.profileImage &&
    !/^https?:\/\/.+/i.test(data.profileImage) &&
    !/^data:image\/.+/i.test(data.profileImage)
  ) {
    errors.profileImage = 'Profile image must be a valid URL';
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
