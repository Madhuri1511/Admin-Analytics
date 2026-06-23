import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { tokenStorage, decodeTokenExpiry } from '../utils/tokenStorage';

export function useTokenExpiry(): void {
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleLogout = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const token = tokenStorage.getAccessToken();
      if (!token) return;

      const expiry = decodeTokenExpiry(token);
      if (!expiry) {
        dispatch(logout());
        return;
      }

      const msUntilExpiry = expiry - Date.now();
      if (msUntilExpiry <= 0) {
        dispatch(logout());
        return;
      }

      timerRef.current = setTimeout(() => {
        dispatch(logout());
      }, msUntilExpiry);
    };

    scheduleLogout();

    const handleStorage = () => scheduleLogout();
    window.addEventListener('storage', handleStorage);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('storage', handleStorage);
    };
  }, [dispatch]);
}
