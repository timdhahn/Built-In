import { nanoid } from 'nanoid';

export type ProjectId = string & { readonly __brand: 'ProjectId' };
export type BayId = string & { readonly __brand: 'BayId' };
export type ModuleId = string & { readonly __brand: 'ModuleId' };
export type ComponentId = string & { readonly __brand: 'ComponentId' };

export function projectId(): ProjectId {
  return nanoid() as ProjectId;
}

export function bayId(): BayId {
  return nanoid() as BayId;
}

export function moduleId(): ModuleId {
  return nanoid() as ModuleId;
}

export function componentId(): ComponentId {
  return nanoid() as ComponentId;
}
