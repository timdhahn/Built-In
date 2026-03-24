/** Scale factor: mm in scene units. We use mm directly. */
export const SCALE = 0.001; // 1mm = 0.001 scene units (effectively meters)

export function mmToScene(mm: number): number {
  return mm * SCALE;
}
