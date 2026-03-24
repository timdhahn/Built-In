import { ValidationRule, ValidationIssue } from '../types';

const MAX_UNSUPPORTED_SHELF_SPAN = 900; // mm (~36")

export const shelfSpanRule: ValidationRule = {
  id: 'shelf-span',
  name: 'Shelf span should not exceed recommended maximum',
  severity: 'warning',
  validate(ctx): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    for (const bay of ctx.bays) {
      for (const mod of bay.modules) {
        if (mod.type === 'shelf-tower' && mod.width > MAX_UNSUPPORTED_SHELF_SPAN) {
          issues.push({
            id: `${this.id}-${mod.id}`,
            ruleId: this.id,
            severity: this.severity,
            message: `Shelf span (${mod.width}mm) exceeds recommended max (${MAX_UNSUPPORTED_SHELF_SPAN}mm). May sag over time.`,
            entityId: mod.id,
            entityType: 'module',
            suggestion: 'Add a vertical divider or reduce the bay width.',
          });
        }
      }
    }
    return issues;
  },
};
