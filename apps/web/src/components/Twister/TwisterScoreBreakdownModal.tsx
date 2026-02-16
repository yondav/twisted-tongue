import type { Dispatch, SetStateAction } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTwister } from '@/contexts/twister/hook';

interface TwisterScoreBreakdownModalProps {
  isOpen?: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function TwisterScoreBreakdownModal({
  isOpen,
  onOpenChange,
}: TwisterScoreBreakdownModalProps) {
  const {
    lastParams,
    gamePlay: {
      metrics: { scoreBreakdown },
    },
  } = useTwister();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Score breakdown</DialogTitle>
          <DialogDescription className='hidden'>
            Scored contributions
          </DialogDescription>
        </DialogHeader>
        {scoreBreakdown && (
          <div className='grid gap-2 text-sm'>
            <div className='flex items-center justify-between'>
              <span>Score:</span>
              <span className='font-bold'>{scoreBreakdown.score}</span>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <span>Accuracy:</span>
              <span className='font-bold'>
                {(scoreBreakdown.accuracyFactor * 100).toFixed(0)}%
              </span>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <span>Time:</span>
              <span className='font-bold'>{scoreBreakdown.timeSeconds}s</span>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <span>Expected Time:</span>
              <span className='font-bold'>
                {scoreBreakdown.expectedTime.toFixed(2)}s
              </span>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <span>Difficulty:</span>
              <span className='font-bold'>{lastParams?.difficulty}</span>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <span>Word Count:</span>
              <span className='font-bold'>{scoreBreakdown.wordCount}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
