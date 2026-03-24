import { loadCatalog } from '@/domain/catalog/loader';
import { ModuleDefinition } from '@/domain/catalog/types';
import { ModuleCard } from './ModuleCard';
import styles from './ModuleLibrary.module.css';

const catalog = loadCatalog();

interface ModuleLibraryProps {
  onSelect: (definition: ModuleDefinition) => void;
}

export function ModuleLibrary({ onSelect }: ModuleLibraryProps) {
  return (
    <div className={styles.library}>
      <h3 className={styles.heading}>Modules</h3>
      <div className={styles.grid}>
        {catalog.map((def) => (
          <ModuleCard key={def.id} definition={def} onClick={() => onSelect(def)} />
        ))}
      </div>
    </div>
  );
}
