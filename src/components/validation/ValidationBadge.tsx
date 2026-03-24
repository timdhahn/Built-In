import { useAppStore } from '@/store';
import { selectErrorCount, selectWarningCount } from '@/store/selectors';
import styles from './ValidationBadge.module.css';

export function ValidationBadge() {
  const errorCount = useAppStore(selectErrorCount);
  const warningCount = useAppStore(selectWarningCount);

  if (errorCount === 0 && warningCount === 0) return null;

  return (
    <span className={styles.badge}>
      {errorCount > 0 && <span className={styles.errors}>{errorCount}</span>}
      {warningCount > 0 && <span className={styles.warnings}>{warningCount}</span>}
    </span>
  );
}
