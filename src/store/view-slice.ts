import { StateCreator } from 'zustand';

export type ViewMode = '2d' | '3d';

export type DragInsertion = { bayId: string; targetIndex: number } | null;

export interface ViewSlice {
  viewMode: ViewMode;
  isAdvancedMode: boolean;
  zoomLevel: number;
  dragInsertion: DragInsertion;

  setViewMode: (mode: ViewMode) => void;
  toggleAdvancedMode: () => void;
  setZoomLevel: (level: number) => void;
  setDragInsertion: (insertion: DragInsertion) => void;
}

export const createViewSlice: StateCreator<ViewSlice, [['zustand/immer', never]], [], ViewSlice> = (set) => ({
  viewMode: '2d',
  isAdvancedMode: false,
  zoomLevel: 1,
  dragInsertion: null,

  setViewMode: (mode) =>
    set((state) => {
      state.viewMode = mode;
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
