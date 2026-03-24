import { StateCreator } from 'zustand';
import { BayId, ModuleId } from '@/domain/model';

export type ToolMode = 'select' | 'place';

export interface EditorSlice {
  selectedBayId: BayId | null;
  selectedModuleId: ModuleId | null;
  toolMode: ToolMode;
  placingCatalogId: string | null;

  selectBay: (id: BayId | null) => void;
  selectModule: (id: ModuleId | null) => void;
  setToolMode: (mode: ToolMode) => void;
  setPlacingCatalogId: (id: string | null) => void;
}

export const createEditorSlice: StateCreator<EditorSlice, [['zustand/immer', never]], [], EditorSlice> = (set) => ({
  selectedBayId: null,
  selectedModuleId: null,
  toolMode: 'select',
  placingCatalogId: null,

  selectBay: (id) =>
    set((state) => {
      state.selectedBayId = id;
      state.selectedModuleId = null;
    }),

  selectModule: (id) =>
    set((state) => {
      state.selectedModuleId = id;
    }),

  setToolMode: (mode) =>
    set((state) => {
      state.toolMode = mode;
    }),

  setPlacingCatalogId: (id) =>
    set((state) => {
      state.placingCatalogId = id;
    }),
});
