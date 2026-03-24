import { Bay } from '@/domain/model';
import { generateBom } from './bom-csv';
import { calculateCost, CostSummary } from '@/domain/cost';

export function generateCostReport(bays: Bay[]): CostSummary {
  const bom = generateBom(bays);
  return calculateCost(bom);
}
