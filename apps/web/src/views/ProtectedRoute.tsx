import { Navigate, Outlet } from 'react-router-dom';

import { useInitializer } from '@/contexts/initializer';
import { TwisterProvider } from '@/contexts/twister/Provider';

export function ProtectedRoute() {
  const { canProceed } = useInitializer();

  if (!canProceed) return <Navigate to='/' />;

  return (
    <TwisterProvider>
      <Outlet />
    </TwisterProvider>
  );
}
