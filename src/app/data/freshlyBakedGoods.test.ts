import { describe, expect, it } from 'vitest';
import goods from './freshlyBakedGoods.json';

describe('freshly baked goods data', () => {
  it('includes a GenAI goods entry', () => {
    expect(goods).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'GenAI Enablement',
          category: 'GenAI',
        }),
      ]),
    );
  });
});
