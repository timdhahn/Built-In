import { useAppStore } from '@/store';
import { selectBayById } from '@/store/selectors';
import { mm, Mm } from '@/domain/units/types';
import { BayId } from '@/domain/model';
import { DimensionInput } from '../shared/DimensionInput';
import styles from './BayConfigPanel.module.css';

export function BayConfigPanel() {
  const selectedBayId = useAppStore((s) => s.selectedBayId);
  const bay = useAppStore(selectBayById(selectedBayId as BayId));
  const bays = useAppStore((s) => s.bays);
  const removeBay = useAppStore((s) => s.removeBay);
  const resizeBay = useAppStore((s) => s.resizeBay);
  const addBay = useAppStore((s) => s.addBay);

  if (!selectedBayId || !bay) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.heading}>Bays</h3>
        <p className={styles.hint}>Click a bay to select it</p>
        <button className={styles.addBtn} onClick={addBay}>
          + Add Bay
        </button>
      </div>
    );
  }

  const bayIndex = bays.findIndex((b) => b.id === selectedBayId);

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Bay {bayIndex + 1}</h3>
      <DimensionInput
        label="Width"
        value={bay.width}
        onChange={(w: Mm) => resizeBay(bayIndex, w)}
        min={mm(200)}
      />
      <div className={styles.info}>
        {bay.modules.length} module{bay.modules.length !== 1 ? 's' : ''}
      </div>
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={addBay}>
          + Add Bay
        </button>
        {bays.length > 1 && (
          <button
            className={styles.removeBtn}
            onClick={() => removeBay(selectedBayId as BayId)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
