import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import React from 'react';

const PANEL_THICKNESS = 0.019; // 19mm in scene units

export const ClosetMesh = React.memo(function ClosetMesh() {
  const envelope = useAppStore((s) => s.envelope);
  const w = mmToScene(envelope.width as number);
  const h = mmToScene(envelope.height as number);
  const d = mmToScene(envelope.depth as number);

  return (
    <group>
      {/* Back wall */}
      <mesh position={[w / 2, h / 2, -d / 2]}>
        <boxGeometry args={[w, h, PANEL_THICKNESS]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Right wall */}
      <mesh position={[w, h / 2, 0]}>
        <boxGeometry args={[PANEL_THICKNESS, h, d]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Floor */}
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Top */}
      <mesh position={[w / 2, h, 0]}>
        <boxGeometry args={[w, PANEL_THICKNESS, d]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
    </group>
  );
});
