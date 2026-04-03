import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import React from 'react';
import { PanelMaterial } from './PanelMaterial';

const PANEL_THICKNESS = 0.019; // 19mm in scene units

export const ClosetMesh = React.memo(function ClosetMesh() {
  const envelope = useAppStore((s) => s.envelope);
  const finishId = useAppStore((s) => s.finishId);
  const w = mmToScene(envelope.width as number);
  const h = mmToScene(envelope.height as number);
  const d = mmToScene(envelope.depth as number);

  return (
    <group>
      {/* Back wall */}
      <mesh position={[w / 2, h / 2, -d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, h, PANEL_THICKNESS]} />
        <PanelMaterial finishId={finishId} width={w} height={h} />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <PanelMaterial finishId={finishId} width={d} height={h} />
      </mesh>

      {/* Right wall */}
      <mesh position={[w, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <PanelMaterial finishId={finishId} width={d} height={h} />
      </mesh>

      {/* Floor */}
      <mesh position={[w / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <PanelMaterial finishId={finishId} width={w} height={d} />
      </mesh>

      {/* Top */}
      <mesh position={[w / 2, h, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <PanelMaterial finishId={finishId} width={w} height={d} />
      </mesh>
    </group>
  );
});
