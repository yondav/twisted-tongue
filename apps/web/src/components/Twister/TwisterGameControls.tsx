import { ArrowLeft, Play, RotateCcw, Square } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTwister } from '@/contexts/twister/hook';
import { cn } from '@/lib/utils';

import { TwisterMetrics } from './TwisterMetrics';
import { TwisterScoreBreakdownModal } from './TwisterScoreBreakdownModal';

type TwisterGameControlsProps = {
  onBack?: () => void;
};

export function TwisterGameControls({ onBack }: TwisterGameControlsProps) {
  const {
    gamePlay: {
      speech: { status, isListening },
      metrics: { scoreBreakdown },
      startListening,
      resetListening,
      stopListening,
    },
  } = useTwister();

  const [countDown, setCountDown] = useState(3);
  const [countDownActive, setCountDownActive] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);

  useEffect(() => {
    if (!countDownActive) return;
    const interval = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) return 0;

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownActive]);

  useEffect(() => {
    if (!countDownActive) return;
    if (countDown === 0) {
      startListening();
      setCountDownActive(false);
      setCountDown(3);
    }
  }, [countDown, countDownActive, startListening]);

  const startGame = useCallback(() => {
    setCountDown(3);
    setCountDownActive(true);
  }, []);

  const handleRestart = useCallback(() => {
    resetListening();
    startGame();
  }, [resetListening, startGame]);

  const isStopped = status === 'stopped';
  const isIdle = status === 'idle' || status === 'error';

  return (
    <>
      <section className='rounded-2xl border border-border bg-card py-3 shadow-sm'>
        <div className='mx-4 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            {isListening && (
              <span className='flex items-center gap-2 text-success'>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-ring-accent opacity-75'></span>
                  <span className='relative inline-flex size-2 rounded-full bg-ring-accent'></span>
                </span>
                Listening
              </span>
            )}
            {!isListening && countDownActive && (
              <span className='text-ring-accent'>Starting in {countDown}</span>
            )}
            {isIdle && !countDownActive && <span>Ready</span>}
            {isStopped && <span>Stopped</span>}
          </div>
          {isListening || countDownActive ? (
            <TwisterMetrics />
          ) : scoreBreakdown ? (
            <Button
              onClick={() => setIsScoreOpen(true)}
              aria-label='Open score breakdown'
            >
              Score: {scoreBreakdown.score}
            </Button>
          ) : (
            <TwisterMetrics />
          )}
          <div className='flex items-center gap-2'>
            {onBack && !isListening && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon-lg'
                    className='sm:size-12'
                    onClick={onBack}
                    aria-label='Back to twister settings'
                  >
                    <ArrowLeft className='sm:w-6! sm:h-6!' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to form</TooltipContent>
              </Tooltip>
            )}
            {isListening && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon-lg'
                    className='sm:size-12'
                    onClick={stopListening}
                    aria-label='Stop listening'
                  >
                    <Square className='sm:w-6! sm:h-6!' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop Game</TooltipContent>
              </Tooltip>
            )}
            {isListening && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon-lg'
                    variant='ghost'
                    className='sm:size-12'
                    onClick={handleRestart}
                    aria-label='Restart attempt'
                  >
                    <RotateCcw className='sm:w-6! sm:h-6!' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restart</TooltipContent>
              </Tooltip>
            )}
            {(isIdle || isStopped) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon-lg'
                    className={cn('sm:size-12', {
                      'opacity-60 pointer-events-none': countDownActive,
                    })}
                    onClick={startGame}
                    aria-label='Start listening'
                  >
                    <Play className='sm:w-6! sm:h-6!' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start game</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </section>
      {countDownActive && countDown > 0 && (
        <div className='z-50 fixed top-0 left-0 w-full h-full bg-black/80 text-white backdrop-blur-lg'>
          <div className='absolute top-1/2 left-1/2 -translate-1/2 text-9xl text-center font-black'>
            {countDown}
          </div>
        </div>
      )}
      <TwisterScoreBreakdownModal
        isOpen={isScoreOpen}
        onOpenChange={setIsScoreOpen}
      />
    </>
  );
}
