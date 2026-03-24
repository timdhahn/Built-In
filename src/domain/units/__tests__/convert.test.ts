import { describe, it, expect } from 'vitest';
import { toMm, fromMm } from '../convert';
import { Unit, mm } from '../types';

describe('toMm', () => {
  it('converts mm (identity)', () => {
    expect(toMm(100, Unit.MM)).toBe(100);
  });

  it('converts cm', () => {
    expect(toMm(10, Unit.CM)).toBe(100);
  });

  it('converts inches', () => {
    expect(toMm(1, Unit.INCH)).toBeCloseTo(25.4);
  });

  it('converts feet', () => {
    expect(toMm(1, Unit.FT)).toBeCloseTo(304.8);
  });

  it('converts zero', () => {
    expect(toMm(0, Unit.INCH)).toBe(0);
  });

  it('converts fractional inches', () => {
    expect(toMm(0.5, Unit.INCH)).toBeCloseTo(12.7);
  });
});

describe('fromMm', () => {
  it('converts to mm (identity)', () => {
    expect(fromMm(mm(100), Unit.MM)).toBe(100);
  });

  it('converts to cm', () => {
    expect(fromMm(mm(100), Unit.CM)).toBe(10);
  });

  it('converts to inches', () => {
    expect(fromMm(mm(25.4), Unit.INCH)).toBeCloseTo(1);
  });

  it('converts to feet', () => {
    expect(fromMm(mm(304.8), Unit.FT)).toBeCloseTo(1);
  });

  it('converts to ft_in compound', () => {
    const result = fromMm(mm(1600), Unit.FT_IN);
    expect(result).toHaveProperty('ft');
    expect(result).toHaveProperty('in');
    const ftIn = result as { ft: number; in: number };
    expect(ftIn.ft).toBe(5);
    expect(ftIn.in).toBeCloseTo(2.99, 0);
  });

  it('round trips through conversion', () => {
    const original = 48;
    const asMm = toMm(original, Unit.INCH);
    const back = fromMm(asMm, Unit.INCH) as number;
    expect(back).toBeCloseTo(original, 5);
  });
});
