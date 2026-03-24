import { Suspense, lazy } from 'react';
import { useAppStore } from '@/store';
import { useValidation } from '@/hooks/useValidation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { BayBar } from '../bays/BayBar';
import { ElevationCanvas } from '@/views/elevation/ElevationCanvas';
import styles from './AppShell.module.css';

const Scene = lazy(() => import('@/views/three/Scene').then((m) => ({ default: m.Scene })));

export function AppShell() {
  const viewMode = useAppStore((s) => s.viewMode);

  useValidation();
  useKeyboardShortcuts();

  return (
    <div className={styles.shell}>
      <Toolbar />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.main}>
          <BayBar />
          <div className={styles.canvas}>
            {viewMode === '2d' ? (
              <ElevationCanvas />
            ) : (
              <Suspense fallback={<div className={styles.loading}>Loading 3D...</div>}>
                <Scene />
              </Suspense>
            )}
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
