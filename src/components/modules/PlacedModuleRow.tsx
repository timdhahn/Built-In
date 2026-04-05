import { useEffect, useRef } from 'react';
import { Module } from '@/domain/model';
import styles from './PlacedModuleRow.module.css';

const TYPE_LABELS: Record<string, string> = {
  'single-hang': 'Single Hang',
  'double-hang': 'Double Hang',
  'drawer-stack': 'Drawer Stack',
  'shelf-tower': 'Shelf Tower',
  'shoe-section': 'Shoe Section',
};

interface PlacedModuleRowProps {
  module: Module;
  isSelected: boolean;
  isNew: boolean;
  onSelect: (id: string) => void;
}

export function PlacedModuleRow({ module, isSelected, isNew, onSelect }: PlacedModuleRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isNew]);

  return (
    <div
      ref={rowRef}
      className={`${styles.row} ${isSelected ? styles.selected : ''} ${isNew ? styles.newHighlight : ''}`}
    >
      <button
        className={styles.label}
        onClick={() => onSelect(module.id)}
      >
        {TYPE_LABELS[module.type] ?? module.type}
      </button>
    </div>
  );
}
