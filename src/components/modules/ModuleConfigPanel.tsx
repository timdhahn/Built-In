import { useAppStore } from '@/store';
import { selectModuleById } from '@/store/selectors';
import { Mm, mm } from '@/domain/units/types';
import { ModuleId } from '@/domain/model';
import { DimensionInput } from '../shared/DimensionInput';
import styles from './ModuleConfigPanel.module.css';

export function ModuleConfigPanel() {
  const selectedModuleId = useAppStore((s) => s.selectedModuleId);
  const mod = useAppStore(selectModuleById(selectedModuleId as ModuleId));
  const updateModuleDimensions = useAppStore((s) => s.updateModuleDimensions);
  const removeModule = useAppStore((s) => s.removeModule);

  if (!selectedModuleId || !mod) return null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>{mod.type.replace('-', ' ')}</h3>
      <div className={styles.fields}>
        <DimensionInput
          label="Width"
          value={mod.width}
          onChange={(w: Mm) => updateModuleDimensions(selectedModuleId as ModuleId, { width: w })}
          min={mm(200)}
        />
        <DimensionInput
          label="Height"
          value={mod.height}
          onChange={(h: Mm) => updateModuleDimensions(selectedModuleId as ModuleId, { height: h })}
          min={mm(200)}
        />
        <DimensionInput
          label="Depth"
          value={mod.depth}
          onChange={(d: Mm) => updateModuleDimensions(selectedModuleId as ModuleId, { depth: d })}
          min={mm(200)}
        />
      </div>
      <div className={styles.info}>
        {mod.components.length} component{mod.components.length !== 1 ? 's' : ''}
      </div>
      <button
        className={styles.removeBtn}
        onClick={() => removeModule(selectedModuleId as ModuleId)}
      >
        Remove Module
      </button>
    </div>
  );
}
