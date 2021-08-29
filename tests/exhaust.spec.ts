import * as assert from 'assert';

import { exhaust, str } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('exhaust', function() {
  describe('should exhaust a sequence', () => {
    it(`case: exhaust(str('a')) -> 'aaaaaa'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaaaaa', index: 0, path: '' };
      const parser = exhaust(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a', 'a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaaaaa', index: 6, path: '' });
    });
  });

  describe('should exhaust a sequence with an until', () => {
    it(`case: exhaust(str('a'), str('()')) -> 'aaaaaa()aa'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaaaaa()aa', index: 0, path: '' };
      const parser = exhaust(str('a'), str('()'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a', 'a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaaaaa()aa', index: 6, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: exhaust(str('a')) -> 'aaac'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaac', index: 0, path: '' };
      const parser = exhaust(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});