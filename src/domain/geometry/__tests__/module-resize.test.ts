import { describe, expect, it } from 'vitest';
import { resizeModuleInBay } from '../placement';
import { mm } from '../../units/types';
import { moduleId, componentId } from '../../model';
import type { Module } from '../../model';

function makeModule(y: number, height: number): Module {
  return {
    id: moduleId(),
    type: 'single-hang',
    catalogId: 'single-hang',
    x: mm(0),
    y: mm(y),
    width: mm(600),
    height: mm(height),
    depth: mm(500),
    components: [
      {
        id: componentId(),
        name: 'panel',
        materialId: 'default',
        width: mm(600),
        height: mm(19),
        depth: mm(500),
        quantity: 1,
      },
    ],
    overrides: {},
  };
}

describe('resizeModuleInBay', () => {
  it('grows a module upward and pushes modules above it', () => {
    const bottom = makeModule(0, 300);
    const middle = makeModule(300, 300);
    const top = makeModule(600, 300);

    const result = resizeModuleInBay(
      [bottom, middle, top],
      middle.id,
      { height: mm(400) },
      mm(1200),
    );

    expect(result.map((mod) => mod.y)).toEqual([0, 300, 700]);
    expect(result[1].height).toBe(400);
  });

  it('shrinks a module from the bottom and lifts modules below it', () => {
    const bottom = makeModule(0, 300);
    const middle = makeModule(300, 300);
    const top = makeModule(600, 300);

    const result = resizeModuleInBay(
      [bottom, middle, top],
      middle.id,
      { y: mm(450), height: mm(150) },
      mm(1200),
    );

    expect(result.map((mod) => mod.y)).toEqual([150, 450, 600]);
    expect(result[1].height).toBe(150);
  });

  it('clamps upward growth when there is not enough headroom for modules above', () => {
    const bottom = makeModule(0, 300);
    const middle = makeModule(300, 300);
    const top = makeModule(600, 300);

    const result = resizeModuleInBay(
      [bottom, middle, top],
      middle.id,
      { height: mm(700) },
      mm(1200),
    );

    expect(result.map((mod) => mod.y)).toEqual([0, 300, 900]);
    expect(result[1].height).toBe(600);
  });

  it('clamps downward growth when there is not enough room below', () => {
    const bottom = makeModule(0, 300);
    const middle = makeModule(300, 300);
    const top = makeModule(600, 300);

    const result = resizeModuleInBay(
      [bottom, middle, top],
      middle.id,
      { y: mm(100), height: mm(500) },
      mm(1200),
    );

    expect(result.map((mod) => mod.y)).toEqual([0, 300, 600]);
    expect(result[1].height).toBe(300);
  });
});
