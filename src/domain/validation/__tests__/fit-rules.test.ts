import { describe, it, expect } from 'vitest';
import { moduleFitWidthRule, moduleFitHeightRule } from '../rules/fit-rules';
import { ValidationContext } from '../types';

describe('moduleFitWidthRule', () => {
  it('passes when module fits', () => {
    const ctx: ValidationContext = {
      envelope: { width: 1200, height: 2400, depth: 600 },
      bays: [
        {
          id: 'b1',
          width: 600,
          modules: [
            { id: 'm1', type: 'shelf-tower', x: 0, y: 0, width: 600, height: 1000, depth: 400 },
          ],
        },
      ],
    };
    expect(moduleFitWidthRule.validate(ctx)).toEqual([]);
  });

  it('fails when module exceeds bay width', () => {
    const ctx: ValidationContext = {
      envelope: { width: 1200, height: 2400, depth: 600 },
      bays: [
        {
          id: 'b1',
          width: 600,
          modules: [
            { id: 'm1', type: 'shelf-tower', x: 100, y: 0, width: 600, height: 1000, depth: 400 },
          ],
        },
      ],
    };
    const issues = moduleFitWidthRule.validate(ctx);
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
  });
});

describe('moduleFitHeightRule', () => {
  it('fails when module exceeds envelope height', () => {
    const ctx: ValidationContext = {
      envelope: { width: 1200, height: 2400, depth: 600 },
      bays: [
        {
          id: 'b1',
          width: 600,
          modules: [
            { id: 'm1', type: 'shelf-tower', x: 0, y: 2000, width: 600, height: 600, depth: 400 },
          ],
        },
      ],
    };
    const issues = moduleFitHeightRule.validate(ctx);
    expect(issues.length).toBe(1);
  });
});
