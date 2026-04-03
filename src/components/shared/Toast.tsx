import styles from './toast.module.css';

export interface ToastItem {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[toast.severity]}`}>
      <div className={styles.dot} />
      <div className={styles.body}>
        <div className={styles.message}>{toast.message}</div>
        {toast.suggestion && (
          <div className={styles.suggestion}>{toast.suggestion}</div>
        )}
      </div>
      <button className={styles.dismiss} onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
