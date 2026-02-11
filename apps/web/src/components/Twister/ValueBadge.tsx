import { cn } from '@/lib/utils';

export const ValueBadge = ({
  label,
  fallback,
}: {
  label?: string;
  fallback: string;
}) => {
  return (
    <span
      aria-invalid={!label}
      className={cn(
        'rounded-full bg-accent px-2 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground',
        'aria-invalid:bg-muted aria-invalid:text-muted-foreground'
      )}
    >
      {label ?? fallback}
    </span>
  );
};
