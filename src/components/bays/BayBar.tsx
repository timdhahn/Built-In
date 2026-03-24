import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store';
import { mm, Mm } from '@/domain/units/types';
import { BayId } from '@/domain/model';
import { formatDimension } from '@/domain/units/format';
import styles from './BayBar.module.css';

export function BayBar() {
  const bays = useAppStore((s) => s.bays);
  const displayUnit = useAppStore((s) => s.displayUnit);
  const selectedBayId = useAppStore((s) => s.selectedBayId);
  const selectBay = useAppStore((s) => s.selectBay);
  const resizeBay = useAppStore((s) => s.resizeBay);
  const envelope = useAppStore((s) => s.envelope);

  const barRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback(
    (bayIndex: number, startX: number) => {
      const barEl = barRef.current;
      if (!barEl) return;

      const barWidth = barEl.clientWidth;
      const envelopeWidth = envelope.width as number;
      const pxPerMm = barWidth / envelopeWidth;

      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dxMm = dx / pxPerMm;
        const currentWidth = bays[bayIndex].width as number;
        const newWidth = mm(Math.round(currentWidth + dxMm));
        resizeBay(bayIndex, newWidth);
        startX = e.clientX;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [bays, envelope.width, resizeBay],
  );

  return (
    <div className={styles.bar} ref={barRef}>
      {bays.map((bay, index) => (
        <div key={bay.id} className={styles.bayGroup} style={{ flex: bay.width as number }}>
          <button
            className={`${styles.segment} ${selectedBayId === bay.id ? styles.selected : ''}`}
            onClick={() => selectBay(bay.id as BayId)}
          >
            <span className={styles.label}>{formatDimension(bay.width as Mm, displayUnit)}</span>
          </button>
          {index < bays.length - 1 && (
            <div
              className={styles.handle}
              onMouseDown={(e) => handleDrag(index, e.clientX)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
