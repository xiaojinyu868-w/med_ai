import { useEffect, useRef } from "react";

export const useDwellTime = (onStop: (dwellTimeMs: number) => void) => {
  const startRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    startRef.current = performance.now();
    return () => {
      if (!stoppedRef.current && startRef.current !== null) {
        const dwell = performance.now() - startRef.current;
        onStop(Math.round(dwell));
        stoppedRef.current = true;
      }
    };
  }, [onStop]);

  const stop = (value?: number) => {
    if (stoppedRef.current || startRef.current === null) return null;
    const dwell = value ?? performance.now() - startRef.current;
    stoppedRef.current = true;
    const rounded = Math.round(dwell);
    onStop(rounded);
    return rounded;
  };

  return { stop };
};
