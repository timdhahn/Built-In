import { Vector2 } from 'three';

export interface FinishDefinition {
  id: string;
  label: string;
  texture: {
    map: string;
    normalMap: string;
    roughnessMap: string;
  };
  tint: string;
  tileSize: number;
  roughness: number;
  metalness: number;
  normalScale: Vector2;
}

export const FINISHES: FinishDefinition[] = [
  {
    id: 'white-melamine',
    label: 'White Melamine',
    texture: {
      map: '/textures/finishes/white-melamine/map.jpg',
      normalMap: '/textures/finishes/white-melamine/normal.jpg',
      roughnessMap: '/textures/finishes/white-melamine/roughness.jpg',
    },
    tint: '#f6f6f3',
    tileSize: 1.4,
    roughness: 0.52,
    metalness: 0.02,
    normalScale: new Vector2(0.1, 0.1),
  },
  {
    id: 'oak',
    label: 'Natural Oak',
    texture: {
      map: '/textures/finishes/oak/map.jpg',
      normalMap: '/textures/finishes/oak/normal.jpg',
      roughnessMap: '/textures/finishes/oak/roughness.jpg',
    },
    tint: '#f0cda6',
    tileSize: 1.8,
    roughness: 0.66,
    metalness: 0.04,
    normalScale: new Vector2(0.22, 0.22),
  },
  {
    id: 'walnut',
    label: 'Walnut',
    texture: {
      map: '/textures/finishes/walnut/map.jpg',
      normalMap: '/textures/finishes/walnut/normal.jpg',
      roughnessMap: '/textures/finishes/walnut/roughness.jpg',
    },
    tint: '#7a553b',
    tileSize: 1.5,
    roughness: 0.64,
    metalness: 0.04,
    normalScale: new Vector2(0.2, 0.2),
  },
  {
    id: 'charcoal',
    label: 'Charcoal',
    texture: {
      map: '/textures/finishes/charcoal/map.jpg',
      normalMap: '/textures/finishes/charcoal/normal.jpg',
      roughnessMap: '/textures/finishes/charcoal/roughness.jpg',
    },
    tint: '#596068',
    tileSize: 1.6,
    roughness: 0.7,
    metalness: 0.04,
    normalScale: new Vector2(0.16, 0.16),
  },
];

export const DEFAULT_FINISH_ID = 'white-melamine';

export function getFinishById(finishId: string): FinishDefinition {
  return FINISHES.find((finish) => finish.id === finishId) ?? FINISHES[0];
}
