import { appConfig } from '@/config/appConfig';
import { cn } from '@/lib/utils';

import type { StatusProps } from './types';

export function Idle({ screen }: StatusProps) {
  return (
    <div className='flex flex-col gap-2 lg:items-center lg:text-center sm:max-w-xl mx-auto'>
      <h1 className='font-display font-semibold leading-tight text-center text-6xl md:text-8xl lg:text-9xl'>
        {appConfig.title}
      </h1>
      <p
        className={cn([
          'w-full text-base text-muted-foreground font-extralight text-center md:text-lg',
          { 'min-w-xs max-w-xl': screen === 'splash' },
        ])}
      >
        {appConfig.description}
      </p>
    </div>
  );
}
