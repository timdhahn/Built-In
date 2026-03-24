import { useAppStore } from '@/store';

export function useUndoRedo() {
  const temporalStore = useAppStore.temporal.getState();
  const { undo, redo, pastStates, futureStates } = temporalStore;

  return {
    undo,
    redo,
    canUndo: pastStates.length > 0,
    canRedo: futureStates.length > 0,
  };
}
