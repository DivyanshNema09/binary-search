import { useState, useEffect, useCallback, useRef } from 'react';
import type { VisualizationStep } from '@/types';

export type PlayState = 'playing' | 'paused' | 'idle';

export function useVisualizer(steps: VisualizationStep[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setPlayState('idle');
    setCurrentStep(0);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setPlayState('playing');
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setPlayState('paused');
  }, []);

  const togglePlay = useCallback(() => {
    if (playState === 'playing') {
      setPlayState('paused');
    } else {
      play();
    }
  }, [playState, play]);

  const goToStep = useCallback((index: number) => {
    setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps]);

  useEffect(() => {
    if (playState !== 'playing') return;
    if (currentStep >= totalSteps - 1) {
      setPlayState('idle');
      return;
    }
    const delay = 1000 / speed;
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delay);
    return () => clearTimer();
  }, [playState, currentStep, speed, totalSteps, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    steps,
    currentStep,
    step,
    totalSteps,
    playState,
    speed,
    setSpeed,
    next,
    prev,
    reset,
    play,
    pause,
    togglePlay,
    goToStep,
  };
}
