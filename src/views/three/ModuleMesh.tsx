import { Module } from '@/domain/model';
import { mmToScene } from './helpers';
import React from 'react';

const MODULE_COLORS: Record<string, string> = {
  'single-hang': '#93c5fd',
  'double-hang': '#a5b4fc',
  'drawer-stack': '#fcd34d',
  'shelf-tower': '#6ee7b7',
  'shoe-section': '#f9a8d4',
};

interface ModuleMeshProps {
  module: Module;
  bayX: number;
}

export const ModuleMesh = React.memo(function ModuleMesh({ module: mod, bayX }: ModuleMeshProps) {
  const x = mmToScene(bayX + (mod.x as number));
  const y = mmToScene(mod.y as number);
  const w = mmToScene(mod.width as number);
  const h = mmToScene(mod.height as number);
  const d = mmToScene(mod.depth as number);
  const color = MODULE_COLORS[mod.type] ?? '#d1d5db';

  return (
    <group position={[x + w / 2, y + h / 2, 0]}>
      <mesh>
        <boxGeometry args={[w * 0.95, h * 0.95, d * 0.9]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Wireframe outline */}
      <mesh>
        <boxGeometry args={[w * 0.95, h * 0.95, d * 0.9]} />
        <meshBasicMaterial color="#475569" wireframe />
      </mesh>

      {/* Type-specific details */}
      {(mod.type === 'single-hang' || mod.type === 'double-hang') && (
        <mesh position={[0, h * 0.35, 0]}>
          <cylinderGeometry args={[0.005, 0.005, w * 0.9, 8]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      )}

      {mod.type === 'double-hang' && (
        <mesh position={[0, -h * 0.1, 0]}>
          <cylinderGeometry args={[0.005, 0.005, w * 0.9, 8]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      )}
    </group>
  );
});
