import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION, deserialize } from '../serialization';

describe('serialization migration', () => {
  it('assigns default finishId for schema v1 payloads', () => {
    const legacy = JSON.stringify({
      schemaVersion: 1,
      envelope: {
        width: 1830,
        height: 2440,
        depth: 610,
        wallType: 'reach-in',
      },
      bays: [],
      displayUnit: 'in',
      projectName: 'Legacy Project',
    });

    const migrated = deserialize(legacy);

    expect(migrated.finishId).toBe('white-melamine');
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });
});
