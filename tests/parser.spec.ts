import * as assert from "assert";
import { ParseError, ParseText, seq, spacesPlus, str } from "../src";

describe('ParseText', () => {
    it('executes a valid parse', () => {
        const parser = seq(
            str('Lazy fox jumps'), spacesPlus, str('over'), spacesPlus, str('a lazy dog')
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = ParseText('Lazy fox jumps over a lazy dog', parser);
    });

    it('executes readme example', () => {
        const parser = seq(
            str('Lazy fox jumps'), spacesPlus, str('over'), spacesPlus, str('a lazy dog')
        );

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = ParseText('Lazy fox jumps under a lazy dog', parser);
            assert.fail('Parsing should have failed');
        } catch (e) {
            if (!(e instanceof ParseError)) {
                assert.fail('Error should have been a ParseError');
            }
            assert.deepStrictEqual(e.history, ['seq', "'over'"]);
            assert.equal(e.getPrettyErrorMessage(), 'Parse error, expected \'over\' at char 15 (line 1, col 16):\nLazy fox jumps under a lazy dog\n---------------^');
        }
    });

    it('fails when parser does not reach end of text', () => {
        const parser = seq(
            str('Lazy fox jumps'), spacesPlus, str('over'), spacesPlus, str('a lazy dog')
        );

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = ParseText('Lazy fox jumps over a lazy dog or something', parser);
            assert.fail('Parsing should have failed');
        } catch (e) {
            if (!(e instanceof ParseError)) {
                assert.fail('Error should have been a ParseError');
            }
            assert.deepStrictEqual(e.history, []);
            assert.equal(e.getPrettyErrorMessage(), 'Parse error, expected end of text at char 30 (line 1, col 31):\nLazy fox jumps over a lazy dog or something\n------------------------------^');
        }
    });
});
