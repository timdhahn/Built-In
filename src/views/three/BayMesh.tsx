import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import React from 'react';

const DIVIDER_THICKNESS = 0.019;

export const BayMesh = React.memo(function BayMesh() {
  const bays = useAppStore((s) => s.bays);
  const envelope = useAppStore((s) => s.envelope);
  const h = mmToScene(envelope.height as number);
  const d = mmToScene(envelope.depth as number);

  let xAccum = 0;
  const dividers: JSX.Element[] = [];

  for (let i = 0; i < bays.length - 1; i++) {
    xAccum += mmToScene(bays[i].width as number);
    dividers.push(
      <mesh key={i} position={[xAccum, h / 2, 0]}>
        <boxGeometry args={[DIVIDER_THICKNESS, h, d]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
      </mesh>,
    );
  }

  return <group>{dividers}</group>;
});
