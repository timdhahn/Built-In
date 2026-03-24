import { ModuleType } from '../model/module';

export type Severity = 'error' | 'warning' | 'info';

export type EntityType = 'bay' | 'module' | 'envelope' | 'project';

export interface ValidationIssue {
  id: string;
  ruleId: string;
  severity: Severity;
  message: string;
  entityId: string;
  entityType: EntityType;
  suggestion?: string;
}

export interface ValidationContext {
  envelope: {
    width: number;
    height: number;
    depth: number;
  };
  bays: Array<{
    id: string;
    width: number;
    modules: Array<{
      id: string;
      type: ModuleType;
      x: number;
      y: number;
      width: number;
      height: number;
      depth: number;
    }>;
  }>;
}

export interface ValidationRule {
  id: string;
  name: string;
  severity: Severity;
  validate(context: ValidationContext): ValidationIssue[];
}
