import { BomLineItem } from '../model/bom';
import { PricingConfig, DEFAULT_PRICING } from './pricing';

export interface CostSummary {
  items: BomLineItem[];
  materialTotal: number;
  hardwareTotal: number;
  subtotal: number;
  markup: number;
  total: number;
}

export function calculateCost(
  bom: BomLineItem[],
  pricing: PricingConfig = DEFAULT_PRICING,
): CostSummary {
  let materialTotal = 0;
  let hardwareTotal = 0;

  for (const item of bom) {
    materialTotal += item.totalCost;
  }

  // Add fixed hardware costs
  for (const item of bom) {
    const fixedCost = pricing.hardwareFixedCosts[item.material];
    if (fixedCost) {
      hardwareTotal += fixedCost * item.quantity;
    }
  }

  const subtotal = materialTotal + hardwareTotal;
  const markup = subtotal * (pricing.markupPercent / 100);
  const total = subtotal + markup;

  return {
    items: bom,
    materialTotal: Math.round(materialTotal * 100) / 100,
    hardwareTotal: Math.round(hardwareTotal * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    markup: Math.round(markup * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
