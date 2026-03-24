import { describe, it, expect, vi } from 'vitest';
import { runValidation } from '../engine';
import { ValidationRule, ValidationContext } from '../types';

const emptyContext: ValidationContext = {
  envelope: { width: 1200, height: 2400, depth: 600 },
  bays: [],
};

describe('runValidation', () => {
  it('returns empty for no rules', () => {
    expect(runValidation([], emptyContext)).toEqual([]);
  });

  it('collects issues from multiple rules', () => {
    const rule1: ValidationRule = {
      id: 'r1',
      name: 'Rule 1',
      severity: 'error',
      validate: () => [
        {
          id: 'i1',
          ruleId: 'r1',
          severity: 'error',
          message: 'Error 1',
          entityId: 'x',
          entityType: 'bay',
        },
      ],
    };
    const rule2: ValidationRule = {
      id: 'r2',
      name: 'Rule 2',
      severity: 'warning',
      validate: () => [
        {
          id: 'i2',
          ruleId: 'r2',
          severity: 'warning',
          message: 'Warning 1',
          entityId: 'y',
          entityType: 'module',
        },
      ],
    };

    const issues = runValidation([rule1, rule2], emptyContext);
    expect(issues.length).toBe(2);
  });

  it('handles rule that throws', () => {
    const badRule: ValidationRule = {
      id: 'bad',
      name: 'Bad Rule',
      severity: 'error',
      validate: () => {
        throw new Error('Boom');
      },
    };
    const goodRule: ValidationRule = {
      id: 'good',
      name: 'Good Rule',
      severity: 'info',
      validate: () => [
        {
          id: 'i1',
          ruleId: 'good',
          severity: 'info',
          message: 'Info',
          entityId: 'x',
          entityType: 'bay',
        },
      ],
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const issues = runValidation([badRule, goodRule], emptyContext);
    expect(issues.length).toBe(1);
    consoleSpy.mockRestore();
  });
});
