import { ValidationRule, ValidationIssue } from '../types';

export const moduleCollisionRule: ValidationRule = {
  id: 'module-collision',
  name: 'Modules must not overlap',
  severity: 'error',
  validate(ctx): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    for (const bay of ctx.bays) {
      for (let i = 0; i < bay.modules.length; i++) {
        for (let j = i + 1; j < bay.modules.length; j++) {
          const a = bay.modules[i];
          const b = bay.modules[j];
          const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
          const overlapY = a.y < b.y + b.height && a.y + a.height > b.y;
          if (overlapX && overlapY) {
            issues.push({
              id: `${this.id}-${a.id}-${b.id}`,
              ruleId: this.id,
              severity: this.severity,
              message: `Two modules overlap in the same bay`,
              entityId: a.id,
              entityType: 'module',
              suggestion: 'Move or resize one of the overlapping modules.',
            });
          }
        }
      }
    }
    return issues;
  },
};
