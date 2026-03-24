import { StateCreator } from 'zustand';

export type ViewMode = '2d' | '3d';

export interface ViewSlice {
  viewMode: ViewMode;
  isAdvancedMode: boolean;
  zoomLevel: number;

  setViewMode: (mode: ViewMode) => void;
  toggleAdvancedMode: () => void;
  setZoomLevel: (level: number) => void;
}

export const createViewSlice: StateCreator<ViewSlice, [['zustand/immer', never]], [], ViewSlice> = (set) => ({
  viewMode: '2d',
  isAdvancedMode: false,
  zoomLevel: 1,

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
});
