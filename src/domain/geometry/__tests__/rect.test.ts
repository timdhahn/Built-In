import { describe, it, expect } from 'vitest';
import { rectsOverlap, rectContains, rectArea } from '../rect';
import { mm } from '../../units/types';

describe('rectsOverlap', () => {
  it('detects overlap', () => {
    const a = { x: mm(0), y: mm(0), width: mm(100), height: mm(100) };
    const b = { x: mm(50), y: mm(50), width: mm(100), height: mm(100) };
    expect(rectsOverlap(a, b)).toBe(true);
  });

  it('no overlap when apart', () => {
    const a = { x: mm(0), y: mm(0), width: mm(100), height: mm(100) };
    const b = { x: mm(200), y: mm(200), width: mm(100), height: mm(100) };
    expect(rectsOverlap(a, b)).toBe(false);
  });

  it('no overlap when touching edges', () => {
    const a = { x: mm(0), y: mm(0), width: mm(100), height: mm(100) };
    const b = { x: mm(100), y: mm(0), width: mm(100), height: mm(100) };
    expect(rectsOverlap(a, b)).toBe(false);
  });
});

describe('rectContains', () => {
  it('contains inner rect', () => {
    const outer = { x: mm(0), y: mm(0), width: mm(200), height: mm(200) };
    const inner = { x: mm(10), y: mm(10), width: mm(50), height: mm(50) };
    expect(rectContains(outer, inner)).toBe(true);
  });

  it('does not contain if partially outside', () => {
    const outer = { x: mm(0), y: mm(0), width: mm(200), height: mm(200) };
    const inner = { x: mm(150), y: mm(150), width: mm(100), height: mm(100) };
    expect(rectContains(outer, inner)).toBe(false);
  });
});

describe('rectArea', () => {
  it('computes area', () => {
    const r = { x: mm(0), y: mm(0), width: mm(100), height: mm(50) };
    expect(rectArea(r)).toBe(5000);
  });
});
