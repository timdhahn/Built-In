import { describe, it, expect } from 'vitest';
import { distributeEqualBays, resizeBay, addBay, removeBay } from '../layout';
import { mm } from '../../units/types';

describe('distributeEqualBays', () => {
  it('distributes evenly', () => {
    const result = distributeEqualBays(mm(1200), 3);
    expect(result.length).toBe(3);
    const total = result.reduce((a, b) => a + (b as number), 0);
    expect(total).toBe(1200);
  });

  it('handles remainder', () => {
    const result = distributeEqualBays(mm(1000), 3);
    expect(result.length).toBe(3);
    const total = result.reduce((a, b) => a + (b as number), 0);
    expect(total).toBe(1000);
  });

  it('returns empty for zero count', () => {
    expect(distributeEqualBays(mm(1200), 0)).toEqual([]);
  });

  it('handles single bay', () => {
    const result = distributeEqualBays(mm(1200), 1);
    expect(result).toEqual([mm(1200)]);
  });
});

describe('resizeBay', () => {
  it('resizes bay and adjusts neighbor', () => {
    const widths = [mm(500), mm(500)];
    const result = resizeBay(widths, 0, mm(600));
    expect(result).not.toBeNull();
    expect(result![0]).toBe(600);
    expect(result![1]).toBe(400);
  });

  it('returns null if too small', () => {
    const widths = [mm(500), mm(300)];
    const result = resizeBay(widths, 0, mm(700));
    expect(result).toBeNull();
  });

  it('returns null if below min width', () => {
    const widths = [mm(500), mm(500)];
    const result = resizeBay(widths, 0, mm(100));
    expect(result).toBeNull();
  });

  it('returns null for last bay index', () => {
    const widths = [mm(500), mm(500)];
    expect(resizeBay(widths, 1, mm(600))).toBeNull();
  });
});

describe('addBay', () => {
  it('splits the widest bay', () => {
    const widths = [mm(400), mm(800)];
    const result = addBay(widths);
    expect(result).not.toBeNull();
    expect(result!.length).toBe(3);
    const total = result!.reduce((a, b) => a + (b as number), 0);
    expect(total).toBe(1200);
  });

  it('returns null if cannot split', () => {
    const widths = [mm(300)];
    const result = addBay(widths, mm(200));
    expect(result).toBeNull();
  });
});

describe('removeBay', () => {
  it('removes and redistributes', () => {
    const widths = [mm(400), mm(400), mm(400)];
    const result = removeBay(widths, 1);
    expect(result.length).toBe(2);
    const total = result.reduce((a, b) => a + (b as number), 0);
    expect(total).toBe(1200);
  });

  it('does not remove last bay', () => {
    const widths = [mm(400)];
    const result = removeBay(widths, 0);
    expect(result.length).toBe(1);
  });
});
