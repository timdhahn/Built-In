import { Mm, mm } from '../units/types';

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
