import { describe, it, expect } from 'vitest';
import { parseDimension, isParseError } from '../parse';
import { Unit } from '../types';

function parseMm(input: string, fallback: Unit = Unit.INCH): number | null {
  const result = parseDimension(input, fallback);
  if (isParseError(result)) return null;
  return result.mm as number;
}

describe('parseDimension', () => {
  describe('plain numbers (use fallback unit)', () => {
    it('parses "48" with inch fallback', () => {
      expect(parseMm('48', Unit.INCH)).toBeCloseTo(48 * 25.4);
    });

    it('parses "48" with mm fallback', () => {
      expect(parseMm('48', Unit.MM)).toBeCloseTo(48);
    });

    it('parses "120" with cm fallback', () => {
      expect(parseMm('120', Unit.CM)).toBeCloseTo(1200);
    });

    it('parses decimal "48.5"', () => {
      expect(parseMm('48.5', Unit.INCH)).toBeCloseTo(48.5 * 25.4);
    });
  });

  describe('explicit unit suffixes', () => {
    it('parses "48in"', () => {
      expect(parseMm('48in')).toBeCloseTo(48 * 25.4);
    });

    it('parses "48 in"', () => {
      expect(parseMm('48 in')).toBeCloseTo(48 * 25.4);
    });

    it('parses \'48"\'', () => {
      expect(parseMm('48"')).toBeCloseTo(48 * 25.4);
    });

    it('parses "4ft"', () => {
      expect(parseMm('4ft')).toBeCloseTo(4 * 304.8);
    });

    it("parses \"4'\"", () => {
      expect(parseMm("4'")).toBeCloseTo(4 * 304.8);
    });

    it('parses "120cm"', () => {
      expect(parseMm('120cm')).toBeCloseTo(1200);
    });

    it('parses "1200mm"', () => {
      expect(parseMm('1200mm')).toBeCloseTo(1200);
    });
  });

  describe('compound ft + in', () => {
    it('parses "5\' 3\\""', () => {
      expect(parseMm("5' 3\"")).toBeCloseTo((5 * 12 + 3) * 25.4);
    });

    it('parses "5ft 3in"', () => {
      expect(parseMm('5ft 3in')).toBeCloseTo((5 * 12 + 3) * 25.4);
    });

    it("parses \"5'-3\\\"\"", () => {
      expect(parseMm("5'-3\"")).toBeCloseTo((5 * 12 + 3) * 25.4);
    });

    it("parses \"6'\" (feet only compound)", () => {
      expect(parseMm("6'")).toBeCloseTo(6 * 304.8);
    });

    it('parses "5ft" (feet only)', () => {
      expect(parseMm('5ft')).toBeCloseTo(5 * 304.8);
    });
  });

  describe('fractions', () => {
    it('parses "3/4\\""', () => {
      expect(parseMm('3/4"')).toBeCloseTo(0.75 * 25.4);
    });

    it('parses "5 3/4\\""', () => {
      expect(parseMm('5 3/4"')).toBeCloseTo(5.75 * 25.4);
    });

    it('parses "5 3/4in"', () => {
      expect(parseMm('5 3/4in')).toBeCloseTo(5.75 * 25.4);
    });

    it('parses "1/2"', () => {
      expect(parseMm('1/2"')).toBeCloseTo(0.5 * 25.4);
    });
  });

  describe('edge cases', () => {
    it('returns error for empty string', () => {
      const result = parseDimension('', Unit.INCH);
      expect(isParseError(result)).toBe(true);
    });

    it('returns error for whitespace only', () => {
      const result = parseDimension('   ', Unit.INCH);
      expect(isParseError(result)).toBe(true);
    });

    it('returns error for garbage', () => {
      const result = parseDimension('abc', Unit.INCH);
      expect(isParseError(result)).toBe(true);
    });

    it('parses zero', () => {
      expect(parseMm('0', Unit.INCH)).toBe(0);
    });

    it('trims whitespace', () => {
      expect(parseMm('  48in  ')).toBeCloseTo(48 * 25.4);
    });
  });

  describe('detected unit', () => {
    it('detects inch unit', () => {
      const result = parseDimension('48in', Unit.MM);
      if (!isParseError(result)) {
        expect(result.detectedUnit).toBe(Unit.INCH);
      }
    });

    it('detects cm unit', () => {
      const result = parseDimension('120cm', Unit.INCH);
      if (!isParseError(result)) {
        expect(result.detectedUnit).toBe(Unit.CM);
      }
    });

    it('returns null detected unit for plain numbers', () => {
      const result = parseDimension('48', Unit.INCH);
      if (!isParseError(result)) {
        expect(result.detectedUnit).toBeNull();
      }
    });

    it('detects ft_in for compound', () => {
      const result = parseDimension("5' 3\"", Unit.MM);
      if (!isParseError(result)) {
        expect(result.detectedUnit).toBe(Unit.FT_IN);
      }
    });
  });
});
