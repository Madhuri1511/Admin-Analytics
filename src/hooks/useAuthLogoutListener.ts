import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';

export function useAuthLogoutListener(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = () => {
      dispatch(logout());
    };
    window.addEventListener('auth:logout', handler);
    return () => {
      window.removeEventListener('auth:logout', handler);
    };
  }, [dispatch]);
}
