import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { StatusProps } from './types';

export function Pending({ screen }: StatusProps) {
  return (
    <div
      className={cn([
        'flex justify-center items-center text-muted-foreground',
        {
          'sm:size-12 md:size-14 lg:size-16': screen === 'splash',
          'h-full': screen === 'twister',
        },
      ])}
    >
      <LoaderCircle
        className={cn([
          'animate-spin',
          {
            'md:w-6! md:h-6!': screen === 'splash',
            'w-12! h-12! sm:w-16! sm:h-16! md:w-20! md:h-20! lg:w-24! lg:h-24!':
              screen === 'twister',
          },
        ])}
      />
    </div>
  );
}
