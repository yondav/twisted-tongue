import { DrawerMenu } from './DrawerMenu';

export function AppHeader() {
  return (
    <header className='flex flex-col gap-4'>
      <div className='w-full flex justify-between'>
        <div className='size- flex flex-col xs:flex-row items-start xs:items-center gap-3'>
          <span className='rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground'>
            yondav
          </span>
          <span className='text-xs uppercase tracking-[0.25em] text-muted-foreground'>
            Twisted Tongue
          </span>
        </div>
        <DrawerMenu />
      </div>
    </header>
  );
}
