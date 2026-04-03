import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import { getFinishById } from './finishes';
import { useThree } from '@react-three/fiber';

interface PanelMaterialProps {
  finishId: string;
  width: number;
  height: number;
}

function cloneWithRepeat(
  texture: Texture,
  repeatX: number,
  repeatY: number,
  useSrgb: boolean,
  anisotropy: number,
): Texture {
  const clone = texture.clone();
  clone.wrapS = RepeatWrapping;
  clone.wrapT = RepeatWrapping;
  clone.repeat.set(repeatX, repeatY);
  clone.anisotropy = anisotropy;
  clone.needsUpdate = true;
  if (useSrgb) {
    clone.colorSpace = SRGBColorSpace;
  }
  return clone;
}

export function PanelMaterial({ finishId, width, height }: PanelMaterialProps) {
  const { gl } = useThree();
  const finish = getFinishById(finishId);
  const [mapSource, normalMapSource, roughnessMapSource] = useTexture([
    finish.texture.map,
    finish.texture.normalMap,
    finish.texture.roughnessMap,
  ]);

  const repeatX = Math.max(1, width / finish.tileSize);
  const repeatY = Math.max(1, height / finish.tileSize);
  const getMaxAnisotropy = (gl as unknown as { capabilities?: { getMaxAnisotropy?: () => number } })
    .capabilities
    ?.getMaxAnisotropy;
  const anisotropy = Math.min(8, getMaxAnisotropy?.() ?? 1);

  const map = useMemo(
    () => cloneWithRepeat(mapSource, repeatX, repeatY, true, anisotropy),
    [mapSource, repeatX, repeatY, anisotropy],
  );
  const normalMap = useMemo(
    () => cloneWithRepeat(normalMapSource, repeatX, repeatY, false, anisotropy),
    [normalMapSource, repeatX, repeatY, anisotropy],
  );
  const roughnessMap = useMemo(
    () => cloneWithRepeat(roughnessMapSource, repeatX, repeatY, false, anisotropy),
    [roughnessMapSource, repeatX, repeatY, anisotropy],
  );

  return (
    <meshStandardMaterial
      color={finish.tint}
      map={map}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      roughness={finish.roughness}
      metalness={finish.metalness}
      normalScale={finish.normalScale}
    />
  );
}
