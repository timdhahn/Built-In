import { Mm, mm } from '../units/types';
import { Module, ModuleId } from '../model';

interface ModuleSlot {
  y: Mm;
  height: Mm;
}

/** Find the next available Y position in a bay for a module of given height */
export function findNextSlot(
  bayHeight: Mm,
  existingModules: ModuleSlot[],
  moduleHeight: Mm,
): Mm | null {
  const bh = bayHeight as number;
  const mh = moduleHeight as number;

  if (mh > bh) return null;

  // Sort existing modules by Y position
  const sorted = [...existingModules].sort((a, b) => (a.y as number) - (b.y as number));

  // Try to place at the bottom first
  let candidateY = 0;
  for (const mod of sorted) {
    const modY = mod.y as number;
    const modH = mod.height as number;

    if (candidateY + mh <= modY) {
      return mm(candidateY);
    }
    candidateY = Math.max(candidateY, modY + modH);
  }

  // Try placing above all existing modules
  if (candidateY + mh <= bh) {
    return mm(candidateY);
  }

  return null;
}

/** Snap a value to the nearest grid increment */
export function snapToGrid(y: Mm, gridSize: Mm): Mm {
  const g = gridSize as number;
  if (g <= 0) return y;
  return mm(Math.round((y as number) / g) * g);
}

const DEFAULT_MIN_MODULE_HEIGHT = mm(80);

type ModuleResizePatch = Partial<Pick<Module, 'width' | 'height' | 'depth' | 'y'>>;

/**
 * Resize a module and restack neighboring modules in the same bay.
 * If `patch.y` is present, treat it as a bottom-edge resize and shift modules below.
 * Otherwise treat it as a top-edge resize and shift modules above.
 */
export function resizeModuleInBay(
  modules: Module[],
  moduleId: ModuleId,
  patch: ModuleResizePatch,
  envelopeHeight: Mm,
  minModuleHeight: Mm = DEFAULT_MIN_MODULE_HEIGHT,
): Module[] {
  const sorted = [...modules].sort((a, b) => (a.y as number) - (b.y as number));
  const targetIndex = sorted.findIndex((mod) => mod.id === moduleId);

  if (targetIndex === -1) return modules;

  const next = sorted.map((mod) => ({ ...mod }));
  const target = next[targetIndex];

  if (patch.width !== undefined) target.width = patch.width;
  if (patch.depth !== undefined) target.depth = patch.depth;

  const wantsBottomResize = patch.y !== undefined;
  const nextHeight = patch.height ?? target.height;

  if (patch.height === undefined && patch.y === undefined) {
    return next;
  }

  const minHeight = minModuleHeight as number;

  if (wantsBottomResize) {
    const topFixed = (sorted[targetIndex].y as number) + (sorted[targetIndex].height as number);
    const desiredY = patch.y !== undefined
      ? (patch.y as number)
      : topFixed - (nextHeight as number);
    const clampedY = Math.min(topFixed - minHeight, Math.max(0, desiredY));

    target.y = mm(clampedY);
    target.height = mm(Math.max(minHeight, topFixed - clampedY));

    let cursor = clampedY;
    for (let i = targetIndex - 1; i >= 0; i--) {
      cursor -= next[i].height as number;
      next[i].y = mm(cursor);
    }

    const lowestY = next.length > 0 ? (next[0].y as number) : 0;
    if (lowestY < 0) {
      const deficit = -lowestY;
      const adjustedY = clampedY + deficit;
      target.y = mm(adjustedY);
      target.height = mm(Math.max(minHeight, topFixed - adjustedY));

      cursor = adjustedY;
      for (let i = targetIndex - 1; i >= 0; i--) {
        cursor -= next[i].height as number;
        next[i].y = mm(cursor);
      }
    }

    return next;
  }

  const totalAboveHeight = next
    .slice(targetIndex + 1)
    .reduce((sum, mod) => sum + (mod.height as number), 0);
  const maxHeight = Math.max(
    minHeight,
    (envelopeHeight as number) - (target.y as number) - totalAboveHeight,
  );
  const clampedHeight = Math.max(minHeight, Math.min(maxHeight, nextHeight as number));

  target.height = mm(clampedHeight);

  let cursor = (target.y as number) + clampedHeight;
  for (let i = targetIndex + 1; i < next.length; i++) {
    next[i].y = mm(cursor);
    cursor += next[i].height as number;
  }

  return next;
}
