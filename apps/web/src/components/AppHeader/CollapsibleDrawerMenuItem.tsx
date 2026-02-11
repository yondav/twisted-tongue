import { ChevronsUpDown } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface CollapsibleDrawerMenuItemProps<T> {
  options: { id: T; label: string }[];
  currentSelection: T;
  onSelect: (id: T) => void;
  defaultOpen?: boolean;
  label: string;

  // a11y
  triggerLabel?: string;
  listboxLabel?: string;
  selectionLabel?: string;
  idBase?: string;
}

export function CollapsibleDrawerMenuItem<T>({
  options,
  currentSelection,
  onSelect,
  defaultOpen = false,
  label,
  triggerLabel = 'Toggle options',
  listboxLabel = 'Options',
  selectionLabel = 'Current Selection',
  idBase = 'collapsible-menu-item',
}: CollapsibleDrawerMenuItemProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const contentId = `${idBase}-content`;
  const triggerId = `${idBase}-trigger`;

  const handleSelect = useCallback(
    (id: T) => {
      onSelect(id);
      setIsOpen(false);
    },
    [onSelect]
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='flex w-87.5 flex-col gap-2'
    >
      <div className='flex items-center justify-between gap-4 px-4'>
        <h4 id={`${idBase}-label`} className='text-sm font-semibold'>
          {label}
        </h4>
        <CollapsibleTrigger asChild>
          <Button
            id={triggerId}
            variant='ghost'
            size='icon'
            className='size-8'
            aria-label={triggerLabel}
            aria-controls={contentId}
            aria-expanded={isOpen}
          >
            <ChevronsUpDown aria-hidden='true' />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleTrigger asChild>
        <Button
          role='status'
          aria-label={selectionLabel}
          variant='outline'
          className='w-full'
        >
          {options.find(opt => opt.id === currentSelection)?.label}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        id={contentId}
        role='listbox'
        aria-label={listboxLabel}
        className='flex flex-col gap-2'
      >
        {options
          .filter(opt => opt.id !== currentSelection)
          .map(opt => (
            <Button
              key={opt.id as string}
              role='option'
              variant='secondary'
              onClick={() => handleSelect(opt.id)}
              className='w-full justify-start'
            >
              {opt.label}
            </Button>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
