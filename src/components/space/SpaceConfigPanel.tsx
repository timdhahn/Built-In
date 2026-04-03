import { useAppStore } from '@/store';
import { mm, Mm } from '@/domain/units/types';
import { WallType } from '@/domain/model/project';
import { FINISHES } from '@/views/three/finishes';
import { DimensionInput } from '../shared/DimensionInput';
import styles from './SpaceConfigPanel.module.css';

const WALL_TYPES: Array<{ value: WallType; label: string }> = [
  { value: 'reach-in', label: 'Reach-In' },
  { value: 'walk-in', label: 'Walk-In' },
  { value: 'flat', label: 'Flat Wall' },
  { value: 'l-shape', label: 'L-Shape' },
  { value: 'u-shape', label: 'U-Shape' },
];

export function SpaceConfigPanel() {
  const envelope = useAppStore((s) => s.envelope);
  const setEnvelope = useAppStore((s) => s.setEnvelope);
  const finishId = useAppStore((s) => s.finishId);
  const setFinish = useAppStore((s) => s.setFinish);

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Closet Space</h3>

      <div className={styles.field}>
        <label className={styles.label}>Type</label>
        <select
          className={styles.select}
          aria-label="Wall type"
          value={envelope.wallType}
          onChange={(e) => setEnvelope({ wallType: e.target.value as WallType })}
        >
          {WALL_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Finish</label>
        <select
          className={styles.select}
          aria-label="Closet finish"
          value={finishId}
          onChange={(e) => setFinish(e.target.value)}
        >
          {FINISHES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.dimensions}>
        <DimensionInput
          label="Width"
          value={envelope.width}
          onChange={(w: Mm) => setEnvelope({ width: w })}
          min={mm(300)}
          max={mm(6000)}
        />
        <DimensionInput
          label="Height"
          value={envelope.height}
          onChange={(h: Mm) => setEnvelope({ height: h })}
          min={mm(1000)}
          max={mm(3600)}
        />
        <DimensionInput
          label="Depth"
          value={envelope.depth}
          onChange={(d: Mm) => setEnvelope({ depth: d })}
          min={mm(200)}
          max={mm(1200)}
        />
      </div>
    </div>
  );
}
