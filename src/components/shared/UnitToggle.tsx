import { Unit } from '@/domain/units/types';
import { useAppStore } from '@/store';
import styles from './UnitToggle.module.css';

const UNIT_OPTIONS: Array<{ unit: Unit; label: string }> = [
  { unit: Unit.INCH, label: 'in' },
  { unit: Unit.FT_IN, label: 'ft-in' },
  { unit: Unit.CM, label: 'cm' },
  { unit: Unit.MM, label: 'mm' },
];

export function UnitToggle() {
  const displayUnit = useAppStore((s) => s.displayUnit);
  const setDisplayUnit = useAppStore((s) => s.setDisplayUnit);

  return (
    <div className={styles.toggle}>
      {UNIT_OPTIONS.map(({ unit, label }) => (
        <button
          key={unit}
          className={`${styles.btn} ${displayUnit === unit ? styles.active : ''}`}
          onClick={() => setDisplayUnit(unit)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
