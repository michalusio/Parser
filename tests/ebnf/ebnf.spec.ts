import * as assert from 'assert';
import { readFileSync } from 'fs';

import { Context, grammar, isFailure } from '../../src';

describe('EBNF', function() {
    it(`should parse a simple grammar`, () => {
        // Arrange
        const text = readFileSync('tests/ebnf/ebnf.ebnf', { encoding: 'utf-8' });
        const ctx: Context = { text, index: 0, path: '' };

        // Act
        const result = grammar(ctx);

        // Assert
        assert.ok(!isFailure(result));
        assert.equal(result.ctx.index, text.length);
    });

    it(`should parse a complicated grammar`, () => {
        // Arrange
        const text = readFileSync('tests/ebnf/ebnf2.ebnf', { encoding: 'utf-8' });
        const ctx: Context = { text, index: 0, path: '' };

        // Act
        const result = grammar(ctx);

        // Assert
        assert.ok(!isFailure(result));
        assert.equal(result.ctx.index, text.length);
    });
});