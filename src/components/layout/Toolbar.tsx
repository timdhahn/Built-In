import { useAppStore } from '@/store';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { UnitToggle } from '../shared/UnitToggle';
import { ValidationBadge } from '../validation/ValidationBadge';
import styles from './Toolbar.module.css';

export function Toolbar() {
  const projectName = useAppStore((s) => s.projectName);
  const setProjectName = useAppStore((s) => s.setProjectName);
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <header className={styles.toolbar}>
      <div className={styles.left}>
        <span className={styles.logo}>Built-In</span>
        <input
          className={styles.nameInput}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
        />
      </div>

      <div className={styles.center}>
        <button className={styles.btn} onClick={() => undo()} disabled={!canUndo} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button className={styles.btn} onClick={() => redo()} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
          Redo
        </button>
        <div className={styles.separator} />
        <button
          className={`${styles.btn} ${viewMode === '2d' ? styles.active : ''}`}
          onClick={() => setViewMode('2d')}
        >
          2D
        </button>
        <button
          className={`${styles.btn} ${viewMode === '3d' ? styles.active : ''}`}
          onClick={() => setViewMode('3d')}
        >
          3D
        </button>
      </div>

      <div className={styles.right}>
        <ValidationBadge />
        <UnitToggle />
      </div>
    </header>
  );
}
