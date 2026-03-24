import { describe, it, expect } from 'vitest';
import { calculateCost } from '../calculator';
import { BomLineItem } from '../../model/bom';
import { mm } from '../../units/types';

describe('calculateCost', () => {
  it('calculates totals with markup', () => {
    const bom: BomLineItem[] = [
      {
        partName: 'shelf',
        material: 'melamine-white-19',
        width: mm(600),
        height: mm(19),
        depth: mm(400),
        quantity: 5,
        unitCost: 10,
        totalCost: 50,
      },
    ];

    const summary = calculateCost(bom, {
      markupPercent: 30,
      laborCostPerModule: 25,
      hardwareFixedCosts: {},
    });

    expect(summary.materialTotal).toBe(50);
    expect(summary.subtotal).toBe(50);
    expect(summary.markup).toBe(15);
    expect(summary.total).toBe(65);
  });

  it('handles empty BOM', () => {
    const summary = calculateCost([]);
    expect(summary.total).toBe(0);
  });

  it('adds hardware fixed costs', () => {
    const bom: BomLineItem[] = [
      {
        partName: 'rod',
        material: 'chrome-rod',
        width: mm(600),
        height: mm(25),
        depth: mm(25),
        quantity: 2,
        unitCost: 5,
        totalCost: 10,
      },
    ];

    const summary = calculateCost(bom, {
      markupPercent: 0,
      laborCostPerModule: 0,
      hardwareFixedCosts: { 'chrome-rod': 8.5 },
    });

    expect(summary.hardwareTotal).toBe(17);
    expect(summary.subtotal).toBe(27);
  });
});
