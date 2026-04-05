import { Bay, ModuleId } from '@/domain/model';
import { PlacedModuleRow } from './PlacedModuleRow';
import styles from './PlacedModuleList.module.css';

interface PlacedModuleListProps {
  bay: Bay;
  bayIndex: number;
  selectedModuleId: ModuleId | null;
  lastPlacedModuleId: ModuleId | null;
  onSelectModule: (id: ModuleId) => void;
}

export function PlacedModuleList({
  bay,
  bayIndex,
  selectedModuleId,
  lastPlacedModuleId,
  onSelectModule,
}: PlacedModuleListProps) {
  const sortedModules = [...bay.modules].sort((a, b) => (a.y as number) - (b.y as number));

  return (
    <div className={styles.section}>
      <div className={styles.bayHeader}>Bay {bayIndex + 1}</div>
      <div className={styles.list}>
        {sortedModules.length === 0 ? (
          <div className={styles.empty}>No modules placed</div>
        ) : (
          sortedModules.map((mod) => (
            <PlacedModuleRow
              key={mod.id}
              module={mod}
              isSelected={mod.id === selectedModuleId}
              isNew={mod.id === lastPlacedModuleId}
              onSelect={(id) => onSelectModule(id as ModuleId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
