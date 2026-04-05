import { StateCreator } from 'zustand';

export type ViewMode = '2d' | '3d';
export type RenderBackend = 'webgpu' | 'webgl';
export type RenderPreference = 'auto';

export type DragInsertion = { bayId: string; targetIndex: number } | null;

export interface ViewSlice {
  viewMode: ViewMode;
  finishId: string;
  renderPreference: RenderPreference;
  effectiveRenderer: RenderBackend;
  isAdvancedMode: boolean;
  zoomLevel: number;
  dragInsertion: DragInsertion;

  setViewMode: (mode: ViewMode) => void;
  setFinish: (finishId: string) => void;
  setEffectiveRenderer: (renderer: RenderBackend) => void;
  toggleAdvancedMode: () => void;
  setZoomLevel: (level: number) => void;
  setDragInsertion: (insertion: DragInsertion) => void;
}

export const createViewSlice: StateCreator<ViewSlice, [['zustand/immer', never]], [], ViewSlice> = (set) => ({
  viewMode: '2d',
  finishId: 'white-melamine',
  renderPreference: 'auto',
  effectiveRenderer: 'webgl',
  isAdvancedMode: false,
  zoomLevel: 1,
  dragInsertion: null,

  setViewMode: (mode) =>
    set((state) => {
      state.viewMode = mode;
    }),

  setFinish: (finishId) =>
    set((state) => {
      state.finishId = finishId;
    }),

  setEffectiveRenderer: (renderer) =>
    set((state) => {
      state.effectiveRenderer = renderer;
    }),

  toggleAdvancedMode: () =>
    set((state) => {
      state.isAdvancedMode = !state.isAdvancedMode;
    }),

  setZoomLevel: (level) =>
    set((state) => {
      state.zoomLevel = Math.max(0.1, Math.min(5, level));
    }),

  setDragInsertion: (insertion) =>
    set((state) => {
      state.dragInsertion = insertion;
    }),
});
