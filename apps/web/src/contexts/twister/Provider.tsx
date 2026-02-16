import type {
  ApiFailure,
  ApiResponse,
  Nullable,
  TwisterResponse,
  TwisterQueryParams,
  Difficulty,
  LengthPreset,
} from '@repo/types';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useInitializer } from '@/contexts/initializer';
import { fetchTwister } from '@/lib/queries';
import { calculateScoreBreakdown } from '@/lib/score';

import {
  TwisterProviderContext,
  type TwisterProviderProps,
  type TwisterProviderState,
  type TwisterStatus,
  type ListeningStatus,
  type TranscriptContext,
  type ScoreBreakdown,
} from './context';

export function TwisterProvider({ children }: TwisterProviderProps) {
  // Provider selection is derived from initializer context
  const { provider } = useInitializer();

  const [status, setStatus] = useState<TwisterStatus>('idle');
  const [data, setData] = useState<Nullable<TwisterResponse>>(null);
  const [error, setError] = useState<Nullable<ApiFailure['error']>>(null);
  const [lastParams, setLastParams] =
    useState<Nullable<TwisterQueryParams>>(null);

  // AbortController allows us to cancel in‑flight requests
  const controllerRef = useRef<Nullable<AbortController>>(null);

  const mutation = useMutation<
    ApiResponse<TwisterResponse>,
    Error,
    {
      params: TwisterQueryParams;
      signal?: AbortSignal;
    }
  >({
    mutationKey: ['twister'],
    mutationFn: ({ params, signal }) => fetchTwister(params, signal),
  });

  const generateTwister = useCallback(
    async (params: TwisterQueryParams) => {
      // Cancel any pending request before starting a new one
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const resolvedParams = {
        ...params,
        provider: params.provider ?? provider,
      };

      setStatus('pending');
      setData(null);
      setError(null);
      setLastParams(resolvedParams);
      setScoreBreakdown(null);

      try {
        const response = await mutation.mutateAsync({
          params: resolvedParams,
          signal: controllerRef.current?.signal,
        });

        if (response.success) {
          setStatus('success');
          setData(response.data);

          setTranscript({ interim: '', final: '' });
          setSpeechError(null);
          setSpeechStatus('idle');
        } else {
          // Edge case in event success is false but an error wasn't thrown to the catch block
          setStatus('error');
          setError(response.error);
        }
      } catch (err) {
        // Ignore aborts; treat all other errors as network failures
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setStatus('error');
        setError({
          code: 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Network error',
        });
      }
    },
    [mutation, provider]
  );

  const retry = useCallback(async () => {
    if (!lastParams) return;
    await generateTwister(lastParams);
  }, [generateTwister, lastParams]);

  // Gameplay states
  const [speechStatus, setSpeechStatus] = useState<ListeningStatus>('idle');
  const [speechError, setSpeechError] = useState<Nullable<string>>(null);
  const [lastUpdateAt, setLastUpdateAt] = useState<Nullable<number>>(null);
  const [time, setTime] = useState<Nullable<number>>(null);
  const [accuracy, setAccuracy] = useState<Nullable<number>>(null);
  const [scoreBreakdown, setScoreBreakdown] =
    useState<Nullable<ScoreBreakdown>>(null);
  const [transcript, setTranscript] = useState<TranscriptContext>({
    interim: '',
    final: '',
  });

  // Helper to secure fallback for SpeechRecognition on window object
  const getSpeechRecognitionCtor = () => {
    if (typeof SpeechRecognition !== 'undefined') return SpeechRecognition;
    if (typeof webkitSpeechRecognition !== 'undefined')
      return webkitSpeechRecognition;
    return null;
  };

  // Speech recognition refs
  const recognitionRef = useRef<Nullable<SpeechRecognition>>(null);
  const silenceTimerRef = useRef<Nullable<number>>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // Helpers to start/stop timer for when speech goes silent & game play handlers
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      window.clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    setSpeechStatus('stopped');
  }, [clearSilenceTimer]);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = window.setInterval(() => {
      if (speechStatus !== 'listening') return;
      const now = Date.now();
      if (now - lastUpdateRef.current >= 3000) {
        stopListening();
      }
    }, 500);
  }, [clearSilenceTimer, speechStatus, stopListening]);

  // Game play handlers
  const startListening = useCallback(() => {
    if (status !== 'success') return;
    if (speechStatus === 'listening') {
      stopListening();
      return;
    }

    const SpeechCtor = getSpeechRecognitionCtor();
    if (!SpeechCtor) {
      setSpeechStatus('error');
      setSpeechError('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechCtor();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    setSpeechStatus('listening');
    setSpeechError(null);
    setTranscript({ interim: '', final: '' });
    lastUpdateRef.current = Date.now();
    setLastUpdateAt(Date.now());
    recognition.onresult = event => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result ? result[0]?.transcript : '';
        if (result?.isFinal) final += text;
        else interim += text;
      }
      setTranscript(prev => ({
        interim,
        final: prev.final + final,
      }));
      const now = Date.now();
      lastUpdateRef.current = now;
      setLastUpdateAt(now);
    };
    recognition.onerror = event => {
      setSpeechStatus('error');
      setSpeechError(event.error || 'Speech recognition error');
    };
    recognition.onend = () => {
      setSpeechStatus('stopped');
    };
    recognition.start();
    startSilenceTimer();
  }, [status, speechStatus, startSilenceTimer, stopListening]);

  const resetListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setSpeechStatus('idle');
    setSpeechError(null);
    setLastUpdateAt(null);
    setTranscript({ interim: '', final: '' });
    lastUpdateRef.current = Date.now();
    setScoreBreakdown(null);
  }, [clearSilenceTimer]);

  const isListening = useMemo(
    () => speechStatus === 'listening',
    [speechStatus]
  );

  useEffect(() => {
    if (speechStatus !== 'stopped') return;
    if (!data?.tokens?.length || accuracy === null || time === null) return;
    if (!lastParams?.difficulty || !lastParams?.length) return;

    const breakdown = calculateScoreBreakdown({
      accuracyPercent: accuracy,
      timeSeconds: time / 100,
      difficulty: lastParams.difficulty as Difficulty,
      length: lastParams.length as LengthPreset,
      wordCount: data.tokens.length,
    });

    setScoreBreakdown(breakdown);
  }, [
    accuracy,
    data?.tokens,
    lastParams?.difficulty,
    lastParams?.length,
    speechStatus,
    time,
  ]);

  const value: TwisterProviderState = useMemo(
    () => ({
      status,
      data,
      error,
      lastParams,
      gamePlay: {
        speech: {
          status: speechStatus,
          error: speechError,
          isListening,
          lastUpdateAt,
        },
        transcript,
        metrics: {
          time,
          accuracy,
          scoreBreakdown,
        },
        setTime,
        setAccuracy,
        startListening,
        stopListening,
        resetListening,
      },
      generateTwister,
      retry,
    }),
    [
      accuracy,
      data,
      error,
      generateTwister,
      isListening,
      lastParams,
      lastUpdateAt,
      resetListening,
      retry,
      speechError,
      speechStatus,
      scoreBreakdown,
      startListening,
      status,
      stopListening,
      time,
      transcript,
    ]
  );

  return (
    <TwisterProviderContext.Provider value={value}>
      {children}
    </TwisterProviderContext.Provider>
  );
}
