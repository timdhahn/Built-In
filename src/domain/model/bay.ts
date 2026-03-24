import { Mm } from '../units/types';
import { BayId } from './ids';
import { Module } from './module';

export interface Bay {
  id: BayId;
  width: Mm;
  modules: Module[];
}
