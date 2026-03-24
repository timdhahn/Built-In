import { Unit, Mm } from './types';
import { fromMm, FtIn } from './convert';

export function formatDimension(value: Mm, displayUnit: Unit, precision: number = 1): string {
  const converted = fromMm(value, displayUnit);

  if (displayUnit === Unit.FT_IN) {
    const { ft, in: inches } = converted as FtIn;
    const roundedIn = Math.round(inches * 10) / 10;
    if (ft === 0) return `${roundedIn}"`;
    if (roundedIn === 0) return `${ft}'`;
    return `${ft}' ${roundedIn}"`;
  }

  const num = converted as number;
  const rounded = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);

  switch (displayUnit) {
    case Unit.MM:
      return `${rounded} mm`;
    case Unit.CM:
      return `${rounded} cm`;
    case Unit.INCH:
      return `${rounded}"`;
    case Unit.FT:
      return `${rounded}'`;
    default:
      return `${rounded}`;
  }
}
