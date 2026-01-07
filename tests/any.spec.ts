import * as assert from 'assert';

import { any, regex, seq, str, surely } from '../src/parsers';
import { Context, isFailure } from '../src/types';
import { sanitize } from './sanitization';

describe('any', function() {
  describe('should match any parser', () => {
    it(`case: any(str('a'), str('b')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = any(str('a'), str('b'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index:1, path: '' });
    });

    it(`case: any(str('x')) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = any(str('x'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'x');
      assert.deepStrictEqual(result.ctx, { text: 'xasf', index: 1, path: '' });
    });

    it(`case: any(regex(${sanitize(/\d+/)}, 'r1'), regex(${sanitize(/[^x]+/)}, 'r2'), str('x')) -> 'x123abcdx'`, () => {
      // Arrange
      const ctx: Context = { text: 'x123abcdx', index: 0, path: '' };
      const parser = any(regex(/\d+/, 'r1'), regex(/[^x]+/, 'r2'), str('x'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'x');
      assert.deepStrictEqual(result.ctx, { text: 'x123abcdx', index: 1, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: any(str('b'), str('w')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = any(str('b'), str('w'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: any(str(' ')) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = any(str(' '));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: any(seq(str('x'), str('b')), seq(str('a'))) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = any(seq(str('x'), str('b')), seq(str('a')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: any(seq(str('a')), seq(str('x'), str('b'))) -> 'xasf'`, () => {
      // Arrange
      const ctx: Context = { text: 'xasf', index: 0, path: '' };
      const parser = any(seq(str('a')), seq(str('x'), str('b')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: any(regex(${sanitize(/\d+/)}, 'r1'), regex(${sanitize(/[^x]+/)}, 'r2'), str('a')) -> 'x123abcdx'`, () => {
      // Arrange
      const ctx: Context = { text: 'x123abcdx', index: 0, path: '' };
      const parser = any(regex(/\d+/, 'r1'), regex(/[^x]+/, 'r2'), str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });

    it(`case: any(surely(str('b')), str('a')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = any(surely(str('b')), str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepEqual(result.history, ['b']);
    });

    describe('with longest expected history', () => {
      it(`case: any(seq(str('b')), str('c')) -> 'abc'`, () => {
        // Arrange
        const ctx: Context = { text: 'abc', index: 0, path: '' };
        const parser = any(seq(str('b')), str('c'));

        // Act
        const result = parser(ctx);

        // Assert
        assert.ok(isFailure(result));
        assert.deepEqual(result.history, ['any', 'seq', 'b']);
      });
    });
  });
});