import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SpaceConfigPanel } from '../SpaceConfigPanel';
import { useAppStore } from '@/store';

describe('SpaceConfigPanel', () => {
  beforeEach(() => {
    useAppStore.setState({ finishId: 'white-melamine' });
  });

  it('updates finish selection in app state', () => {
    render(<SpaceConfigPanel />);

    fireEvent.change(screen.getByLabelText('Closet finish'), {
      target: { value: 'oak' },
    });

    expect(useAppStore.getState().finishId).toBe('oak');
  });
});
