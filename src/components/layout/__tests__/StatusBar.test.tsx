import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '../StatusBar';
import { useAppStore } from '@/store';

describe('StatusBar', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: '3d',
      effectiveRenderer: 'webgpu',
      finishId: 'oak',
    });
  });

  it('shows active renderer backend in 3d mode', () => {
    render(<StatusBar />);
    expect(screen.getByText('renderer: webgpu')).toBeInTheDocument();
  });
});
