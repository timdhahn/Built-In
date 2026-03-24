import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import { ClosetMesh } from './ClosetMesh';
import { BayMesh } from './BayMesh';
import { ModuleMesh } from './ModuleMesh';
import { CameraControls } from './CameraControls';

export function Scene() {
  const envelope = useAppStore((s) => s.envelope);
  const bays = useAppStore((s) => s.bays);

  const w = mmToScene(envelope.width as number);
  const h = mmToScene(envelope.height as number);

  // Compute bay x positions
  let xAccum = 0;
  const bayData = bays.map((bay) => {
    const bayX = xAccum;
    xAccum += bay.width as number;
    return { bay, bayX };
  });

  return (
    <Canvas
      camera={{
        position: [w * 0.5, h * 0.5, Math.max(w, h) * 1.5],
        fov: 45,
        near: 0.01,
        far: 100,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />

      <ClosetMesh />
      <BayMesh />

      {bayData.map(({ bay, bayX }) =>
        bay.modules.map((mod) => (
          <ModuleMesh key={mod.id} module={mod} bayX={bayX} />
        )),
      )}

      <CameraControls />
      <gridHelper args={[10, 20, '#e2e8f0', '#e2e8f0']} />
    </Canvas>
  );
}
