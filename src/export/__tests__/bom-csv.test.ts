import { describe, it, expect } from 'vitest';
import { generateBom, bomToCsv } from '../bom-csv';
import { Bay } from '@/domain/model';
import { mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';

describe('generateBom', () => {
  it('generates BOM from bay modules', () => {
    const bays: Bay[] = [
      {
        id: 'b1' as Bay['id'],
        width: mm(600),
        modules: [
          {
            id: 'm1' as any,
            type: 'shelf-tower',
            catalogId: 'shelf-tower-5',
            x: mm(0),
            y: mm(0),
            width: mm(600),
            height: mm(1800),
            depth: mm(400),
            components: [
              {
                id: 'c1' as any,
                name: 'shelf',
                materialId: 'melamine-white-19',
                width: mm(600),
                height: mm(19),
                depth: mm(400),
                quantity: 5,
              },
            ],
            overrides: {},
          },
        ],
      },
    ];

    const bom = generateBom(bays);
    expect(bom.length).toBe(1);
    expect(bom[0].partName).toBe('shelf');
    expect(bom[0].quantity).toBe(5);
  });
});

describe('bomToCsv', () => {
  it('produces valid CSV', () => {
    const bom = [
      {
        partName: 'shelf',
        material: '3/4" Melamine',
        width: mm(600),
        height: mm(19),
        depth: mm(400),
        quantity: 5,
        unitCost: 10,
        totalCost: 50,
      },
    ];

    const csv = bomToCsv(bom, Unit.INCH);
    expect(csv).toContain('Part,Material');
    expect(csv).toContain('shelf');
    expect(csv.split('\n').length).toBe(2);
  });
});
