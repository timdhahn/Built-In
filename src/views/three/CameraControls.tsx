import { OrbitControls } from '@react-three/drei';

export function CameraControls() {
  return (
    <OrbitControls
      makeDefault
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={0.5}
      maxDistance={10}
      enableDamping
      dampingFactor={0.1}
    />
  );
}
