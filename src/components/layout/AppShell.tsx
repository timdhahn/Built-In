import { Suspense, lazy, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type Modifier,
} from '@dnd-kit/core';
import { useAppStore } from '@/store';
import { useValidation } from '@/hooks/useValidation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { BayId, ModuleId } from '@/domain/model';
import { ModuleDefinition } from '@/domain/catalog/types';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { BayBar } from '../bays/BayBar';
import { ElevationCanvas } from '@/views/elevation/ElevationCanvas';
import { ToastContainer } from '../shared/ToastContainer';
import styles from './AppShell.module.css';
import overlayStyles from './DragOverlay.module.css';

const Scene = lazy(() => import('@/views/three/Scene').then((m) => ({ default: m.Scene })));

const ICONS: Record<string, string> = {
  shirt: '👔',
  layers: '📚',
  archive: '📦',
  grid: '📋',
  footprints: '👟',
};

const TYPE_LABELS: Record<string, string> = {
  'single-hang': 'Single Hang',
  'double-hang': 'Double Hang',
  'drawer-stack': 'Drawer Stack',
  'shelf-tower': 'Shelf Tower',
  'shoe-section': 'Shoe Section',
};

type ActiveDrag =
  | { type: 'library-card'; definition: ModuleDefinition }
  | { type: 'placed-module'; moduleId: string; moduleType: string };

const pointerAlignedOverlay: Modifier = ({ activatorEvent, active, activeNodeRect, transform }) => {
  if (active?.data.current?.type !== 'placed-module') return transform;
  if (!(activatorEvent instanceof MouseEvent || activatorEvent instanceof PointerEvent)) {
    return transform;
  }
  if (!activeNodeRect) return transform;

  return {
    ...transform,
    x: transform.x + (activatorEvent.clientX - activeNodeRect.left),
    y: transform.y + (activatorEvent.clientY - activeNodeRect.top),
  };
};

