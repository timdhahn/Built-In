import { Mm, mm } from '../units/types';

/** Default minimum bay width: 200mm (~8 inches) */
export const MIN_BAY_WIDTH = mm(200);

/** Given envelope width and bay count, return initial equal widths */
export function distributeEqualBays(envelopeWidth: Mm, count: number): Mm[] {
  if (count <= 0) return [];
  const baseWidth = Math.floor((envelopeWidth as number) / count);
  const remainder = (envelopeWidth as number) - baseWidth * count;
  return Array.from({ length: count }, (_, i) =>
    mm(baseWidth + (i < remainder ? 1 : 0)),
  );
}

/** Resize one bay, adjusting its right neighbor. Returns null if constraints violated. */
export function resizeBay(
  bayWidths: Mm[],
  bayIndex: number,
  newWidth: Mm,
  minBayWidth: Mm = MIN_BAY_WIDTH,
): Mm[] | null {
  if (bayIndex < 0 || bayIndex >= bayWidths.length - 1) return null;

  const newW = newWidth as number;
  const min = minBayWidth as number;

  if (newW < min) return null;

  const currentWidth = bayWidths[bayIndex] as number;
  const neighborWidth = bayWidths[bayIndex + 1] as number;
  const totalPair = currentWidth + neighborWidth;
  const newNeighborWidth = totalPair - newW;

  if (newNeighborWidth < min) return null;

  const result = [...bayWidths];
  result[bayIndex] = mm(newW);
  result[bayIndex + 1] = mm(newNeighborWidth);
  return result;
}

/** Add a bay by splitting the widest one */
export function addBay(bayWidths: Mm[], minBayWidth: Mm = MIN_BAY_WIDTH): Mm[] | null {
  const min = minBayWidth as number;

  // Find widest bay
  let maxIdx = 0;
  let maxW = bayWidths[0] as number;
  for (let i = 1; i < bayWidths.length; i++) {
    if ((bayWidths[i] as number) > maxW) {
      maxW = bayWidths[i] as number;
      maxIdx = i;
    }
  }

  // Check if widest bay can be split
  const halfWidth = Math.floor(maxW / 2);
  if (halfWidth < min) return null;

  const result = [...bayWidths];
  const secondHalf = maxW - halfWidth;
  result.splice(maxIdx, 1, mm(halfWidth), mm(secondHalf));
  return result;
}

/** Remove a bay, distributing its width to neighbors */
export function removeBay(bayWidths: Mm[], bayIndex: number): Mm[] {
  if (bayWidths.length <= 1) return bayWidths;
  if (bayIndex < 0 || bayIndex >= bayWidths.length) return bayWidths;

  const removedWidth = bayWidths[bayIndex] as number;
  const result = bayWidths.filter((_, i) => i !== bayIndex);

  // Distribute removed width equally to remaining bays
  const extra = Math.floor(removedWidth / result.length);
  const remainder = removedWidth - extra * result.length;

  return result.map((w, i) => mm((w as number) + extra + (i < remainder ? 1 : 0)));
}
