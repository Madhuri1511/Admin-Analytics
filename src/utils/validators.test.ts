import { validateLogin, validateCreateUser, hasValidationErrors } from './validators';

describe('validateLogin', () => {
  it('returns error when email is empty', () => {
    expect(validateLogin('', 'password123')).toBe('Email is required');
  });

  it('returns error for invalid email format', () => {
    expect(validateLogin('not-an-email', 'password123')).toBe(
      'Enter a valid email address',
    );
  });

  it('returns error when password is too short', () => {
    expect(validateLogin('test@example.com', '123')).toBe(
      'Password must be at least 6 characters',
    );
  });

  it('returns null for valid credentials', () => {
    expect(validateLogin('arjun.mehta@yopmail.com', 'password123')).toBeNull();
  });
});

describe('validateCreateUser', () => {
  it('returns errors for empty required fields', () => {
    const errors = validateCreateUser({
      name: '',
      email: '',
      role: '',
      status: '',
    });
    expect(hasValidationErrors(errors)).toBe(true);
    expect(errors.name).toBe('Name is required');
    expect(errors.email).toBe('Email is required');
  });

  it('returns error for invalid profile image URL', () => {
    const errors = validateCreateUser({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'viewer',
      status: 'active',
      profileImage: 'not-a-url',
    });
    expect(errors.profileImage).toBe('Profile image must be a valid URL');
  });

  it('passes validation for valid user data', () => {
    const errors = validateCreateUser({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
    });
    expect(hasValidationErrors(errors)).toBe(false);
  });
});
