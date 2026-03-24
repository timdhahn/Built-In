export interface PricingConfig {
  markupPercent: number;
  laborCostPerModule: number;
  hardwareFixedCosts: Record<string, number>;
}

export const DEFAULT_PRICING: PricingConfig = {
  markupPercent: 30,
  laborCostPerModule: 25,
  hardwareFixedCosts: {
    'chrome-rod': 8.5,
    'steel-bracket': 2.0,
    'drawer-slide': 12.0,
  },
};
