import { Play as PlayIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useInitializer } from '@/contexts/initializer';

export function Play() {
  const navigate = useNavigate();
  const { canProceed } = useInitializer();

  return (
    <Button
      size='icon-lg'
      className='sm:size-12 md:size-14 lg:size-16'
      disabled={!canProceed}
      onClick={() => navigate('/twister')}
    >
      <PlayIcon className='md:w-6! md:h-6!' />
    </Button>
  );
}
