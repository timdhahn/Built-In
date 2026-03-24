import { ValidationRule } from '../types';
import { envelopeWidthRule, moduleDepthRule } from './envelope-rules';
import { moduleFitWidthRule, moduleFitHeightRule } from './fit-rules';
import { moduleCollisionRule } from './collision-rules';
import { shelfSpanRule } from './structural-rules';

export const allRules: ValidationRule[] = [
  envelopeWidthRule,
  moduleDepthRule,
  moduleFitWidthRule,
  moduleFitHeightRule,
  moduleCollisionRule,
  shelfSpanRule,
];
