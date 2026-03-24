import { describe, it, expect } from 'vitest';
import { validateCatalog, loadCatalog } from '../loader';

describe('validateCatalog', () => {
  it('throws for non-array input', () => {
    expect(() => validateCatalog('not-array')).toThrow('must be an array');
  });

  it('throws for item missing id', () => {
    expect(() => validateCatalog([{ type: 'single-hang' }])).toThrow('missing id');
  });

  it('throws for invalid type', () => {
    expect(() =>
      validateCatalog([{ id: 'x', type: 'invalid', label: 'X', minWidth: 100, maxWidth: 200, components: [] }]),
    ).toThrow('invalid type');
  });

  it('throws if minWidth > maxWidth', () => {
    expect(() =>
      validateCatalog([
        { id: 'x', type: 'single-hang', label: 'X', minWidth: 500, maxWidth: 200, components: [] },
      ]),
    ).toThrow('minWidth > maxWidth');
  });

  it('validates built-in catalog successfully', () => {
    const catalog = loadCatalog();
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog[0]).toHaveProperty('id');
    expect(catalog[0]).toHaveProperty('type');
  });
});
