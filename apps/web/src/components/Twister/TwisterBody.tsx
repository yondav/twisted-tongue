import { useMemo } from 'react';

import { ApiError } from '@/components/Status/ApiError';
import { Idle } from '@/components/Status/Idle';
import { Pending } from '@/components/Status/Pending';
import { useTwister } from '@/contexts/twister/hook';
import { cn } from '@/lib/utils';

export function TwisterBody() {
  const { status, data } = useTwister();

  const tokens = useMemo(() => data?.tokens ?? [], [data?.tokens]);

  if (status === 'pending') return <Pending screen='twister' />;
  if (status === 'error') return <ApiError screen='twister' />;
  if (status === 'success' && data?.tokens)
    return (
      <div className='flex h-full flex-col gap-6'>
        <div className='flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-fit mx-auto'>
          {tokens.map((token, index) => (
            <span
              key={`${token}-${index}`}
              className={cn(
                'rounded-full border border-border bg-background uppercase text-center',
                'px-4 py-2 text-xl',
                'sm:px-5 sm:py-2.5 sm:text-3xl',
                'lg:px-6 lg:py-3 lg:text-4xl'
              )}
            >
              {token}
            </span>
          ))}
        </div>
      </div>
    );
  if (status === 'success')
    return (
      <div className='flex h-full flex-col items-center justify-center gap-3 text-center'>
        <h3 className='text-lg font-semibold'>No twister returned</h3>
        <p className='text-sm text-muted-foreground'>
          Try again or adjust your theme settings.
        </p>
      </div>
    );

  return <Idle screen='twister' />;
}
