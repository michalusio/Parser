import { json } from '../src';
import { ParseError } from '../src/types';
import { ParseText,  } from '../src/parser';
import { json_sample1kne } from './samples/1K_json_no_escaping';
import { json_sample1k } from './samples/1K_json';
import { json_sample1k_failing } from './samples/1K_json_failing';
import { json_sample10k } from './samples/10K_json';
import { mochaLog } from './logging.spec';
import * as assert from 'assert';
import { sanitize } from './sanitization';

describe('json', function() {
    it('is parsed ([])', function() {
        const data = '[]';
        try {
            assert.deepStrictEqual(ParseText(data, json), JSON.parse(data));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed ({ "prop": 12 })', function() {
        const data = '{ "prop": 12 }';
        try{
            assert.deepStrictEqual(ParseText(data, json), JSON.parse(data));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed ({ "prop": "\\u2135" })', function() {
        const data = '{ "prop": "\\u2135" }';
        try{
            assert.deepStrictEqual(ParseText(data, json), JSON.parse(data));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it(`is parsed (${sanitize('[\n            {\n                "prop": 12\n            }\n                ]')})`, function() {
        const data = `[
            {
                "prop": 12    
            }
                ]`;
        try{
            assert.deepStrictEqual(ParseText(data, json), JSON.parse(data));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed ([{}])', function() {
        const data = '[{}]';
        try{
            assert.deepStrictEqual(ParseText(data, json), JSON.parse(data));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (1K file no escaping)', function() {
        try{
            assert.deepStrictEqual(ParseText(json_sample1kne, json), JSON.parse(json_sample1kne));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (1K file)', function() {
        try{
            assert.deepStrictEqual(ParseText(json_sample1k, json), JSON.parse(json_sample1k));
        } catch(e) {
            if (e instanceof ParseError) {
                mochaLog(e.getPrettyErrorMessage());
            }
            throw e;
        }
    });
    it('is parsed (10K file)', function() {
        try{
            assert.deepStrictEqual(ParseText(json_sample10k, json), JSON.parse(json_sample10k));
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
