import { any, between, regex, seq, str, wspaces, zeroOrMany } from '../src/parsers';
import { Context, Result } from '../src/types';
import { ParseText } from '../src/parser';
import { json_sample1kne } from './samples/1K_json_no_escaping';
import { json_sample1k } from './samples/1K_json';
import { json_sample10k } from './samples/10K_json';
import { mochaLog } from './logging.spec';

const True = str("true");
const False = str("false");
const Null = str("null");
const LCurly = str("{");
const RCurly = str("}");
const LSquare = str("[");
const RSquare = str("]");
const Comma = between(wspaces, str(","), wspaces);
const Colon = str(":");

const StringLiteral = regex(/"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/, 'string literal');
const NumberLiteral = regex(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number literal');

const Value = any(
    True,
    False,
    Null,
    StringLiteral,
    NumberLiteral,
    JObject(),
    JArray()
);

const ObjectEntry = seq(StringLiteral, wspaces, Colon, wspaces, Value);

function JArray() {
    return (ctx: Context): Result<unknown[]> => seq(
        LSquare,
        wspaces,
        zeroOrMany(Value, Comma),
        wspaces,
        RSquare
    )(ctx);
};

function JObject() {
    return (ctx: Context): Result<unknown[]> => seq(
        LCurly,
        wspaces,
        zeroOrMany(ObjectEntry, Comma),
        wspaces,
        RCurly
    )(ctx);
}

const json = between(wspaces, any(JObject(), JArray()), wspaces);

xdescribe('json', function() {
    this.timeout(5000);
    this.slow(2000);

    it('is parsed (1K file no escaping)', function() {
        const start = performance.now();
        for (let index = 0; index < 500; index++) {
            ParseText(json_sample1kne, json);
        }
        const delta = performance.now() - start;
        const deltaSeconds = delta/1000;
        mochaLog('Speed:', (500/deltaSeconds).toFixed(1), 'per second');
    });
    it('is parsed (1K file)', function() {
        const start = performance.now();
        for (let index = 0; index < 500; index++) {
            ParseText(json_sample1k, json);
        }
        const delta = performance.now() - start;
        const deltaSeconds = delta/1000;
        mochaLog('Speed:', (500/deltaSeconds).toFixed(1), 'per second');
    });
    it('is parsed (10K file)', function() {
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
    it('is parsed (1K file no escaping)', function() {
        ParseText(json_sample1kne, json);
    });
    it('is parsed (1K file)', function() {
        ParseText(json_sample1k, json);
    });
    it('is parsed (10K file)', function() {
        ParseText(json_sample10k, json);
    });
});