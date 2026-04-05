import { useCallback } from 'react';
import { Mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';
import { parseDimension, isParseError } from '@/domain/units/parse';
import { formatDimension, formatDimensionValue, unitLabel } from '@/domain/units/format';
import { useAppStore } from '@/store';

export function useDimension() {
  const displayUnit = useAppStore((s) => s.displayUnit);

  const format = useCallback(
    (value: Mm) => formatDimensionValue(value, displayUnit),
    [displayUnit],
  );

  const unit = unitLabel(displayUnit);

  const parse = useCallback(
    (input: string) => {
      const result = parseDimension(input, displayUnit);
      if (isParseError(result)) return null;
      return result.mm;
    },
    [displayUnit],
  );

  return { format, parse, displayUnit, unit };
}

export function useDimensionWithUnit(unit: Unit) {
  const format = useCallback(
    (value: Mm) => formatDimension(value, unit),
    [unit],
  );

  const parse = useCallback(
    (input: string) => {
      const result = parseDimension(input, unit);
      if (isParseError(result)) return null;
      return result.mm;
    },
    [unit],
  );

  return { format, parse, displayUnit: unit };
}
