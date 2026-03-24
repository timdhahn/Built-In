import { ValidationRule, ValidationContext, ValidationIssue } from './types';

export function runValidation(
  rules: ValidationRule[],
  context: ValidationContext,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const rule of rules) {
    try {
      issues.push(...rule.validate(context));
    } catch (err) {
      console.error(`Validation rule "${rule.id}" threw:`, err);
    }
  }
  return issues;
}
