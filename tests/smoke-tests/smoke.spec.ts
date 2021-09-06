import * as assert from 'assert';

import { any, between, boolP, map, oneOrMany, regex, seq, str, wspaces } from '../../src/parsers';
import { Context, isFailure, Parser, Result } from '../../src/types';
import { json_sample1k, json_sample_huge } from './smoke-data';

type ValueType = JSONObject | ValueType[] | string | number | boolean | null;
type JSONObject = { [key: string]: ValueType };

const string: Parser<string> = map(
    between(str('"'), regex(/(?:[^\n\\"]|(?:\\(?:"|n|r|t|b|f|v|0|'|\\|(?:x[0-9a-fA-F][0-9a-fA-F]))))*/, 'String content'), str('"')),
    str => ( str
        .replace(/\\"/g,'"')
        .replace(/\\'/g, "'")
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\v/g, '\v')
        .replace(/\\0/g, '\0')
        .replace(/\\\\/g, '\\')
        .replace(/\\x([0-9a-fA-F][0-9a-fA-F])/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    )
);

const nullParser = map(str('null'), () => null);

const numberParser = map(regex(/[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'Number'), n => parseFloat(n));

const elements = oneOrMany(element(), str(','));

const array = map(
    between(str('['), any(elements, wspaces), str(']')),
    (elements) => Array.isArray(elements) ? elements : []
);

const member = map(
    seq(wspaces, string, wspaces, str(':'), element()),
    ([,name,,,value]) => ({ name, value })
);

const members = oneOrMany(member, str(','));

const objectParser: Parser<JSONObject> = map(
    between(str('{'), any(members, wspaces), str('}')),
    (members) => Array.isArray(members) ? members.reduce<JSONObject>((obj, { name, value }) => { obj[name] = value; return obj; }, {}) : {}
);

const value: Parser<ValueType> = any(objectParser, array, string, numberParser, boolP, nullParser);

const elementInside = between(wspaces, value, wspaces);

function element(): Parser<ValueType> {
    return (ctx: Context): Result<ValueType> => elementInside(ctx);
}

const JSONParser = element();

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