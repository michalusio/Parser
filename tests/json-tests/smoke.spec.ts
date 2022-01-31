import * as assert from 'assert';
import { JSONParser } from '../../src';

import { Context, isFailure } from '../../src/types';
import { json_sample1k, json_sample_huge } from './smoke-data';

describe('JSON', function() {
    it(`should parse a 1K file`, () => {
        // Arrange
        const ctx: Context = { text: json_sample1k, index: 0, path: '' };

        // Act
        const result = JSONParser(ctx);

        // Assert
        assert.ok(!isFailure(result));
        assert.strictEqual(JSON.stringify(result.value, null, 2), json_sample1k.replace(/\r/g, ''));
    });

    it(`should parse a huge file`, () => {
        // Arrange
        const ctx: Context = { text: json_sample_huge, index: 0, path: '' };

        // Act
        const result = JSONParser(ctx);

        // Assert
        assert.ok(!isFailure(result));
    }).timeout(25000);
});