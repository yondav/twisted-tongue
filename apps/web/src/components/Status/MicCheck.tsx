import { AlertCircleIcon, Mic } from 'lucide-react';
import { useMemo } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useInitializer } from '@/contexts/initializer';

export function MicCheck() {
  const {
    mic: { status, error },
    checkMic,
  } = useInitializer();

  const errorMessage = useMemo(() => {
    if (error?.message) return `${error.message}.`;
    return null;
  }, [error?.message]);

  return (
    <div className='relative flex flex-col items-center justify-center gap-4'>
      <div className='relative'>
        {status !== 'granted' && (
          <span className='absolute -top-1 -right-1 flex size-3'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-ring opacity-75'></span>
            <span className='relative inline-flex size-3 rounded-full bg-ring-accent'></span>
          </span>
        )}
        <Button
          size='icon-lg'
          className='sm:size-12 md:size-14 lg:size-16'
          onClick={checkMic}
        >
          <Mic className='md:w-6! md:h-6!' />
        </Button>
      </div>
      {error && (
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircleIcon />
          <AlertTitle>Microphone access failed</AlertTitle>
          {errorMessage && <AlertDescription>{errorMessage}</AlertDescription>}
        </Alert>
      )}
    </div>
  );
}
