import { useAppStore } from '@/store';
import { BayId } from '@/domain/model';
import { ModuleDefinition } from '@/domain/catalog/types';
import { SpaceConfigPanel } from '../space/SpaceConfigPanel';
import { BayConfigPanel } from '../bays/BayConfigPanel';
import { ModuleLibrary } from '../modules/ModuleLibrary';
import { ModuleConfigPanel } from '../modules/ModuleConfigPanel';
import { ValidationPanel } from '../validation/ValidationPanel';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const selectedBayId = useAppStore((s) => s.selectedBayId);
  const placeModule = useAppStore((s) => s.placeModule);

  const handleModuleSelect = (definition: ModuleDefinition) => {
    if (selectedBayId) {
      placeModule(selectedBayId as BayId, definition);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.scroll}>
        <SpaceConfigPanel />
        <BayConfigPanel />
        {selectedBayId && <ModuleLibrary onSelect={handleModuleSelect} />}
        <ModuleConfigPanel />
        <ValidationPanel />
      </div>
    </aside>
  );
}
