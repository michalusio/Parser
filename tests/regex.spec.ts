import 'mocha';

import * as assert from 'assert';

import { regex } from '../src/parsers';
import { Context, isFailure } from '../src/types';
import { sanitize } from './sanitization';

describe('regex', function() {
  describe('should match', () => {
    const testCases = [
      { rgx: /\w+/, from: 'test string', to: 'test' },
      { rgx: /\w+/, from: 'rgavon_gtenqig 123', to: 'rgavon_gtenqig' },
      { rgx: /\s*?data: .+?\s+/, from: '  \n data: something data2  \t ', to: '  \n data: something ' },
      { rgx: 'data', from: 'data test', to: 'data' }
    ];
    testCases.forEach(({ rgx, from, to }) => {
      it(`case: ${sanitize(rgx)}: '${sanitize(from)}' -> '${sanitize(to)}'`, () => {
        // Arrange
        const context: Context = { text: from, index: 0, path: '' };
        const parser = regex(rgx, 'regex');

        // Act
        const result = parser(context);

        // Assert
        assert.ok(!isFailure(result));

        assert.strictEqual(result.value, to);
        assert.deepStrictEqual(result.ctx, { text: from, index: to.length, path: '' });
      });
    });
  });

  describe('should fail', () => {
    const testCases = [
      { rgx: /12345/, from: 'test string' },
      { rgx: /\D+/, from: '12345' },
      { rgx: /\s*?data: .+?\s+/, from: '  \n data2: data  \t ' },
      { rgx: 'data', from: 'datu test' }
    ];
    testCases.forEach(({ rgx, from }) => {
      it(`case: ${sanitize(rgx)}: '${sanitize(from)}'`, () => {
        // Arrange
        const context: Context = { text: from, index: 0, path: '' };
        const parser = regex(rgx, 'regex');

        // Act
        const result = parser(context);

        // Assert
        assert.ok(isFailure(result));
      });
    });
  });
});