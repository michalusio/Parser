import * as assert from 'assert';

import { map, str } from '../src/parsers/index';
import { Context, isFailure } from '../src/types';

describe('map', function() {
  describe('should pass the parser result', () => {
    it(`case: map(str('a'), a => a) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = map(str('a'), a => a);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });

  describe('should map the parser result', () => {
    it(`case: map(str('a'), () => 5) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = map(str('a'), () => 5);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 5);
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 1, path: '' });
    });
  });

  describe('should pass the parser fail', () => {
    it(`case: map(str('a'), a => a) -> 'bcd'`, () => {
      // Arrange
      const ctx: Context = { text: 'bcd', index: 0, path: '' };
      const parser = map(str('a'), a => a);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });

  describe('should fail on invalid map', () => {
    it(`case: map(str('a'), () => { throw 0; }) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = map(str('a'), () => { throw 0; });

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});