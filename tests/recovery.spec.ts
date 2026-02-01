import * as assert from "assert";

import { recoverByAddingChars, recoverBySkippingChars, str } from "../src/parsers";
import { Context, isFailure } from "../src/types";

describe('recoverBySkippingChars', function() {
  describe('should pass without removing characters', () => {
    it(`case: recoverBySkippingChars(str('a'), 3) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = recoverBySkippingChars(str('a'), 3);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });
  describe('should pass with removing characters', () => {
    it(`case: recoverBySkippingChars(str('a'), 3) -> 'bcabc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcabc', index: 0, path: '' };
      const parser = recoverBySkippingChars(str('a'), 3);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));
      
      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'bcabc', index: 3, path: '' });
    });
    it(`case: recoverBySkippingChars(str('a'), 3) -> 'bcbaca'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcbaca', index: 0, path: '' };
      const parser = recoverBySkippingChars(str('a'), 3);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));
      
      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'bcbaca', index: 4, path: '' });
    });
  });

  describe('should fail when not enough characters removed', () => {
    it(`case: recoverBySkippingChars(str('a'), 1) -> 'bcabc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcabc', index: 0, path: '' };
      const parser = recoverBySkippingChars(str('a'), 1);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });

  describe('should fail when all characters removed', () => {
    it(`case: recoverBySkippingChars(str('a'), 9) -> 'bcbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcbc', index: 0, path: '' };
      const parser = recoverBySkippingChars(str('a'), 9);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});

describe('recoverByAddingChars', function() {
  describe('should pass without adding characters', () => {
    it(`case: recoverByAddingChars(str('a'), 'a') -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = recoverByAddingChars(str('a'), 'a');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });
  describe('should pass with adding characters', () => {
    it(`case: recoverByAddingChars(str('a'), 'a') -> 'bcbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcbc', index: 0, path: '' };
      const parser = recoverByAddingChars(str('a'), 'a');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));
      
      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abcbc', index: 1, path: '' });
    });
  });

  describe('should fail when not enough characters added', () => {
    it(`case: recoverByAddingChars(str('abcde'), 'abc') -> 'eee'`, () => {
      // Arrange
      const ctx: Context = { text: 'eee', index: 0, path: '' };
      const parser = recoverByAddingChars(str('abcde'), 'abc');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });

  describe('should fail when all characters added', () => {
    it(`case: recoverByAddingChars(str('abc'), 'cba') -> 'bcbc'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcbc', index: 0, path: '' };
      const parser = recoverByAddingChars(str('abc'), 'cba');

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});