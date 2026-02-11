import { SplashBody } from '@/components/Splash/SplashBody';
import { Idle } from '@/components/Status/Idle';

export function Splash() {
  return (
    <main className='absolute top-1/2 left-1/2 -translate-1/2 max-w-xl'>
      <Idle screen='splash' />
      <div className='mt-4 flex items-center justify-center gap-2'>
        <SplashBody />
      </div>
    </main>
  );
}
