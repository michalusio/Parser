import * as assert from 'assert';

import { expect, expectErase, ref, str } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('expect', function() {
  describe('should pass the parser result', () => {
    it(`case: expect(str('a'), 'a letter') -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = expect(str('a'), 'a letter');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });

  describe('should pass the parser fail and add the expected history', () => {
    it(`case: expect(str('a'), 'a letter') -> 'bcd'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcd', index: 0, path: '' };
      const parser = expect(str('a'), 'a letter');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.history, ['a letter', 'a']);
    });
  });
});

describe('expectErase', function() {
  describe('should pass the parser result', () => {
    it(`case: expectErase(expect(str('a'), 'a letter'), 'x letter') -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = expectErase(expect(str('a'), 'a letter'), 'x letter');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });

  describe('should pass the parser fail and not add the alternative expected value', () => {
    it(`case: expectErase(expect(str('a'), 'a letter'), 'x letter') -> 'bcd'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcd', index: 0, path: '' };
      const parser = expectErase(expect(str('a'), 'a letter'), 'x letter');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.history, ['x letter']);
    });
  });
});

describe('ref', function() {
  describe('should pass the parser result', () => {
    it(`case: ref(str('a'), () => true, 'ref') -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = ref(str('a'), () => true, 'ref');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });

  describe('should pass the parser fail', () => {
    it(`case: ref(str('a'), () => true, 'ref') -> 'bcd'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcd', index: 0, path: '' };
      const parser = ref(str('a'), () => true, 'ref');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.history, [ 'a' ]);
    });
  });

  describe('should fail on check', () => {
    it(`case: ref(str('a'), () => false) -> 'acd'`, () => {
      // Arrange
      const ctx: Context = { text: 'acd', index: 0, path: '' };
      const parser = ref(str('a'), () => false);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.history, ['ref: check']);
    });

    it(`case: ref(str('a'), () => false, 'ref') -> 'acd'`, () => {
      // Arrange
      const ctx: Context = { text: 'acd', index: 0, path: '' };
      const parser = ref(str('a'), () => false, 'ref');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.history, ['ref: ref']);
    });
  });
});