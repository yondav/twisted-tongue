import type { Difficulty, LengthPreset } from '@repo/types';
import { ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMediaQuery } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTwister } from '@/contexts/twister/hook';

import { ValueBadge } from './ValueBadge';

interface TwisterFormScema {
  theme?: string;
  difficulty?: Difficulty;
  length?: LengthPreset;
}

const themeOptions = [
  { value: 'sea', label: 'Sea' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'space', label: 'Space' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'animals', label: 'Animals' },
];

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

const lengthOptions = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export function TwisterForm() {
  const { generateTwister } = useTwister();

  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { control, handleSubmit, watch } = useForm<TwisterFormScema>({
    mode: 'onChange',
  });

  const themeValue = watch('theme');
  const difficultyValue = watch('difficulty');
  const lengthValue = watch('length');
  const isComplete = Boolean(themeValue && difficultyValue && lengthValue);

  const renderSelectField = (
    name: keyof TwisterFormScema,
    label: string,
    options: { value: string; label: string }[],
    placeholder: string
  ) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: `Select a ${label.toLowerCase()}` }}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className='h-full items-start'>
          <FieldLabel
            htmlFor={`form-twister-config-${name}`}
            className='hidden'
          >
            {label}
          </FieldLabel>
          <Select value={field.value ?? ''} onValueChange={field.onChange}>
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue
                id={`form-twister-config-${name}`}
                placeholder={placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );

  const onSubmit = useCallback(
    async (values: TwisterFormScema) => {
      await generateTwister(values);
      if (!isDesktop) setIsOpen(false);
    },
    [generateTwister, isDesktop]
  );

  return (
    <section className='rounded-2xl border border-border bg-card py-3 shadow-sm'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mx-4 p-0'>
        <div className='flex items-center justify-between gap-3 md:hidden'>
          <CollapsibleTrigger asChild>
            <button
              type='button'
              className='flex flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-3 py-2 text-left text-sm text-secondary-foreground'
            >
              <div className='mx-auto flex itemse-center sm:gap-2'>
                <ValueBadge
                  label={
                    themeOptions.find(option => option.value === themeValue)
                      ?.label
                  }
                  fallback='Theme'
                />
                <ValueBadge
                  label={
                    difficultyOptions.find(
                      option => option.value === difficultyValue
                    )?.label
                  }
                  fallback='Difficulty'
                />
                <ValueBadge
                  label={
                    lengthOptions.find(option => option.value === lengthValue)
                      ?.label
                  }
                  fallback='Length'
                />
              </div>
              <ChevronDown className='size-4' aria-hidden='true' />
            </button>
          </CollapsibleTrigger>
        </div>

        {isDesktop && (
          <form
            id='form-twister-config'
            className='grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_auto] md:items-center'
            onSubmit={handleSubmit(onSubmit)}
          >
            {renderSelectField('theme', 'Theme', themeOptions, 'Select Theme')}
            {renderSelectField(
              'difficulty',
              'Difficulty',
              difficultyOptions,
              'Select Difficulty'
            )}
            {renderSelectField(
              'length',
              'Length',
              lengthOptions,
              'Select Length'
            )}
            <div className='flex justify-start md:justify-end h-full items-start'>
              <Button type='submit' className='px-5' disabled={!isComplete}>
                Generate
              </Button>
            </div>
          </form>
        )}

        {!isDesktop && (
          <CollapsibleContent>
            <form
              id='form-twister-config'
              className='mt-3 grid gap-3'
              onSubmit={handleSubmit(onSubmit)}
            >
              {renderSelectField(
                'theme',
                'Theme',
                themeOptions,
                'Select Theme'
              )}
              {renderSelectField(
                'difficulty',
                'Difficulty',
                difficultyOptions,
                'Select Difficulty'
              )}
              {renderSelectField(
                'length',
                'Length',
                lengthOptions,
                'Select Length'
              )}
              <div className='flex justify-end'>
                <Button type='submit' className='px-5' disabled={!isComplete}>
                  Generate
                </Button>
              </div>
            </form>
          </CollapsibleContent>
        )}
      </Collapsible>
    </section>
  );
}
