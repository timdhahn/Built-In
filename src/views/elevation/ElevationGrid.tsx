interface ElevationGridProps {
  width: number;
  height: number;
  step?: number;
}

export function ElevationGrid({ width, height, step = 100 }: ElevationGridProps) {
  const lines: JSX.Element[] = [];

  for (let x = 0; x <= width; x += step) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e2e8f0"
        strokeWidth={0.5}
      />,
    );
  }

  for (let y = 0; y <= height; y += step) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e2e8f0"
        strokeWidth={0.5}
      />,
    );
  }

  return <g>{lines}</g>;
}
