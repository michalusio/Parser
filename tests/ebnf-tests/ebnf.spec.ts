import * as assert from 'assert';
import { readFileSync } from 'fs';

import { Context, EBNFParser, grammarToParser, isFailure } from '../../src';

describe('EBNF', function() {
    it(`should parse a simple grammar`, () => {
        // Arrange
        const text = readFileSync('tests/ebnf-tests/ebnf.ebnf', { encoding: 'utf-8' });
        const ctx: Context = { text, index: 0, path: '' };

        // Act
        const result = EBNFParser(ctx);

        // Assert
        assert.ok(!isFailure(result));
        assert.equal(result.ctx.index, text.length);
    });

    it(`should parse a complicated grammar`, () => {
        // Arrange
        const text = readFileSync('tests/ebnf-tests/ebnf2.ebnf', { encoding: 'utf-8' });
        const ctx: Context = { text, index: 0, path: '' };

        // Act
        const result = EBNFParser(ctx);

        // Assert
        assert.ok(!isFailure(result));
        assert.equal(result.ctx.index, text.length);
    });

    it(`should parse using a generated parser`, () => {
        // Arrange
        const grammarText = readFileSync('tests/ebnf-tests/super-simple.ebnf', { encoding: 'utf-8' });

        // Act
        const result = EBNFParser({ text: grammarText, index: 0, path: '' });

        // Assert
        assert.ok(!isFailure(result));
        assert.equal(result.ctx.index, grammarText.length);

        const generatedParser = grammarToParser(result.value, {
            kind: 'identifier',
            name: 'start'
        });

        const testText = readFileSync('tests/ebnf-tests/super-simple-test.txt', { encoding: 'utf-8' });

        const generatedResult = generatedParser({ text: testText, index: 0, path: '' });

        // Assert
        if (isFailure(generatedResult)) {
            console.log(generatedResult.ctx.index);
            console.log(generatedResult.history);
        }
        assert.ok(!isFailure(generatedResult));
        console.dir(generatedResult.value, { depth: null });
        assert.equal(generatedResult.ctx.index, testText.length);
    });
});