import { ValidationRule, ValidationIssue } from '../types';

export const envelopeWidthRule: ValidationRule = {
  id: 'envelope-width-match',
  name: 'Bay widths must equal envelope width',
  severity: 'error',
  validate(ctx): ValidationIssue[] {
    const totalBayWidth = ctx.bays.reduce((sum, bay) => sum + bay.width, 0);
    const diff = Math.abs(totalBayWidth - ctx.envelope.width);
    if (diff > 1) {
      return [
        {
          id: `${this.id}-0`,
          ruleId: this.id,
          severity: this.severity,
          message: `Total bay width (${totalBayWidth}mm) does not match envelope width (${ctx.envelope.width}mm)`,
          entityId: 'envelope',
          entityType: 'envelope',
          suggestion: 'Adjust bay widths to match the total closet width.',
        },
      ];
    }
    return [];
  },
};

export const moduleDepthRule: ValidationRule = {
  id: 'module-depth-envelope',
  name: 'Modules must fit within envelope depth',
  severity: 'warning',
  validate(ctx): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    for (const bay of ctx.bays) {
      for (const mod of bay.modules) {
        if (mod.depth > ctx.envelope.depth) {
          issues.push({
            id: `${this.id}-${mod.id}`,
            ruleId: this.id,
            severity: this.severity,
            message: `Module depth (${mod.depth}mm) exceeds closet depth (${ctx.envelope.depth}mm)`,
            entityId: mod.id,
            entityType: 'module',
            suggestion: 'Reduce module depth or increase closet depth.',
          });
        }
      }
    }
    return issues;
  },
};
