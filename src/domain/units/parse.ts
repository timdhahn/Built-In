import { Unit, Mm } from './types';
import { toMm } from './convert';

export interface ParseResult {
  mm: Mm;
  original: string;
  detectedUnit: Unit | null;
}

export interface ParseError {
  error: string;
  original: string;
}

export type ParseOutcome = ParseResult | ParseError;

export function isParseError(result: ParseOutcome): result is ParseError {
  return 'error' in result;
}

/**
 * Parse a dimension string into millimeters.
 *
 * Supported formats:
 *   "48", "48in", "48 in", '48"'
 *   "4ft", "4'", "4 ft"
 *   "5' 3\"", "5ft 3in", "5'-3\""
 *   "120cm", "1200mm"
 *   "3/4\"", "5 3/4\""  (fractions)
 */
export function parseDimension(input: string, fallbackUnit: Unit): ParseOutcome {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: 'Empty input', original: input };
  }

  // Try compound ft + in: 5' 3", 5ft 3in, 5'-3", 5' 3 1/2"
  const compoundResult = tryParseCompound(trimmed);
  if (compoundResult !== null) {
    return { mm: compoundResult, original: input, detectedUnit: Unit.FT_IN };
  }

  // Try single-unit patterns
  const singleResult = tryParseSingle(trimmed, fallbackUnit);
  if (singleResult !== null) {
    return singleResult;
  }

  return { error: `Cannot parse "${trimmed}" as a dimension`, original: input };
}

function tryParseCompound(input: string): Mm | null {
  // Match: 5' 3", 5ft 3in, 5'-3", 5' 3 1/2", 5ft3in, etc.
  const pattern =
    /^(\d+(?:\.\d+)?)\s*(?:ft|'|feet)\s*[-]?\s*(\d+(?:\.\d+)?)?(?:\s+(\d+)\/(\d+))?\s*(?:in|"|inches?)?\s*$/i;
  const match = input.match(pattern);
  if (!match) return null;

  const feet = parseFloat(match[1]);
  const inches = match[2] ? parseFloat(match[2]) : 0;
  const fracNum = match[3] ? parseInt(match[3]) : 0;
  const fracDen = match[4] ? parseInt(match[4]) : 1;

  if (fracDen === 0) return null;

  const totalInches = feet * 12 + inches + fracNum / fracDen;
  return toMm(totalInches, Unit.INCH);
}

function tryParseSingle(
  input: string,
  fallbackUnit: Unit,
): { mm: Mm; original: string; detectedUnit: Unit | null } | null {
  // Fractional inches: 3/4", 5 3/4", 5 3/4in
  const fracPattern =
    /^(\d+(?:\.\d+)?)?\s*(\d+)\/(\d+)\s*(?:in|"|inches?)?\s*$/i;
  const fracMatch = input.match(fracPattern);
  if (fracMatch) {
    const whole = fracMatch[1] ? parseFloat(fracMatch[1]) : 0;
    const num = parseInt(fracMatch[2]);
    const den = parseInt(fracMatch[3]);
    if (den === 0) return null;
    const inches = whole + num / den;
    return { mm: toMm(inches, Unit.INCH), original: input, detectedUnit: Unit.INCH };
  }

  // Number with unit suffix
  const unitPattern = /^(-?\d+(?:\.\d+)?)\s*(mm|cm|in|inches?|ft|feet|'|")\s*$/i;
  const unitMatch = input.match(unitPattern);
  if (unitMatch) {
    const value = parseFloat(unitMatch[1]);
    const unitStr = unitMatch[2].toLowerCase();
    const unit = parseUnitSuffix(unitStr);
    if (unit === null) return null;
    return { mm: toMm(value, unit), original: input, detectedUnit: unit };
  }

  // Plain number — use fallback unit
  const plainPattern = /^(-?\d+(?:\.\d+)?)\s*$/;
  const plainMatch = input.match(plainPattern);
  if (plainMatch) {
    const value = parseFloat(plainMatch[1]);
    return { mm: toMm(value, fallbackUnit), original: input, detectedUnit: null };
  }

  return null;
}

function parseUnitSuffix(suffix: string): Unit | null {
  switch (suffix) {
    case 'mm':
      return Unit.MM;
    case 'cm':
      return Unit.CM;
    case 'in':
    case 'inch':
    case 'inches':
    case '"':
      return Unit.INCH;
    case 'ft':
    case 'feet':
    case "'":
      return Unit.FT;
    default:
      return null;
  }
}
