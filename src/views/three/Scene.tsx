import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store';
import { mmToScene } from './helpers';
import { ClosetMesh } from './ClosetMesh';
import { BayMesh } from './BayMesh';
import { ModuleMesh } from './ModuleMesh';
import { CameraControls } from './CameraControls';
import { ACESFilmicToneMapping, Color, PCFSoftShadowMap, WebGLRenderer } from 'three';
import { WebGPURenderer } from 'three/webgpu';

function isWebGpuSupported() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

function isHtmlCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): canvas is HTMLCanvasElement {
  return typeof HTMLCanvasElement !== 'undefined' && canvas instanceof HTMLCanvasElement;
}

export function Scene() {
  const envelope = useAppStore((s) => s.envelope);
  const bays = useAppStore((s) => s.bays);
  const setEffectiveRenderer = useAppStore((s) => s.setEffectiveRenderer);
  const [rendererMode, setRendererMode] = useState<'webgpu' | 'webgl'>(() =>
    isWebGpuSupported() ? 'webgpu' : 'webgl',
  );
  const [webGpuReady, setWebGpuReady] = useState(false);
  const fallbackTriggeredRef = useRef(false);

  const w = mmToScene(envelope.width as number);
  const h = mmToScene(envelope.height as number);
  const d = mmToScene(envelope.depth as number);

  // Compute bay x positions
  let xAccum = 0;
  const bayData = bays.map((bay) => {
    const bayX = xAccum;
    xAccum += bay.width as number;
    return { bay, bayX };
  });

  useEffect(() => {
    if (rendererMode === 'webgl') {
      setWebGpuReady(false);
      setEffectiveRenderer('webgl');
    }
  }, [rendererMode, setEffectiveRenderer]);

  const createRenderer = useCallback((canvas: HTMLCanvasElement | OffscreenCanvas) => {
    if (rendererMode === 'webgpu' && isWebGpuSupported() && isHtmlCanvas(canvas)) {
      try {
        const renderer = new WebGPURenderer({
          canvas,
          antialias: true,
          alpha: true,
        });
        renderer.init()
          .then(() => {
            setWebGpuReady(true);
            setEffectiveRenderer('webgpu');
          })
          .catch(() => {
            if (!fallbackTriggeredRef.current) {
              fallbackTriggeredRef.current = true;
              setRendererMode('webgl');
            }
          });
        return renderer as unknown as WebGLRenderer;
      } catch {
        if (!fallbackTriggeredRef.current) {
          fallbackTriggeredRef.current = true;
          setRendererMode('webgl');
        }
      }
    }

    return new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  }, [rendererMode, setEffectiveRenderer]);

  const isTexturedSceneReady = rendererMode === 'webgl' || webGpuReady;

  return (
    <Canvas
      key={rendererMode}
      camera={{
        position: [w * 0.5, h * 0.5, Math.max(w, h) * 1.5],
        fov: 45,
        near: 0.01,
        far: 100,
      }}
      gl={createRenderer}
      shadows
      dpr={[1, 1.5]}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
        scene.background = new Color('#edf2f7');
        if (!(gl as unknown as { isWebGPURenderer?: boolean }).isWebGPURenderer) {
          setEffectiveRenderer('webgl');
        }
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.28} />
      {isTexturedSceneReady && <Environment preset="city" />}
      <directionalLight
        position={[3.5, 5.5, 3.5]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-2.8, 2.4, -2.2]} intensity={0.38} />

      {isTexturedSceneReady && (
        <>
          <ClosetMesh />
          <BayMesh />

          {bayData.map(({ bay, bayX }) =>
            bay.modules.map((mod) => (
              <ModuleMesh key={mod.id} module={mod} bayX={bayX} />
            )),
          )}
        </>
      )}

      <CameraControls width={w} height={h} depth={d} />
      <gridHelper args={[10, 20, '#d6dee8', '#dbe5ef']} position={[0, -0.001, 0]} />
    </Canvas>
  );
}
