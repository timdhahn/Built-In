import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { runValidation, allRules } from '@/domain/validation';
import { ValidationContext } from '@/domain/validation/types';

export function useValidation() {
  const envelope = useAppStore((s) => s.envelope);
  const bays = useAppStore((s) => s.bays);
  const setIssues = useAppStore((s) => s.setValidationIssues);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const context: ValidationContext = {
        envelope: {
          width: envelope.width as number,
          height: envelope.height as number,
          depth: envelope.depth as number,
        },
        bays: bays.map((b) => ({
          id: b.id,
          width: b.width as number,
          modules: b.modules.map((m) => ({
            id: m.id,
            type: m.type,
            x: m.x as number,
            y: m.y as number,
            width: m.width as number,
            height: m.height as number,
            depth: m.depth as number,
          })),
        })),
      };
      const issues = runValidation(allRules, context);
      setIssues(issues);
    }, 100);
    return () => clearTimeout(timeout);
  }, [envelope, bays, setIssues]);
}
