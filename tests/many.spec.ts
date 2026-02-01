import * as assert from 'assert';

import { any, many, seq, str, surely } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('many', function() {
  describe('should match many parses', () => {
    it(`case: many(str('a')) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = many(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a']);
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: many(str('a')) -> 'aaab'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaab', index: 0, path: '' };
      const parser = many(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaab', index:3, path: '' });
    });
  });

  describe('should get no parses', () => {
    it(`case: many(str('b')) -> 'abb'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = many(str('b'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, []);
      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
    });
  });

  describe('should fail when surely is there', () => {
    it(`case: many(any(str('b'), surely(surely(str('a'))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = many(any(str('b'), surely(surely(str('a')))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['many', 'any', "'a'"]);
    });
  });

  describe('should fail when surely is there (inside)', () => {
    it(`case: many(any(str('b'), seq(surely(surely(str('a')))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = many(any(str('b'), seq(surely(surely(str('a'))))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['many', 'any', 'seq', "'a'"]);
    });
  });
});
