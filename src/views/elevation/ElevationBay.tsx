import { useDroppable } from '@dnd-kit/core';
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
  const dragInsertion = useAppStore((s) => s.dragInsertion);
  const isSelected = selectedBayId === bay.id;
  const w = bay.width as number;

  // Compute insertion line Y position in SVG space
  let insertionLineY: number | null = null;
  if (dragInsertion?.bayId === bay.id) {
    const sorted = [...bay.modules].sort((a, b) => (a.y as number) - (b.y as number));
    const { targetIndex } = dragInsertion;
    if (sorted.length === 0) {
      insertionLineY = envelopeHeight;
    } else if (targetIndex < sorted.length) {
      insertionLineY = envelopeHeight - (sorted[targetIndex].y as number);
    } else {
      const top = sorted[sorted.length - 1];
      insertionLineY = envelopeHeight - (top.y as number) - (top.height as number);
    }
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `canvas-bay:${bay.id}`,
    data: { type: 'canvas-bay', bayId: bay.id },
  });

  return (
    <g>
      {/* Droppable bay background */}
      <rect
        ref={setNodeRef as unknown as React.Ref<SVGRectElement>}
        x={x}
        y={0}
        width={w}
        height={envelopeHeight}
        fill={
          isOver
            ? 'rgba(79, 70, 229, 0.12)'
            : isSelected
            ? 'rgba(79, 70, 229, 0.05)'
            : 'transparent'
        }
        stroke={isOver ? '#4f46e5' : isSelected ? '#4f46e5' : 'transparent'}
        strokeWidth={isOver ? 2 : isSelected ? 1 : 0}
        strokeDasharray={isSelected && !isOver ? '4 2' : undefined}
        style={{ cursor: 'pointer' }}
        onClick={() => selectBay(bay.id as BayId)}
      />

      {/* Bay divider line (right edge) */}
      <line
        x1={x + w}
        y1={0}
        x2={x + w}
        y2={envelopeHeight}
        stroke="#94a3b8"
        strokeWidth={2}
        strokeDasharray="6 4"
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

      {/* Drag insertion indicator */}
      {insertionLineY !== null && (
        <g style={{ pointerEvents: 'none' }}>
          <line
            x1={x + 6}
            y1={insertionLineY}
            x2={x + w - 6}
            y2={insertionLineY}
            stroke="#4f46e5"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={x + 6} cy={insertionLineY} r={5} fill="#4f46e5" />
        </g>
      )}
    </g>
  );
}
