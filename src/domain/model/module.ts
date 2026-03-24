import { Mm } from '../units/types';
import { ModuleId, ComponentId } from './ids';

export type ModuleType =
  | 'single-hang'
  | 'double-hang'
  | 'drawer-stack'
  | 'shelf-tower'
  | 'shoe-section';

export interface Module {
  id: ModuleId;
  type: ModuleType;
  catalogId: string;
  x: Mm;
  y: Mm;
  width: Mm;
  height: Mm;
  depth: Mm;
  components: Component[];
  overrides: Record<string, unknown>;
}

export interface Component {
  id: ComponentId;
  name: string;
  materialId: string;
  width: Mm;
  height: Mm;
  depth: Mm;
  quantity: number;
}
