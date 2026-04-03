import { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useAppStore } from '@/store';
import { Module, ModuleId } from '@/domain/model';
import { mm } from '@/domain/units/types';

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

const RESIZE_ZONE = 12; // SVG units — height of the invisible resize hit area

export function ElevationModule({ module: mod, bayX, envelopeHeight }: ElevationModuleProps) {
  const selectedModuleId = useAppStore((s) => s.selectedModuleId);
  const selectModule = useAppStore((s) => s.selectModule);
  const updateModuleDimensions = useAppStore((s) => s.updateModuleDimensions);
  const isSelected = selectedModuleId === mod.id;

  const bodyRef = useRef<SVGRectElement>(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `canvas-module:${mod.id}`,
    data: { type: 'placed-module', moduleId: mod.id },
  });

  const x = bayX + (mod.x as number);
  const y = envelopeHeight - (mod.y as number) - (mod.height as number);
  const w = mod.width as number;
  const h = mod.height as number;

  const fill = MODULE_COLORS[mod.type] ?? '#f1f5f9';
  const stroke = MODULE_STROKES[mod.type] ?? '#94a3b8';

  // Compute CSS-to-SVG scale from the body rect's rendered size
  const getScale = () => {
    if (!bodyRef.current) return 1;
    const cssRect = bodyRef.current.getBoundingClientRect();
    return cssRect.width / (w - 4);
  };

  const handleResizeStart = (
    e: React.PointerEvent<SVGRectElement>,
    edge: 'top' | 'bottom',
  ) => {
    e.stopPropagation(); // prevent drag from starting
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);

    const scale = getScale();
    const startY = e.clientY;
    const startHeight = mod.height as number;
    const startModY = mod.y as number;

    const onMove = (me: PointerEvent) => {
      const deltaYPx = me.clientY - startY;
      const deltaYMm = deltaYPx / scale;

      if (edge === 'top') {
        // Top edge: height changes, bottom (mod.y) stays fixed
        const newH = Math.max(80, Math.round(startHeight - deltaYMm));
        updateModuleDimensions(mod.id as ModuleId, { height: mm(newH) });
      } else {
        // Bottom edge: floor (mod.y) moves, top of module stays fixed
        const newModY = Math.max(0, Math.round(startModY - deltaYMm));
        const topFixed = startModY + startHeight;
        const newH = Math.max(80, topFixed - newModY);
        updateModuleDimensions(mod.id as ModuleId, {
          y: mm(newModY),
          height: mm(Math.round(newH)),
        });
      }
    };

    const onUp = (ue: PointerEvent) => {
      (e.currentTarget as Element).releasePointerCapture(ue.pointerId);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return (
    <g
      ref={(el) => {
        setNodeRef(el as unknown as HTMLElement);
      }}
      style={{ opacity: isDragging ? 0.25 : 1, cursor: isDragging ? 'grabbing' : 'grab' }}
      {...attributes}
      {...listeners}
    >
      {/* Module body */}
      <rect
        ref={bodyRef}
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h - 4}
        rx={3}
        fill={fill}
        stroke={isSelected ? '#4f46e5' : stroke}
        strokeWidth={isSelected ? 3 : 2}
        onClick={(e) => {
          e.stopPropagation();
          selectModule(mod.id as ModuleId);
        }}
      />

      {/* Decorations */}
      {mod.type === 'single-hang' && (
        <>
          <line x1={x + 14} y1={y + 32} x2={x + w - 14} y2={y + 32} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
          <line x1={x + 6}  y1={y + 16} x2={x + w - 6}  y2={y + 16} stroke={stroke} strokeWidth={2} />
        </>
      )}
      {mod.type === 'double-hang' && (
        <>
          <line x1={x + 14} y1={y + 32}         x2={x + w - 14} y2={y + 32}         stroke={stroke} strokeWidth={3} strokeLinecap="round" />
          <line x1={x + 14} y1={y + h / 2 + 16} x2={x + w - 14} y2={y + h / 2 + 16} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {mod.type === 'drawer-stack' && (
        <>
          {[1, 2].map((i) => (
            <line key={i} x1={x + 6} y1={y + (h * i) / 3} x2={x + w - 6} y2={y + (h * i) / 3} stroke={stroke} strokeWidth={2} />
          ))}
          {[0, 1, 2].map((i) => (
            <line key={`pull-${i}`} x1={x + w / 2 - 16} y1={y + (h * i) / 3 + h / 6} x2={x + w / 2 + 16} y2={y + (h * i) / 3 + h / 6} stroke={stroke} strokeWidth={3} strokeLinecap="round" />
          ))}
        </>
      )}
      {mod.type === 'shelf-tower' && (
        [1, 2, 3, 4].map((i) => (
          <line key={i} x1={x + 6} y1={y + (h * i) / 5} x2={x + w - 6} y2={y + (h * i) / 5} stroke={stroke} strokeWidth={2} />
        ))
      )}
      {mod.type === 'shoe-section' && (
        [1, 2, 3].map((i) => (
          <line key={i} x1={x + 8} y1={y + (h * i) / 4 + 12} x2={x + w - 8} y2={y + (h * i) / 4 - 6} stroke={stroke} strokeWidth={2} />
        ))
      )}

      {/* Label */}
      <text
        x={x + w / 2}
        y={y + h - 10}
        textAnchor="middle"
        fontSize={Math.min(12, w / 7)}
        fill={stroke}
        fontWeight={600}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {mod.type.replace('-', ' ')}
      </text>

      {/* TOP resize handle — invisible hit area, overrides drag listeners */}
      <rect
        x={x + 4}
        y={y + 2}
        width={w - 8}
        height={RESIZE_ZONE}
        fill="transparent"
        style={{ cursor: 'ns-resize' }}
        onPointerDown={(e) => handleResizeStart(e, 'top')}
        onClick={(e) => { e.stopPropagation(); selectModule(mod.id as ModuleId); }}
      />

      {/* BOTTOM resize handle */}
      <rect
        x={x + 4}
        y={y + h - 2 - RESIZE_ZONE}
        width={w - 8}
        height={RESIZE_ZONE}
        fill="transparent"
        style={{ cursor: 'ns-resize' }}
        onPointerDown={(e) => handleResizeStart(e, 'bottom')}
        onClick={(e) => { e.stopPropagation(); selectModule(mod.id as ModuleId); }}
      />

      {/* Selected indicator: top-bar highlight */}
      {isSelected && (
        <rect
          x={x + 2}
          y={y + 2}
          width={w - 4}
          height={4}
          rx={2}
          fill="#4f46e5"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}
