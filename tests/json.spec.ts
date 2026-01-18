import { any, between, lazy, regex, seq, str, surely, zeroOrMany } from '../src/parsers';
import { ParseError, Parser } from '../src/types';
import { ParseText } from '../src/parser';
import { json_sample1kne } from './samples/1K_json_no_escaping';
import { json_sample1k } from './samples/1K_json';
import { json_sample1k_failing } from './samples/1K_json_failing';
import { json_sample10k } from './samples/10K_json';
import { mochaLog } from './logging.spec';
import * as assert from 'assert';
import { sanitize } from './sanitization';

const WhiteSpace = regex(/\s*/m, 'whitespace');

const True = str("true");
const False = str("false");
const Null = str("null");
const LCurly = str("{");
const RCurly = surely(str("}"));
const LSquare = str("[");
const RSquare = surely(str("]"));
const Comma = str(",");
const Colon = surely(str(":"));

const StringLiteral = regex(/"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/, 'string literal');
const NumberLiteral = regex(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number literal');

const JArray: Parser<unknown> = lazy(() => seq(
    LSquare,
    surely(
        seq(
            WhiteSpace,
            zeroOrMany(Value, seq(WhiteSpace, Comma, WhiteSpace)),
            WhiteSpace,
            RSquare
        )
    )
));

const JObject: Parser<unknown> = lazy(() => seq(
    LCurly,
    surely(
        seq(
            WhiteSpace,
            zeroOrMany(ObjectEntry, seq(WhiteSpace, Comma, WhiteSpace)),
            WhiteSpace,
            RCurly
        )
    )
));

const Value = any(
    StringLiteral,
    NumberLiteral,
    JObject,
    JArray,
    True,
    False,
    Null,
);

const ObjectEntry = seq(StringLiteral, surely(seq(WhiteSpace, Colon, WhiteSpace, Value)));

const json = between(WhiteSpace, Value, WhiteSpace);

xdescribe('json benchmark', function() {
    this.timeout(5000);
    this.slow(2000);

    it('is parsed (1K file no escaping)', function() {
        for (let index = 0; index < 10; index++) {
            ParseText(json_sample1kne, json);
        }
        const start = performance.now();
        for (let index = 0; index < 500; index++) {
            ParseText(json_sample1kne, json);
        }
        const delta = performance.now() - start;
        const deltaSeconds = delta/1000;
        mochaLog('Speed:', (500/deltaSeconds).toFixed(1), 'per second');
    });
    it('is parsed (1K file)', function() {
        for (let index = 0; index < 10; index++) {
            ParseText(json_sample1k, json);
        }
        const start = performance.now();
        for (let index = 0; index < 500; index++) {
            ParseText(json_sample1k, json);
        }
        const delta = performance.now() - start;
        const deltaSeconds = delta/1000;
        mochaLog('Speed:', (500/deltaSeconds).toFixed(1), 'per second');
    });
    it('is parsed (10K file)', function() {
        for (let index = 0; index < 10; index++) {
            ParseText(json_sample10k, json);
        }
        const start = performance.now();
        for (let index = 0; index < 100; index++) {
            ParseText(json_sample10k, json);
        }
        const delta = performance.now() - start;
        const deltaSeconds = delta/1000;
        mochaLog('Speed:', (100/deltaSeconds).toFixed(1), 'per second');
    });
});

describe('json', function() {
    it('is parsed ([])', function() {
        try{
            ParseText('[]', json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed ({ "prop": 12 })', function() {
        try{
            ParseText('{ "prop": 12 }', json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it(`is parsed (${sanitize('[\n            {\n                "prop": 12\n            }\n                ]')})`, function() {
        try{
            ParseText(`[
            {
                "prop": 12    
            }
                ]`, json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed ([{}])', function() {
        try{
            ParseText('[{}]', json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (1K file no escaping)', function() {
        try{
            ParseText(json_sample1kne, json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (1K file)', function() {
        try{
            ParseText(json_sample1k, json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (10K file)', function() {
        try{
            ParseText(json_sample10k, json);
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });

    it('fails parsing (1K file failing)', function() {
        try {
            ParseText(json_sample1k_failing, json);
            assert.fail('should have failed parsing');
        } catch (e) {
            if (e instanceof ParseError) {
                assert.equal(e.getPrettyErrorMessage(), 'Parse error, expected \'}\' at char 8171 (line 245, col 5):\n    "longitude": 90.165296,\r\n----^');
            } else assert.fail('should have been a ParseError');
        }
    });
});
