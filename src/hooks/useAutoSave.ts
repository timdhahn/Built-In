import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

export function useAutoSave(onSave: () => Promise<void>, delayMs: number = 30000) {
  const envelope = useAppStore((s) => s.envelope);
  const bays = useAppStore((s) => s.bays);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onSave().catch(console.error);
    }, delayMs);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [envelope, bays, onSave, delayMs]);
}
