import { Outlet } from 'react-router-dom';

import { AppFooter } from '@/components/AppFooter';
import { AppHeader } from '@/components/AppHeader';
import { TooltipProvider } from '@/components/ui/tooltip';

export function MainLayout() {
  return (
    <TooltipProvider>
      <div className='relative min-h-svh bg-background text-foreground'>
        <div className='relative mx-auto flex w-full min-h-screen max-w-6xl flex-col gap-10 px-6 pt-10 pb-6 md:px-10'>
          <AppHeader />
          <>
            <Outlet />
          </>
          <AppFooter />
        </div>
      </div>
    </TooltipProvider>
  );
}
