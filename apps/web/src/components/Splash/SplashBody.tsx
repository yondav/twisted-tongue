import { ApiError } from '@/components/Status/ApiError';
import { MicCheck } from '@/components/Status/MicCheck';
import { Pending } from '@/components/Status/Pending';
import { Play } from '@/components/Status/Play';
import { useInitializer } from '@/contexts/initializer';

export function SplashBody() {
  const {
    mic: { status: micStatus },
    api: { status: apiStatus },
    canProceed,
  } = useInitializer();

  if (micStatus !== 'granted') return <MicCheck />;
  if (apiStatus === 'error') return <ApiError screen='splash' />;
  if (canProceed) return <Play />;

  return <Pending screen='splash' />;
}
