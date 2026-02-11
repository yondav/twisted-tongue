import { AlertCircleIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useInitializer } from '@/contexts/initializer';
import { useTwister } from '@/contexts/twister/hook';

import type { StatusProps } from './types';

function ReadynessApiError() {
  const {
    api: { error },
    checkApi,
    setProvider,
  } = useInitializer();

  const errorContent = useMemo(() => {
    if (!error) return null;

    const title =
      error.code === 'PROVIDER_FAILURE'
        ? 'OpenAI connection failed'
        : 'Internal Error';

    return {
      title,
      message: error.message,
    };
  }, [error]);

  const isMockAvailable = useMemo(
    () => !(error && error?.code !== 'PROVIDER_FAILURE'),
    [error]
  );

  return (
    <div className='flex flex-col justify-center items-center gap-4'>
      <div className='flex items-center justify-center gap-2'>
        <Button
          size='lg'
          onClick={() => setProvider('mock')}
          disabled={!isMockAvailable}
        >
          Mock
        </Button>
        <Button size='lg' onClick={checkApi}>
          Retry
        </Button>
      </div>
      {error && (
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircleIcon />
          <AlertTitle>{errorContent?.title ?? 'Unknown error'}</AlertTitle>
          {errorContent?.message && (
            <AlertDescription>{errorContent.message}</AlertDescription>
          )}
        </Alert>
      )}
    </div>
  );
}

function TwisterApiError() {
  const { setProvider } = useInitializer();
  const { error, lastParams, generateTwister, retry } = useTwister();

  const errorContent = useMemo(() => {
    if (!error) return null;

    const title =
      error.code === 'PROVIDER_FAILURE'
        ? 'OpenAI connection failed'
        : 'Internal Error';

    return {
      title,
      message: error.message,
    };
  }, [error]);

  const canUseMock = Boolean(lastParams);

  const handleMockRequest = useCallback(async () => {
    if (!lastParams) return;
    await generateTwister({ ...lastParams, provider: 'mock' });

    setProvider('mock');
  }, [generateTwister, lastParams, setProvider]);

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='flex items-center justify-center gap-2'>
        <Button size='lg' onClick={handleMockRequest} disabled={!canUseMock}>
          Mock
        </Button>
        <Button size='lg' onClick={retry}>
          Retry
        </Button>
      </div>
      {error && (
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircleIcon />
          <AlertTitle>{errorContent?.title ?? 'Unknown error'}</AlertTitle>
          {errorContent?.message && (
            <AlertDescription>{errorContent.message}</AlertDescription>
          )}
        </Alert>
      )}
    </div>
  );
}

export function ApiError({ screen }: StatusProps) {
  if (screen === 'splash') return <ReadynessApiError />;
  if (screen === 'twister') return <TwisterApiError />;

  return null;
}
