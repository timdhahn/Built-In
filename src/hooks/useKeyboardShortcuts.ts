import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { useUndoRedo } from './useUndoRedo';

export function useKeyboardShortcuts() {
  const { undo, redo } = useUndoRedo();
  const removeModule = useAppStore((s) => s.removeModule);
  const selectedModuleId = useAppStore((s) => s.selectedModuleId);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const addBay = useAppStore((s) => s.addBay);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (isCtrl && (e.key === 'Z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedModuleId) {
        e.preventDefault();
        removeModule(selectedModuleId);
      } else if (e.key === '2') {
        setViewMode('2d');
      } else if (e.key === '3') {
        setViewMode('3d');
      } else if (e.key === '+' || e.key === '=') {
        addBay();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, removeModule, selectedModuleId, setViewMode, addBay]);
}
