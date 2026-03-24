import { Unit, Mm, mm } from './types';

const MM_PER_INCH = 25.4;
const MM_PER_FT = 304.8;
const MM_PER_CM = 10;

export function toMm(value: number, from: Unit): Mm {
  switch (from) {
    case Unit.MM:
      return mm(value);
    case Unit.CM:
      return mm(value * MM_PER_CM);
    case Unit.INCH:
      return mm(value * MM_PER_INCH);
    case Unit.FT:
      return mm(value * MM_PER_FT);
    case Unit.FT_IN:
      // For FT_IN, value is treated as inches
      return mm(value * MM_PER_INCH);
  }
}

export interface FtIn {
  ft: number;
  in: number;
}

export function fromMm(value: Mm, to: Unit): number | FtIn {
  switch (to) {
    case Unit.MM:
      return value as number;
    case Unit.CM:
      return (value as number) / MM_PER_CM;
    case Unit.INCH:
      return (value as number) / MM_PER_INCH;
    case Unit.FT:
      return (value as number) / MM_PER_FT;
    case Unit.FT_IN: {
      const totalInches = (value as number) / MM_PER_INCH;
      const ft = Math.floor(totalInches / 12);
      const inches = totalInches - ft * 12;
      return { ft, in: Math.round(inches * 100) / 100 };
    }
  }
}
