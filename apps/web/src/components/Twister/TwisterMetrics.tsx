import { useEffect, useState } from 'react';

import { useTwister } from '@/contexts/twister/hook';

// import { Separator } from '../ui/separator';

export function TwisterMetrics() {
  const {
    gamePlay: {
      speech: { isListening },
      metrics: { accuracy },
      setTime,
      setAccuracy,
    },
  } = useTwister();
  const [clockTime, setClockTime] = useState(0);

  useEffect(() => {
    if (!isListening) {
      setTime(clockTime);
      setAccuracy(accuracy ?? null);
    }
  }, [accuracy, clockTime, isListening, setAccuracy, setTime]);

  useEffect(() => {
    if (isListening) setClockTime(0);
  }, [isListening]);

  useEffect(() => {
    let intervalId = 0;

    if (isListening)
      intervalId = setInterval(() => setClockTime(clockTime + 1), 10);

    return () => clearInterval(intervalId);
  }, [isListening, clockTime]);

  const minutes = Math.floor((clockTime % 360000) / 6000);
  const seconds = Math.floor((clockTime % 6000) / 100);
  const milliseconds = clockTime % 100;

  return (
    <div className='flex items-center gap-2 h-7'>
      <span className='font-bold text-lg'>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}:
        {milliseconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
