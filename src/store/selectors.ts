import { AppState } from './store';
import { Bay, Module, BayId, ModuleId } from '@/domain/model';
import { ValidationIssue } from '@/domain/validation/types';

export const selectEnvelope = (state: AppState) => state.envelope;
export const selectBays = (state: AppState) => state.bays;
export const selectDisplayUnit = (state: AppState) => state.displayUnit;
export const selectViewMode = (state: AppState) => state.viewMode;
export const selectSelectedBayId = (state: AppState) => state.selectedBayId;
export const selectSelectedModuleId = (state: AppState) => state.selectedModuleId;
export const selectValidationIssues = (state: AppState) => state.validationIssues;

export const selectBayById = (id: BayId) => (state: AppState): Bay | undefined =>
  state.bays.find((b) => b.id === id);

export const selectModuleById = (id: ModuleId) => (state: AppState): Module | undefined => {
  for (const bay of state.bays) {
    const mod = bay.modules.find((m) => m.id === id);
    if (mod) return mod;
  }
  return undefined;
};

export const selectIssuesForEntity = (entityId: string) => (state: AppState): ValidationIssue[] =>
  state.validationIssues.filter((i) => i.entityId === entityId);

export const selectErrorCount = (state: AppState): number =>
  state.validationIssues.filter((i) => i.severity === 'error').length;

export const selectWarningCount = (state: AppState): number =>
  state.validationIssues.filter((i) => i.severity === 'warning').length;
