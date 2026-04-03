import { Unit, Mm } from './types';
import { fromMm, FtIn } from './convert';

/** Full formatted string including unit label — used in status bar etc. */
export function formatDimension(value: Mm, displayUnit: Unit, precision: number = 1): string {
  const num = formatDimensionValue(value, displayUnit, precision);
  const label = unitLabel(displayUnit);
  return label ? `${num} ${label}` : num;
}

/** Just the numeric part — used in inputs (unit badge shown separately). */
export function formatDimensionValue(value: Mm, displayUnit: Unit, precision: number = 1): string {
  const converted = fromMm(value, displayUnit);

  if (displayUnit === Unit.FT_IN) {
    const { ft, in: inches } = converted as FtIn;
    const roundedIn = Math.round(inches * 10) / 10;
    if (ft === 0) return `${roundedIn}`;
    if (roundedIn === 0) return `${ft}`;
    return `${ft} ${roundedIn}`;
  }

  const num = converted as number;
  const rounded = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  return `${rounded}`;
}

/** Short abbreviation for the unit — shown as a badge next to inputs. */
export function unitLabel(displayUnit: Unit): string {
  switch (displayUnit) {
    case Unit.MM:     return 'mm';
    case Unit.CM:     return 'cm';
    case Unit.INCH:   return '"';
    case Unit.FT:     return 'ft';
    case Unit.FT_IN:  return 'ft';
    default:          return '';
  }
}
