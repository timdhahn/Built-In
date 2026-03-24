import { useAppStore } from '@/store';
import { Module, ModuleId } from '@/domain/model';

interface ElevationModuleProps {
  module: Module;
  bayX: number;
  envelopeHeight: number;
}

const MODULE_COLORS: Record<string, string> = {
  'single-hang': '#dbeafe',
  'double-hang': '#e0e7ff',
  'drawer-stack': '#fef3c7',
  'shelf-tower': '#d1fae5',
  'shoe-section': '#fce7f3',
};

const MODULE_STROKES: Record<string, string> = {
  'single-hang': '#3b82f6',
  'double-hang': '#6366f1',
  'drawer-stack': '#f59e0b',
  'shelf-tower': '#10b981',
  'shoe-section': '#ec4899',
};

export function ElevationModule({ module: mod, bayX, envelopeHeight }: ElevationModuleProps) {
  const selectedModuleId = useAppStore((s) => s.selectedModuleId);
  const selectModule = useAppStore((s) => s.selectModule);
  const isSelected = selectedModuleId === mod.id;

  const x = bayX + (mod.x as number);
  const y = envelopeHeight - (mod.y as number) - (mod.height as number); // flip Y
  const w = mod.width as number;
  const h = mod.height as number;

  const fill = MODULE_COLORS[mod.type] ?? '#f1f5f9';
  const stroke = MODULE_STROKES[mod.type] ?? '#94a3b8';

  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation();
        selectModule(mod.id as ModuleId);
      }}
    >
      {/* Module body */}
      <rect
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h - 4}
        rx={2}
        fill={fill}
        stroke={isSelected ? '#4f46e5' : stroke}
        strokeWidth={isSelected ? 2 : 1}
      />

      {/* Module-type specific decorations */}
      {mod.type === 'single-hang' && (
        <>
          {/* Rod */}
          <line
            x1={x + 10}
            y1={y + 30}
            x2={x + w - 10}
            y2={y + 30}
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Shelf above */}
          <line
            x1={x + 4}
            y1={y + 15}
            x2={x + w - 4}
            y2={y + 15}
            stroke={stroke}
            strokeWidth={1}
          />
        </>
      )}

      {mod.type === 'double-hang' && (
        <>
          {/* Upper rod */}
          <line
            x1={x + 10}
            y1={y + 30}
            x2={x + w - 10}
            y2={y + 30}
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Lower rod */}
          <line
            x1={x + 10}
            y1={y + h / 2 + 15}
            x2={x + w - 10}
            y2={y + h / 2 + 15}
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}

      {mod.type === 'drawer-stack' && (
        <>
          {/* Drawer lines */}
          {[1, 2].map((i) => (
            <line
              key={i}
              x1={x + 6}
              y1={y + (h * i) / 3}
              x2={x + w - 6}
              y2={y + (h * i) / 3}
              stroke={stroke}
              strokeWidth={1}
            />
          ))}
          {/* Drawer pulls */}
          {[0, 1, 2].map((i) => (
            <line
              key={`pull-${i}`}
              x1={x + w / 2 - 15}
              y1={y + (h * i) / 3 + h / 6}
              x2={x + w / 2 + 15}
              y2={y + (h * i) / 3 + h / 6}
              stroke={stroke}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}
        </>
      )}

      {mod.type === 'shelf-tower' && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={x + 4}
              y1={y + (h * i) / 5}
              x2={x + w - 4}
              y2={y + (h * i) / 5}
              stroke={stroke}
              strokeWidth={1}
            />
          ))}
        </>
      )}

      {mod.type === 'shoe-section' && (
        <>
          {[1, 2, 3].map((i) => (
            <line
              key={i}
              x1={x + 6}
              y1={y + (h * i) / 4 + 10}
              x2={x + w - 6}
              y2={y + (h * i) / 4 - 5}
              stroke={stroke}
              strokeWidth={1}
            />
          ))}
        </>
      )}

      {/* Module label */}
      <text
        x={x + w / 2}
        y={y + h - 8}
        textAnchor="middle"
        fontSize={Math.min(11, w / 8)}
        fill={stroke}
        fontWeight={500}
      >
        {mod.type.replace('-', ' ')}
      </text>
    </g>
  );
}
