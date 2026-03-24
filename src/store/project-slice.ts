import { StateCreator } from 'zustand';
import { Mm, mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';
import { SpaceEnvelope, Bay, Module, BayId, ModuleId, bayId, moduleId, componentId } from '@/domain/model';
import { distributeEqualBays, addBay as addBayLayout, removeBay as removeBayLayout, resizeBay as resizeBayLayout } from '@/domain/geometry/layout';
import { findNextSlot } from '@/domain/geometry/placement';
import { ModuleDefinition } from '@/domain/catalog/types';

export interface ProjectSlice {
  projectName: string;
  envelope: SpaceEnvelope;
  bays: Bay[];
  displayUnit: Unit;

  setProjectName: (name: string) => void;
  setEnvelope: (envelope: Partial<SpaceEnvelope>) => void;
  setDisplayUnit: (unit: Unit) => void;

  addBay: () => void;
  removeBay: (id: BayId) => void;
  resizeBay: (index: number, newWidth: Mm) => void;

  placeModule: (bayId: BayId, definition: ModuleDefinition) => void;
  moveModule: (moduleId: ModuleId, toBayId: BayId, y: Mm) => void;
  removeModule: (moduleId: ModuleId) => void;
  updateModuleDimensions: (
    moduleId: ModuleId,
    patch: Partial<Pick<Module, 'width' | 'height' | 'depth'>>,
  ) => void;
}

const DEFAULT_ENVELOPE: SpaceEnvelope = {
  width: mm(1830),    // 6 feet
  height: mm(2440),   // 8 feet
  depth: mm(610),     // 24 inches
  wallType: 'reach-in',
};

export const createProjectSlice: StateCreator<ProjectSlice, [['zustand/immer', never]], [], ProjectSlice> = (set) => ({
  projectName: 'Untitled Project',
  envelope: DEFAULT_ENVELOPE,
  bays: (() => {
    const widths = distributeEqualBays(DEFAULT_ENVELOPE.width, 3);
    return widths.map((w) => ({
      id: bayId(),
      width: w,
      modules: [],
    }));
  })(),
  displayUnit: Unit.INCH,

  setProjectName: (name) =>
    set((state) => {
      state.projectName = name;
    }),

  setEnvelope: (patch) =>
    set((state) => {
      Object.assign(state.envelope, patch);
      // Redistribute bay widths when envelope width changes
      if (patch.width !== undefined) {
        const widths = distributeEqualBays(state.envelope.width, state.bays.length);
        state.bays.forEach((bay, i) => {
          bay.width = widths[i];
        });
      }
    }),

  setDisplayUnit: (unit) =>
    set((state) => {
      state.displayUnit = unit;
    }),

  addBay: () =>
    set((state) => {
      const widths = state.bays.map((b) => b.width);
      const newWidths = addBayLayout(widths);
      if (!newWidths) return;
      // A new bay was inserted by splitting the widest
      if (newWidths.length === widths.length + 1) {
        // Find which bay was split
        const newBays: Bay[] = [];
        let oldIdx = 0;
        for (let i = 0; i < newWidths.length; i++) {
          if (oldIdx < widths.length && (widths[oldIdx] as number) === (newWidths[i] as number)) {
            state.bays[oldIdx].width = newWidths[i];
            newBays.push(state.bays[oldIdx]);
            oldIdx++;
          } else if (oldIdx < widths.length) {
            // This is the split bay — first half keeps old bay
            state.bays[oldIdx].width = newWidths[i];
            newBays.push(state.bays[oldIdx]);
            i++;
            // Second half is new bay
            newBays.push({ id: bayId(), width: newWidths[i], modules: [] });
            oldIdx++;
          }
        }
        state.bays = newBays;
      }
    }),

  removeBay: (id) =>
    set((state) => {
      const idx = state.bays.findIndex((b) => b.id === id);
      if (idx === -1) return;
      const widths = state.bays.map((b) => b.width);
      const newWidths = removeBayLayout(widths, idx);
      state.bays.splice(idx, 1);
      state.bays.forEach((bay, i) => {
        bay.width = newWidths[i];
      });
    }),

  resizeBay: (index, newWidth) =>
    set((state) => {
      const widths = state.bays.map((b) => b.width);
      const newWidths = resizeBayLayout(widths, index, newWidth);
      if (!newWidths) return;
      state.bays.forEach((bay, i) => {
        bay.width = newWidths[i];
      });
    }),

  placeModule: (targetBayId, definition) =>
    set((state) => {
      const bay = state.bays.find((b) => b.id === targetBayId);
      if (!bay) return;

      const moduleWidth = bay.width;
      const moduleHeight = mm(definition.defaultHeight);
      const moduleDepth = mm(definition.defaultDepth);

      const y = findNextSlot(
        state.envelope.height,
        bay.modules.map((m) => ({ y: m.y, height: m.height })),
        moduleHeight,
      );

      if (y === null) return;

      const newModule: Module = {
        id: moduleId(),
        type: definition.type,
        catalogId: definition.id,
        x: mm(0),
        y,
        width: moduleWidth,
        height: moduleHeight,
        depth: moduleDepth,
        components: definition.components.map((c) => ({
          id: componentId(),
          name: c.name,
          materialId: c.material,
          width: moduleWidth,
          height: mm(19),
          depth: moduleDepth,
          quantity: c.quantity,
        })),
        overrides: {},
      };

      bay.modules.push(newModule);
    }),

  moveModule: (modId, toBayId, y) =>
    set((state) => {
      let found: Module | null = null;
      for (const bay of state.bays) {
        const idx = bay.modules.findIndex((m) => m.id === modId);
        if (idx !== -1) {
          found = bay.modules.splice(idx, 1)[0];
          break;
        }
      }
      if (!found) return;
      const targetBay = state.bays.find((b) => b.id === toBayId);
      if (!targetBay) return;
      found.y = y;
      found.width = targetBay.width;
      targetBay.modules.push(found);
    }),

  removeModule: (modId) =>
    set((state) => {
      for (const bay of state.bays) {
        const idx = bay.modules.findIndex((m) => m.id === modId);
        if (idx !== -1) {
          bay.modules.splice(idx, 1);
          return;
        }
      }
    }),

  updateModuleDimensions: (modId, patch) =>
    set((state) => {
      for (const bay of state.bays) {
        const mod = bay.modules.find((m) => m.id === modId);
        if (mod) {
          Object.assign(mod, patch);
          return;
        }
      }
    }),
});
