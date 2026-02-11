import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { InitializerProvider } from '@/contexts/initializer';
import { ThemingProvider } from '@/contexts/theming/Provider.tsx';

import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <InitializerProvider>
        <ThemingProvider>
          <App />
        </ThemingProvider>
      </InitializerProvider>
    </QueryClientProvider>
  </StrictMode>
);
