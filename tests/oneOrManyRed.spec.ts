import * as assert from 'assert';

import { any, str, surely, oneOrManyRed } from '../src/parsers';
import { Context, isFailure } from '../src/types';

describe('oneOrManyRed', function() {
  describe('should match many parses', () => {
    it(`case: oneOrManyRed(str('a'), str(','), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'a'`, () => {
      // Arrange
      const ctx: Context = { text: 'a', index: 0, path: '' };
      const parser = oneOrManyRed(str('a'), str(','), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a');
      assert.deepStrictEqual(result.ctx, { text: 'a', index:1, path: '' });
    });

    it(`case: oneOrManyRed(str('a'), str(','), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'a,a,a,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'a,a,a,b', index: 0, path: '' };
      const parser = oneOrManyRed(str('a'), str(','), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(!isFailure(result));

      assert.deepStrictEqual(result.value, 'a,a,a');
      assert.deepStrictEqual(result.ctx, { text: 'a,a,a,b', index:5, path: '' });
    });
  });
  

  describe('should get no parses', () => {
    it(`case: oneOrManyRed(str('b'), str(','), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'a,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'abb', index: 0, path: '' };
      const parser = oneOrManyRed(str('b'), str(','), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));

      assert.deepStrictEqual(result.ctx, { text: 'abb', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrManyRed', "'b'"]);
    });
  });

  describe('should fail when surely is there', () => {
    it(`case: oneOrManyRed(str('b'), surely(str(',')), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'bbbb'`, () => {
      // Arrange
      const ctx: Context = { text: 'bbbb', index: 0, path: '' };
      const parser = oneOrManyRed(str('b'), surely(str(',')), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'bbbb', index:1, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrManyRed', "','"]);
    });

    it(`case: oneOrManyRed(surely(str('b')), str(','), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'c,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'c,b,b', index: 0, path: '' };
      const parser = oneOrManyRed(surely(str('b')), str(','), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'c,b,b', index:0, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrManyRed', 'surely', "'b'"]);
    });

    it(`case: oneOrManyRed(any(str('b'), surely(surely(str('a')))), str(','), (l: string, r, s) => \`\${l}\${s}\${r}\`) -> 'b,b,b,c'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,c', index: 0, path: '' };
      const parser = oneOrManyRed(any(str('b'), surely(surely(str('a')))), str(','), (l: string, r, s) => `${l}${s}${r}`);

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,c', index:6, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrManyRed', 'any', "'a'"]);
    });
  });

  describe('should fail when reducer throws', () => {
    it(`case: oneOrManyRed(str('b'), surely(str(',')), (l: string, r, s) => {throw l;}) -> 'b,b,b,b'`, () => {
      // Arrange
      const ctx: Context = { text: 'b,b,b,b', index: 0, path: '' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parser = oneOrManyRed(str('b'), surely(str(',')), (l: string, r, s) => {throw l;});

      // Act
      const result = parser(ctx);

      // Assert
      assert.ok(isFailure(result));
      assert.deepStrictEqual(result.expected, 'Error while reducing');
      assert.deepStrictEqual(result.ctx, { text: 'b,b,b,b', index:3, path: '' });
      assert.deepStrictEqual(result.history, ['oneOrManyRed']);
    });
  });
});