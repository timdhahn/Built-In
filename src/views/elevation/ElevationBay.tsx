import { useAppStore } from '@/store';
import { Bay, BayId } from '@/domain/model';
import { ElevationModule } from './ElevationModule';

interface ElevationBayProps {
  bay: Bay;
  x: number;
  envelopeHeight: number;
}

export function ElevationBay({ bay, x, envelopeHeight }: ElevationBayProps) {
  const selectedBayId = useAppStore((s) => s.selectedBayId);
  const selectBay = useAppStore((s) => s.selectBay);
  const isSelected = selectedBayId === bay.id;
  const w = bay.width as number;

  return (
    <g>
      {/* Bay background - click target */}
      <rect
        x={x}
        y={0}
        width={w}
        height={envelopeHeight}
        fill={isSelected ? 'rgba(79, 70, 229, 0.05)' : 'transparent'}
        stroke={isSelected ? '#4f46e5' : 'transparent'}
        strokeWidth={isSelected ? 1 : 0}
        strokeDasharray={isSelected ? '4 2' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => selectBay(bay.id as BayId)}
      />

      {/* Bay divider line (right edge) */}
      <line
        x1={x + w}
        y1={0}
        x2={x + w}
        y2={envelopeHeight}
        stroke="#cbd5e1"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Modules within this bay */}
      {bay.modules.map((mod) => (
        <ElevationModule
          key={mod.id}
          module={mod}
          bayX={x}
          envelopeHeight={envelopeHeight}
        />
      ))}
    </g>
  );
}
