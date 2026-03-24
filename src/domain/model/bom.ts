import { Mm } from '../units/types';

export interface BomLineItem {
  partName: string;
  material: string;
  width: Mm;
  height: Mm;
  depth: Mm;
  quantity: number;
  unitCost: number;
  totalCost: number;
}
