import { StateCreator } from 'zustand';
import { ValidationIssue } from '@/domain/validation/types';

export interface ValidationSlice {
  validationIssues: ValidationIssue[];
  setValidationIssues: (issues: ValidationIssue[]) => void;
}

export const createValidationSlice: StateCreator<ValidationSlice, [['zustand/immer', never]], [], ValidationSlice> = (set) => ({
  validationIssues: [],

  setValidationIssues: (issues) =>
    set((state) => {
      state.validationIssues = issues;
    }),
});
