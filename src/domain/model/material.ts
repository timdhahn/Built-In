import { Mm } from '../units/types';

export interface Material {
  id: string;
  name: string;
  thickness: Mm;
  costPerSqMm: number;
  category: 'panel' | 'hardware' | 'rod' | 'accessory';
}

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'melamine-white-19',
    name: '3/4" Melamine - White',
    thickness: 19 as Mm,
    costPerSqMm: 0.000015,
    category: 'panel',
  },
  {
    id: 'melamine-white-16',
    name: '5/8" Melamine - White',
    thickness: 16 as Mm,
    costPerSqMm: 0.000012,
    category: 'panel',
  },
  {
    id: 'chrome-rod',
    name: 'Chrome Hanging Rod',
    thickness: 25 as Mm,
    costPerSqMm: 0.00005,
    category: 'rod',
  },
  {
    id: 'steel-bracket',
    name: 'Steel Rod Support Bracket',
    thickness: 3 as Mm,
    costPerSqMm: 0,
    category: 'hardware',
  },
  {
    id: 'drawer-slide',
    name: 'Full-Extension Drawer Slide',
    thickness: 12 as Mm,
    costPerSqMm: 0,
    category: 'hardware',
  },
];
