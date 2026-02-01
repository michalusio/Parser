import * as assert from 'assert';

import { any, seq, str, surely, oneOrMany } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('oneOrMany', function() {
  describe('should match many parses', () => {
    it(`case: oneOrMany(str('a')) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = oneOrMany(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a']);
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: oneOrMany(str('a')) -> 'aaab'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaab', index: 0, path: '' };
      const parser = oneOrMany(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaab', index:3, path: '' });
    });

    it(`case: oneOrMany(str('a'), str(',')) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = oneOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a']);
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: oneOrMany(str('a'), str(',')) -> 'a,a,a,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a,b', index: 0, path: '' };
      const parser = oneOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a,b', index:5, path: '' });
    });
  });
  

  describe('should get no parses', () => {
    it(`case: oneOrMany(str('b')) -> 'abb'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = oneOrMany(str('b'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', "'b'"]);
    });

    it(`case: oneOrMany(str('b'), str(',')) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = oneOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', "'b'"]);
    });
  });

  describe('should fail when surely is there', () => {
    it(`case: oneOrMany(surely(str('b'))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = oneOrMany(surely(str('b')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', "'b'"]);
    });

    it(`case: oneOrMany(str('b'), surely(str(','))) -> 'bbbb'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbb', index: 0, path: '' };
      const parser = oneOrMany(str('b'), surely(str(',')));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbb', index:1, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', "','"]);
    });

    it(`case: oneOrMany(surely(str('b')), str(',')) -> 'c,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'c,b,b', index: 0, path: '' };
      const parser = oneOrMany(surely(str('b')), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'c,b,b', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', 'surely', "'b'"]);
    });

    it(`case: oneOrMany(any(str('b'), surely(surely(str('a'))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = oneOrMany(any(str('b'), surely(surely(str('a')))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', 'any', "'a'"]);
    });

    it(`case: oneOrMany(any(str('b'), surely(surely(str('a')))), str(',')) -> 'b,b,b,c'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,c', index: 0, path: '' };
      const parser = oneOrMany(any(str('b'), surely(surely(str('a')))), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,c', index:6, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', 'any', "'a'"]);
    });
  });

  describe('should fail when surely is there (inside)', () => {
    it(`case: oneOrMany(any(str('b'), seq(surely(surely(str('a')))))) -> 'bbbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbc', index: 0, path: '' };
      const parser = oneOrMany(any(str('b'), seq(surely(surely(str('a'))))));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbc', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', 'any', 'seq', "'a'"]);
    });

    it(`case: oneOrMany(any(str('b'), seq(surely(surely(str('a'))))), str(',')) -> 'b,b,b,c'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,c', index: 0, path: '' };
      const parser = oneOrMany(any(str('b'), seq(surely(surely(str('a'))))), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,c', index:6, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrMany', 'any', 'seq', "'a'"]);
    });
  });
});