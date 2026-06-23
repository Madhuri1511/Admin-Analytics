import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, logout, clearError } from '../store/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, initialized } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogin = useCallback(
    (email?: string, password?: string) => dispatch(login({ email, password })),
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initialized,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
}
