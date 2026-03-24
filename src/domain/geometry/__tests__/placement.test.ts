import { describe, it, expect } from 'vitest';
import { findNextSlot, snapToGrid } from '../placement';
import { mm } from '../../units/types';

describe('findNextSlot', () => {
  it('places first module at bottom', () => {
    const result = findNextSlot(mm(2000), [], mm(500));
    expect(result).toBe(0);
  });

  it('stacks above existing module', () => {
    const existing = [{ y: mm(0), height: mm(500) }];
    const result = findNextSlot(mm(2000), existing, mm(500));
    expect(result).toBe(500);
  });

  it('returns null if no space', () => {
    const existing = [{ y: mm(0), height: mm(1800) }];
    const result = findNextSlot(mm(2000), existing, mm(500));
    expect(result).toBeNull();
  });

  it('finds gap between modules', () => {
    const existing = [
      { y: mm(0), height: mm(400) },
      { y: mm(1000), height: mm(400) },
    ];
    const result = findNextSlot(mm(2000), existing, mm(500));
    expect(result).toBe(400);
  });

  it('returns null if module too tall', () => {
    const result = findNextSlot(mm(400), [], mm(500));
    expect(result).toBeNull();
  });
});

describe('snapToGrid', () => {
  it('snaps to nearest grid', () => {
    expect(snapToGrid(mm(47), mm(10))).toBe(50);
  });

  it('snaps down', () => {
    expect(snapToGrid(mm(42), mm(10))).toBe(40);
  });

  it('no-ops with zero grid', () => {
    expect(snapToGrid(mm(47), mm(0))).toBe(47);
  });
});
