import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useTokenExpiry } from '../hooks/useTokenExpiry';
import { useAuthLogoutListener } from '../hooks/useAuthLogoutListener';

interface AuthEffectsProps {
  children: React.ReactNode;
}

function AuthEffects({ children }: AuthEffectsProps) {
  useTokenExpiry();
  useAuthLogoutListener();
  return <>{children}</>;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <Provider store={store}>
      <AuthEffects>{children}</AuthEffects>
    </Provider>
  );
}
