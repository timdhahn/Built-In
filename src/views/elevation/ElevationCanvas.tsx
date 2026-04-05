import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { Mm } from '@/domain/units/types';
import { ElevationBay } from './ElevationBay';
import { DimensionLine } from './DimensionLine';
import { ElevationGrid } from './ElevationGrid';
import styles from './ElevationCanvas.module.css';

const PADDING = 60; // SVG units padding for dimension lines

export function ElevationCanvas() {
  const envelope = useAppStore((s) => s.envelope);
  const bays = useAppStore((s) => s.bays);
  const displayUnit = useAppStore((s) => s.displayUnit);
  const zoomLevel = useAppStore((s) => s.zoomLevel);

  const w = envelope.width as number;
  const h = envelope.height as number;

  const viewBoxW = w + PADDING * 2;
  const viewBoxH = h + PADDING * 2;

  const bayPositions = useMemo(() => {
    let x = 0;
    return bays.map((bay) => {
      const pos = { x, width: bay.width as number };
      x += bay.width as number;
      return pos;
    });
  }, [bays]);

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox={`${-PADDING} ${-PADDING} ${viewBoxW} ${viewBoxH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Background grid */}
        <ElevationGrid width={w} height={h} />

        {/* Closet envelope */}
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill="white"
          stroke="#475569"
          strokeWidth={4}
        />

        {/* Bay dividers and modules */}
        {bays.map((bay, i) => (
          <ElevationBay
            key={bay.id}
            bay={bay}
            x={bayPositions[i].x}
            envelopeHeight={h}
          />
        ))}

        {/* Dimension: total width */}
        <DimensionLine
          x1={0}
          y1={h + 20}
          x2={w}
          y2={h + 20}
          value={envelope.width as Mm}
          unit={displayUnit}
        />

        {/* Dimension: total height */}
        <DimensionLine
          x1={-20}
          y1={0}
          x2={-20}
          y2={h}
          value={envelope.height as Mm}
          unit={displayUnit}
          vertical
        />

        {/* Bay width dimensions */}
        {bays.map((bay, i) => (
          <DimensionLine
            key={`dim-${bay.id}`}
            x1={bayPositions[i].x}
            y1={h + 40}
            x2={bayPositions[i].x + (bay.width as number)}
            y2={h + 40}
            value={bay.width as Mm}
            unit={displayUnit}
            small
          />
        ))}
      </svg>
    </div>
  );
}
