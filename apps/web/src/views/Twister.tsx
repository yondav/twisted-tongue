import { TwisterBody } from '@/components/Twister/TwisterBody';
import { TwisterForm } from '@/components/Twister/TwisterForm';
import { useTwister } from '@/contexts/twister/hook';
import { cn } from '@/lib/utils';

export function Twister() {
  const { status, error } = useTwister();

  return (
    <>
      <TwisterForm />

      <main className='grid gap-6 flex-1'>
        <section
          aria-disabled={status === 'pending'}
          aria-invalid={status === 'error' && !!error}
          className={cn(
            'rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8',
            'aria-disabled:bg-card/40',
            'aria-invalid:bg-destructive/20 aria-invalid:border-destructive'
          )}
        >
          <TwisterBody />
        </section>
      </main>
    </>
  );
}
