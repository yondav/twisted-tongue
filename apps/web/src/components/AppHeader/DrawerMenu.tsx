import { Copyright, Menu, X } from 'lucide-react';

import { GitHub, YonDav } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { modeOptions, themeOptions, useTheming } from '@/contexts/theming';

import { CollapsibleDrawerMenuItem } from './CollapsibleDrawerMenuItem';

export function DrawerMenu() {
  const { theme, mode, setTheme, setMode } = useTheming();
  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        <Button variant='outline' size='icon'>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className='flex items-center justify-between'>
            <div>
              <DrawerTitle>Twisted Tongue</DrawerTitle>
              <DrawerDescription>by Tone Labs</DrawerDescription>
            </div>
            <DrawerClose asChild autoFocus>
              <Button variant='ghost' size='icon'>
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <DrawerBody>
          <CollapsibleDrawerMenuItem
            options={themeOptions}
            currentSelection={theme}
            onSelect={setTheme}
            label='Theme'
            triggerLabel='Toggle theme'
            listboxLabel='Themes'
            selectionLabel='Current Theme'
            idBase='twister-themes'
          />
          <CollapsibleDrawerMenuItem
            options={modeOptions}
            currentSelection={mode}
            onSelect={setMode}
            label='Mode'
            triggerLabel='Toggle mode'
            listboxLabel='Modes'
            selectionLabel='Current Mode'
            idBase='twister-modes'
          />
        </DrawerBody>
        <DrawerFooter className='flex flex-col items-center justify-enter'>
          <div className='flex items-center gap-2'>
            <a
              href='https://github.com/yondav'
              target='_blank'
              rel='noopener noreferrer'
              className='opacity-90 hover:opacity-100 transition-all'
            >
              <GitHub size={30} />
            </a>
            <a
              href='https://yondav.us'
              target='_blank'
              rel='noopener noreferrer'
              className='opacity-90 hover:opacity-100 transition-all'
            >
              <YonDav />
            </a>
          </div>
          <div className='flex items-center gap-1'>
            <Copyright size={14} />
            <span className='text-sm'>yondav {new Date().getFullYear()}</span>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
