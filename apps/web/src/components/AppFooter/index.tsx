import { Mic, MicOff } from 'lucide-react';
import { useMemo } from 'react';

import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { useInitializer } from '@/contexts/initializer';

interface KeyBindingProps {
  kbd: string[];
  label: string;
}

const KeyBinding = ({ kbd, label }: KeyBindingProps) => {
  const keys = useMemo(() => {
    if (kbd.length > 1) return kbd.join(' + ');
    return kbd[0];
  }, [kbd]);

  return (
    <>
      <span className='hidden md:flex items-center gap-2 text-xs'>
        <Kbd>{keys}</Kbd> to {label}
      </span>
      <Separator orientation='vertical' className='hidden md:block' />
    </>
  );
};

export function AppFooter() {
  const { mic, provider } = useInitializer();

  const micStatusIndicator = useMemo(() => {
    if (mic.status === 'granted')
      return (
        <>
          <Mic size={12} /> enabled
        </>
      );
    return (
      <>
        <MicOff size={12} /> disabled
      </>
    );
  }, [mic.status]);

  return (
    <footer className='h-5 mt-auto w-full flex justify-end items-center gap-2'>
      <KeyBinding kbd={['⇧', 'D']} label='toggle mode' />
      <KeyBinding kbd={['⇧', 'T']} label='change theme' />
      <span className='flex items-center gap-2 text-xs'>
        {micStatusIndicator}
      </span>
      <Separator orientation='vertical' className='hidden md:block' />
      <span className='text-xs'>{provider}</span>
    </footer>
  );
}
