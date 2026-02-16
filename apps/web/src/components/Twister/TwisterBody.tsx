import { ApiError } from '@/components/Status/ApiError';
import { Idle } from '@/components/Status/Idle';
import { Pending } from '@/components/Status/Pending';
import { useTwister } from '@/contexts/twister/hook';

import { TwisterGamePlay } from './TwisterGamePlay';

export function TwisterBody() {
  const { status, data } = useTwister();

  if (status === 'pending') return <Pending screen='twister' />;
  if (status === 'error') return <ApiError screen='twister' />;
  if (status === 'success' && data?.tokens) return <TwisterGamePlay />;
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
