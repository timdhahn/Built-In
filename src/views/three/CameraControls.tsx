import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

interface CameraControlsProps {
  width: number;
  height: number;
  depth: number;
}

export function CameraControls({ width, height, depth }: CameraControlsProps) {
  const controlsRef = useRef<{
    target: Vector3;
    update: () => void;
  } | null>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const controls = controlsRef.current;
    if (!controls || size.width === 0 || size.height === 0) return;

    const center = new Vector3(width / 2, height / 2, 0);
    const aspect = size.width / size.height;
    const verticalFov = MathUtils.degToRad((camera as { fov?: number }).fov ?? 45);
    const fitHeightDistance = height / (2 * Math.tan(verticalFov / 2));
    const fitWidthDistance = width / (2 * aspect * Math.tan(verticalFov / 2));
    const distance = Math.max(fitHeightDistance, fitWidthDistance) + depth / 2 + 0.25;

    camera.position.set(center.x, center.y, center.z + distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = Math.max(100, distance * 10);
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
  }, [camera, depth, height, size.height, size.width, width]);

  return (
    <DreiOrbitControls
      ref={(instance) => {
        controlsRef.current = instance;
      }}
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
