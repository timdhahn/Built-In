import { Mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';
import { formatDimension } from '@/domain/units/format';

interface DimensionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  value: Mm;
  unit: Unit;
  vertical?: boolean;
  small?: boolean;
}

export function DimensionLine({
  x1,
  y1,
  x2,
  y2,
  value,
  unit,
  vertical,
  small,
}: DimensionLineProps) {
  const text = formatDimension(value, unit);
  const fontSize = small ? 9 : 11;
  const tickSize = small ? 4 : 6;

  if (vertical) {
    const mx = x1;
    const my = (y1 + y2) / 2;
    return (
      <g>
        <line x1={mx} y1={y1} x2={mx} y2={y2} stroke="#64748b" strokeWidth={0.5} />
        <line
          x1={mx - tickSize}
          y1={y1}
          x2={mx + tickSize}
          y2={y1}
          stroke="#64748b"
          strokeWidth={0.5}
        />
        <line
          x1={mx - tickSize}
          y1={y2}
          x2={mx + tickSize}
          y2={y2}
          stroke="#64748b"
          strokeWidth={0.5}
        />
        <text
          x={mx - 8}
          y={my}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={fontSize}
          fill="#64748b"
          transform={`rotate(-90, ${mx - 8}, ${my})`}
        >
          {text}
        </text>
      </g>
    );
  }

  const mx = (x1 + x2) / 2;
  const my = y1;
  return (
    <g>
      <line x1={x1} y1={my} x2={x2} y2={my} stroke="#64748b" strokeWidth={0.5} />
      <line
        x1={x1}
        y1={my - tickSize}
        x2={x1}
        y2={my + tickSize}
        stroke="#64748b"
        strokeWidth={0.5}
      />
      <line
        x1={x2}
        y1={my - tickSize}
        x2={x2}
        y2={my + tickSize}
        stroke="#64748b"
        strokeWidth={0.5}
      />
      <text
        x={mx}
        y={my - 4}
        textAnchor="middle"
        fontSize={fontSize}
        fill="#64748b"
      >
        {text}
      </text>
    </g>
  );
}
