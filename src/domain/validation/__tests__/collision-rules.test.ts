import { describe, it, expect } from 'vitest';
import { moduleCollisionRule } from '../rules/collision-rules';
import { ValidationContext } from '../types';

describe('moduleCollisionRule', () => {
  it('passes when modules do not overlap', () => {
    const ctx: ValidationContext = {
      envelope: { width: 1200, height: 2400, depth: 600 },
      bays: [
        {
          id: 'b1',
          width: 600,
          modules: [
            { id: 'm1', type: 'shelf-tower', x: 0, y: 0, width: 600, height: 500, depth: 400 },
            { id: 'm2', type: 'shelf-tower', x: 0, y: 500, width: 600, height: 500, depth: 400 },
          ],
        },
      ],
    };
    expect(moduleCollisionRule.validate(ctx)).toEqual([]);
  });

  it('detects overlapping modules', () => {
    const ctx: ValidationContext = {
      envelope: { width: 1200, height: 2400, depth: 600 },
      bays: [
        {
          id: 'b1',
          width: 600,
          modules: [
            { id: 'm1', type: 'shelf-tower', x: 0, y: 0, width: 600, height: 500, depth: 400 },
            { id: 'm2', type: 'shelf-tower', x: 0, y: 200, width: 600, height: 500, depth: 400 },
          ],
        },
      ],
    };
    const issues = moduleCollisionRule.validate(ctx);
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
  });
});
