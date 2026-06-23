import * as React from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { initializeAuth } from '../store/authSlice';
import AppRoutes from '../routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppInitializerProps {
  children: React.ReactNode;
}

function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <AppInitializer>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AppInitializer>
  );
}
