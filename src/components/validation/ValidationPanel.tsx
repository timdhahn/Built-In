import { useAppStore } from '@/store';
import styles from './ValidationPanel.module.css';

export function ValidationPanel() {
  const issues = useAppStore((s) => s.validationIssues);

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  if (issues.length === 0) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.heading}>Validation</h3>
        <p className={styles.ok}>No issues found</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Validation</h3>
      {errors.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.errorDot} /> {errors.length} Error{errors.length !== 1 ? 's' : ''}
          </h4>
          {errors.map((issue) => (
            <div key={issue.id} className={styles.issue}>
              <p className={styles.message}>{issue.message}</p>
              {issue.suggestion && <p className={styles.suggestion}>{issue.suggestion}</p>}
            </div>
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.warningDot} /> {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
          </h4>
          {warnings.map((issue) => (
            <div key={issue.id} className={styles.issue}>
              <p className={styles.message}>{issue.message}</p>
              {issue.suggestion && <p className={styles.suggestion}>{issue.suggestion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
