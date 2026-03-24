import { ValidationRule, ValidationIssue } from '../types';

export const moduleFitWidthRule: ValidationRule = {
  id: 'module-fit-width',
  name: 'Module must fit within bay width',
  severity: 'error',
  validate(ctx): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    for (const bay of ctx.bays) {
      for (const mod of bay.modules) {
        if (mod.x + mod.width > bay.width) {
          issues.push({
            id: `${this.id}-${mod.id}`,
            ruleId: this.id,
            severity: this.severity,
            message: `Module extends beyond bay width`,
            entityId: mod.id,
            entityType: 'module',
            suggestion: 'Reduce module width or move it within the bay.',
          });
        }
      }
    }
    return issues;
  },
};

export const moduleFitHeightRule: ValidationRule = {
  id: 'module-fit-height',
  name: 'Module must fit within envelope height',
  severity: 'error',
  validate(ctx): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    for (const bay of ctx.bays) {
      for (const mod of bay.modules) {
        if (mod.y + mod.height > ctx.envelope.height) {
          issues.push({
            id: `${this.id}-${mod.id}`,
            ruleId: this.id,
            severity: this.severity,
            message: `Module extends beyond closet height`,
            entityId: mod.id,
            entityType: 'module',
            suggestion: 'Lower the module or reduce its height.',
          });
        }
      }
    }
    return issues;
  },
};
