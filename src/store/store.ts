import { create, StateCreator } from 'zustand';
import { temporal } from 'zundo';
import { immer } from 'zustand/middleware/immer';
import { ProjectSlice, createProjectSlice } from './project-slice';
import { EditorSlice, createEditorSlice } from './editor-slice';
import { ViewSlice, createViewSlice } from './view-slice';
import { ValidationSlice, createValidationSlice } from './validation-slice';

export type AppState = ProjectSlice & EditorSlice & ViewSlice & ValidationSlice;

export const useAppStore = create<AppState>()(
  temporal(
    immer<AppState>((set, get, api) => ({
      ...(createProjectSlice as unknown as StateCreator<AppState, [['zustand/immer', never]], []>)(set, get, api),
      ...(createEditorSlice as unknown as StateCreator<AppState, [['zustand/immer', never]], []>)(set, get, api),
      ...(createViewSlice as unknown as StateCreator<AppState, [['zustand/immer', never]], []>)(set, get, api),
      ...(createValidationSlice as unknown as StateCreator<AppState, [['zustand/immer', never]], []>)(set, get, api),
    })),
    {
      partialize: (state) => ({
        envelope: state.envelope,
        bays: state.bays,
        projectName: state.projectName,
      }),
    },
  ),
);
