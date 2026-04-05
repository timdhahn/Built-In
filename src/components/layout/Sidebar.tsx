import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { ModuleDefinition } from '@/domain/catalog/types';
import { ModuleId } from '@/domain/model';
import { SpaceConfigPanel } from '../space/SpaceConfigPanel';
import { BayConfigPanel } from '../bays/BayConfigPanel';
import { ModuleLibrary } from '../modules/ModuleLibrary';
import { ModuleConfigPanel } from '../modules/ModuleConfigPanel';
import { PlacedModuleList } from '../modules/PlacedModuleList';
import styles from './Sidebar.module.css';

type Tab = 'configure' | 'modules';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('configure');

  const bays = useAppStore((s) => s.bays);
  const selectedBayId = useAppStore((s) => s.selectedBayId);
  const selectedModuleId = useAppStore((s) => s.selectedModuleId);
  const lastPlacedModuleId = useAppStore((s) => s.lastPlacedModuleId);
  const placeModule = useAppStore((s) => s.placeModule);
  const selectModule = useAppStore((s) => s.selectModule);

  // Auto-switch to Modules tab whenever a module is placed (from click or DnD)
  useEffect(() => {
    if (lastPlacedModuleId) setActiveTab('modules');
  }, [lastPlacedModuleId]);

  const handleModuleClick = (definition: ModuleDefinition) => {
    const bayId = (selectedBayId ?? bays[0]?.id) as typeof bays[0]['id'] | undefined;
    if (!bayId) return;
    placeModule(bayId, definition);
  };

  const totalModules = bays.reduce((n, b) => n + b.modules.length, 0);

  return (
    <aside className={styles.sidebar}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'configure' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('configure')}
        >
          Configure
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'modules' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules
          {totalModules > 0 && (
            <span className={styles.tabBadge}>{totalModules}</span>
          )}
        </button>
      </div>

      {/* Configure tab */}
      {activeTab === 'configure' && (
        <div className={styles.scroll}>
          <SpaceConfigPanel />
          <BayConfigPanel />
        </div>
      )}

      {/* Modules tab */}
      {activeTab === 'modules' && (
        <div className={styles.modulesTab}>
          <ModuleLibrary onSelect={handleModuleClick} />
          {bays.some((b) => b.modules.length > 0) && (
            <div className={styles.placedSection}>
              <div className={styles.placedHeader}>Placed Modules</div>
              {bays.map((bay, i) => (
                <PlacedModuleList
                  key={bay.id}
                  bay={bay}
                  bayIndex={i}
                  selectedModuleId={selectedModuleId}
                  lastPlacedModuleId={lastPlacedModuleId}
                  onSelectModule={(id) => selectModule(id as ModuleId)}
                />
              ))}
            </div>
          )}
          {selectedModuleId && <ModuleConfigPanel />}
        </div>
      )}
    </aside>
  );
}
