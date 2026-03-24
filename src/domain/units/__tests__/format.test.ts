import { describe, it, expect } from 'vitest';
import { formatDimension } from '../format';
import { Unit, mm } from '../types';

describe('formatDimension', () => {
  it('formats mm', () => {
    expect(formatDimension(mm(1200), Unit.MM)).toBe('1200 mm');
  });

  it('formats cm', () => {
    expect(formatDimension(mm(1200), Unit.CM)).toBe('120 cm');
  });

  it('formats inches', () => {
    const result = formatDimension(mm(25.4), Unit.INCH);
    expect(result).toBe('1"');
  });

  it('formats ft_in compound', () => {
    const result = formatDimension(mm(1600), Unit.FT_IN);
    // 1600mm ~ 5' 3"
    expect(result).toContain("'");
  });

  it('formats ft_in with zero inches', () => {
    const result = formatDimension(mm(304.8), Unit.FT_IN);
    expect(result).toBe("1'");
  });

  it('formats ft_in with zero feet', () => {
    const result = formatDimension(mm(25.4), Unit.FT_IN);
    expect(result).toBe('1"');
  });

  it('formats feet', () => {
    const result = formatDimension(mm(304.8), Unit.FT);
    expect(result).toBe("1'");
  });

  it('handles zero', () => {
    expect(formatDimension(mm(0), Unit.INCH)).toBe('0"');
  });
});
