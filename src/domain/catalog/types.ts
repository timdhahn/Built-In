import { ModuleType } from '../model/module';

export interface ComponentTemplate {
  name: string;
  material: string;
  quantity: number;
  widthExpr?: string;
  heightExpr?: string;
  depthExpr?: string;
}

export interface ModuleDefinition {
  id: string;
  type: ModuleType;
  label: string;
  icon: string;
  description: string;
  defaultHeight: number;
  defaultDepth: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  components: ComponentTemplate[];
  tags: string[];
}
