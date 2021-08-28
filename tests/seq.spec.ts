import * as assert from 'assert';

import { regex, seq, str } from '../src/parsers';
import { Context, isFailure } from '../src/types';
import { sanitize } from './sanitization';

describe('seq', function() {
  describe('should match a sequence', () => {
    it(`case: seq(str('a'), str('b')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = seq(str('a'), str('b'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'b']);
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 2, path: '' });
    });

    it(`case: seq(str('x')) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = seq(str('x'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['x']);
      assert.deepStrictEqual(result.ctx, { text: 'xasf', index: 1, path: '' });
    });

    it(`case: seq(str('x'), regex(${sanitize(/\d+/)}, 'r1'), regex(${sanitize(/[^x]+/)}, 'r2'), str('x')) -> 'x123abcdx'`, () => {
      // Arrange
      const ctx: Context = { text: 'x123abcdx', index: 0, path: '' };
      const parser = seq(str('x'), regex(/\d+/, 'r1'), regex(/[^x]+/, 'r2'), str('x'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['x', '123', 'abcd', 'x']);
      assert.deepStrictEqual(result.ctx, { text: 'x123abcdx', index: 'x123abcdx'.length, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: seq(str('a'), str('w')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = seq(str('a'), str('w'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: seq(str(' ')) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = seq(str(' '));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: seq(str('x'), regex(${sanitize(/\d+/)}, 'r1'), regex(${sanitize(/\w+/)}, 'r2'), str('x')) -> 'x123abcdx'`, () => {
      // Arrange
      const ctx: Context = { text: 'x123abcdx', index: 0, path: '' };
      const parser = seq(str('x'), regex(/\d+/, 'r1'), regex(/\w+/, 'r2'), str('x'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});