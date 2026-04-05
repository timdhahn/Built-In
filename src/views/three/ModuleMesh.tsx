import { Module } from '@/domain/model';
import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import { PanelMaterial } from './PanelMaterial';
import React from 'react';

const PANEL = 0.018;
const BACK = 0.006;
const INSET = 0.008;
const FRONT_GAP = 0.0025;

interface ModuleMeshProps {
  module: Module;
  bayX: number;
}

function Board({
  finishId,
  position,
  size,
}: {
  finishId: string;
  position: [number, number, number];
  size: [number, number, number];
}) {
  const [bw, bh, bd] = size;
  const faceW = Math.max(bw, bd);
  const faceH = Math.max(bh, bd);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <PanelMaterial finishId={finishId} width={faceW} height={faceH} />
    </mesh>
  );
}

function Rod({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.006, 0.006, Math.max(0.08, width), 24]} />
      <meshPhysicalMaterial color="#c5ccd3" roughness={0.18} metalness={0.92} />
    </mesh>
  );
}

export const ModuleMesh = React.memo(function ModuleMesh({ module: mod, bayX }: ModuleMeshProps) {
  const finishId = useAppStore((s) => s.finishId);
  const x = mmToScene(bayX + (mod.x as number));
  const y = mmToScene(mod.y as number);
  const w = mmToScene(mod.width as number);
  const h = mmToScene(mod.height as number);
  const d = mmToScene(mod.depth as number);

  const innerW = Math.max(0.05, w - PANEL * 2);
  const innerH = Math.max(0.05, h - PANEL * 2);
  const innerD = Math.max(0.1, d * 0.92 - BACK);
  const caseD = d * 0.92;

  return (
    <group position={[x + w / 2, y + h / 2, 0]}>
      {/* Carcass */}
      <Board finishId={finishId} position={[-w / 2 + PANEL / 2, 0, 0]} size={[PANEL, h, caseD]} />
      <Board finishId={finishId} position={[w / 2 - PANEL / 2, 0, 0]} size={[PANEL, h, caseD]} />
      <Board finishId={finishId} position={[0, h / 2 - PANEL / 2, 0]} size={[innerW, PANEL, caseD]} />
      <Board finishId={finishId} position={[0, -h / 2 + PANEL / 2, 0]} size={[innerW, PANEL, caseD]} />
      <Board
        finishId={finishId}
        position={[0, 0, -caseD / 2 + BACK / 2]}
        size={[innerW, innerH, BACK]}
      />

      {mod.type === 'single-hang' && (
        <>
          <Board
            finishId={finishId}
            position={[0, h * 0.26, 0]}
            size={[innerW, PANEL, innerD]}
          />
          <Rod position={[0, h * 0.05, caseD * 0.2]} width={innerW * 0.88} />
        </>
      )}

      {mod.type === 'double-hang' && (
        <>
          <Board
            finishId={finishId}
            position={[0, 0, 0]}
            size={[innerW, PANEL, innerD]}
          />
          <Rod position={[0, h * 0.22, caseD * 0.2]} width={innerW * 0.88} />
          <Rod position={[0, -h * 0.22, caseD * 0.2]} width={innerW * 0.88} />
        </>
      )}

      {mod.type === 'drawer-stack' && (
        <>
          {Array.from({ length: Math.max(3, Math.min(6, Math.round(h / 0.34))) }).map((_, i, arr) => {
            const slotH = innerH / arr.length;
            const drawerY = h / 2 - PANEL - slotH * (i + 0.5);
            const faceH = Math.max(0.08, slotH - FRONT_GAP * 2);
            return (
              <group key={i}>
                <Board
                  finishId={finishId}
                  position={[0, drawerY, caseD / 2 - 0.012]}
                  size={[innerW - FRONT_GAP * 2, faceH, 0.02]}
                />
                <mesh position={[0, drawerY, caseD / 2]} castShadow>
                  <boxGeometry args={[Math.max(0.1, innerW * 0.28), 0.008, 0.008]} />
                  <meshPhysicalMaterial color="#c1c8cf" roughness={0.25} metalness={0.88} />
                </mesh>
              </group>
            );
          })}
        </>
      )}

      {mod.type === 'shelf-tower' && (
        <>
          {Array.from({ length: 4 }).map((_, i) => {
            const shelfY = h / 2 - PANEL - ((i + 1) * innerH) / 5;
            return (
              <Board
                key={i}
                finishId={finishId}
                position={[0, shelfY, 0]}
                size={[innerW, PANEL, innerD]}
              />
            );
          })}
        </>
      )}

      {mod.type === 'shoe-section' && (
        <>
          {Array.from({ length: 4 }).map((_, i) => {
            const shelfY = h / 2 - PANEL - ((i + 1) * innerH) / 5;
            return (
              <group key={i} position={[0, shelfY, INSET]} rotation={[-0.26, 0, 0]}>
                <Board
                  finishId={finishId}
                  position={[0, 0, 0]}
                  size={[innerW * 0.95, PANEL, innerD * 0.78]}
                />
                <mesh position={[0, 0.012, innerD * 0.37]} castShadow>
                  <boxGeometry args={[innerW * 0.95, 0.006, 0.006]} />
                  <meshStandardMaterial color="#6b7280" />
                </mesh>
              </group>
            );
          })}
        </>
      )}
    </group>
  );
});