export function AppShell() {
  const viewMode = useAppStore((s) => s.viewMode);
  const bays = useAppStore((s) => s.bays);
  const placeModule = useAppStore((s) => s.placeModule);
  const reorderModules = useAppStore((s) => s.reorderModules);
  const moveModuleToIndex = useAppStore((s) => s.moveModuleToIndex);
  const setDragInsertion = useAppStore((s) => s.setDragInsertion);

  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [disableDropAnimation, setDisableDropAnimation] = useState(false);
  const insertionRef = useRef<{ bayId: string; targetIndex: number } | null>(null);

  useValidation();
  useKeyboardShortcuts();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDisableDropAnimation(false);
    const data = event.active.data.current as Record<string, unknown> | undefined;
    if (!data) return;

    if (data.type === 'library-card') {
      setActiveDrag({ type: 'library-card', definition: data.definition as ModuleDefinition });
    } else if (data.type === 'placed-module') {
      const moduleId = data.moduleId as string;
      let moduleType = '';
      for (const bay of bays) {
        const mod = bay.modules.find((m) => m.id === moduleId);
        if (mod) { moduleType = mod.type; break; }
      }
      setActiveDrag({ type: 'placed-module', moduleId, moduleType });
    }
  };

  const computeInsertion = (
    activeId: string,
    over: DragOverEvent['over'],
    activeTranslatedRect: DragEndEvent['active']['rect']['current']['translated'],
  ) => {
    if (!over) return null;
    const overData = over.data.current as Record<string, unknown> | undefined;
    const overId = String(over.id);

    if (overData?.type === 'placed-module') {
      const overModuleId = overData.moduleId as string;
      if (overModuleId === activeId) return null;
      const targetBay = bays.find((b) => b.modules.some((m) => m.id === overModuleId));
      if (!targetBay) return null;
      const sorted = [...targetBay.modules].sort((a, b) => (a.y as number) - (b.y as number));
      const overIndex = sorted.findIndex((m) => m.id === overModuleId);
      // Compare vertical centers: smaller CSS Y = higher on screen = higher in closet
      let targetIndex = overIndex;
      if (activeTranslatedRect) {
        const activeCenterY = activeTranslatedRect.top + activeTranslatedRect.height / 2;
        const overCenterY = over.rect.top + over.rect.height / 2;
        if (activeCenterY < overCenterY) targetIndex = overIndex + 1; // insert above
      }
      return { bayId: targetBay.id, targetIndex };
    }

    if (overId.startsWith('bay:') || overId.startsWith('canvas-bay:')) {
      const bayId = overId.replace(/^(canvas-)?bay:/, '');
      const targetBay = bays.find((b) => b.id === bayId);
      if (!targetBay) return null;
      return { bayId, targetIndex: targetBay.modules.length };
    }

    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const activeData = event.active.data.current as Record<string, unknown> | undefined;
    if (activeData?.type !== 'placed-module') return;
    const insertion = computeInsertion(
      activeData.moduleId as string,
      event.over,
      event.active.rect.current.translated,
    );
    insertionRef.current = insertion;
    setDragInsertion(insertion);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const insertion = insertionRef.current;
    insertionRef.current = null;
    setDragInsertion(null);

    const { active, over } = event;
    if (!over) {
      setDisableDropAnimation(false);
      setActiveDrag(null);
      return;
    }

    const activeData = active.data.current as Record<string, unknown> | undefined;
    const overData = over.data.current as Record<string, unknown> | undefined;
    const overId = String(over.id);

    // --- Library card dropped ---
    if (activeData?.type === 'library-card') {
      const definition = activeData.definition as ModuleDefinition;
      let targetBayId: BayId | undefined;

      if (overId.startsWith('bay:') || overId.startsWith('canvas-bay:')) {
        targetBayId = overId.replace(/^(canvas-)?bay:/, '') as BayId;
      } else if (overData?.type === 'placed-module') {
        const modId = overData.moduleId as string;
        const bay = bays.find((b) => b.modules.some((m) => m.id === modId));
        targetBayId = bay?.id as BayId | undefined;
      }

      setDisableDropAnimation(Boolean(targetBayId));
      setActiveDrag(null);
      if (targetBayId) placeModule(targetBayId, definition);
      return;
    }

    // --- Placed module reorder / move ---
    if (activeData?.type === 'placed-module') {
      const activeModuleId = activeData.moduleId as ModuleId;
      const activeBay = bays.find((b) => b.modules.some((m) => m.id === activeModuleId));
      if (!activeBay) {
        setDisableDropAnimation(false);
        setActiveDrag(null);
        return;
      }

      // Use the insertion computed during onDragOver; fall back to computing from the final event
      const finalInsertion =
        insertion ??
        computeInsertion(activeModuleId, over, active.rect.current.translated);

      if (!finalInsertion) {
        setDisableDropAnimation(false);
        setActiveDrag(null);
        return;
      }

      const { bayId: targetBayIdStr, targetIndex } = finalInsertion;
      const targetBayId = targetBayIdStr as BayId;
      setDisableDropAnimation(true);
      setActiveDrag(null);

      if (activeBay.id === targetBayId) {
        const sorted = [...activeBay.modules].sort((a, b) => (a.y as number) - (b.y as number));
        const fromIndex = sorted.findIndex((m) => m.id === activeModuleId);
        if (fromIndex !== targetIndex) {
          reorderModules(activeBay.id as BayId, activeModuleId, targetIndex);
        }
      } else {
        moveModuleToIndex(activeModuleId, activeBay.id as BayId, targetBayId, targetIndex);
      }
      return;
    }

    setDisableDropAnimation(false);
    setActiveDrag(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        insertionRef.current = null;
        setDragInsertion(null);
        setDisableDropAnimation(false);
        setActiveDrag(null);
      }}
    >
      <div className={styles.shell}>
        <Toolbar />
        <div className={styles.body}>
          <Sidebar />
          <div className={styles.main}>
            <BayBar />
            <div className={styles.canvas}>
              {viewMode === '2d' ? (
                <ElevationCanvas />
              ) : (
                <Suspense fallback={<div className={styles.loading}>Loading 3D...</div>}>
                  <Scene />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        <StatusBar />
        <ToastContainer />
      </div>

      <DragOverlay
        dropAnimation={disableDropAnimation ? null : undefined}
        modifiers={[pointerAlignedOverlay]}
      >
        {activeDrag?.type === 'library-card' && (
          <div className={overlayStyles.cardOverlay}>
            <span className={overlayStyles.icon}>
              {ICONS[activeDrag.definition.icon] ?? '?'}
            </span>
            <span className={overlayStyles.label}>{activeDrag.definition.label}</span>
          </div>
        )}
        {activeDrag?.type === 'placed-module' && (
          <div className={overlayStyles.rowOverlay}>
            <span className={overlayStyles.handle}>⠿</span>
            <span className={overlayStyles.rowLabel}>
              {TYPE_LABELS[activeDrag.moduleType] ?? activeDrag.moduleType}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
