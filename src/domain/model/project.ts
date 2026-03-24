import { Mm } from '../units/types';
import { Unit } from '../units/types';
import { ProjectId } from './ids';
import { Bay } from './bay';

export type WallType = 'flat' | 'l-shape' | 'u-shape' | 'reach-in' | 'walk-in';

export interface SpaceEnvelope {
  width: Mm;
  height: Mm;
  depth: Mm;
  wallType: WallType;
}

export interface Project {
  id: ProjectId;
  name: string;
  createdAt: string;
  updatedAt: string;
  envelope: SpaceEnvelope;
  bays: Bay[];
  displayUnit: Unit;
}
