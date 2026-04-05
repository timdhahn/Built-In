import { AppState } from '@/store/store';
import { SpaceEnvelope } from '@/domain/model/project';
import { Bay } from '@/domain/model/bay';
import { Unit } from '@/domain/units/types';

export const CURRENT_SCHEMA_VERSION = 2;
const DEFAULT_FINISH_ID = 'white-melamine';

export interface SerializedProject {
  schemaVersion: number;
  envelope: SpaceEnvelope;
  bays: Bay[];
  displayUnit: Unit;
  projectName: string;
  finishId: string;
}

export function serialize(state: AppState): string {
  const data: SerializedProject = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    envelope: state.envelope,
    bays: state.bays,
    displayUnit: state.displayUnit,
    projectName: state.projectName,
    finishId: state.finishId,
  };
  return JSON.stringify(data);
}

export function deserialize(json: string): SerializedProject {
  const data = JSON.parse(json) as Partial<SerializedProject> & { schemaVersion?: number };
  return migrate(data);
}

function migrate(data: Partial<SerializedProject> & { schemaVersion?: number }): SerializedProject {
  if (data.schemaVersion === CURRENT_SCHEMA_VERSION && data.finishId) {
    return data as SerializedProject;
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    envelope: data.envelope as SpaceEnvelope,
    bays: data.bays as Bay[],
    displayUnit: data.displayUnit as Unit,
    projectName: data.projectName ?? 'Untitled Project',
    finishId: data.finishId ?? DEFAULT_FINISH_ID,
  };
}
