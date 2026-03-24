import { Mm } from '../units/types';

export interface Rect {
  x: Mm;
  y: Mm;
  width: Mm;
  height: Mm;
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  const ax = a.x as number;
  const ay = a.y as number;
  const aw = a.width as number;
  const ah = a.height as number;
  const bx = b.x as number;
  const by = b.y as number;
  const bw = b.width as number;
  const bh = b.height as number;

  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function rectContains(outer: Rect, inner: Rect): boolean {
  const ox = outer.x as number;
  const oy = outer.y as number;
  const ow = outer.width as number;
  const oh = outer.height as number;
  const ix = inner.x as number;
  const iy = inner.y as number;
  const iw = inner.width as number;
  const ih = inner.height as number;

  return ix >= ox && iy >= oy && ix + iw <= ox + ow && iy + ih <= oy + oh;
}

export function rectArea(r: Rect): number {
  return (r.width as number) * (r.height as number);
}
