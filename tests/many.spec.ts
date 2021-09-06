import * as assert from 'assert';

import { any, many, oneOrMany, oneOrManyRed, str, zeroOrMany } from '../src/parsers';
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
});

describe('zeroOrMany', function() {
  describe('should match zero or more parses', () => {
    it(`case: zeroOrMany(str('a'), str(',')) -> 'a,a,a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a', index: 0, path: '' };
      const parser = zeroOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a', index: 5, path: '' });
    });
  });

  describe('should get no parses', () => {
    it(`case: zeroOrMany(str('b'), str(',')) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,b,b', index: 0, path: '' };
      const parser = zeroOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, []);
      assert.deepStrictEqual(result.ctx, { text: 'a,b,b', index:0, path: '' });
    });
  });
});

describe('oneOrMany', function() {
  describe('should match one or more parses', () => {
    it(`case: oneOrMany(str('a')) -> 'aaa'`, () => {
      // Arrange
      const ctx: Context = { text: 'aaa', index: 0, path: '' };
      const parser = oneOrMany(str('a'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'aaa', index: 3, path: '' });
    });

    it(`case: oneOrMany(str('a'), str(',')) -> 'a,a,a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a', index: 0, path: '' };
      const parser = oneOrMany(str('a'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['a', 'a', 'a']);
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a', index: 5, path: '' });
    });

    it(`case: oneOrMany(str('b'), str(',')) -> 'b,a,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,a,b', index: 0, path: '' };
      const parser = oneOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['b']);
      assert.deepStrictEqual(result.ctx, { text: 'b,a,b', index:1, path: '' });
    });

    it(`case: oneOrMany(str('b'), str(',')) -> 'b,b,a'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,a', index: 0, path: '' };
      const parser = oneOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, ['b', 'b']);
      assert.deepStrictEqual(result.ctx, { text: 'b,b,a', index:3, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: oneOrMany(str('b'), str(',')) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,b,b', index: 0, path: '' };
      const parser = oneOrMany(str('b'), str(','));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});

describe('oneOrManyRed', function() {
  describe('should match one or more parses and then reduce', () => {
    it(`case: oneOrManyRed(str('a'), str(','), (a, b) => a + b) -> 'a,a,a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a', index: 0, path: '' };
      const parser = oneOrManyRed<'a', ',', string>(str('a'), str(','), (a, b) => a + b);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'aaa');
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a', index: 5, path: '' });
    });

    it(`case: oneOrManyRed(any(str('b'), str('a')), str(','), (a, b) => (Number.isInteger(a) ? a : 1) + (Number.isInteger(b) ? b : 1)) -> 'b,a,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,a,b', index: 0, path: '' };
      const parser = oneOrManyRed<'a' | 'b', ',', number>(any(str('b'), str('a')), str(','), (a, b) => (typeof a === 'number' ? a : 1) + (typeof b === 'number' ? b : 1));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 3);
      assert.deepStrictEqual(result.ctx, { text: 'b,a,b', index:5, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: oneOrManyRed(any(str('b'), str('a')), str(','), (a, b) => (Number.isInteger(a) ? a : 1) + (Number.isInteger(b) ? b : 1)) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'c,b,b', index: 0, path: '' };
      const parser = oneOrManyRed<'a' | 'b', ',', number>(any(str('b'), str('a')), str(','), (a, b) => (typeof a === 'number' ? a : 1) + (typeof b === 'number' ? b : 1));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});