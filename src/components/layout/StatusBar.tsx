import { useAppStore } from '@/store';
import { formatDimension } from '@/domain/units/format';
import { Mm } from '@/domain/units/types';
import styles from './StatusBar.module.css';

export function StatusBar() {
  const envelope = useAppStore((s) => s.envelope);
  const displayUnit = useAppStore((s) => s.displayUnit);
  const bays = useAppStore((s) => s.bays);
  const viewMode = useAppStore((s) => s.viewMode);
  const finishId = useAppStore((s) => s.finishId);
  const effectiveRenderer = useAppStore((s) => s.effectiveRenderer);
  const totalModules = bays.reduce((sum, b) => sum + b.modules.length, 0);

  return (
    <footer className={styles.bar}>
      <span>
        {formatDimension(envelope.width as Mm, displayUnit)} x{' '}
        {formatDimension(envelope.height as Mm, displayUnit)} x{' '}
        {formatDimension(envelope.depth as Mm, displayUnit)}
      </span>
      <span>{bays.length} bays</span>
      <span>{totalModules} modules</span>
      <span>{envelope.wallType}</span>
      <span>finish: {finishId}</span>
      <span>renderer: {viewMode === '3d' ? effectiveRenderer : 'webgl'}</span>
    </footer>
  );
}
