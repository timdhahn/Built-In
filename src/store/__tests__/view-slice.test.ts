import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../store';

describe('view slice', () => {
  beforeEach(() => {
    useAppStore.setState({ finishId: 'white-melamine', effectiveRenderer: 'webgl' });
  });

  it('setFinish updates global finish selection', () => {
    useAppStore.getState().setFinish('walnut');
    expect(useAppStore.getState().finishId).toBe('walnut');
  });
});
