import * as assert from 'assert';

import { between, str } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('between', function() {
  describe('should match a sequence', () => {
    it(`case: between(str('a'), str('b'), str('c')) -> 'abc'`, () => {
      // Arrange
      const ctx: Context = { text: 'abc', index: 0, path: '' };
      const parser = between(str('a'), str('b'), str('c'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'b');
      assert.deepStrictEqual(result.ctx, { text: 'abc', index: 3, path: '' });
    });
  });

  describe('should fail', () => {
    it(`case: between(str('a'), str('b'), str('c')) -> 'abd'`, () => {
      // Arrange
      const ctx: Context = { text: 'abd', index: 0, path: '' };
      const parser = between(str('a'), str('b'), str('c'));

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
    });
  });
});