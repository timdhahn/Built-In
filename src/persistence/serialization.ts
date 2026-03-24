import { AppState } from '@/store/store';
import { SpaceEnvelope } from '@/domain/model/project';
import { Bay } from '@/domain/model/bay';
import { Unit } from '@/domain/units/types';

export const CURRENT_SCHEMA_VERSION = 1;

export interface SerializedProject {
  schemaVersion: number;
  envelope: SpaceEnvelope;
  bays: Bay[];
  displayUnit: Unit;
  projectName: string;
}

export function serialize(state: AppState): string {
  const data: SerializedProject = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    envelope: state.envelope,
    bays: state.bays,
    displayUnit: state.displayUnit,
    projectName: state.projectName,
  };
  return JSON.stringify(data);
}

export function deserialize(json: string): SerializedProject {
  const data = JSON.parse(json) as SerializedProject;
  return migrate(data);
}

function migrate(data: SerializedProject): SerializedProject {
  // Future migrations go here
  return data;
}
