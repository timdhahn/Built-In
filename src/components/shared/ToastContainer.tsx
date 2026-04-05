import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store';
import { Toast, ToastItem } from './Toast';
import styles from './toast.module.css';

export function ToastContainer() {
  const validationIssues = useAppStore((s) => s.validationIssues);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const shownIds = useRef<Set<string>>(new Set());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    shownIds.current.delete(id);
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  useEffect(() => {
    const newToasts: ToastItem[] = [];

    for (const issue of validationIssues) {
      if (!shownIds.current.has(issue.id)) {
        shownIds.current.add(issue.id);
        if (issue.severity === 'info') continue;
        newToasts.push({
          id: issue.id,
          severity: issue.severity,
          message: issue.message,
          suggestion: issue.suggestion,
        });
      }
    }

    if (newToasts.length === 0) return;

    setToasts((prev) => [...prev, ...newToasts]);

    for (const toast of newToasts) {
      // Warnings auto-dismiss after 5s; errors stay until dismissed
      if (toast.severity === 'warning') {
        const timer = setTimeout(() => dismiss(toast.id), 5000);
        timers.current.set(toast.id, timer);
      }
    }
  }, [validationIssues, dismiss]);

  // Remove toasts for issues that have been resolved
  useEffect(() => {
    const activeIds = new Set(validationIssues.map((i) => i.id));
    setToasts((prev) => prev.filter((t) => activeIds.has(t.id)));
    // Sync shownIds to only active issues so they can re-appear if they return
    for (const id of shownIds.current) {
      if (!activeIds.has(id)) shownIds.current.delete(id);
    }
  }, [validationIssues]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
