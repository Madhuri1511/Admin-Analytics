import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppProvider from './app/providers';
import App from './app/App';
import { setupMockApi } from './services/mockApi';
import './index.css';

setupMockApi();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>,
  );
}
