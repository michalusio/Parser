import 'mocha';

import * as assert from 'assert';
import { Context, isFailure } from '../src/types';
import { opt, str } from '../src';

describe('opt', function() {
  it('should parse', () => {
    // Arrange
    const context: Context = { text: 'some text', index: 0, path: '' };

    // Act
    const result = opt(str('other text'))(context);

    // Assert
    assert.ok(!isFailure(result));

    assert.strictEqual(result.value, null);
    assert.deepStrictEqual(result.ctx, context);
  });

  it('should have marker', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepEqual((opt(str('')) as any).parserType, 'opt');
  });
});