import { Bay, BomLineItem, Material } from '@/domain/model';
import { Mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';
import { formatDimension } from '@/domain/units/format';
import { DEFAULT_MATERIALS } from '@/domain/model/material';

export function generateBom(bays: Bay[], materials: Material[] = DEFAULT_MATERIALS): BomLineItem[] {
  const items: BomLineItem[] = [];

  for (const bay of bays) {
    for (const mod of bay.modules) {
      for (const comp of mod.components) {
        const material = materials.find((m) => m.id === comp.materialId);
        const materialName = material?.name ?? comp.materialId;
        const area = (comp.width as number) * (comp.height as number);
        const costPerSqMm = material?.costPerSqMm ?? 0;
        const unitCost = area * costPerSqMm;

        items.push({
          partName: comp.name,
          material: materialName,
          width: comp.width,
          height: comp.height,
          depth: comp.depth,
          quantity: comp.quantity,
          unitCost: Math.round(unitCost * 100) / 100,
          totalCost: Math.round(unitCost * comp.quantity * 100) / 100,
        });
      }
    }
  }

  return items;
}

export function bomToCsv(items: BomLineItem[], displayUnit: Unit): string {
  const header = 'Part,Material,Width,Height,Depth,Qty,Unit Cost,Total Cost';
  const rows = items.map((item) => {
    const w = formatDimension(item.width as Mm, displayUnit);
    const h = formatDimension(item.height as Mm, displayUnit);
    const d = formatDimension(item.depth as Mm, displayUnit);
    return `"${item.partName}","${item.material}","${w}","${h}","${d}",${item.quantity},${item.unitCost.toFixed(2)},${item.totalCost.toFixed(2)}`;
  });

  return [header, ...rows].join('\n');
}

export function downloadCsv(csv: string, filename: string = 'bom.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
