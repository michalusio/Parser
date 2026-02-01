import * as assert from 'assert';

import { any, seq, str, surely, zeroOrMany } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('zeroOrMany', function() {
  describe('should match many parses', () => {
    it(`case: zeroOrMany(str('a')) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = zeroOrMany(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a']);
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: zeroOrMany(str('a')) -> 'aaab'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaab', index: 0, path: '' };
      const parser = zeroOrMany(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaab', index:3, path: '' });
    });

    it(`case: zeroOrMany(str('a'), str(',')) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = zeroOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a']);
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: zeroOrMany(str('a'), str(',')) -> 'a,a,a,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a,b', index: 0, path: '' };
      const parser = zeroOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a,b', index:5, path: '' });
    });
  });
  

  describe('should get no parses', () => {
    it(`case: zeroOrMany(str('b')) -> 'abb'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = zeroOrMany(str('b'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, []);
      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
    });

    it(`case: zeroOrMany(str('b'), str(',')) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = zeroOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, []);
      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
    });
  });

  describe('should fail when surely is there', () => {
    it(`case: zeroOrMany(surely(str('b'))) -> 'cbbb'`, () => {
      // Arrange
      const ctx: Context = { text: 'cbbb', index: 0, path: '' };
      const parser = zeroOrMany(surely(str('b')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'cbbb', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', "'b'"]);
    });

    it(`case: zeroOrMany(surely(str('b'))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = zeroOrMany(surely(str('b')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', "'b'"]);
    });

    it(`case: zeroOrMany(str('b'), surely(str(','))) -> 'bbbb'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbb', index: 0, path: '' };
      const parser = zeroOrMany(str('b'), surely(str(',')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbb', index:1, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', "','"]);
    });

    it(`case: zeroOrMany(surely(str('b')), str(',')) -> 'c,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'c,b,b', index: 0, path: '' };
      const parser = zeroOrMany(surely(str('b')), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'c,b,b', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', "'b'"]);
    });

    it(`case: zeroOrMany(any(str('b'), surely(surely(str('a'))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = zeroOrMany(any(str('b'), surely(surely(str('a')))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', 'any', "'a'"]);
    });

    it(`case: zeroOrMany(any(str('b'), surely(surely(str('a')))), str(',')) -> 'b,b,b,c'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,c', index: 0, path: '' };
      const parser = zeroOrMany(any(str('b'), surely(surely(str('a')))), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,c', index:6, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', 'any', "'a'"]);
    });
  });

  describe('should fail when surely is there (inside)', () => {
    it(`case: zeroOrMany(any(str('b'), seq(surely(surely(str('a')))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = zeroOrMany(any(str('b'), seq(surely(surely(str('a'))))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', 'any', 'seq', "'a'"]);
    });

    it(`case: zeroOrMany(any(str('b'), seq(surely(surely(str('a'))))), str(',')) -> 'b,b,b,c'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,c', index: 0, path: '' };
      const parser = zeroOrMany(any(str('b'), seq(surely(surely(str('a'))))), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,c', index:6, path: '' });
      assert.deepStrictEqual(result.history, ['zeroOrMany', 'any', 'seq', "'a'"]);
    });
  });
});