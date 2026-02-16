import { useEffect, useMemo, useState } from 'react';

import { useTwister } from '@/contexts/twister/hook';
import { cn } from '@/lib/utils';

import { TwisterScoreBreakdownModal } from './TwisterScoreBreakdownModal';

export function TwisterGamePlay() {
  const {
    data,
    gamePlay: {
      speech,
      transcript,
      setAccuracy,
      metrics: { scoreBreakdown },
    },
  } = useTwister();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const showIndicators = useMemo(
    () => speech.status === 'stopped' || speech.isListening,
    [speech.isListening, speech.status]
  );

  const normalizeToken = (token: string): string => {
    const edgePunctuation = /^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g;
    return token.trim().replace(edgePunctuation, '').toLowerCase();
  };
  const normalizeTokens = (tokens: string[]): string[] =>
    tokens.map(normalizeToken).filter(Boolean);
  const normalizeTranscript = (text: string): string[] =>
    text.trim().split(/\s+/).map(normalizeToken).filter(Boolean);

  const targetTokens = normalizeTokens(data?.tokens ?? []);

  const finalTokens = normalizeTranscript(transcript.final);
  const combinedTokens = normalizeTranscript(
    `${transcript.final} ${transcript.interim}`
  );

  const tokenStates = targetTokens.map((token, idx) => {
    const combined = combinedTokens[idx];
    const final = finalTokens[idx];
    if (!combined) return 'pending';
    if (combined === token) return 'correct';
    // only mark incorrect if the FINAL token at this index exists and is wrong
    if (final) return 'incorrect';
    return 'unstable';
  });

  const accuracy = useMemo(() => {
    const total = targetTokens.length;
    const correct = tokenStates.filter(s => s === 'correct').length;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [targetTokens.length, tokenStates]);

  useEffect(() => {
    if (speech.status === 'stopped') setAccuracy(accuracy);
  }, [accuracy, setAccuracy, speech.status]);

  useEffect(() => {
    if (speech.status === 'stopped' && scoreBreakdown) setShowBreakdown(true);

    if (speech.status === 'listening') setShowBreakdown(false);
  }, [scoreBreakdown, speech.status]);

  return (
    <>
      <div className='flex h-full flex-col gap-6'>
        <div className='flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-fit mx-auto'>
          {targetTokens.map((token, index) => (
            <span
              key={`${token}-${index}`}
              className={cn(
                'rounded-full border border-border bg-background uppercase text-center',
                'px-4 py-2 text-xl',
                'sm:px-5 sm:py-2.5 sm:text-3xl',
                'lg:px-6 lg:py-3 lg:text-4xl',
                {
                  'blur-md': speech.status === 'idle',
                  'text-success bg-success/20 border-success':
                    tokenStates[index] === 'correct' && showIndicators,
                  'text-destructive bg-destructive/20 border-destructive':
                    tokenStates[index] === 'incorrect' && showIndicators,
                  'text-warning bg-warning/20 border-warning':
                    tokenStates[index] === 'unstable' && showIndicators,
                }
              )}
            >
              {token}
            </span>
          ))}
        </div>
      </div>
      <TwisterScoreBreakdownModal
        isOpen={showBreakdown}
        onOpenChange={setShowBreakdown}
      />
    </>
  );
}
